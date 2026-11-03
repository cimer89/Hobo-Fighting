# Hobo Fighting – makieta planowania (GitHub Pages)

Cała gra jest w jednym pliku `index.html`. Nie potrzebuje instalacji ani serwera.

- **Tryb na jednym telefonie** działa od razu po wgraniu strony, bez żadnej konfiguracji.
- **Pokoje online** (gra na kilku telefonach przez kod pokoju) wymagają darmowej bazy Firebase. Poniżej jest opisana konfiguracja.

---

## Część 1: Wgranie na GitHub Pages

1. Zaloguj się na https://github.com i kliknij **New** (nowe repozytorium).
2. Nazwij repozytorium, np. `hobo-fighting`. Zostaw **Public**. Kliknij **Create repository**.
3. Na stronie repozytorium kliknij **uploading an existing file** (lub **Add file → Upload files**).
4. Przeciągnij plik `index.html` i kliknij **Commit changes**.
5. Włącz stronę: **Settings → Pages**. W sekcji *Build and deployment* ustaw:
   - *Source*: **Deploy from a branch**
   - *Branch*: **main**, folder **/ (root)**
   - kliknij **Save**.
6. Po ok. minucie strona będzie pod adresem:
   `https://TWOJA-NAZWA.github.io/hobo-fighting/`
   (adres pokazuje się na górze sekcji Pages).

Na tym etapie działa już tryb na jednym telefonie.

---

## Część 2: Konfiguracja Firebase (pokoje online)

### 2.1 Projekt i baza danych

1. Wejdź na https://console.firebase.google.com i zaloguj się kontem Google.
2. Kliknij **Add project** (lub **Utwórz projekt**), nazwij go np. `hobo-fighting` i przejdź dalej. Google Analytics można wyłączyć.
3. W menu po lewej wybierz **Build → Firestore Database** i kliknij **Create database**.
   - Wybierz dowolną lokalizację (np. `europe-west`).
   - Wybierz **Start in production mode** i zatwierdź.
4. Otwórz zakładkę **Rules** (Reguły) i zastąp całą treść tym tekstem, potem kliknij **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rooms/{code}/players/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

### 2.2 Logowanie anonimowe

1. W menu po lewej wybierz **Build → Authentication** i kliknij **Get started**.
2. Zakładka **Sign-in method** → kliknij **Anonymous** → włącz przełącznik → **Save**.
3. W zakładce **Settings → Authorized domains** kliknij **Add domain** i dodaj:
   `TWOJA-NAZWA.github.io`
   Bez tego logowanie z adresu GitHub Pages zostanie zablokowane.

### 2.3 Skopiowanie konfiguracji do gry

1. Kliknij ikonę zębatki obok **Project Overview → Project settings**.
2. Przewiń do **Your apps** i kliknij ikonę **</>** (Web). Nazwij aplikację, np. `hobo`, i kliknij **Register app**. Nie zaznaczaj hostingu Firebase.
3. Pojawi się fragment `const firebaseConfig = { ... }`. Skopiuj z niego wartości.
4. Na GitHubie otwórz plik `index.html` → ikona ołówka (**Edit**).
5. Na samym początku kodu znajdziesz blok:

```
const FIREBASE_CONFIG={apiKey:'WPISZ_TUTAJ',authDomain:'WPISZ_TUTAJ',projectId:'WPISZ_TUTAJ',storageBucket:'WPISZ_TUTAJ',messagingSenderId:'WPISZ_TUTAJ',appId:'WPISZ_TUTAJ'};
```

   Zamień każde `WPISZ_TUTAJ` na odpowiednią wartość z Firebase (zostaw apostrofy). Przykład:
   `apiKey:'AIzaSy...'`, `projectId:'hobo-fighting-12345'`.
6. Kliknij **Commit changes**. Po minucie odśwież stronę.

Teraz w lobby powinny być aktywne przyciski **Utwórz pokój** i **Dołącz**.

---

## Część 3: Gra z kolegą na dwóch telefonach

1. Obaj otwierają adres `https://TWOJA-NAZWA.github.io/hobo-fighting/`.
2. Jedna osoba klika **Utwórz pokój** i widzi 4-literowy kod.
3. Druga osoba wpisuje kod w pole **KOD** i klika **Dołącz**.
4. Każdy wybiera postać i pole startowe, potem planuje rundy. Gdy wszyscy zaplanują, plany się ujawniają.

Wskazówki:
- Urządzenia z różnymi systemami (iPhone, Android, iPad) działają tak samo, bo gra jest w przeglądarce.
- Jeśli pojawi się komunikat o błędzie zapisu, sprawdź punkt 2.2 (czy dodano domenę) i reguły z punktu 2.1.
- Najprostsza gra bez konfiguracji: **Jeden telefon, przekazujemy sobie**.

