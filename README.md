# Verslo modelis ir logika (pagal sekų diagramą)

## Pagrindiniai veikėjai

-   **Mažmenininkas (Retailer)**
-   **Gamintojas (Manufacturer)**
-   **Išmanusis kontraktas (Smart Contract)**
-   **Kurjeris (Courier)**

## Verslo modelio logika

Šis modelis atitinka „**užsakymas → kainodara → saugus apmokėjimas → pristatymas → išmokos**“ grandinę, kur:

-   Išmanusis kontraktas veikia kaip **patikimas tarpininkas (escrow)**: mažmenininko lėšos laikomos kontrakte iki pristatymo patvirtinamo.
-   Gamintojas koordinuoja procesą: priima užsakymą, gauna siuntimo pasiūlymą, pateikia kainas kontraktui.
-   Kurjeris teikia siuntimo paslaugą, o jo atlygis išmokamas tik įvykdžius pristatymo sąlygas.

## Tipinis scenarijus

-   Mažmenininkas pateikia užsakymą.
-   Gamintojas gauna siuntimo kainą iš kurjerio ir užregistruoja prekių bei siuntimo kainas kontrakte.
-   Mažmenininkas atlieka saugų apmokėjimą į kontraktą.
-   Kurjeris pristato siuntą.
-   Gamintojas išrašo sąskaitą.
-   Mažmenininkas patvirtina pristatymą.
-   Kontraktas išmoka lėšas gamintojui ir kurjeriui bei uždaro užsakymą.

## Sekų diagrama

![image](./photos/Screenshot_20251218_011711.png)

## Veiksmų aprašymai (1–10)

**1. Deploy**

-   Gamintojas sukuria (deploy) išmanųjį kontraktą.
-   Kontrakte užfiksuojama savininkystė (pvz., gamintojo adresas) ir pradinė būsena.

**2. Send the order**

-   Mažmenininkas pateikia užsakymo informaciją kontraktui.
-   Kontraktas įrašo užsakymą ir išsiunčia įvykį apie naują užsakymą (pvz., `OrderSent`).

**3. Best shipment price / Shipment price**

-   Gamintojas kreipiasi į kurjerį dėl geriausios siuntimo kainos.
-   Kurjeris pateikia siuntimo kainą (ir/ar kitus parametrus), reikalingus užsakymui.

**4. Send Price [Order]**

-   Gamintojas įrašo prekių/užsakymo kainą į kontraktą.
-   Kontraktas išsiunčia įvykį (pvz., `PriceSent`), kad mažmenininkas matytų kainą.

**5. Send Price [Shipment]**

-   Gamintojas įrašo siuntimo (kurjerio) kainą į kontraktą.
-   Kontraktas išsiunčia įvykį (pvz., `PriceSent`) apie siuntimo kainą.

**6. Safe payment**

-   Mažmenininkas atlieka saugų apmokėjimą į kontraktą (escrow): lėšos laikomos kontrakte.
-   Tikslas – kad mokėjimas būtų įvykdytas, bet išmokos atidedamos iki pristatymo patvirtinimo.

**7. Send invoice**

-   Gamintojas pateikia sąskaitos/faktūros duomenis kontraktui.
-   Kontraktas išsiunčia įvykį (pvz., `InvoiceSent`) mažmenininkui.

**8. Delivery OK**

-   Po pristatymo (realioje logistikoje) mažmenininkas patvirtina, kad siunta gauta ir tinkama.
-   Šis patvirtinimas kontrakte atveria kelią išmokoms.

**9. Payout (Manufacturer)**

-   Kontraktas išmoka gamintojui jam priklausančią dalį (už prekes), pagal nustatytas sąlygas.

**10. Payout (Courier) + Close order**

-   Kontraktas išmoka kurjeriui siuntimo dalį.
-   Kontraktas uždaro užsakymą (būsena „pristatyta/užbaigta“) ir išsiunčia įvykį (pvz., `OrderDelivered`).
