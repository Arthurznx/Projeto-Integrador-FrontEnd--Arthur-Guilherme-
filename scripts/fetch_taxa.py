import urllib.request
import urllib.parse
import json
import time

especies = [
    ('Sagui-de-tufos-brancos', 'Callithrix jacchus'),
    ('Tatu-bola-do-nordeste', 'Tolypeutes tricinctus'),
    ('Preguica-de-coleira', 'Bradypus torquatus'),
    ('Preguica-comum', 'Bradypus variegatus'),
    ('Sucuarana (Onca-parda)', 'Puma concolor'),
    ('Moco', 'Kerodon rupestris'),
    ('Tamandua-mirim', 'Tamandua tetradactyla'),
    ('Peixe-boi-marinho', 'Trichechus manatus'),
    ('Guaxinim (Mao-pelada)', 'Procyon cancrivorus'),
    ('Boto-cinza', 'Sotalia guianensis'),
    ('Guara', 'Eudocimus ruber'),
    ('Colhereiro', 'Platalea ajaja'),
    ('Seriema', 'Cariama cristata'),
    ('Jacucaca', 'Penelope jacucaca'),
    ('Carcara', 'Caracara plancus'),
    ('Pintassilgo-do-nordeste', 'Spinus yarrellii'),
    ('Periquito-da-caatinga', 'Eupsittula cactorum'),
    ('Gaviao-de-asa-larga', 'Buteo platypterus'),
    ('Tartaruga-de-pente', 'Eretmochelys imbricata'),
    ('Jacare-de-papo-amarelo', 'Caiman latirostris'),
    ('Cobra-verde-da-caatinga', 'Erythrolamprus viridis'),
    ('Cobra-cipo', 'Philodryas nattereri'),
    ('Teiu', 'Salvator merianae'),
    ('Jiboia-da-caatinga', 'Boa constrictor'),
    ('Sapo-cururu-do-nordeste', 'Rhinella jimi'),
    ('Perereca-verde-da-mata', 'Boana albomarginata'),
    ('Sapo-do-chifre (Intanha)', 'Ceratophrys joazeirensis'),
    ('Mero', 'Epinephelus itajara'),
    ('Peixe-donzela-do-nordeste', 'Stegastes fuscus'),
    ('Traira', 'Hoplias malabaricus'),
    ('Caranguejo-uca', 'Ucides cordatus'),
    ('Abelha-jandaira', 'Melipona subnitida'),
    ('Lagosta-vermelha', 'Panulirus argus')
]

taxa_data = {}

for nome, sp in especies:
    encoded = urllib.parse.quote(sp)
    url = f"https://api.inaturalist.org/v1/taxa?q={encoded}&rank=species"
    req = urllib.request.Request(url, headers={'User-Agent': 'AnimaliaFaunaParaiba/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=6) as resp:
            data = json.loads(resp.read().decode())
            res = data.get('results', [])
            matched = None
            for item in res:
                if item.get('name', '').lower() == sp.lower():
                    matched = item
                    break
            if not matched and res:
                matched = res[0]
            
            if matched:
                photo = matched.get('default_photo') or {}
                medium_url = photo.get('medium_url', '')
                large_url = medium_url.replace('/medium.', '/large.').replace('/square.', '/large.') if medium_url else ''
                taxa_data[sp] = {
                    'taxon_id': matched.get('id'),
                    'scientific_name': matched.get('name'),
                    'common_name': matched.get('preferred_common_name') or nome,
                    'photo_url': large_url or medium_url,
                    'attribution': photo.get('attribution', 'iNaturalist')
                }
                print(f"[OK] {sp} -> ID: {matched.get('id')} | Foto: {large_url or 'SEM FOTO'}")
            else:
                print(f"[SEM TAXON] {sp}")
    except Exception as e:
        print(f"[ERRO] {sp}: {e}")
    time.sleep(0.3)

with open('taxa_result.json', 'w', encoding='utf-8') as f:
    json.dump(taxa_data, f, indent=2, ensure_ascii=False)
print(f"Finalizado. Coletados {len(taxa_data)} registros.")