---

## Aktualizacja gry

Po zmianie pliku `index.html` na GitHubie (**Edit** → **Commit changes**) strona aktualizuje się automatycznie po minucie. Konfiguracja Firebase zostaje w pliku, więc nie trzeba jej wpisywać ponownie.

## Bezpieczeństwo

Wartości z punktu 2.3 nie są hasłami, mogą być widoczne w kodzie strony. Bezpieczeństwo zapewniają reguły z punktu 2.1: tylko zalogowani mogą czytać pokoje, a każdy może zapisywać wyłącznie swoje dane.

---

## Rozwiązywanie problemów: błąd 404

Sprawdź po kolei, aż znajdziesz przyczynę:

1. **Odczekaj 1–3 minuty.** Po pierwszym włączeniu Pages strona buduje się i przez chwilę zwraca 404. W zakładce **Settings → Pages** powinien pojawić się zielony komunikat *Your site is live at ...*. Jeśli widzisz *Building*, poczekaj.

2. **Sprawdź nazwę pliku.** Na stronie repozytorium musi być plik dokładnie o nazwie `index.html`, a nie `index.html.txt` ani `Index.html`. Na Windows domyślnie ukrywane są rozszerzenia, więc sprawdź to przed wgraniem.

3. **Sprawdź położenie pliku.** `index.html` musi leżeć bezpośrednio na głównym poziomie repozytorium, nie w folderze. Jeśli wgrałeś go do folderu (np. `hobo/index.html`), przenieś go: **Add file → Upload files** w katalogu głównym, a stary plik usuń.

4. **Sprawdź gałąź i folder.** W **Settings → Pages → Build and deployment** musi być wybrane *Deploy from a branch*, gałąź z plikiem (np. `main`) i folder `/ (root)`. Jeśli Twoje repozytorium ma gałąź `master`, wybierz ją zamiast `main`.

5. **Sprawdź widoczność repozytorium.** Darmowe konto GitHub udostępnia Pages tylko dla repozytoriów *Public*. W **Settings → General** (na samym dole) sprawdź, czy repozytorium nie jest *Private*.

6. **Sprawdź adres.** Adres ma postać `https://TWOJA-NAZWA.github.io/NAZWA-REPOZYTORIUM/`. Nazwa repozytorium musi być w adresie. Sam adres `https://TWOJA-NAZWA.github.io/` pokaże 404, jeśli nie masz repozytorium o nazwie `TWOJA-NAZWA.github.io`.

7. **Sprawdź wielkość liter i ukośnik.** Adres kończy się ukośnikiem `/`. Nazwa repozytorium rozróżnia wielkie i małe litery.

Jeśli po wszystkim nadal jest 404, sprawdź w zakładce **Actions** (w repozytorium), czy nie ma czerwonego błędu wdrożenia `pages build and deployment`. Wtedy wklej jego treść, to będzie widać, co blokuje.

---

## Tryby gry

W menu głównym wybierasz tryb, a potem sposób gry (jeden telefon albo pokój online).

**Tryb klasyczny**: bonusy z koła losowania. Koło dostajesz, gdy postać spełni swój warunek (np. Wiatrak trafi dwóch przeciwników) oraz po zmniejszeniu strefy w rundach 3, 6 i 9.

**Tryb specjalny**: zamiast losowania na mapie leżą przedmioty z tymi samymi bonusami (+1 HP, +1 DMG, dodatkowy ruch, tarcza, refleks).
- Po rundzie 1 pojawia się 6 przedmiotów, po rundzie 3 kolejne 5, po 6 kolejne 4, po 9 kolejne 3.
- Przedmioty nigdy nie pojawiają się na polu zajętym przez gracza ani innego przedmiotu.
- Przedmiot podnosisz, kończąc rundę na jego polu. Jeśli na polu stoi kilku graczy, nikt go nie bierze.
- Nie podniesiesz przedmiotu, gdy masz już aktywny, niewykorzystany bonus. Leczenie nie zajmuje miejsca, ale nie podniesiesz go przy pełnym zdrowiu.
- **Pasterz w trybie specjalnym** gra w nowej wersji z Testów: 7 HP, zaczyna z owcą na polu obok, szarża owcy zadaje 2 DMG każdej postaci w linii, a nowa akcja **Kij** bije 2 pola przed nim za 2 DMG każdemu. Zderzenie szarży Byka z szarżującą owcą też kosztuje Byka 2 HP. Opis na karcie i przykłady akcji pokazują tę wersję.

**Kod pokoju online:** pierwsza litera kodu mówi o trybie. Kod zaczynający się od **S** to tryb specjalny, każdy inny to tryb klasyczny. Osoba dołączająca kodem nie musi wybierać trybu.

---

## Zmiany postaci

