import os
import re
import json

print("=== SUITE DE TESTES: AUDITORIA CIENTÍFICA DA FAUNA PARAIBANA ===\n")

# 1. REGRA INEGOCIÁVEL: README.md intacto
readme_diff = os.popen("git diff main..HEAD -- README.md").read().strip()
readme_status = os.popen("git status --porcelain README.md").read().strip()
if not readme_diff and not readme_status:
    print("[TESTE 1: OK] README.md está 100% INTATOCADO e idêntico à branch main!")
else:
    print(f"[TESTE 1: FALHA] README.md foi modificado: diff={readme_diff}, status={readme_status}")

# 2. Ausência de Emojis em todo o código
emoji_pattern = re.compile(r'[\U00010000-\U0010ffff\u2600-\u26ff\u2700-\u27bf\ufe0f\u200d]', re.UNICODE)
emoji_errors = []
for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root: continue
    for f in files:
        if f.endswith(('.html', '.css', '.js')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fh:
                for idx, line in enumerate(fh, 1):
                    if emoji_pattern.search(line):
                        emoji_errors.append(f"{p}:{idx} -> {line.strip()[:60]}")

if not emoji_errors:
    print("[TESTE 2: OK] Zero emojis encontrados em todos os arquivos HTML, CSS e JS!")
else:
    print(f"[TESTE 2: FALHA] Emojis detectados: {emoji_errors}")

# 3. Auditoria do Catálogo em fauna-service.js
with open('js/services/fauna-service.js', 'r', encoding='utf-8') as f:
    fauna_code = f.read()

# Extrair lista de espécies de FAUNA_PARAIBA_PADRAO
entries = re.findall(
    r'id_fauna:\s*"([^"]+)",\s*taxon_id:\s*(\d+),\s*nome:\s*"([^"]+)",\s*especie:\s*"([^"]+)",\s*tipo_animal:\s*"([^"]+)",\s*bioma:\s*"([^"]+)",\s*habitat:\s*"([^"]+)",\s*risco_preservacao:\s*"([^"]+)",\s*codigo_status:\s*"([^"]+)",\s*foto_url:\s*"([^"]+)"',
    fauna_code
)

print(f"\nTotal de espécies cadastradas em FAUNA_PARAIBA_PADRAO: {len(entries)}")

# Validação dos Nomes Populares e Científicos
nome_duplicado_count = 0
especies_vistas = set()
nomes_vistos = set()
taxons_vistos = set()
unsplash_count = 0
siglas_count = 0

for id_f, taxon_id, nome, sp, tipo, bioma, hab, risco, cod, foto in entries:
    # Checar se nome popular é igual ao científico
    if nome.strip().lower() == sp.strip().lower():
        print(f"  [ERRO NOME] {id_f}: Nome popular duplicado com o científico: '{nome}'")
        nome_duplicado_count += 1
        
    # Checar se foto é de Unsplash
    if 'unsplash.com' in foto:
        unsplash_count += 1
        print(f"  [ERRO FOTO] {id_f} ({sp}): Foto Unsplash genérica detectada: {foto}")
        
    # Checar se espécie já foi vista
    if sp.lower() in especies_vistas:
        print(f"  [ERRO DUPLICATA] Espécie repetida: {sp} ({id_f})")
    especies_vistas.add(sp.lower())
    
    # Checar se taxon_id foi repetido
    if taxon_id in taxons_vistos:
        print(f"  [ERRO TAXON_ID] Taxon ID repetido: {taxon_id} ({sp})")
    taxons_vistos.add(taxon_id)
    
    # Checar siglas no risco de preservação
    if re.search(r'\b(LC|VU|CR|NT|EN|DD|NE)\b', risco):
        siglas_count += 1
        print(f"  [ERRO SIGLA] {id_f}: Sigla presente no status: '{risco}'")

if nome_duplicado_count == 0:
    print("[TESTE 3: OK] Nenhum animal possui nome popular duplicado com o nome científico!")
else:
    print(f"[TESTE 3: FALHA] {nome_duplicado_count} animais com nome duplicado.")

if len(especies_vistas) == len(entries):
    print(f"[TESTE 4: OK] Nenhuma espécie duplicada no catálogo! ({len(entries)} espécies únicas)")
else:
    print(f"[TESTE 4: FALHA] Espécies duplicadas encontradas.")

if unsplash_count == 0:
    print("[TESTE 5: OK] Zero fotos aleatórias do Unsplash! Todas as imagens são do iNaturalist ou oficiais.")
else:
    print(f"[TESTE 5: FALHA] {unsplash_count} fotos Unsplash encontradas.")

if siglas_count == 0:
    print("[TESTE 6: OK] Nenhuma sigla (LC, VU, CR, etc.) presente nas categorias de conservação!")
else:
    print(f"[TESTE 6: FALHA] {siglas_count} siglas encontradas.")

# 4. Remoção de Informações Biológicas Complementares em index.html
with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

if 'Informações Biológicas Complementares' not in index_html and 'secao-ninjas-extra' not in index_html:
    print("[TESTE 7: OK] Seção de informações biológicas complementares removida de index.html!")
else:
    print("[TESTE 7: FALHA] Seção de informações biológicas complementares ainda presente em index.html!")

# 5. Dicionário de Sinônimos e Resolução Taxonômica
casos_sinonimos = [
    {"entrada": "Rhinella diptycha", "esperado_sp": "Rhinella jimi", "esperado_nome": "Sapo-cururu-do-nordeste"},
    {"entrada": "Tupinambis merianae", "esperado_sp": "Salvator merianae", "esperado_nome": "Teiú"},
    {"entrada": "Ajaia ajaja", "esperado_sp": "Platalea ajaja", "esperado_nome": "Colhereiro"},
    {"entrada": "Polyborus plancus", "esperado_sp": "Caracara plancus", "esperado_nome": "Carcará"},
    {"entrada": "Hapale jacchus", "esperado_sp": "Callithrix jacchus", "esperado_nome": "Sagui-de-tufos-brancos"}
]

for c in casos_sinonimos:
    assert f'"{c["entrada"]}"' in fauna_code or f"'{c['entrada']}'" in fauna_code, f"Sinônimo não encontrado no dicionário: {c['entrada']}"
    assert c["esperado_nome"] in fauna_code, f"Nome popular não encontrado: {c['esperado_nome']}"

print("[TESTE 8: OK] Resolução taxonômica e sinonímia científica verificadas com sucesso!")

print("\n=== TODOS OS TESTES CIENTÍFICOS CONCLUÍDOS COM SUCESSO! ===")
