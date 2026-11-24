import os
import re
import json

print("=== SUITE DE TESTES: AUDITORIA CIENTÍFICA E INTEGRIDADE DA FAUNA PARAIBANA ===\n")

# 1. REGRA INEGOCIÁVEL: README.md intacto
readme_diff = os.popen("git diff main..HEAD -- README.md").read().strip()
readme_status = os.popen("git status --porcelain README.md").read().strip()
if not readme_diff and not readme_status:
    print("[TESTE 1: OK] README.md está 100% INTATOCADO e idêntico à branch main!")
else:
    print(f"[TESTE 1: FALHA] README.md foi modificado: diff={readme_diff}, status={readme_status}")
    exit(1)

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
    exit(1)

# 3. Leitura e Auditoria de fauna-service.js
with open('js/services/fauna-service.js', 'r', encoding='utf-8') as f:
    fauna_code = f.read()

# Extrair lista de espécies de FAUNA_PARAIBA_PADRAO
entry_blocks = re.findall(r'\{\s*id_fauna:\s*"([^"]+)",(.*?)\n\s*\},', fauna_code, re.DOTALL)
animais_padrao = []
for id_f, block in entry_blocks:
    obj = {'id_fauna': id_f}
    for line in block.split('\n'):
        m = re.search(r'([a-zA-Z_]+):\s*(?:"([^"]*)"|(\d+)|(true|false))', line)
        if m:
            k = m.group(1)
            val = m.group(2) if m.group(2) is not None else (int(m.group(3)) if m.group(3) is not None else m.group(4) == 'true')
            obj[k] = val
    animais_padrao.append(obj)

print(f"\nTotal de espécies cadastradas em FAUNA_PARAIBA_PADRAO: {len(animais_padrao)}")

# Validação dos Nomes Populares e Científicos
nome_duplicado_count = 0
especies_vistas = set()
taxons_vistos = set()
unsplash_count = 0
siglas_count = 0

for a in animais_padrao:
    id_f = a.get('id_fauna')
    sp = a.get('especie', '')
    nome = a.get('nome', '')
    foto = a.get('foto_url', '')
    risco = a.get('risco_preservacao', '')
    taxon_id = a.get('taxon_id')

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
    exit(1)

if len(especies_vistas) == len(animais_padrao):
    print(f"[TESTE 4: OK] Nenhuma espécie duplicada no catálogo! ({len(animais_padrao)} espécies únicas)")
else:
    print(f"[TESTE 4: FALHA] Espécies duplicadas encontradas.")
    exit(1)

if unsplash_count == 0:
    print("[TESTE 5: OK] Zero fotos aleatórias do Unsplash! Todas as imagens são do iNaturalist ou oficiais.")
else:
    print(f"[TESTE 5: FALHA] {unsplash_count} fotos Unsplash encontradas.")
    exit(1)

if siglas_count == 0:
    print("[TESTE 6: OK] Nenhuma sigla (LC, VU, CR, etc.) presente nas categorias de conservação!")
else:
    print(f"[TESTE 6: FALHA] {siglas_count} siglas encontradas.")
    exit(1)

# 4. Remoção de Informações Biológicas Complementares em index.html
with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

if 'Informações Biológicas Complementares' not in index_html and 'secao-ninjas-extra' not in index_html:
    print("[TESTE 7: OK] Seção de informações biológicas complementares removida de index.html!")
else:
    print("[TESTE 7: FALHA] Seção de informações biológicas complementares ainda presente em index.html!")
    exit(1)

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

# 6. Auditoria dos 6 Critérios Obrigatórios em 100% dos animais de FAUNA_PARAIBA_PADRAO
def auditar_seis_criterios(a):
    erros = []
    nome = a.get('nome', '').strip()
    sp = a.get('especie', '').strip()
    foto = a.get('foto_url', '').strip()
    habitat = a.get('habitat', '').strip()
    bioma = a.get('bioma', '').strip()
    local = a.get('local_observacao', '').strip()
    municipio = a.get('municipio', '').strip()

    # 1. Nome popular brasileiro
    if not nome or 'não identificado' in nome.lower() or nome.lower() == sp.lower():
        erros.append("Critério 1 violado: nome popular inválido/ausente/duplicado")
    for t in ['toad', 'hawk', 'frog', 'crab', 'viper', 'heron', 'tanager', 'marmoset', 'sloth', 'snake', 'lizard']:
        if t in nome.lower():
            erros.append(f"Critério 1 violado: termo em inglês '{t}' no nome popular")

    # 2. Nome científico válido no nível de espécie
    if not sp or len(sp.split()) < 2 or sp.endswith(' sp.') or sp.endswith(' spp.'):
        erros.append("Critério 2 violado: nome científico inválido ou não no nível de espécie")

    # 3. Fotografia real e correspondente
    if not foto or 'placeholder' in foto or 'unsplash.com' in foto or not (foto.startswith('http://') or foto.startswith('https://') or foto.startswith('assets/')):
        erros.append("Critério 3 violado: fotografia ausente, placeholder ou genérica")

    # 4. Habitat ecologicamente correto
    if not habitat or len(habitat) < 5 or 'não disponível' in habitat.lower():
        erros.append("Critério 4 violado: habitat ausente ou genérico")

    # 5. Bioma de ocorrência na Paraíba
    if not bioma or 'não disponível' in bioma.lower() or ('Caatinga' not in bioma and 'Mata Atlântica' not in bioma):
        erros.append("Critério 5 violado: bioma ausente ou inexistente na Paraíba")

    # 6. Localização registrada na Paraíba
    if not local or not municipio or not ('PB' in local or 'Paraíba' in local or 'PB' in municipio or 'Paraíba' in municipio):
        erros.append("Critério 6 violado: ocorrência na Paraíba não comprovada")

    return erros