**Długi: trzecia faza.** Długi planuje w rundzie trzy fazy (pozostałe postacie dwie). W fazie III działa tylko on, a ścisk w tej fazie dotyczy wyłącznie pól, na których stoi Długi. Jeśli inna postać zmieni jego pozycję w fazach I–II (przesunięcie Ciotki, odrzucenie przez szarżę Byka), jego faza III zostaje anulowana w podsumowaniu. W trybie specjalnym przedmioty podnosi dopiero na koniec rundy, po fazie III.

**Byku: Skok i Szarża.**
- **Skok** zastępuje ruch: o 1 lub 2 pola (pola dalszego skoku są pomarańczowe). Dalszy skok zadaje 1 DMG postaciom stojącym na polu lądowania, a Byku nie dostaje wtedy obrażeń.
- **Szarża** zastępuje atak i jest dostępna tylko w fazie II. Byku biegnie na wprost do pierwszej napotkanej postaci albo do ściany. Trafiona postać dostaje 3 DMG i zostaje odrzucona o 1 pole w tym samym kierunku (przy ścianie nie zostaje odrzucona). Jeśli odrzucona postać wyląduje na zajętym polu, obie dostają po 1 DMG.
- Dawna zasada „wejście na pole przeciwnika = 3 DMG" już nie obowiązuje.

**Kolejność w fazie:** ruchy, ścisk, ataki, szarża Byka, przesunięcie Ciotki, usunięcie postaci z 0 HP.

---

## Nowe postacie

**Pasterz**: akcje Ruch, Ruch owcy, Przywołaj owcę, Szarża owcy.
- Przywołuje owcę na sąsiednie pole. Na planszy jest jedna jego owca: nowe przywołanie zastępuje starą.
- W fazie porusza albo siebie, albo owcę (jedna akcja).
- Szarża owcy: owca biegnie prosto do pierwszej postaci i zadaje 1 DMG. Bez nikogo na drodze dobiega do ściany.
- Przywołanie i szarża to osobne akcje, więc nie da się ich zrobić w tej samej fazie.
- Owca ma 1 HP. Ginie od każdego trafienia i zasłania Pasterza przed strzałem, jeśli stoi pierwsza na linii.

**Truchel**: akcje Teleport i Kałuża.
- Teleport na dowolne pole. Na zajętym polu zachodzi zwykła kolizja.
- Kałuża na sąsiednim polu: na końcu każdej fazy zadaje 1 DMG każdej postaci na niej (2 DMG z bonusem +1 DMG). Działa w rundzie powstania i w dwóch kolejnych. Kałuż może być wiele, nie blokują ruchu. Truchel jest odporny tylko na własne kałuże.

**Sierżant Przemo**: akcje Ruch, Pistolet, Dron.
- Pistolet: jak broń Żylety, ale 1 DMG.
- Dron: w fazie I aktywacja (cała akcja fazy), w fazie II wysłanie nad wybrane pole. Po ruchach fazy II dron atakuje najbliższą postać za 1 DMG i znika. Remis odległości: postać z największym HP, kolejny remis: losowo. Niewysłany dron czeka do następnej rundy.

## Punktacja na koniec gry

- 1 pkt za każde zadane obrażenie (liczą się tylko obrażenia, które faktycznie zabrały HP; ścisk i strefa nie dają punktów nikomu).
- +1 pkt za każdego dodatkowego przeciwnika trafionego jednym atakiem.
- 1 pkt za każdy podniesiony przedmiot (tryb specjalny).
- 5 pkt dla ostatniego żyjącego gracza.

Tabela pojawia się w wynikach ostatniej rundy, a przycisk „Nowa gra” zaczyna od nowa.

---

## Rodzaje walki: Free for all i 2 vs 2

Po wybraniu trybu (klasyczny albo specjalny) wybierasz rodzaj walki.

**Free for all**: każdy na każdego, 2–5 graczy. Wygrywa ostatni na polu.

**2 vs 2**: dokładnie 4 graczy w dwóch drużynach (A: czerwoni, B: niebiescy). Drużynę wybiera się razem z postacią, maksymalnie 2 osoby w drużynie. Żetony mają kolorową obwódkę i literę drużyny.
- Ataki nie ranią sojuszników: strzały (Żyleta, Ciotka, Przemo) przelatują przez sojusznika do pierwszego wroga, Wiatrak i Długi omijają sojuszników, szarża Byka i szarża owcy biegną do pierwszego wroga, dron leci do najbliższego wroga, kałuża nie truje sojuszników Truchla, a owca nie zasłania przed strzałem sojusznika.
- Sojusznicy na jednym polu nie dostają ścisku. Gdy na polu jest też wróg, ścisk dostają wszyscy.
- Wygrywa ostatnia drużyna, w której ktoś żyje. Każdy żywy gracz zwycięskiej drużyny dostaje 5 pkt, a tabela pokazuje też sumy drużyn.
- Kod pokoju online: drugi znak „2” oznacza 2 vs 2.

