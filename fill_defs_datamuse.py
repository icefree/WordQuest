import json
import urllib.request
import urllib.parse
import time

json_path = '/Users/rex/workspace/playground/WordQuest/wordquest-app/src/lib/data/KET_Vocab_Full_1076.json'

with open(json_path, 'r') as f:
    words = json.load(f)

count = 0
for w in words:
    # Check if definition is missing or placeholder
    defn = w.get('definition')
    defnEn = w.get('definitionEn')
    if not defn or defn == "Official KET word" or defnEn == "Official KET word":
        count += 1

print(f"Missing definitions to fix: {count}")

processed = 0
for item in words:
    defn = item.get('definition')
    defnEn = item.get('definitionEn')
    
    # Target condition: Missing definition key, or placeholder in either field
    if not defn or defn == "Official KET word" or defnEn == "Official KET word":
        word = item['word'].lower()
        try:
            url = f"https://api.datamuse.com/words?sp={urllib.parse.quote(word)}&md=d&max=1"
            req = urllib.request.Request(
                url, 
                headers={'User-Agent': 'Mozilla/5.0 (WordQuest/1.0)'}
            )
            with urllib.request.urlopen(req, timeout=5) as response:
                data = json.loads(response.read().decode())
                if data and 'defs' in data[0]:
                    defs = data[0]['defs']
                    # Pick the first one, usually most common
                    # Format is "n\tDefinition"
                    raw_def = defs[0]
                    clean_def = raw_def.split('\t', 1)[-1].strip()
                    
                    item['definition'] = clean_def
                    item['definitionEn'] = clean_def
                    item['meaning'] = clean_def
        except Exception as e:
            # print(f"Error {word}: {e}")
            pass
            
        processed += 1
        if processed % 20 == 0:
            print(f"Processed {processed}...")
            with open(json_path, 'w') as f:
                json.dump(words, f, indent=2, ensure_ascii=False)
        
        time.sleep(0.05) # fast but polite

with open(json_path, 'w') as f:
    json.dump(words, f, indent=2, ensure_ascii=False)

print("Datamuse fill complete.")
