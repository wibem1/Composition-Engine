# PROJECT INDEX — verbindlicher Entwicklungsstand

Stand: 2026-09-26

Dieser Index ist die zentrale Orientierung für die gemeinsam entwickelten Musikprojekte. Angaben werden nur als CURRENT oder SAFE geführt, wenn sie durch Repository/Commit bzw. dokumentierten Test belegt sind. Ungeklärte Punkte werden nicht geraten.

| Projekt | Repository | CURRENT | Engine | Status / Referenz |
|---|---|---|---|---|
| Composition Engine | wibem1/Composition-Engine | 2.3.1, main | 2.3.1 | CURRENT + zentrale stabile Engine. Manifest 2.3.1: 798430e. Regressionstests: 153a1c4. |
| Minimal Composer | wibem1/Minimal-Composer | 0.8.12, main | zentrale 2.3.1 | CURRENT. App: 0ba38fd; Cache: 4d558a7. Musikalischer 2.3.0/2.3.1-Pfad vom Nutzer als Spitzenklasse beurteilt; Player-0.8.12 praktisch noch nicht als SAFE bestätigt. |
| Music Chat Lab | wibem1/Music-Chat-Lab | 1.9.4, main | zentrale stabile Engine | CURRENT CODE. App: 79ea942; Cache: eaa5f8e. Praktischer 1.9.4-Runtime-Test noch nicht als SAFE dokumentiert. |
| Composition Lab Native | wibem1/Composition-Lab-Native | 3.5.3 Build 3503, main | lokaler Port 2.3.1, Build 231 | CURRENT TEST CANDIDATE. main ist die eindeutige aktuelle Entwicklungsline. Ehemalige 6.1.1/Build-94-Linie als `reference-v6.1.1-build94` erhalten. Praktischer Test ausstehend. |
| Composition Studio | wibem1/Composition-Studio | 1.0.4, main | lokale 2.3.1, Build 231 | CURRENT. Einzige aktive Update-Linie auf main; keine parallele Nutzerinstallation. Direkte Komposition → technische Übersetzung. Praktischer REAPER-Test von 1.0.4 noch nicht als SAFE dokumentiert. |
| Composition Studio MiniDAW | wibem1/Composition-Studio-MiniDAW-Archive | historisch | fruehere MiniDAW/MAGDA-Architektur | HISTORICAL/OBSOLETE. Nicht fuer die aktuelle REAPER-Entwicklung verwenden. |
| Notation Module | wibem1/Notation-Module | 0.1.23, main | eigenstaendiges Notationsmodul | STABLE laut projektspezifischer README. ABC-Notation, Wiedergabe, Import/Export, MIDI-Export, Druck/PDF ueber Systemdialog; MusicXML/MIDI-Import u.a. noch offen. |
| Tune Search Module | wibem1/Tune-Search-Module | 0.6.2, main | eigenstaendiges Such-/Vorhoermodul | STABLE laut projektspezifischer README. Aktive Quellen: The Session, Gavin Heneghan, MuseTrainer. |
| ABC Tools Referenz | wibem1/abctools | externer Referenz-Fork/Quellbestand | keine Composition Engine | REFERENCE ONLY. Michael Eskins ABC Tools; nicht als eigene aktive Klangwerke-App oder Entwicklungsbasis behandeln. |

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

Das produktive REAPER-Script ist verifiziert und in das aktive Repository wibem1/Composition-Studio migriert. Aktueller Runtime-Stand: Composition Studio 1.0.4 mit lokaler Composition Engine 2.3.1 Build 231. Das fruehere MiniDAW-Projekt ist separat archiviert. Das ehemalige Repository wibem1/Reaper-Composition wurde nach verifizierter Migration am 2026-09-26 geloescht.

## Architekturvertrag Composition Engine 2.3.1

Für Anwendungen, die 2.3.1 verwenden:
Kompositionsauftrag → freie vollständige Komposition → rein technische werkgetreue Übersetzung → optional kurze Beschreibung danach.
Kein vorgeschalteter musikalischer Entwurf/Formplan/Klangkonzept als eigene kreative Stufe.


## Repository-Bestand – verifiziert 2026-09-26

Aktive/erhaltene Repositories der Musikprojekte: Composition-Engine, Minimal-Composer, Music-Chat-Lab, Composition-Lab-Native, Composition-Studio, Notation-Module, Tune-Search-Module, Composition-Studio-MiniDAW-Archive sowie abctools als externe Referenz. Das zuvor beobachtete leere Repository `Composition--Studio` ist in der aktuell ueber die GitHub-Verbindung sichtbaren installierten Repository-Liste nicht mehr enthalten; daraus wird ohne separate Loeschbestaetigung keine Aussage ueber eine erfolgte Loeschung abgeleitet.