## Przedmioty (tryb specjalny): zmiany

- Przedmioty pojawiają się tylko w bezpiecznej strefie następnej rundy. Gdy strefa się kurczy, przedmioty, które zostały w czerwonej strefie, znikają.
- Kolejne fale są coraz mniejsze: 6, 5, 4, 3 (ostatnia może być mniejsza, bo po rundzie 9 bezpieczne jest tylko pole środkowe).
- Podniesiony przedmiot podskakuje i wlatuje w postać, a potem znika z mapy.

---

## Wybór postaci w stylu bijatyki

- Ekran wyboru zajmuje cały ekran: duża ilustracja postaci, nazwa, rola i paski Siła / Zasięg / Ruch, a na dole siatka 8 portretów. Zajęte postacie są wyszarzone z napisem „ZAJĘTA”. W 2 vs 2 nad ilustracją wybierasz drużynę.
- Jeden telefon: najpierw wszyscy po kolei wybierają postacie, potem pojawia się ekran „VS” (w 2 vs 2 drużyna A kontra drużyna B), a dopiero po przycisku „Rozstawienie” każdy po kolei, w tajemnicy, wybiera pole startowe na mapie.
- Gra online: każdy wybiera postać na tym samym ekranie, a potem pole startowe.

---

## Dźwięk

Gra ma wbudowane dźwięki zastępcze (generowane w przeglądarce), więc działa bez żadnych plików. Własne dźwięki podmieniasz tak:

1. W repozytorium utwórz folder `audio` obok `index.html` (na GitHubie: **Add file → Upload files**, przeciągnij cały folder).
2. Nazwij pliki dokładnie jak w tabeli, w formacie `.mp3` (albo `.ogg`). Wystarczy wgrać tylko część: brakujące zostaną zastępcze.

| Plik | Kiedy gra |
|---|---|
| `music_menu.mp3` | muzyka w menu i przy wyborze postaci (zapętlona) |
| `music_battle.mp3` | muzyka w trakcie walki (zapętlona) |
| `click.mp3` | zwykły przycisk |
| `confirm.mp3` | zatwierdzenie (faza, start, wybór) |
| `select.mp3` | dotknięcie portretu postaci |
| `vs.mp3` | ekran VS |
| `phase.mp3` | początek fazy w animacji, przycisk „Rozstawienie” |
| `step.mp3` / `jump.mp3` | ruch / skok i unik |
| `swing.mp3` | atak Wiatraka |
| `thrust.mp3` | atak Długiego |
| `sniper.mp3` | strzał Żylety |
| `magic.mp3` | atak Ciotki |
| `pistol.mp3` | pistolet Przemo |
| `charge.mp3` | szarża Byka |
| `sheep.mp3` | owca Pasterza |
| `drone.mp3` | dron |
| `poison.mp3` | kałuża Truchla |
| `teleport.mp3` | teleport Truchla |
| `hit.mp3` | otrzymanie obrażeń |
| `miss.mp3` | pudło |
| `knock.mp3` | odrzucenie / przesunięcie |
| `shield.mp3` | tarcza blokuje |
| `ko.mp3` | postać odpada |
| `heal.mp3` | leczenie |
| `pickup.mp3` | podniesienie przedmiotu |
| `wheel.mp3` / `win.mp3` | koło losowania (tyk) / wynik |

Wskazówki: efekty krótkie (do 1 s, kilkadziesiąt KB), muzyka 1–3 MB, przycięta tak, żeby pętla się nie urywała. Dźwięk włącza się po dotknięciu „Naciśnij żeby rozpocząć” (telefony nie pozwalają na dźwięk wcześniej). Przycisk 🔊 otwiera głośność muzyki i efektów oraz wyciszenie; ustawienia zapamiętują się na telefonie.

## Tryby bez bonusów

Tryb klasyczny i tryb Testy nie mają już koła bonusów. Bonusy zostały tylko w trybie specjalnym (przedmioty na mapie).

## Tryb „Testy” (nowy balans, BETA)

Trzeci tryb w menu: jak tryb klasyczny, ale z poprawkami balansu z symulacji. Online kod pokoju zaczyna się od litery **T**.

