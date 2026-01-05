# Verslo modelis ir logika

Šio projekto verslo modelis paimtas iš https://medium.com/coinmonks/build-a-smart-contract-to-sell-goods-6cf73609d25.  
Šis modelis skirtas saugiam fizinių prekių užsakymo, transportavimo pajieškos ir apmokėjimui užtikrinti. Jis tai užtikrina naudojant išmaniają sutartį kuri visus mokėjimus laiko savyje iki kol visų dalyvių įsipareigojimai yra įvykdyti (escrow).

## Pagrindiniai veikėjai

-   **Mažmenininkas (Retailer)**
-   **Gamintojas (Manufacturer)**
-   **Išmanioji sutartis (Smart Contract)**
-   **Kurjeris (Courier)**

## Sekų diagrama

![](./photos/Screenshot_20251218_011711.png)

## Veiksmų aprašymas

1. Gamintojas sukuria (deploy) išmanąją sutartį skirta specifiniam mažmeninkui
2. Naudojant įvykį (event) mažmeninkas užsisako produktą X ir jo kiekį N gamintojo sukurtame sutartįje.
3. Gamintojas suranda geriausią kurjieriaus kainą per kurjieriaus išmaniąją sutartį.
4. Gamintojas nusiunčia užsakymo kainą ir mažmeninkas gauną ją per įvykį (event) pavadinimu: _price sent_
5. Gamintojas nusiunčia siuntimo kainą ir mažmeninkas gauną ją per įvykį (event) pavadinimu: _price sent_
6. Mažmeninkas atlieka pilną mokėjimą (užsakymas + siuntimas). Šis mokėjimas lieka išmanioje sutartyje iki tol kol siuntimas bus įvykdytas
7. Gamintojas nusiunčia sąskaitą su atsiuntimo data ir kita informacija. Mažmeninkas gauna sąskaitą per įvykį (event) pavadinimu: _invoice sent_
8. Kurjieris po siuntos pridavimo mažmeninkui pažymi, kad siuntimas įvykdytas išmaniojoje sutartyje.
9. Išmanioji sutartis sumoka Gamintojui už užsakymą.
10. Išmanioji sutartis sumoka Kurjieriui už siuntimą.

# Modelio testavimas

## Lokalus tinklas

Veiksmų eiga:

1. Ganache tinklo paleidimas su komanda: `ganache-cli -p 8545 --chainId 1337 --networkId 1337`
2. Sukompiliuoti sutartį, atidarius naują terminalo langą projekto root direktorijoje paleidžiant šią komandą `truffle compile`
3. Paleisti tinklapį nukeliaujant į `front-end` direktoriją ir paleidžiant komandą: `npm run dev`

Tinklapis:

![](./photos/front/Screenshot_20251218_015001.png)

4. Paspaudus "Connect wallet" mygtuką išmetamas šis langas:

![](./photos/front/image.png)

5. Paspaudžiant "Connect" prijungiamas Metamask
6. Toliau pridedama piniginė kurios privatus raktas yra aprašytas 1-o žingsnio terminalo išvestyje (pasirenkamas betkuris raktas)

![](./photos/front/Screenshot_20260105_151904.png)

![](./photos/front/Screenshot_20260105_152130.png)

7. Į "contract address" laukelį įvedamas kitos piniginės viešas adresas ir paspaudžiama "load contract"

8. Įvedamas užsakymas ir paspaudžiamas "Send Order"

![](./photos/front/Screenshot_20260105_152634.png)

9. Patvirtinamas užsakymas
10. ganache-cli terminalo aplinkoje matoma įvykdita transakcija:

![](./photos/front/Screenshot_20260105_153054.png)

## Testinis tinklas
