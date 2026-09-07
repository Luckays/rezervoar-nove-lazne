# Rezervoár minerální vody Nové Lázně

Statická webová prezentace historického plánu a současné digitální dokumentace objektu v Mariánských Lázních.

## Obsah

- `index.html` – porovnání historického podkladu a současného řezu
- `mracno.html` – interaktivní Potree prohlížeč mračna bodů
- `assets/images` – zarovnané 2D podklady (5502 × 3071 px), včetně bílé varianty současného řezu
- `pointclouds/rezervoar` – Potree 2.0 data, 1 591 209 bodů
- `vendor` – lokální sestavení Potree a potřebné knihovny

## Lokální spuštění

Stránky je nutné otevřít přes lokální HTTP server, nikoli dvojklikem na HTML soubor. V adresáři projektu spusťte:

```powershell
python -m http.server 8000
```

Potom otevřete `http://localhost:8000/`.

## GitHub Pages

Projekt nevyžaduje build. Nahrajte celý obsah adresáře do repozitáře a v nastavení GitHub Pages zvolte **Deploy from a branch**, větev `main` a adresář `/ (root)`.

## Původ dat

Mračno `redenemracno.e57` bylo převedeno přes CloudCompare do LAS a následně nástrojem PotreeConverter 2.1.3 do Potree 2.0 formátu s kompresí Brotli.