| Postać | Zmiana w trybie Testy |
|---|---|
| Byku | Skok o 1–2 pola (o 2 tylko w fazie I): wylądowanie na polu przeciwnika = 2 DMG dla niego, Byku bez obrażeń. Szarża przez całą planszę: 1 DMG i odrzut. Gdy strefa już się zmniejszyła, a szarża nikogo nie trafi, Byku uderza w ścianę strefy: −1 HP i zatrzymuje się przy niej |
| Pasterz | 7 HP. Zaczyna z owcą obok. Szarża owcy 2 DMG i trafia wszystkich w linii. Nowa akcja **Kij**: 2 pola przed sobą, 2 DMG każdemu na nich |
| Wiatrak | 6 HP. Wachlarz 2/1/1 plus drugi rząd 3 pól po 1 DMG |
| Żyleta | Strzał: pierwsza postać, 2 DMG na 2 pierwszych polach, dalej 1 DMG. Nowa akcja **Strzał snajperski** (2 akcje): faza I „Celuj” (kierunek), faza II „Snajperski”: 3 DMG pierwszej postaci przez całą planszę |
| Sierżant Przemo | 4 HP. Dron 2 DMG |
| Truchel | Kałuża 2 DMG na koniec każdej fazy |
| Długi | Linia 1 – 2 – 2 DMG |
| Ciotka | 2 DMG także w fazie II (przesunięcie bez zmian) |

We wszystkich trybach owca zostaje na polu, na którym skończyła szarżę. Szarża Byka zderza się z owcą: Byku zatrzymuje się na jej polu, owca ginie, a jeśli owca szarżowała naprzeciw niego, Byku dostaje jej obrażenia.


Po końcu gry przycisk **Menu główne** wraca do wyboru trybu bez przeładowania strony.

## Bitwa baz (BETA)

Wejście: Testy → Bitwa baz → rozmiar → mapa. Gra na jednym telefonie, drużyny 1v1 (małe mapy, baza 12 HP), 2v2 lub 3v3 (duże mapy, baza 20 HP).

Mapy (każda w wersji małej i dużej, symetryczne, bazy zawsze na brzegu planszy):
- **Otwarta równina:** prostokąt z kilkoma przeszkodami.
- **Labirynt:** generowany losowo przy każdej grze i **niesymetryczny**: bazy stoją w losowych kolumnach przy przeciwnych brzegach, układ korytarzy jest inny po obu stronach. Uczciwość pilnuje generator: odległość od każdej bazy do Wielkiego Menela różni się najwyżej o 2 pola, a każda drużyna dostaje tyle samo stworków i skrzyń bliżej swojej bazy (najchętniej w ślepych zaułkach).
- **Kwadrat:** bazy w przeciwległych rogach, pomiędzy las i ścieżki.
- **Most nad rzeką:** woda dzieli mapę. Przez wodę nie da się przejść (tylko mostami), ale ataki i strzały lecą nad nią. Wielki Menel pilnuje środkowego mostu. Bez strefy. Na razie prosta grafika planszy (do podmiany).

- **Symetria:** każda mapa jest dokładnie symetryczna względem środka (w osiach heksów), więc obie drużyny mają skrzynki, stworki, krzaki i skały w tych samych odległościach od bazy. Wyjątek: labirynt (patrz wyżej).
- **Start i odrodzenie w bazie:** wszyscy zaczynają na polu swojej bazy. Własna baza jest przechodnia tylko dla swojej drużyny.
- **Ruch:** tylko po drodze (bez przeskakiwania skał i wody) i tylko na pola, które drużyna teraz widzi. Wzmocnienie zasięgu ruchu można wziąć raz (+ Buty).
- **Linia wzroku:** skały i krzaki zasłaniają pola za nimi. Pole z krzakiem widać, ale postać w środku dalej jest ukryta, dopóki nie zaatakuje.
- **Cel:** zniszczyć wrogą bazę. Baza strzela 1 DMG na fazę do najbliższego wroga w zasięgu 2.
- **Mgła wojny:** wzrok zaczyna się od 2 pól (rośnie z wzmocnieniami i Lunetą), baza widzi 3 pola. Nieodkryte pola są ciemne, odkryte ale poza wzrokiem przyciemnione.
- **Krzaki:** postać w krzakach jest niewidoczna dla wrogów, dopóki z nich nie zaatakuje. Wyjście z krzaków i powrót znowu ją chowa.
- **Stworki:** Szczury (poz. 1: 3 HP, 1 DMG, 2 XP) i Wielki Menel na środku (poz. 3: 10 HP, 2 DMG, 5 XP, zostawia skrzynkę). Znaczek poziomu na mapie ma kolor według twojego poziomu: zielony łatwy, żółty wyrównany, czerwony trudny. Dotknięcie stworka albo postaci pokazuje kartę ze statystykami. Stoją w miejscu, dopóki ktoś nie podejdzie na sąsiednie pole albo ich nie zaatakuje. Nie widzą postaci w krzakach. Gonią do 4 pól od legowiska, potem wracają i leczą się o 1 HP na rundę. Odradzają się po 5 rundach.
- **Skrzynki:** +1 DMG, +2 HP, Buty (ruch dalej o 1), Luneta (+2 wzroku). Maks. 3 przedmioty.
- **Doświadczenie:** +1 za rundę, stworki 2–5, zabójstwo 4 (pomoc 2), trafienie bazy 1. Poziomy 2–6 (3, 7, 12, 18, 25 XP); każdy poziom +1 HP i **jedno wzmocnienie do wyboru**: +1 DMG albo +1 zasięgu dla odblokowanej umiejętności (atak, ruch/skok/teleport, szarża, owca, kałuża, dron, strzał snajperski) albo +1 do wzroku.
- **Śmierć:** odrodzenie w bazie po 2 rundach.
- **Rozwój postaci:** na poziomie 1 każdy ma ruch o 1 pole i atak 1 DMG na sąsiednie pole. Poziomy 2 i 3 odblokowują umiejętności postaci (lista w panelu „Umiejętności postaci”), a każdy awans daje wybór wzmocnienia.

