from pathlib import Path
repo = Path(r'd:\Projects\Website for created apps')
files = [
    repo / 'app.js',
    repo / 'index.html',
    repo / 'app-detail.html',
    repo / 'detail.js',
    repo / 'dist-web' / 'index.html',
    repo / 'dist-web' / 'assets' / 'js' / 'app.js',
    repo / 'ApexCore_3.0.3_stable' / 'ApexCore_3.0.3_FinalFix.html',
    repo / 'ApexCore_3.0.3_stable' / 'assets' / 'js' / 'app.js',
    repo / 'ApexCore_3.0.3_stable' / 'dist-web' / 'index.html',
    repo / 'ApexCore_3.0.3_stable' / 'dist-web' / 'assets' / 'js' / 'app.js',
]
replacements = [
    ('Ã¤', 'ä'), ('Ã¶', 'ö'), ('Ã¥', 'å'), ('Ã„', 'Ä'), ('Ã–', 'Ö'), ('Ã¼', 'ü'), ('Ã©', 'é'), ('Ã¸', 'ø'), ('Ã†', 'Æ'), ('Ã', 'Å'),
    ('â€™', '’'), ('â€“', '–'), ('â€¦', '…')
]
for p in files:
    if not p.exists():
        continue
    text = p.read_text(encoding='utf-8', errors='ignore')
    original = text
    for old, new in replacements:
        text = text.replace(old, new)
    if text != original:
        p.write_text(text, encoding='utf-8')
        print('repaired', p)
