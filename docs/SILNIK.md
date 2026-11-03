# Silnik walki Hobo Fighting

Plik: `src/js/engine/combat.js` (obiekt `Combat`). To jedyne miejsce, gdzie rozpatrywana jest runda w trybie klasycznym, specjalnym i w Testach. Bitwa baz ma własne zasady w `modes/bitwa_baz.js`.

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
| 2 przygotowanie | ruch i przywołanie owcy, aktywacja drona |
| 3 unik | (faza II) unik z bonusu Refleks |
| 4 kolizje | lądowanie Byka: o 1 pole i w miejscu 3 DMG, o 2 pola 1 DMG; w pozostałych przypadkach ścisk −1 dla wszystkich na polu |
| 5 dron | (faza II) najbliższa postać; remis → najwięcej HP; dalej losowanie z ziarna |
| 6 strzał snajperski | (faza II) Żyleta po celowaniu w fazie I, 3 DMG |
| 7 kij pasterski | 2 pola, 2 DMG |
| 8 ataki | zwykłe ataki, po kolei wg kolejności graczy |
| 9 kałuże | Truchel stawia kałużę |
| 10 szarża Byka | do pierwszej postaci, 2 DMG, odrzut o 1, kolizja po odrzucie −1 |
| 11 szarża owcy | 1 DMG i stop (klasyczny) albo 2 DMG każdemu na drodze (specjalny, Testy) |
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

- `node tests/combat_test.js`: 54 testy interakcji postaci, m.in. ataki każdej postaci, odmiany skoku i szarży Byka, ścisk, drużyny, tarcza, bonus +1, Refleks, kałuże, dron, owca, kij, strzał snajperski, manipulacja Ciotki, faza III Długiego, strefa, eliminacje, dziennik, powtarzalność.
- `node tests/golden.js` + `tests/gcmp.py`: 1080 losowych rund. Nowy silnik daje wyniki identyczne ze starym `sim()` we wszystkich trybach.

## Niejednoznaczności do decyzji (zasad nie zmieniałem)

Testy oznaczone `[N…]` utrwalają obecne zachowanie. Zmiana decyzji = zmiana tych testów.

1. **[N1] Kolejność zwykłych ataków.** W kroku 8 ataki są liczone po kolei wg kolejności graczy (kolejność dołączenia albo numer gracza). Ma to znaczenie przy owcy. Jeśli Wiatrak (wcześniej na liście) zabije owcę, strzał Żylety przelatuje dalej i trafia postać za nią. Jeśli Żyleta jest pierwsza, trafia owcę.
2. **[N2] Dwóch Byków ląduje na tym samym polu.** Żaden nie dostaje obrażeń, a trzecia postać dostaje obrażenia tylko od pierwszego z nich.
3. **[N3] Ścisk w 2v2.** Gdy na polu jest choć jeden wróg, −1 dostają wszyscy na tym polu, także sojusznicy.
4. **[N4] Bonus +1 DMG a lądowanie Byka.** Bonus nie działa na lądowanie i nie zużywa się (działa przy szarży).
5. **[N5] Kolizja po odrzucie lub przesunięciu.** −1 dostają wszyscy na polu, także sojusznicy, a sprawca nie dostaje za to punktów.
6. **Kolejność kroków 10–13.** Szarża Byka jest liczona przed szarżą owcy i przed przesunięciem Ciotki. Odrzucona postać może więc wpaść pod owcę albo na kałużę już w tej samej fazie.
7. **Dron ignoruje owce.** Celem jest najbliższa postać, nawet jeśli owca stoi bliżej.