## Bitwa baz – ścieżki, las i obozowiska

- **Ścieżki** (ubita ziemia) prowadzą od każdej bazy do środka mapy, a na „Moście nad rzeką” – na most. To najkrótsza i najbardziej odsłonięta droga.
- **Las:** drzewa i krzaki. Można w nie wejść i się w nich schować: zasłaniają widok i ukrywają postać przed przeciwnikiem (tak jak krzaki wcześniej).
- **Obozowiska stworów** (namiot + ognisko) leżą w lesie z boku ścieżek. Żeby zdobyć XP i łup, trzeba zboczyć z drogi.
- Mapy „Otwarta równina” na małej i dużej planszy zastąpiły **„Leśne ścieżki”**. „Kwadrat” i „Most nad rzeką” też dostały ścieżki, las i obozowiska. Wszystkie te mapy pozostają symetryczne.

## Bitwa baz – oprawa rysunkowa

- Mapa Bitwy baz ma ten sam rysunkowy styl co zwykła rozgrywka: trawiaste heksy, rysowane krzaki i głazy, woda z falami, morze dookoła i mgła wojny na nieodkrytych polach.
- Bazy drużyn to szałasy menelów z blachy, palet i opon z niebieską albo czerwoną plandeką i flagą. Skrzynki, kałuże trucizny i stworki mają własne grafiki: **Szczury** (grupka trzech szczurów) i **Wielki Menel** (boss z butelką i kijem).
- Postacie stoją na mapie jako rysunkowe figurki z otoczką w kolorze drużyny. Aktualny gracz ma pulsujący pierścień pod stopami.
- Mapa jest większa niż wcześniej i przewija się palcem, a na starcie tury ustawia się na Twojej postaci.
- Dotknięcie stworka zawsze pokazuje kartę z jego poziomem (z oceną trudności), HP, obrażeniami i nagrodą XP – także wtedy, gdy tym samym dotknięciem wybierasz kierunek ataku.
- **Za krzakiem (nowe)**: krzak nie chowa już terenu za sobą – wiesz, czy dalej jest trawa, krzak, skała czy woda, ale nie widzisz, kto tam stoi (pole jest przyciemnione z ikoną przekreślonego oka). Przy ruchu dalej niż o 1 pole (buty, skok Byka, teleport Truchela) takie pola są pomarańczowe ze znakiem „?” – można tam wejść, ale na własne ryzyko. Skały dalej zasłaniają wszystko.

## Koniec rundy: podsumowanie i baner

- Po animacji rundy wyskakuje animowana karta **KONIEC RUNDY N** z podsumowaniem dla każdej postaci: portret, pasek HP spadający od stanu sprzed rundy do aktualnego, ile HP straciła, ile obrażeń zadała i pieczątka **ODPADA** przy nokaucie. Karta znika sama po ok. 5 s albo po dotknięciu i nie blokuje przycisków pod spodem.
- Gdy zaczyna się kolejna runda, na środku ekranu pojawia się baner **RUNDA N** („twój ruch” online, „zaplanuj ruchy” na jednym telefonie), więc od razu widać, że kolejka się skończyła.

## Trening

- Po wybraniu trybu (klasyczny, specjalny albo Testy) jest przycisk **Trening**: wybierasz postać i grasz sam przeciwko manekinowi, z zasadami wybranego trybu.
- **Manekin** nie atakuje i stoi w miejscu, ma 10 HP i co rundę odnawia je do pełna. Da się go przesuwać i odrzucać (szarża Byka, Ciotka, owca itd.), więc można sprawdzić wszystkie ataki i efekty.
- W treningu nie ma strefy zawężającej planszę ani końca gry. Gdy Twoja postać straci całe HP, zaczyna następną rundę z pełnym HP.
- Pasek **TRENING** u góry: **↺ Manekin na start** ustawia manekina z powrotem na jego polu startowym (podczas planowania), **Zakończ** wraca do menu.
- Po każdej rundzie widać podsumowanie: ile HP stracił manekin i Twoja postać.

