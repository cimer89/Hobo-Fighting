# Narzędzia do testowania balansu

Nic w tych narzędziach nie zmienia zasad gry. Propozycje zmian są tylko tekstem do decyzji.

## Co jest zapisywane

Zapisywana jest każda partia trybu klasycznego, specjalnego i Testów, rozegrana na jednym telefonie albo online. Pomijane są trening, samouczek i Bitwa baz. Dane zbiera `src/js/dev/balance.js` z ekranu wyników każdej rundy. Wpis partii:

| Pole | Znaczenie |
|---|---|
| `mode`, `n`, `team` | tryb, liczba graczy, drużyny |
| `rounds` | liczba rozegranych rund |
| `finished`, `draw` | zakończona czy przerwana (powrót do menu); remis |
| `players[].ch` | wybrana postać (dla botów także `strat`) |
| `dealt`, `taken` | zadane i otrzymane obrażenia (z silnika walki) |
| `attacks`, `hits` | ataki i trafienia: zwykły atak, szarża Byka, szarża owcy, dron |
| `abil` | umiejętności: skoki Byka (o 1, o 2, w miejscu), teleport, przywołanie i ruch owcy, dron, kałuża, unik, strzał snajperski, manipulacja Ciotki |
| `elim` | runda, przyczyna (np. „lądowanie Byka”, „strefa”) i sprawca eliminacji |
| `win` | czy wygrał (w 2v2: cała drużyna) |

Dane leżą w pamięci przeglądarki (`localStorage`, klucz `hf_balance_v1`, ostatnie 1000 partii), tylko na tym urządzeniu. Partie online zapisuje każdy gracz u siebie.

## Ekran „🛠 Statystyki balansu”

Przycisk jest w menu głównym, pod samouczkiem.

- **Filtry:** źródło (prawdziwe partie / boty), tryb, liczba graczy.
- **Tabela postaci:**
  - partie;
  - procent wygranych z 95% przedziałem ufności (Wilson) i wartością oczekiwaną (1/liczba graczy, w 2v2 50%);
  - obrażenia zadane i otrzymane na partię;
  - skuteczność ataków;
  - eliminacje na partię;
  - najczęstsze umiejętności;
  - najczęstsze przyczyny odpadnięcia.
- **Propozycje zmian.** Powstają tylko dla postaci z co najmniej 30 zakończonymi partiami i tylko wtedy, gdy przedział ufności nie obejmuje wartości oczekiwanej ±10%. Pewność zależy od liczby partii: wstępna (30–99), umiarkowana (100–199), mocna (200+).
- **Symulacje botów:** w trybie klasycznym albo w Testach, dla 2–6 graczy, ze strategią mieszaną albo jedną dla wszystkich, w seriach po 100, 300 lub 1000 partii.
- **Eksport CSV** (separator: średnik, zgodny z polskim Excelem):
  - gracze w partiach: jeden wiersz na gracza;
  - podsumowanie postaci.

## Boty (`src/js/dev/bots.js`)

Boty grają na tym samym silniku walki co gra (`Combat.run`), z tymi samymi zasadami strefy, planszy (2 graczy: mniejsza plansza) i HP.

| Strategia | Zachowanie |
|---|---|
| agresywny | atakuje pole, na którym wróg stoi teraz; bez celu idzie do najbliższego |
| przewidujący | ocenia ataki według tego, gdzie wróg może być po ruchu (40% zostaje, reszta po sąsiednich polach) |
| ostrożny | trzyma dystans 2–3 pól, pilnuje strefy, atakuje z mniejszą chęcią |
| losowy | dowolne poprawne akcje |

**Ograniczenia:**
- Tryb specjalny nie jest symulowany, bo przedmioty i bonusy z koła wymagają decyzji, których boty nie podejmują.
- Kałuże Truchla boty stawiają tylko obok wrogów i nie zastawiają pułapek.

Z wiersza poleceń:

```
node tests/balance_sim.js 3000 classic 2 mieszane wynik.csv
node tests/balance_test.js index.html    # test zapisu partii, ekranu, symulacji i CSV
```

## Pierwsze wyniki symulacji (7.11.2026, strategie mieszane)

| Tryb, gracze | Partii | Za silni (wygrane / oczekiwane) | Za słabi |
|---|---|---|---|
| klasyczny, 2 | 3000 | **Byku 84% / 50%** | Truchel 25%, Pasterz 30%, Wiatrak 35%, Ciotka 39% |
| klasyczny, 4 | 2000 | **Byku 53% / 25%** | Truchel 9%, Wiatrak 12%, Pasterz 14%, Ciotka 18% |
| Testy, 2 | 3000 | **Byku 79% / 50%** | Truchel 27%, Ciotka 35%, Żyleta 37%, Pasterz 39% |

Wynik dla Byka jest jednoznaczny we wszystkich ustawieniach. Pozostałe różnice warto potwierdzić prawdziwymi partiami: boty nie zastawiają kałuż i słabo grają owcą, co może zaniżać wyniki Truchla i Pasterza.

## Macierz pojedynków 1v1 (7.11.2026, `node tests/matchups.js 120 classic`)

Każda para postaci, obie strony startu, strategie agresywny / przewidujący / ostrożny (bez losowego). Procent = wygrane postaci z wiersza przeciw postaci z kolumny.

| | Wiatrak | Długi | Żyleta | Byku | Ciotka | Pasterz | Truchel | Przemo | śr. |
|---|---|---|---|---|---|---|---|---|---|
| Wiatrak | – | 40% | 17% | 0% | 47% | 61% | 67% | 30% | 38% |
| Długi | 60% | – | 46% | 0% | 43% | 63% | 72% | 51% | 48% |
| Żyleta | 83% | 54% | – | 0% | 76% | 86% | 79% | 70% | 64% |
| **Byku** | 100% | 100% | 100% | – | 100% | 100% | 98% | 100% | **100%** |
| Ciotka | 53% | 57% | 24% | 0% | – | 45% | 77% | 25% | 40% |
| Pasterz | 39% | 37% | 14% | 0% | 55% | – | 100% | 32% | 40% |
| Truchel | 33% | 28% | 21% | 2% | 23% | 0% | – | 0% | 15% |
| Przemo | 70% | 49% | 30% | 0% | 75% | 68% | 100% | – | 56% |

- Strona startu nie ma znaczenia: gracz na pierwszej pozycji wygrywa 50,1% (n = 5715).
- Byku wygrywa praktycznie każdy pojedynek z botami, które grają sensownie. Część przewagi może wynikać z tego, że boty nie uciekają przed lądowaniem i szarżą na planszy 19 pól, ale skala (100%) wskazuje na realną przewagę mechaniczną.
- Truchel 0% z Pasterzem i Przemo oraz Pasterz 100% z Truchlem to najpewniej słabość bota Truchla (kałuże tylko obok wroga).
- Zmiany balansu wymagają decyzji właściciela.

### Po zmianie szarży Byka 2 → 1 DMG (decyzja z 7.11.2026)

Macierz (`node tests/matchups.js 90 classic`) prawie się nie zmieniła: Byku nadal wygrywa ok. 100% pojedynków z botami. Przewaga bierze się głównie ze skoku (lądowanie 3 DMG w każdej fazie przy 5 HP przeciwników), a nie z szarży.
