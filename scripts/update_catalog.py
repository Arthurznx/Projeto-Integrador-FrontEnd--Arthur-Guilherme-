import json
import re

with open('taxa_result.json', 'r', encoding='utf-8') as f:
    taxa = json.load(f)

with open('js/services/fauna-service.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Substituir o fallback padrao de foto em normalizarEntidadeFauna
content = re.sub(
    r"dados\.foto_url\s*\|\|\s*'https://images\.unsplash\.com/[^']*'",
    "dados.foto_url || 'assets/imagens/placeholder-animal.svg'",
    content
)

# Atualizar cada especie no array FAUNA_PARAIBA_PADRAO
count_updated = 0
for sp, data in taxa.items():
    if not data['photo_url']:
        continue
    
    pattern = rf"(\{{\s*id_fauna:\s*'[^']+',\s*nome:\s*'[^']+',\s*especie:\s*'{re.escape(sp)}'.*?foto_url:\s*)'[^']+'(.*?\n\s*foto_credito:\s*)'[^']+'"
    
    def repl(m):
        global count_updated
        count_updated += 1
        url = data['photo_url']
        attr = data['attribution'].replace("'", "\\'")
        taxon_id = data['taxon_id']
        return f"{m.group(1)}'{url}'{m.group(2)}'{attr}'"

    content, n = re.subn(pattern, repl, content, flags=re.DOTALL)

print(f"Especies atualizadas com fotos oficiais do iNaturalist: {count_updated}")

with open('js/services/fauna-service.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("fauna-service.js atualizado com sucesso!")
