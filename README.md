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

## Bitwa baz (tryb Testy, BETA)

Wejście: Testy → Bitwa baz → rozmiar → mapa. Gra na jednym telefonie, drużyny 1v1 (małe mapy, baza 12 HP), 2v2 lub 3v3 (duże mapy, baza 20 HP).

Mapy (każda w wersji małej i dużej, symetryczne, bazy zawsze na brzegu planszy):
- **Otwarta równina:** prostokąt z kilkoma przeszkodami.
- **Labirynt:** generowany losowo przy każdej grze (symetryczny, zawsze z przejściem między bazami), krzaki i stworki w ślepych zaułkach.
- **Kwadrat:** bazy w przeciwległych rogach, pomiędzy las i ścieżki.
- **Most nad rzeką:** woda dzieli mapę. Przez wodę nie da się przejść (tylko mostami), ale ataki i strzały lecą nad nią. Wielki Menel pilnuje środkowego mostu. Bez strefy. Na razie prosta grafika planszy (do podmiany).

- **Cel:** zniszczyć wrogą bazę. Baza strzela 1 DMG na fazę do najbliższego wroga w zasięgu 2.
- **Mgła wojny:** wzrok zaczyna się od 2 pól (rośnie z wzmocnieniami i Lunetą), baza widzi 3 pola. Nieodkryte pola są ciemne, odkryte ale poza wzrokiem przyciemnione.
- **Krzaki:** postać w krzakach jest niewidoczna dla wrogów, dopóki z nich nie zaatakuje. Wyjście z krzaków i powrót znowu ją chowa.
- **Stworki:** Szczury (poz. 1: 3 HP, 1 DMG, 2 XP) i Wielki Menel na środku (poz. 3: 10 HP, 2 DMG, 5 XP, zostawia skrzynkę). Znaczek poziomu na mapie ma kolor według twojego poziomu: zielony łatwy, żółty wyrównany, czerwony trudny. Dotknięcie stworka albo postaci pokazuje kartę ze statystykami. Stoją w miejscu, dopóki ktoś nie podejdzie na sąsiednie pole albo ich nie zaatakuje. Nie widzą postaci w krzakach. Gonią do 4 pól od legowiska, potem wracają i leczą się o 1 HP na rundę. Odradzają się po 5 rundach.
- **Skrzynki:** +1 DMG, +2 HP, Buty (ruch dalej o 1), Luneta (+2 wzroku). Maks. 3 przedmioty.
- **Doświadczenie:** +1 za rundę, stworki 2–5, zabójstwo 4 (pomoc 2), trafienie bazy 1. Poziomy 2–6 (3, 7, 12, 18, 25 XP); każdy poziom +1 HP i **jedno wzmocnienie do wyboru**: +1 DMG albo +1 zasięgu dla odblokowanej umiejętności (atak, ruch/skok/teleport, szarża, owca, kałuża, dron, strzał snajperski) albo +1 do wzroku.
- **Śmierć:** odrodzenie w bazie po 2 rundach.
- **Rozwój postaci:** na poziomie 1 każdy ma ruch o 1 pole i atak 1 DMG na sąsiednie pole. Poziomy 2 i 3 odblokowują umiejętności postaci (lista w panelu „Umiejętności postaci”), a każdy awans daje wybór wzmocnienia.

## Gra online – działa bez konfiguracji

Tryb online łączy telefony bezpośrednio (WebRTC przez darmowy serwer PeerJS). Nie trzeba zakładać Firebase ani niczego wpisywać.

1. Jedna osoba wybiera tryb i rodzaj walki, potem **Utwórz pokój online**. Dostaje 4-literowy kod.
2. Pozostali na ekranie wyboru trybu wpisują kod i klikają **Dołącz kodem**.
3. Twórca pokoju jest gospodarzem: jego telefon musi mieć grę otwartą do końca partii. Pasek na dole ekranu pokazuje stan połączenia.

Ograniczenia: rzadko, w niektórych sieciach komórkowych lub firmowych bezpośrednie połączenie może się nie udać (wtedy spróbuj innej sieci, np. Wi-Fi). Bitwa baz działa na razie tylko na jednym telefonie.

Jeśli kiedyś wpiszesz konfigurację Firebase w `FIREBASE_CONFIG`, gra użyje Firebase zamiast połączenia bezpośredniego.