## Byku: nowe obrażenia (wszystkie tryby)

- Skok na pole przeciwnika – zarówno o 1, jak i o 2 pola: **3 DMG**.
- Szarża: **2 DMG** i odrzucenie o 1 pole.

## Online: do 6 graczy

- W trybie Free for all online w jednym pokoju może grać do **6 graczy** (na jednym telefonie dalej do 5).
- Siódma osoba, która spróbuje dołączyć, dostaje komunikat **POKÓJ PEŁNY** i wraca do menu.

## Profile graczy, ranking i statystyki (Firebase)

- W menu (po „Start”) są przyciski **👤 Profil** i **🏆 Ranking**.
- **Profil**: gracz wpisuje nick (3–16 znaków, unikalny). Profil jest przypisany do telefonu, bez hasła.
- **Nick widać**: w poczekalni i przy wyborze postaci online, nad postacią na planszy, w podsumowaniu rundy, w wynikach rundy i w tabeli końcowej.
- **Statystyki** (z gier online): gry, wygrane, % wygranych, nokauty, zadane obrażenia, punkty oraz gry i wygrane każdą postacią.
- **Ranking**: top 50 graczy według wygranych, punktów albo nokautów.
- Wymaga podłączenia bazy Firebase (wklejenie konfiguracji w `index.html`, stała `PROF_FB`) i reguł z pliku `firestore.rules`. Bez tego gra działa jak wcześniej, a okna profilu pokazują informację, że baza nie jest podłączona.

## Bitwa baz online i w głównym menu

- **Bitwa baz** jest teraz w głównym menu, obok trybów klasycznego, specjalnego i Testów.
- W menu Bitwy baz są dwie sekcje: **Na jednym telefonie** (jak dotąd) i **Online – każdy na swoim telefonie**.
- **Załóż pokój**: wybierasz rozmiar (1v1, 2v2, 3v3) i mapę, dostajesz 4-znakowy kod. **Dołącz**: wpisujesz kod znajomego.
- W poczekalni każdy wybiera wolne miejsce w drużynie i postać (widać nicki z profilu). Gdy wszystkie miejsca są zajęte, założyciel naciska **Zaczynamy!**.
- Każdy planuje tylko swoją postać i widzi mapę tylko oczami swojej drużyny. Po zatwierdzeniu planu widać, kto jeszcze planuje. Gdy wszyscy skończą, runda rozgrywa się na wszystkich telefonach jednocześnie.
- Wszystkie telefony liczą tę samą grę (wspólne ziarno losowania i te same plany), więc wynik jest identyczny u wszystkich. Połączenie idzie przez ten sam przekaźnik co zwykła gra online.
- Ograniczenie: po odświeżeniu strony albo zamknięciu przeglądarki w trakcie gry nie da się wrócić do tej rozgrywki.

## Menu na małych telefonach

- Menu główne przewija się, a na niskich ekranach chowa obrazek i opisy przycisków, więc wszystkie przyciski są widoczne.

## Bójka (ścisk) jak w starych kreskówkach

- Gdy kilka postaci stoi na jednym polu (ścisk), zamiast nich na planszy kłębi się kreskówkowa chmura kurzu z napisem **BÓJKA!**, latającymi gwiazdkami i małymi ikonkami walczących postaci (z obwódką drużyny w trybie 2 vs 2).
- W fazie planowania Twoja postać wyłania się z kłębu (z odbiciem), a ikonki pozostałych uczestników zostają przy chmurze.

## Online: poczekalnia, drużyny i kolejka wyboru postaci

- Po wejściu do pokoju wszyscy czekają w **poczekalni** (lista graczy z nickami). Założyciel pokoju naciska „Wszyscy są” (Free for all: od 2 graczy, 2 vs 2: dokładnie 4).
- W 2 vs 2 następuje **wybór drużyn**: każdy dołącza do niebieskiej albo czerwonej (po 2 osoby). Założyciel zatwierdza.
- Potem gra **losuje kolejkę** i gracze wybierają postacie po kolei. Kto ma swoją kolej, widzi ekran wyboru z napisem „TWOJA KOLEJ!”, reszta widzi kolejkę z już wybranymi postaciami. Zajętych postaci nie da się wybrać.
- Po wyborze wszystkich jest ekran VS i rozstawienie jak dotąd.

## Gra online – działa bez konfiguracji

Tryb online przesyła ruchy przez darmowy serwer ntfy.sh (zwykłe HTTPS, bez konta). Działa w każdej sieci, w której działa internet: Wi-Fi, sieć komórkowa, różne miasta.

