const OSLO_TZ = "Europe/Oslo";

/** Hvor mange minutter Europe/Oslo ligger foran UTC på et gitt tidspunkt (tar hensyn til sommertid). */
function osloOffsetMinutes(utcGjett: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: OSLO_TZ,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const deler = Object.fromEntries(
    dtf.formatToParts(utcGjett).filter((d) => d.type !== "literal").map((d) => [d.type, d.value]),
  );
  const somOmUtc = Date.UTC(
    Number(deler.year),
    Number(deler.month) - 1,
    Number(deler.day),
    Number(deler.hour),
    Number(deler.minute),
    Number(deler.second),
  );
  return (somOmUtc - utcGjett.getTime()) / 60000;
}

/** Kombinerer en kalenderdato (UTC-midnatt, som fra content collections) og et "HH:MM"-klokkeslett
 * i Europe/Oslo, og returnerer det faktiske UTC-tidspunktet. */
function osloDatoOgTidTilUtc(dato: Date, tid: string): Date {
  const [time, minutt] = tid.split(":").map(Number);
  const gjett = new Date(
    Date.UTC(dato.getUTCFullYear(), dato.getUTCMonth(), dato.getUTCDate(), time, minutt),
  );
  const offsetMin = osloOffsetMinutes(gjett);
  return new Date(gjett.getTime() - offsetMin * 60000);
}

function leggTilDager(dato: Date, dager: number): Date {
  const d = new Date(dato);
  d.setUTCDate(d.getUTCDate() + dager);
  return d;
}

function formatIcsUtc(dato: Date): string {
  return dato.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function formatIcsDato(dato: Date): string {
  const y = dato.getUTCFullYear();
  const m = String(dato.getUTCMonth() + 1).padStart(2, "0");
  const d = String(dato.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function icsEscape(tekst: string): string {
  return tekst.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export interface ArrangementForKalender {
  tittel: string;
  beskrivelse: string;
  dato: Date;
  sluttdato?: Date;
  starttid?: string;
  sluttid?: string;
  sted?: string;
  url: string;
}

/** Regner ut start/slutt for arrangementet. Heldagsarrangement (ingen starttid) bruker rene datoer,
 * ellers faktiske UTC-tidspunkt for det angitte klokkeslettet i Europe/Oslo. */
function beregnTidsrom(arr: ArrangementForKalender) {
  const sluttdatoBase = arr.sluttdato ?? arr.dato;
  if (!arr.starttid) {
    return { heleDagen: true as const, start: arr.dato, slutt: leggTilDager(sluttdatoBase, 1) };
  }
  const start = osloDatoOgTidTilUtc(arr.dato, arr.starttid);
  const slutt = arr.sluttid
    ? osloDatoOgTidTilUtc(sluttdatoBase, arr.sluttid)
    : new Date(start.getTime() + 2 * 60 * 60 * 1000);
  return { heleDagen: false as const, start, slutt };
}

export function byggGoogleKalenderUrl(arr: ArrangementForKalender): string {
  const { heleDagen, start, slutt } = beregnTidsrom(arr);
  const dates = heleDagen
    ? `${formatIcsDato(start)}/${formatIcsDato(slutt)}`
    : `${formatIcsUtc(start)}/${formatIcsUtc(slutt)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: arr.tittel,
    dates,
    details: arr.url ? `${arr.beskrivelse}\n\n${arr.url}` : arr.beskrivelse,
    location: arr.sted ?? "",
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}

export function byggIcs(arr: ArrangementForKalender): string {
  const { heleDagen, start, slutt } = beregnTidsrom(arr);
  const dtstart = heleDagen
    ? `DTSTART;VALUE=DATE:${formatIcsDato(start)}`
    : `DTSTART:${formatIcsUtc(start)}`;
  const dtend = heleDagen
    ? `DTEND;VALUE=DATE:${formatIcsDato(slutt)}`
    : `DTEND:${formatIcsUtc(slutt)}`;

  const uid = `${arr.url.replace(/[^a-zA-Z0-9]/g, "-")}@gokstadkystlag.no`;
  const beskrivelse = arr.url ? `${arr.beskrivelse}\n\n${arr.url}` : arr.beskrivelse;

  const linjer = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Gokstad Kystlag//Arrangementer//NO",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatIcsUtc(new Date())}`,
    dtstart,
    dtend,
    `SUMMARY:${icsEscape(arr.tittel)}`,
    `DESCRIPTION:${icsEscape(beskrivelse)}`,
    arr.sted ? `LOCATION:${icsEscape(arr.sted)}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter((linje): linje is string => linje !== null);

  return linjer.join("\r\n");
}
