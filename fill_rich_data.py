import json
import urllib.request
import urllib.parse
import time
import random

json_path = '/Users/rex/workspace/playground/WordQuest/wordquest-app/src/lib/data/KET_Vocab_Full_1076.json'

with open(json_path, 'r') as f:
    words = json.load(f)

# Queue: definition is placeholder OR translation is placeholder
queue = []
for i, w in enumerate(words):
    defn_missing = w.get('definition') == "Official KET word"
    trans_missing = "待补充" in (w.get('translation') or "") or not w.get('translation')
    if defn_missing or trans_missing:
        queue.append(i) # Store index

print(f"Items to process: {len(queue)}")

def fetch_json(url):
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'}
        )
        with urllib.request.urlopen(req, timeout=3) as response:
            return json.loads(response.read().decode())
    except Exception:
        return None

processed = 0
for idx in queue:
    item = words[idx]
    word = item['word'].lower()
    
    # 1. Fill Chinese Translation (Youdao)
    if "待补充" in (item.get('translation') or "") or not item.get('translation'):
        yd_url = f"http://dict.youdao.com/suggest?num=1&doctype=json&q={urllib.parse.quote(word)}"
        data = fetch_json(yd_url)
        if data and 'data' in data and 'entries' in data['data']:
            entries = data['data']['entries']
            if entries:
                # Get the first explanation
                trans = entries[0].get('explain')
                if trans:
                    item['translation'] = trans
    
    # 2. Fill English Definition (DictionaryAPI)
    if item.get('definition') == "Official KET word":
        d_url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{urllib.parse.quote(word)}"
        data = fetch_json(d_url)
        if data and isinstance(data, list):
            meanings = data[0].get('meanings', [])
            if meanings:
                # Prefer simplified definitions if possible, but DictionaryAPI is verbose
                # Sort by part of speech priority? (noun/verb usually first)
                first_def = meanings[0]['definitions'][0]['definition']
                item['definition'] = first_def
                item['definitionEn'] = first_def
                item['meaning'] = first_def
    
    # Progress save
    processed += 1
    if processed % 10 == 0:
        print(f"Processed {processed}...")
        with open(json_path, 'w') as f:
            json.dump(words, f, indent=2, ensure_ascii=False)
            
    time.sleep(0.1) # polite delay

# Final Save
with open(json_path, 'w') as f:
    json.dump(words, f, indent=2, ensure_ascii=False)

print("Rich data fill complete.")
