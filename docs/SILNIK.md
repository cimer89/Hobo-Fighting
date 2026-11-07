# Silnik walki Hobo Fighting

Plik: `src/js/engine/combat.js` (obiekt `Combat`). To jedyne miejsce, gdzie rozpatrywana jest runda w trybie klasycznym, specjalnym i w Testach. Bitwa baz ma własne zasady w `modes/bitwa_baz/`.

## Planowanie a wykonanie

1. **Planowanie (interfejs):** każdy gracz wybiera akcje na fazy I–II (Długi: I–III). Plany trafiają do stanu gry (`plans[runda]`). Interfejs pyta silnik tylko o kształt ataku (`Combat.shape`), żeby podświetlić pola.
2. **Wykonanie:** `resolve()` (`engine/resolve.js`) zbiera z gry stan początkowy, plany, bonusy, owce, drony, kałuże i wybrane przesunięcia, a potem wywołuje `Combat.run(wejście)`.
3. **Silnik jest funkcją czystą:**
   - nie czyta ekranu ani stanu gry, a wejścia nie zmienia;
   - jedyne losowanie (remis celów drona) idzie z ziarna `kod_pokoju:d:runda`;
   - ten sam stan, te same plany i to samo ziarno zawsze dają identyczny wynik.

## Kolejność rozpatrywania (każda faza)

| Krok | Co się dzieje |
|---|---|
| 1 ruch | wszystkie ruchy naraz: skok Byka (o 1, o 2, w miejscu), teleport Truchla |
| 2 przygotowanie | ruch i przywołanie owcy, aktywacja drona (1/3, 2/3 – na raty, także w różnych rundach) |
| 3 unik | (faza II) unik z bonusu Refleks |
| 4 kolizje | lądowanie Byka: o 1 pole i w miejscu 3 DMG, o 2 pola 1 DMG; w pozostałych przypadkach ścisk −1 dla wszystkich na polu |
| 5 dron | trzecia akcja drona (w dowolnej fazie): 2 DMG najbliższej postaci; remis → najwięcej HP; dalej losowanie z ziarna |
| 6 strzał snajperski | (faza II) Żyleta po celowaniu w fazie I, 3 DMG |
| 7 kij pasterski | 2 pola, 2 DMG |
| 8 ataki | zwykłe ataki, po kolei wg kolejności graczy |
| 9 kałuże | Truchel stawia kałużę |
| 10 szarża Byka | do pierwszej postaci, 2 DMG, odrzut o 1, kolizja po odrzucie −1 |
| 11 szarża owcy | 2 DMG we wszystkich trybach; w klasycznym owca zatrzymuje się na pierwszej postaci, w specjalnym i w Testach przebiega przez linię i rani każdego |
| 12 manipulacja | (faza II) Ciotka przesuwa trafionego; kolizja −1 |
| 13 trucizna | kałuże: 1 DMG (z bonusem 2; w Testach +1) |
| 14 eliminacje | HP ≤ 0 → postać odpada (dopiero na koniec fazy, więc ataki w jednej fazie są jednoczesne) |
| 15 anulowanie | (faza II) przesunięty Długi traci fazę III |

**Koniec rundy:** strefa (−1 poza strefą, tarcza blokuje), eliminacje, przedmioty (tryb specjalny).

## Dziennik zdarzeń

Wynik zawiera `journal`. W grze jest dostępny jako `_journal` w wyniku `resolve()` i pod przyciskiem „📜 Dziennik rundy” w podsumowaniu rundy.

Każdy wpis ma:
- `ph`: faza;
- `step`: krok z tabeli;
- `k`: rodzaj (`dmg`, `shield`, `eliminacja`, `skok`, `odrzut`, `przesunięcie`, `unik`, `losowanie`, `sheep`, …);
- `id`: kogo dotyczy;
- `by`: sprawca;
- `cause` lub `rule`: przyczyna albo zasada;
- przy przesunięciach także `from` i `to`, a przy obrażeniach `hp` po trafieniu.

`Combat.explain(wpis, nazwy)` zamienia wpis na zdanie po polsku.

## Testy

- `node tests/combat_test.js`: 65 testów interakcji postaci, m.in. ataki każdej postaci, odmiany skoku i szarży Byka, ścisk, drużyny, tarcza, bonus +1, Refleks, kałuże, dron, owca, kij, strzał snajperski, manipulacja Ciotki, faza III Długiego, strefa, eliminacje, dziennik, powtarzalność.
- `node tests/golden.js` + `tests/gcmp.py`: 1080 losowych rund. Nowy silnik daje wyniki identyczne ze starym `sim()` we wszystkich trybach.

## Zasady ustalone po zgłoszeniu niejednoznaczności (3.11.2026)

Testy `[D…]` w `tests/combat_test.js` pilnują tych zasad.

1. **[D1] Najpierw wszystkie ruchy naraz, potem ataki; śmierć dopiero po rozpatrzeniu wszystkich ataków fazy.**
   - Trafiona owca zostaje na planszy do kroku eliminacji. Przyjmuje kolejne ataki, zasłania strzały (np. strzał Żylety trafia owcę bez względu na kolejność graczy) i wykonuje swoją szarżę, jeśli Pasterz ją zaplanował.
   - Ginie w kroku 14.
2. **[D2] Dwóch takich samych postaci nie da się wybrać,** więc przypadek dwóch Byków na jednym polu nie występuje.
3. **[D3] Ścisk w 2v2:** gdy na polu jest wróg, −1 dostają wszyscy na polu, także sojusznicy.
4. **[D4] Bonus +1 DMG działa na wszystkie obrażenia zadawane przez gracza,** także na lądowanie Byka (3+1, dalszy skok 1+1) i na zderzenie owcy z Bykiem. Zużywa się przy pierwszej akcji, która zadała obrażenia.
5. **[D5] Kolizja po odrzucie lub przesunięciu:** −1 dla wszystkich na polu, także sojuszników, bez punktów dla sprawcy.
6. **[D6] Szarża Byka jest rozpatrywana przed szarżą owcy.**
   - Gdy Byku wbiegnie w owcę, która szarżuje naprzeciw niego, Byku dostaje obrażenia jej szarży.
   - Gdy owca szarżuje w inną stronę, wykonuje swoją szarżę normalnie.
   - W obu przypadkach owca ginie dopiero po rozpatrzeniu ataków.
7. **[D7] Dron ignoruje owce.**
