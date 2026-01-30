import json

json_path = '/Users/rex/workspace/playground/WordQuest/wordquest-app/src/lib/data/KET_Vocab_Full_1076.json'

with open(json_path, 'r') as f:
    words = json.load(f)

count = 0
for item in words:
    defn = item.get('definition')
    defnEn = item.get('definitionEn')
    
    # 1. If meaning is present but definitionEn is missing or placeholder, sync it
    if item.get('meaning') and (not defnEn or defnEn == "Official KET word"):
        item['definitionEn'] = item['meaning']
        
    # 2. If definition field is used (legacy), sync to definitionEn
    if defn and defn != "Official KET word" and (not defnEn or defnEn == "Official KET word"):
        item['definitionEn'] = defn
    
    # 3. Ensure `meaning` field in words.ts will map to something useful.
    # In words.ts: meaning: raw.definition
    # So we should ensure item['definition'] is set to definitionEn
    if item.get('definitionEn') and item['definitionEn'] != "Official KET word":
         item['definition'] = item['definitionEn']
         item['meaning'] = item['definitionEn']
         
    # 4. Generate ID if missing
    if not item.get('id'):
        import re
        clean_word = re.sub(r'[^a-z0-9_]', '', item['word'].lower().replace(' ', '_'))
        item['id'] = f"ket_{clean_word}"
        count += 1
        
print(f"Fixed IDs for {count} words.")
print("Unified definitions to use 'definitionEn' as source of truth.")

with open(json_path, 'w') as f:
    json.dump(words, f, indent=2, ensure_ascii=False)
