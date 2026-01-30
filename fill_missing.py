import json
import urllib.request
import urllib.parse
import time
import os

json_path = '/Users/rex/workspace/playground/WordQuest/wordquest-app/src/lib/data/KET_Vocab_Full_1076.json'

with open(json_path, 'r') as f:
    words = json.load(f)

# Words to process: definition is "Official KET word" or image_url is None
queue = [w for w in words if w.get('definition') == "Official KET word" or not w.get('image_url')]

print(f"Items to process: {len(queue)}")

processed = 0
for item in queue:
    word = item['word'].lower()
    
    # 1. Fill Definition if missing
    if item.get('definition') == "Official KET word":
        try:
            url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{urllib.parse.quote(word)}"
            with urllib.request.urlopen(url, timeout=5) as response:
                data = json.loads(response.read().decode())
                if isinstance(data, list) and len(data) > 0:
                    # Get first meaning's first definition
                    meanings = data[0].get('meanings', [])
                    if meanings:
                        first_def = meanings[0]['definitions'][0]['definition']
                        item['definition'] = first_def
                        item['definitionEn'] = first_def
                        item['meaning'] = first_def # Update meaning field used in some logical places
        except Exception as e:
            # print(f"Failed definition for {word}: {e}")
            pass
            
    # 2. Fill Image if missing
    if not item.get('image_url'):
        # Use pollinations.ai for guaranteed image
        # Prompt: "minimalist vector illustration of {word} on white background"
        prompt = f"minimalist vector illustration of {word}, simple, bright colors, white background"
        safe_prompt = urllib.parse.quote(prompt)
        item['image_url'] = f"https://image.pollinations.ai/prompt/{safe_prompt}?width=400&height=400&nologo=true"

    processed += 1
    if processed % 10 == 0:
        print(f"Processed {processed} words...")
        # Save periodically
        with open(json_path, 'w') as f:
            json.dump(words, f, indent=2, ensure_ascii=False)
    
    # Be nice to the API
    time.sleep(0.15)

# Final Save
with open(json_path, 'w') as f:
    json.dump(words, f, indent=2, ensure_ascii=False)

print("Done filling missing information.")
