# Verbindliche Entwicklungs- und Wiederherstellungsregeln

Stand: 2026-09-27. Dieses Dokument ist ein Entwicklungsprotokoll und ersetzt keine noch ausstehende historische Rekonstruktion.

## Grundsatz
Jeder Entwicklungsstand der gemeinsamen Composition Engine und jedes Host-Releases muss über unveränderliche Git-Commit-SHAs rekonstruierbar sein. Host-Version und Engine-Version sind getrennt: reine Engine-Änderungen dürfen die App-Version nicht erhöhen. Die App muss die tatsächlich geladene Engine-Version und ihren Build anzeigen; das Infofenster ist entsprechend aktuell zu halten.

## Verpflichtender Eintrag je Änderung
1. Datum, Repository, Ausgangs-Commit-SHA, Ziel-Commit-SHA, Versionsnummer und betroffene Module.
2. Anlass, reproduzierbarer Fehler bzw. musikalische Zielsetzung, genaue Änderungen und bewusst unveränderte Schnittstellen.
3. Betroffene Hosts (Minimal Composer, Music Chat Lab, Composition Lab Native, Reaper-Skript), Kompatibilitätsprüfung und gegebenenfalls Migration.
4. Automatisierte Tests mit Workflow-Link und Ergebnis; getrennt davon praktische Import-/Export-/Abspieltests. Nicht durchgeführte Tests ausdrücklich kennzeichnen.
5. Referenzdiagnose mit Auftrag, Anbieter/Modell, gewählter Repräsentation, tatsächlicher Engine-Version, Original-KI-Ausgabe, verarbeitetem Ergebnis und — falls vorhanden — Hörbeispiel und menschlichem Qualitätsurteil. Keine API-Schlüssel einchecken.
6. Konkreter Rollback: exakte Git-SHAs für Engine und Host, benötigte Konfiguration und Testanleitung.

## Release-Sicherung
- Vor jeder Änderung: Ausgangsstand per SHA festhalten; bei musikalisch wichtigen Ständen einen eindeutig benannten, unveränderlichen Referenz-Tag anlegen.
- Historische Referenzversionen niemals überschreiben. Experimente getrennt entwickeln und erst nach technischer und musikalischer Bewertung freigeben.
- Jede Host-Version dokumentiert die Engine-Version, die sie bei Veröffentlichung tatsächlich referenzierte, und ob der Host später dynamisch eine neuere Engine laden konnte. Die bei einem konkreten Lauf tatsächlich verwendete Engine ist nur durch Laufdiagnose oder gleichwertiges Laufprotokoll gesichert.
- Automatisierte Tests dürfen musikalische Qualitätsurteile nicht ersetzen. Originalnotation erhalten; Parser-/Exportverluste separat testen.

## Bereits belegte historische Anker
- 2026-09-26: Minimal Composer 1.0.0 wurde veröffentlicht: https://github.com/wibem1/Minimal-Composer/commit/9e73bb8210a82864a1211d32e959d52beb9ef2f1
- Zu dieser Veröffentlichung ist die Verwendung von Composition Engine 2.9.0 dokumentiert: https://github.com/wibem1/Minimal-Composer/commit/198d9558e9a79cfcad0aacc77a24c7eb2517740d
- Eine zuvor eingesandte Diagnose vom 2026-09-26 21:59 UTC nennt 2.9.0-representation-lab.1 (MCT-muixn87n-yoxxa). Dies beweist nicht die Engine-Version jedes späteren 1.0-Laufs.
- Weitere historische Diagnosen enthalten Engine 2.7.2 und 2.2.0; ihre musikalische Zuordnung ist gesondert zu prüfen.

## Offene Rekonstruktion (nicht als erledigt markieren)
Die vom Nutzer als außergewöhnlich gelungen bezeichnete erste Minimal-Composer-1.0-Komposition ist noch nicht eindeutig einer Diagnose zugeordnet. Zu ermitteln sind exakte Diagnose-ID, Zeitstempel, tatsächliche Engine-SHA/Version, KI-Modell, Prompt, Originalkomposition und Host-SHA. Danach als unveränderliche musikalische Referenz sichern und spätere Architekturänderungen gegen diese Referenz vergleichen. Bis dahin keine unbelegte Behauptung über die Ursache eines musikalischen Qualitätsverlusts.

## Arbeitsregel
Keine unbelegten Erfolgsmeldungen. Jede Release-Notiz unterscheidet: implementiert, automatisch getestet, praktisch getestet, musikalisch bewertet, noch offen. Keine Folge von ungeprüften Patches; bei regressionsverdächtigen Änderungen zuerst gegen den dokumentierten Ausgangsstand vergleichen.
