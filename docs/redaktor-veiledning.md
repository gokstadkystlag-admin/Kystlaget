# Redaktørveiledning — Gokstad Kystlag CMS

Denne veiledningen forklarer hvordan du bruker nettsidenes innholdssystem (CMS) for å legge til og redigere artikler og arrangementer.

---

## Innlogging

1. Gå til **gokstadkystlag.no/admin** (eller test-URL/admin)
2. Klikk **"Login with GitHub"**
3. Logg inn med GitHub-kontoen som har tilgang til prosjektet
4. Du kommer til CMS-dashbordet

> Første gang må du godkjenne at appen får tilgang til GitHub-kontoen din. Dette er trygt — CMS-et lagrer endringer direkte i kodelageret.

---

## Oversikt over CMS-et

Når du er logget inn ser du to samlinger i venstremenyen:

- **Artikler / Aktuelt** — Nyheter, oppdateringer og artikler fra Kystvakt
- **Arrangementer** — Kommende og tidligere arrangementer

---

## Legge til en ny artikkel

1. Klikk **"Artikler / Aktuelt"** i menyen
2. Klikk **"New Artikkel"** øverst
3. Fyll ut feltene:
   - **Tittel** — Overskriften på artikkelen
   - **Kort beskrivelse** — En setning som vises i listevisningen
   - **Dato** — Publiseringsdato
   - **Bilde** (valgfritt) — Last opp et bilde som vises øverst i artikkelen
   - **Forfatter** (valgfritt) — Hvem som har skrevet artikkelen
   - **Innhold** — Selve artikkelteksten (se "Skrive innhold" nedenfor)
4. Klikk **"Publish"** øverst til høyre
5. Velg **"Publish now"**

Artikkelen blir automatisk publisert på nettsiden innen noen minutter.

---

## Legge til et nytt arrangement

1. Klikk **"Arrangementer"** i menyen
2. Klikk **"New Arrangement"** øverst
3. Fyll ut feltene:
   - **Tittel** — Navnet på arrangementet (f.eks. "Kystkulturdagen 2026")
   - **Kort beskrivelse** — En kort beskrivelse som vises i oversikten
   - **Dato** — Dato for arrangementet
   - **Sted** (valgfritt) — Hvor arrangementet holdes (f.eks. "Gokstad Kystlag, Framnesveien 5")
   - **Tidspunkt** (valgfritt) — Klokkeslett (f.eks. "11:00–17:00")
   - **Bilde** (valgfritt) — Et bilde for arrangementet
   - **Innhold** — Detaljert beskrivelse
4. Klikk **"Publish"** → **"Publish now"**

---

## Skrive innhold

Innholdsfeltet bruker **Markdown**, et enkelt formateringsspråk. Her er det viktigste:

| Hva du vil gjøre       | Hva du skriver               | Resultat               |
|------------------------|------------------------------|------------------------|
| Overskrift             | `## Min overskrift`          | **Min overskrift**     |
| Underoverskrift        | `### Underoverskrift`        | Underoverskrift        |
| Fet tekst              | `**fet tekst**`              | **fet tekst**          |
| Kursiv                 | `*kursiv*`                   | *kursiv*               |
| Lenke                  | `[tekst](https://url.no)`   | [tekst](https://url.no) |
| Punktliste             | `- Punkt 1`                  | • Punkt 1              |
| Nummerert liste        | `1. Punkt 1`                 | 1. Punkt 1             |

CMS-editoren har også en visuell modus med knapper for formatering, så du trenger ikke huske Markdown-syntaksen.

---

## Laste opp bilder

1. I et innholdsfelt kan du klikke på bilde-ikonet i verktøylinjen
2. Velg en fil fra datamaskinen
3. Bildet lastes opp automatisk

**Tips for bilder:**
- Bruk **JPG eller WebP** for fotografier
- Hold filstørrelsen under **500 KB** hvis mulig
- Liggende format (bredere enn høyt) fungerer best

---

## Redigere eksisterende innhold

1. Klikk på samlingen (Artikler eller Arrangementer)
2. Klikk på artikkelen/arrangementet du vil redigere
3. Gjør endringene
4. Klikk **"Publish"** → **"Publish now"**

---

## Slette innhold

1. Åpne artikkelen eller arrangementet
2. Klikk **"Delete"** (nederst eller i menyen)
3. Bekreft slettingen

---

## Vanlige spørsmål

**Hvor lang tid tar det før endringer vises på nettsiden?**
Endringer publiseres automatisk innen 1–3 minutter etter at du trykker "Publish".

**Kan jeg angre en endring?**
Ja — alle endringer lagres i Git-historikken. Kontakt webansvarlig for å rulle tilbake.

**Jeg får feilmelding ved innlogging?**
Sjekk at du bruker riktig GitHub-konto. Kontakt webansvarlig hvis problemet vedvarer.

**Kan jeg forhåndsvise før publisering?**
CMS-et viser en forhåndsvisning av innholdet mens du redigerer. Full forhåndsvisning på nettsiden krever at du publiserer.

---

## Kontakt

Trenger du hjelp? Kontakt webansvarlig.
