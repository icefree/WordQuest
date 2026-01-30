import json
import urllib.request
import urllib.parse
import time
import sys

json_path = '/Users/rex/workspace/playground/WordQuest/wordquest-app/src/lib/data/KET_Vocab_Full_1076.json'

def load_words():
    with open(json_path, 'r') as f:
        return json.load(f)

def save_words(words):
    with open(json_path, 'w') as f:
        json.dump(words, f, indent=2, ensure_ascii=False)

def get_clean_word(raw_word):
    parts = raw_word.split(' ')
    if len(parts) > 1 and parts[0] in ['n', 'v', 'adj', 'adv', 'prep', 'conj', 'pron']:
        return " ".join(parts[1:])
    return raw_word

def fetch_definition(word):
    try:
        url = f"https://api.datamuse.com/words?sp={urllib.parse.quote(word)}&md=d&max=1"
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (WordQuest/1.0)'}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
            if data and 'defs' in data[0]:
                defs = data[0]['defs']
                # Prefer the first definition
                raw_def = defs[0]
                # Format is "n\tDefinition"
                clean_def = raw_def.split('\t', 1)[-1].strip()
                return clean_def
    except Exception as e:
        # print(f"Error fetching {word}: {e}")
        pass
    return None

def main():
    words = load_words()
    
    # Count targets
    targets = [w for w in words if not w.get('definition') or w.get('definition') == "Official KET word" or w.get('definitionEn') == "Official KET word"]
    print(f"Missing definitions to fix: {len(targets)}")
    
    processed = 0
    updated = 0
    
    try:
        for item in words:
            defn = item.get('definition')
            defnEn = item.get('definitionEn')
            
            if not defn or defn == "Official KET word" or defnEn == "Official KET word":
                word = item['word'].lower()
                search_word = get_clean_word(word)
                
                print(f"Processing: '{word}' -> Search: '{search_word}'...", end='', flush=True)
                
                new_def = fetch_definition(search_word)
                
                if new_def:
                    item['definition'] = new_def
                    item['definitionEn'] = new_def
                    item['meaning'] = new_def
                    updated += 1
                    print(f" FOUND: {new_def[:30]}...")
                else:
                    print(" NOT FOUND")
                
                processed += 1
                if processed % 10 == 0:
                    save_words(words)
                    print(f"--- Saved progress ({processed}/{len(targets)} processed, {updated} updated) ---")
                
                time.sleep(0.5) # Be polite
                
    except KeyboardInterrupt:
        print("\nInterrupted! Saving current progress...")
        save_words(words)
        sys.exit(0)
    except Exception as e:
        print(f"\nError: {e}")
        save_words(words)
        raise

    save_words(words)
    print(f"Complete. Updated {updated} definitions.")

if __name__ == "__main__":
    main()