1. Jedna osoba wybiera tryb i rodzaj walki, potem **Utwórz pokój online**. Dostaje 4-literowy kod.
2. Pozostali na pierwszym ekranie (wybór trybu) wpisują kod i klikają **Dołącz kodem**.
3. Pasek na dole pokazuje stan połączenia. Nikt nie musi być „gospodarzem”: każdy telefon wysyła swój stan, a pozostali go odbierają. Nie odświeżaj strony w trakcie partii.

Bitwa baz działa na razie tylko na jednym telefonie. Jeśli kiedyś wpiszesz konfigurację Firebase w `FIREBASE_CONFIG`, gra użyje Firebase zamiast ntfy.sh.

## Animacje 3D i dźwięki

- Postacie zostały wymodelowane w Blenderze jako komiksowe figurki 3D (cel shading z konturem).
- Na ekranie wyboru postaci w rogu obraca się figurka 3D wybranej postaci. Dotknij jej, żeby zobaczyć animację ataku.
- W trakcie rundy przy ataku, szarży, dronie, teleporcie itp. wysuwa się przerywnik z animacją 3D postaci.
- Efekty dźwiękowe wygenerowano w ElevenLabs (28 dźwięków: ataki każdej postaci, trafienia, pudła, nokaut, owca, dron, awans w Bitwie baz, wygrana i inne). Brakujące dźwięki zastępuje syntezator.

## Muzyka (ElevenLabs)

- Dwa utwory instrumentalne z ElevenLabs Music v2.5, po ok. minucie, przerobione na pętle bez przerwy (końcówka płynnie przechodzi w początek):
  - **menu i wybór postaci:** „Junkyard Swagger”, luźny hip-hop z gitarą slide, harmonijką i trąbką,
  - **walka:** „Junkyard Rumble Loop”, energiczny funk-rock z basem slap, gitarą wah i dęciakami.
- Utwory są wbudowane w grę (działa też w artefakcie bez folderu `audio/`), a kopie leżą w `audio/music_menu.mp3` i `audio/music_battle.mp3`.
- Muzyka gra od dotknięcia „Naciśnij żeby rozpocząć” i nie zaczyna się od nowa przy kolejnych dotknięciach. Głośność muzyki ustawisz w panelu 🔊.

## Styl rysunkowy (mobilny cartoon)

- Grafika rozgrywki jest w stylu rysunkowym (wariant B z propozycji): jasne kolory, miękkie cieniowanie, cienki kontur, postacie w proporcjach chibi.
- **Postacie**: każda postać i owca Pasterza to rysunkowe sprite'y (przód 3/4, tył 3/4, poza ataku), narysowane w ChatGPT na podstawie kart postaci. Kierunki w lewo to lustrzane odbicie.
- **6 kierunków jak 6 ścian heksa**: każda postać ma ujęcia przodem, tyłem, 3/4 z przodu i 3/4 z tyłu (lewo to lustrzane odbicie prawa). Przy zmianie kierunku postać „zwija się” w poziomie i rozwija z nowym ujęciem, jak w grach anime.
- **Kierunek w spoczynku**: postać patrzy na najbliższego przeciwnika, a gdy dwóch jest podobnie blisko – między nich. W ruchu patrzy w stronę marszu.
- **Ataki celują w pole**: osobna poza ataku dla każdego z 6 kierunków (broń wycelowana w trafiane pola), krótki zamach i wypad w stronę celu zgrany z błyskiem pól i linią strzału. Byku i owca w czasie szarży mają pozę szarży przez cały bieg, Pasterz wskazuje kijem cel szarży owcy, Przemo przy wysyłaniu drona obraca się do celu.
- Postać stoi na środku swojego heksa.
- **Animacje**: oddech w spoczynku, podskoki przy biegu, wypad z pozą ataku, biały błysk i odrzut przy trafieniu, upadek przy nokaucie, skoki przy wygranej.
- Postacie stoją bezpośrednio na planszy, bez podstawek. W trybie drużynowym (2 vs 2) każda postać ma otoczkę w kolorze drużyny: niebieską albo czerwoną (owca ma kolor drużyny Pasterza).
- Postać schowana za wyższą postacią stojącą bliżej jest dorysowana półprzezroczyście, żeby było ją widać.
- **Plansza**: wyspa z trawiastych heksów z klifami i pianą, morze, a na brzegach głazy, krzaki, skrzynki, beczka, opony i kwiatki. Rysuje się bez three.js, więc działa też bez internetu.
- W panelu dźwięku (🔊) są przełączniki **Postacie rysunkowe** i **Nowa plansza**. Po wyłączeniu wracają żetony i stara plansza.
- Gra nie potrzebuje już modeli 3D ani three.js, plik jest mniejszy (~10 MB).

