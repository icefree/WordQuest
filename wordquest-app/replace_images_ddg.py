import json
import time
import random
from duckduckgo_search import DDGS

DATA_FILE = 'src/lib/data/KET_Vocab.json'

def update_images():
    print("Starting image update process...")
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    updated_count = 0
    # Try to initialize DDGS; if it fails, we handle it.
    try:
        ddgs = DDGS()
    except Exception as e:
        print(f"Error initializing DDGS: {e}")
        return

    # Count items to process
    to_process = [item for item in data if 'image_url' in item and 'pollinations.ai' in item['image_url']]
    print(f"Found {len(to_process)} items to update.")

    processed = 0
    
    for item in data:
        if 'image_url' in item and 'pollinations.ai' in item['image_url']:
            word = item['word']
            processed += 1
            print(f"[{processed}/{len(to_process)}] Searching image for: {word}...")
            
            try:
                # Search for the word. 
                # Using simple keyword to get best match (photo or otherwise).
                results = ddgs.images(
                    keywords=word,
                    region="wt-wt",
                    safesearch="on", # Safe search on
                    max_results=1
                )
                
                # Convert generator/result to list to access
                results_list = list(results)
                
                if results_list:
                    new_url = results_list[0]['image']
                    item['image_url'] = new_url
                    updated_count += 1
                    print(f"  -> Found: {new_url}")
                else:
                    print(f"  -> No results found.")
            
            except Exception as e:
                print(f"  -> Error fetching image: {e}")
            
            # Sleep to strictly respect rate limits and avoid blocking
            time.sleep(random.uniform(1.5, 3.0))
            
            # Save every 20 updates
            if updated_count % 20 == 0 and updated_count > 0:
                 print("Saving progress...")
                 with open(DATA_FILE, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)

    # Final save
    print("Final save...")
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Done! Updated {updated_count} images.")

if __name__ == "__main__":
    update_images()
