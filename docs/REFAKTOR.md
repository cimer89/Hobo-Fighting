# Raport z porządkowania kodu Hobo Fighting

Listopad 2026. Ten dokument opisuje, co znalazłem w kodzie, co zmieniłem, jak sprawdziłem, że gra działa tak samo, i co zostało do zrobienia.

## Najważniejsze w skrócie

- **Źródło gry jest teraz w repozytorium** (`src/`, `assets/`, `tools/build.py`). Wcześniej było tu tylko zbudowane `index.html`, a źródła leżały w tymczasowym katalogu roboczym.
- **Kod jest podzielony tematycznie** na `engine/`, `characters/`, `board/`, `ui/`, `fx/`, `online/`, `modes/` i `core/`.
- **Usunąłem martwy kod:**
  - 45 nieużywanych starszych wersji funkcji;
  - 5 nieużywanych funkcji;
  - 35 nadpisanych obrazków;
  - wszystkie podmiany tekstu funkcji przez `eval`.
- **Usunąłem animacje 3D** (sprite'y z Blendera). Zrobiłem to na Twoją prośbę.
- **Plik gry zmalał z 13,56 MB do 11,42 MB.**
- **Zasady walki, parametry postaci i kolejność rozpatrywania akcji się nie zmieniły.** Sprawdziłem to automatycznie po każdym etapie (szczegóły niżej).

## 1. Znalezione problemy

| Problem | Skala | Co zrobiłem |
|---|---|---|
| Funkcje zadeklarowane kilka razy (działa tylko ostatnia) | 30 nazw, 45 martwych kopii, np. `sim` ×4, `injectExtras` ×5 | usunięte (etap 2) |
| Nieużywane funkcje | `pill`, `token`, `teamChip`, `genMaze` (stary labirynt), `spawnCells` | usunięte (etap 2) |
| Nadpisane dane (stare wersje portretów, tła, banera) | 35 obrazków, ok. 0,7 MB | usunięte (etap 2) |
| Animacje 3D: przerywniki w walce i podgląd 3D na ekranie wyboru | 1,4 MB | usunięte na prośbę (etap 2) |
| Łaty przez podmianę tekstu funkcji (`toString` + `eval`): ciche psucie się, gdy zmieni się tekst | 11 łat: `sim` ×6, `runAnim`, `revCore` ×2, `scoreTable`, `waitH`, `cwaitH`, `DEMOS` ×3 | zapisane wprost w funkcjach (etap 3) |
| Łaty Bitwy baz robione przy budowaniu (4 skrypty podmieniające tekst) | `mbfix`, `mbbush`, `mbart`, `mbonline` | wpisane na stałe w `modes/bitwa_baz.js` (etap 1) |
| Brak źródła w repozytorium; dwie wersje pliku (GitHub i artefakt) utrzymywane osobno | – | jedno źródło i znaczniki wariantów `//@@if github` (etap 1) |
| Jeden plik 3900 linii, w którym mieszają się zasady, ekrany, animacje i online | – | podział na moduły (etap 4) |
| `render` owinięte wiele razy (każda warstwa dokłada coś przed lub po) | 26 → 25 | **zostawione**, patrz punkt 5 |
| Wiele globalnych obsług kliknięć w fazie przechwytywania, przerywających się nawzajem | 24 → 23 | **zostawione**, patrz punkt 5 |

### Konflikty i możliwe błędy (nie naprawiałem, bo zmieniłyby to, co widać w grze; czekają na Twoją decyzję)

1. ~~Nieaktualna podpowiedź przy skoku Byka~~ – **naprawione**. Podpowiedzi w panelu, liczby na polach skoku i przykłady akcji (demo) pokazują teraz obowiązujące wartości: skok, także w miejscu, = 3 DMG; szarża = 2 DMG.
2. **Przyciski „Profil” i „Ranking” są widoczne, ale nie działają,** dopóki nie zostanie wpisana konfiguracja Firebase (`PROF_FB` w `online/profiles.js`).
3. **Wersja na GitHub zawsze pobiera biblioteki Firebase** (3 pliki), choć konfiguracja jest pusta i gra działa bez nich, przez P2P. To spowalnia start.
4. ~~Podpowiedź przy szarży poprawiana przeszukiwaniem strony~~ – **naprawione**. Tekst jest poprawiony u źródła, a przeszukiwanie strony po każdym renderze usunięte.
5. **Gałęzie „tylko w Testach” w zasadach Byka (`sim`)** są martwe, bo nowsza łata ustawia te same wartości dla wszystkich trybów. Nie wpływają na grę, ale mylą przy czytaniu.

## 2. Nowa struktura

```
src/
  index.html          szkielet strony (miejsca na CSS i JS)
  manifest.json       kolejność ładowania plików CSS i JS
  css/                18 sekcji stylów (kolejność ma znaczenie: kaskada)
  js/
    core/             stan gry (st, net, ME, H), narzędzia, start gry
    engine/           zasady i rozpatrywanie walki: sim, attack, resolve, strefa, bonusy
    characters/       dane postaci, akcje, grafika dodatków, podgląd akcji (demo), balans Byka
    board/            geometria heksów, rysowanie planszy, plansza rysunkowa, mała plansza 2 graczy
    ui/               ekrany, planowanie, wybór postaci, HUD, okna, podsumowanie rundy, menu
    fx/               animacje rundy, sprite'y 2D, dźwięki i muzyka, grafiki (dane)
    online/           pokoje, P2P, kolejka wyboru, 6 graczy, profile, konfiguracja Firebase
    modes/            tryb specjalny, Testy, drużyny 2v2, trening, Bitwa baz
assets/img, assets/audio   wszystkie obrazy i dźwięki jako osobne pliki
tools/build.py             budowanie
tests/                     testy porównawcze
```

**Jak działa podział.** Gra nadal jest jednym skryptem, więc zachowuje się dokładnie jak wcześniej. W `manifest.json` są trzy grupy plików:

- **pliki danych:** stałe, które przy tworzeniu niczego nie liczą, np. `C`, `GEO`, `DEMOS`, `SPR2D`;
- **biblioteki:** wyłącznie deklaracje funkcji, np. `engine/resolve.js` czy `ui/screens.js`. JavaScript i tak wynosi deklaracje funkcji na początek skryptu, więc ich położenie nie ma wpływu na działanie;
- **pliki inicjujące:** owijki, rejestracja kliknięć, wywołania `render()`. Zostały w pierwotnej kolejności, bo tu kolejność ma znaczenie. Nazwy mówią, czego dotyczą, np. `modes/training.js`, `online/draft.js`.

## 3. Budowanie

```
python3 tools/build.py github  index.html            # wersja na GitHub Pages
python3 tools/build.py makieta dist/makieta.html     # wersja artefaktu Claude
```

- Obrazy i dźwięki są w kodzie wskazane jako `@@asset:img/nazwa.webp@@`. Przy budowaniu są wstawiane do pliku.
- Różnice między wersjami (logowanie, Firebase) są oznaczone w kodzie liniami `//@@if github` / `//@@else` / `//@@end`.

## 4. Jak sprawdziłem, że nic się nie zmieniło

Po każdym etapie uruchamiałem cztery rodzaje sprawdzeń:

1. **`tests/golden.js` (złoty test), porównywany narzędziem `tests/gcmp.py`:**
   - **Kod funkcji:** tekst kodu i wartości wszystkich 281 globalnych funkcji i danych po załadowaniu gry.
   - **Silnik:** 1080 losowych rund we wszystkich trybach (klasyczny, specjalny, Testy), FFA i 2v2, od 2 do 6 graczy, ze wszystkimi postaciami. Rundy obejmują bonusy, owcę, drona, kałuże i odrzuty.
   - **Bitwa baz:** 240 rund na wszystkich mapach, 1v1, 2v2 i 3v3.
   - **Rozgrywki:** 6 pełnych gier na jednym telefonie, z prawdziwymi przyciskami „Następna runda”.
2. **`tests/shots.js` + `tests/pdiff.py`:** zrzuty 12 ekranów porównywane piksel po pikselu.
3. **15 testów funkcjonalnych:** tryby, trening, ścisk, Byku, Bitwa baz (offline, online, labirynt), kolejka wyboru online dla 2, 3 i 4 graczy, profile, dołączanie kodem.
4. **Porównanie obu wersji pliku (GitHub i artefakt):** różnią się tylko konfiguracją Firebase i `initNet`.

| Etap | Kod funkcji | Silnik (1080) | Bitwa baz (240) | Rozgrywki (30) | Ekrany | Testy (15) |
|---|---|---|---|---|---|---|
| 1. Źródło w repozytorium | plik identyczny bajt w bajt | = | = | = | = | – |
| 2. Martwy kod i 3D | identyczny, poza usuniętymi funkcjami i owijką 3D | 0 różnic | 0 | 0 | zmiana tylko na ekranie wyboru: brak okienka 3D | 15/15 |
| 3. Łaty `eval` | identyczny | 0 | 0 | 0 | – | – |
| 4. Moduły | identyczny | 0 | 0 | 0 | ≤ 0,3% pikseli (szum animacji) | 15/15 |

## 5. Co zostało do zrobienia

- **Łańcuch owijek `render` (25 warstw)** można zamienić na jawną listę kroków przed i po renderze. To zmiana struktury, która wymaga ostrożnego testowania kolejności. Proponuję jako osobny etap.
- **Globalne obsługi kliknięć (23)** warto zebrać w jeden rozdzielacz akcji z jawną kolejnością.
- **Bitwa baz (`modes/bitwa_baz.js`, 480 linii)** to jedno domknięcie. Można je rozbić na mapy, silnik, rysowanie i online, ale wymaga to wyniesienia wspólnego stanu `G`.
- **Style CSS** zostały w 18 sekcjach w pierwotnej kolejności (od niej zależy kaskada). Można je pogrupować po ekranach.
- **Narzędzia migracji** (jednorazowe) są w `tools/migracja/`, gdyby trzeba było odtworzyć któryś krok.
