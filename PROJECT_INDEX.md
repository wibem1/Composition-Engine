# PROJECT INDEX — verbindlicher Entwicklungsstand

Stand: 2026-09-26

Dieser Index ist die zentrale Orientierung für die gemeinsam entwickelten Musikprojekte. Angaben werden nur als CURRENT oder SAFE geführt, wenn sie durch Repository/Commit bzw. dokumentierten Test belegt sind. Ungeklärte Punkte werden nicht geraten.

| Projekt | Repository | CURRENT | Engine | Status / Referenz |
|---|---|---|---|---|
| Composition Engine | wibem1/Composition-Engine | 2.3.1, main | 2.3.1 | CURRENT + zentrale stabile Engine. Manifest 2.3.1: 798430e. Regressionstests: 153a1c4. |
| Minimal Composer | wibem1/Minimal-Composer | 0.8.12, main | zentrale 2.3.1 | CURRENT. App: 0ba38fd; Cache: 4d558a7. Musikalischer 2.3.0/2.3.1-Pfad vom Nutzer als Spitzenklasse beurteilt; Player-0.8.12 praktisch noch nicht als SAFE bestätigt. |
| Music Chat Lab | wibem1/Music-Chat-Lab | 1.9.4, main | zentrale stabile Engine | CURRENT CODE. App: 79ea942; Cache: eaa5f8e. Praktischer 1.9.4-Runtime-Test noch nicht als SAFE dokumentiert. |
| Composition Lab Native | wibem1/Composition-Lab-Native | 3.5.3 Build 3503 auf release/v3.5.3-engine-2.3.1 | lokaler Port 2.3.1, Build 231 | CURRENT TEST CANDIDATE. main ist ausdrücklich veraltete 6.x-Linie und darf nicht als CURRENT benutzt werden. Engine-Port-Commits u.a. 62e7d5b, f1a052c, d54a19e, 24c36bd, 01d1c97. Praktischer Test ausstehend. |
| Composition Studio | wibem1/Composition-Studio | 1.0.3, main | lokale 2.1.0, Build 21 | CURRENT. Produktive REAPER-Runtime wurde aus dem bisherigen Reaper-Repository migriert und gegen die Quelle verglichen. |
| Composition Studio MiniDAW | wibem1/Composition-Studio-MiniDAW-Archive | historisch | fruehere MiniDAW/MAGDA-Architektur | HISTORICAL/OBSOLETE. Nicht fuer die aktuelle REAPER-Entwicklung verwenden. |

## Verbindliche Statusbegriffe

- **CURRENT**: aktuell vorgesehener Entwicklungsstand; Repository, Branch und Commit sind bekannt.
- **SAFE**: vom Nutzer praktisch als funktionierend bestätigter Stand. SAFE darf niemals nur aus grünem CI abgeleitet werden.
- **TEST CANDIDATE**: technisch vorbereiteter Stand, praktische Abnahme steht aus.
- **UNRESOLVED**: Quellstand oder Zuordnung ist nicht zweifelsfrei rekonstruiert. Keine Weiterentwicklung auf Vermutungsbasis.
- **HISTORICAL/OBSOLETE**: nur Referenz; nicht als Ausgangspunkt neuer Änderungen verwenden.

## Verbindlicher Arbeitsablauf

Vor jeder Änderung:
1. diesen Index lesen;
2. projektspezifische README/DEVELOPMENT/Architekturverträge lesen;
3. CURRENT-Branch, Version/Build und Commit im tatsächlichen Code prüfen;
4. SAFE-Stand nicht überschreiben;
5. keine Annahme als Tatsache behandeln.

Bei jeder Testversion:
1. eindeutige neue Version/Buildnummer;
2. zusammenhängende Änderung statt Patch-Kette;
3. automatisierbare Tests vor Übergabe;
4. praktischer Test entscheidet über SAFE;
5. Index nach bestätigter Statusänderung aktualisieren.

## Composition Studio Migration

Das produktive REAPER-Script ist verifiziert und in das aktive Repository wibem1/Composition-Studio migriert. Aktueller Runtime-Stand: Composition Studio 1.0.3 mit lokaler Composition Engine 2.1.0 Build 21. Das fruehere MiniDAW-Projekt ist separat archiviert. Das ehemalige Repository wibem1/Reaper-Composition wurde nach verifizierter Migration am 2026-09-26 geloescht.

## Architekturvertrag Composition Engine 2.3.1

Für Anwendungen, die 2.3.1 verwenden:
Kompositionsauftrag → freie vollständige Komposition → rein technische werkgetreue Übersetzung → optional kurze Beschreibung danach.
Kein vorgeschalteter musikalischer Entwurf/Formplan/Klangkonzept als eigene kreative Stufe.