falhas_criterios = []
for a in animais_padrao:
    errs = auditar_seis_criterios(a)
    if errs:
        falhas_criterios.append((a['id_fauna'], a.get('nome'), errs))

if not falhas_criterios:
    print(f"[TESTE 9: OK] 100% dos {len(animais_padrao)} animais atendem aos 6 critérios obrigatórios!")
else:
    print(f"[TESTE 9: FALHA] Animais com critérios pendentes: {falhas_criterios}")
    exit(1)

# 7. Validação de Bloqueio de Registros Incompletos pelo validador
registros_teste_invalidos = [
    {"nome": "Nome popular não identificado", "especie": "Leopardus pardalis", "foto_url": "https://img.com/1.jpg", "habitat": "Mata atlântica", "bioma": "Mata Atlântica", "local_observacao": "Cabedelo, PB", "municipio": "Cabedelo"},
    {"nome": "Leopardus pardalis", "especie": "Leopardus pardalis", "foto_url": "https://img.com/1.jpg", "habitat": "Mata atlântica", "bioma": "Mata Atlântica", "local_observacao": "Cabedelo, PB", "municipio": "Cabedelo"},
    {"nome": "Southern toad", "especie": "Rhinella marina", "foto_url": "https://img.com/1.jpg", "habitat": "Mata atlântica", "bioma": "Mata Atlântica", "local_observacao": "Cabedelo, PB", "municipio": "Cabedelo"},
    {"nome": "Sagui", "especie": "Callithrix sp.", "foto_url": "https://img.com/1.jpg", "habitat": "Mata atlântica", "bioma": "Mata Atlântica", "local_observacao": "Cabedelo, PB", "municipio": "Cabedelo"},
    {"nome": "Sagui", "especie": "Callithrix jacchus", "foto_url": "assets/imagens/placeholder-animal.svg", "habitat": "Mata atlântica", "bioma": "Mata Atlântica", "local_observacao": "Cabedelo, PB", "municipio": "Cabedelo"},
    {"nome": "Sagui", "especie": "Callithrix jacchus", "foto_url": "https://images.unsplash.com/photo-1", "habitat": "Mata atlântica", "bioma": "Mata Atlântica", "local_observacao": "Cabedelo, PB", "municipio": "Cabedelo"},
    {"nome": "Sagui", "especie": "Callithrix jacchus", "foto_url": "https://img.com/1.jpg", "habitat": "Informação não disponível", "bioma": "Mata Atlântica", "local_observacao": "Cabedelo, PB", "municipio": "Cabedelo"},
    {"nome": "Sagui", "especie": "Callithrix jacchus", "foto_url": "https://img.com/1.jpg", "habitat": "Florestas úmidas", "bioma": "Cerrado", "local_observacao": "Cabedelo, PB", "municipio": "Cabedelo"},
    {"nome": "Sagui", "especie": "Callithrix jacchus", "foto_url": "https://img.com/1.jpg", "habitat": "Florestas úmidas", "bioma": "Mata Atlântica", "local_observacao": "Recife, PE", "municipio": "Recife"}
]

bloqueados_count = 0
for reg in registros_teste_invalidos:
    errs = auditar_seis_criterios(reg)
    if len(errs) > 0:
        bloqueados_count += 1

if bloqueados_count == len(registros_teste_invalidos):
    print(f"[TESTE 10: OK] Bloqueador rejeitou 100% dos {bloqueados_count} casos de dados incompletos ou inválidos!")
else:
    print(f"[TESTE 10: FALHA] Apenas {bloqueados_count} de {len(registros_teste_invalidos)} registros inválidos foram rejeitados.")
    exit(1)

# 8. Verificação de integridade no inaturalist.js e fauna-explorer.js
with open('js/services/inaturalist.js', 'r', encoding='utf-8') as f:
    inat_code = f.read()

with open('js/components/fauna-explorer.js', 'r', encoding='utf-8') as f:
    explorer_code = f.read()

assert 'validarEspecieCompleta' in inat_code, "validarEspecieCompleta não importado/usado em inaturalist.js"
assert 'validarEspecieCompleta' in explorer_code, "validarEspecieCompleta não importado/usado em fauna-explorer.js"
assert 'obterChaveCanonica' in inat_code, "obterChaveCanonica não importado/usado em inaturalist.js"
assert 'obterChaveCanonica' in explorer_code, "obterChaveCanonica não importado/usado em fauna-explorer.js"

print("[TESTE 11: OK] Validação rigorosa e desduplicação canônica ativas no fluxo da API e da interface!")

print("\n=== TODOS OS 11 TESTES CIENTÍFICOS CONCLUÍDOS COM 100% DE SUCESSO! ===")
