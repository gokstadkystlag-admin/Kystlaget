// Små hjelpefunksjoner for å rendre CMS-redigerbar tekst uten en full markdown-motor.

/** Deler en tekstblokk i avsnitt der det er tomme linjer, for rendring som flere <p>. */
export function avsnitt(tekst: string | undefined | null): string[] {
  if (!tekst) return [];
  return tekst
    .split(/\n\s*\n/)
    .map((del) => del.trim())
    .filter(Boolean);
}

/** Gjør **fet tekst** i en enkelt linje om til <strong>, til bruk med set:html i lister o.l. */
export function mdInline(tekst: string | undefined | null): string {
  if (!tekst) return "";
  return tekst.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}
