# PROJECT INDEX — verbindlicher Entwicklungsstand

Stand: 2026-09-26

Dieser Index ist die zentrale Orientierung für die gemeinsam entwickelten Musikprojekte. Angaben werden nur als CURRENT oder SAFE geführt, wenn sie durch Repository/Commit bzw. dokumentierten Test belegt sind. Ungeklärte Punkte werden nicht geraten.

| Projekt | Repository | CURRENT | Engine | Status / Referenz |
|---|---|---|---|---|
| Composition Engine | wibem1/Composition-Engine | 2.4.1, main | 2.4.1 | CURRENT TEST CANDIDATE. Analyse, freigegebene Verbesserung und erneute Analyse jeder verbesserten Fassung sind allgemeine Engine-Fähigkeiten. Weitere Verbesserung nur nach erneuter Freigabe. Runtime: 247cac5; Tests: 8c9dec9. |
| Minimal Composer | wibem1/Minimal-Composer | 0.8.17, main | zentrale 2.4.1 | CURRENT TEST CANDIDATE. Nach einer freigegebenen Verbesserung wird die neue Fassung automatisch erneut analysiert; die aktuelle Beurteilung ersetzt die Anzeige der alten, die versionsbezogen erhalten bleibt. App: b15f13b; Cache: be0a5e5. |
| Music Chat Lab | wibem1/Music-Chat-Lab | 1.9.4, main | zentrale stabile Engine | CURRENT CODE. App: 79ea942; Cache: eaa5f8e. Praktischer 1.9.4-Runtime-Test noch nicht als SAFE dokumentiert. |
| Composition Lab Native | wibem1/Composition-Lab-Native | 3.5.3 Build 3503, main | lokaler Port 2.3.1, Build 231 | CURRENT TEST CANDIDATE. main ist die eindeutige aktuelle Entwicklungsline. Ehemalige 6.1.1/Build-94-Linie als `reference-v6.1.1-build94` erhalten. Praktischer Test ausstehend. |
| Composition Studio | wibem1/Composition-Studio | 1.0.4, main | lokale 2.3.1, Build 231 | CURRENT. Einzige aktive Update-Linie auf main; keine parallele Nutzerinstallation. Direkte Komposition → technische Übersetzung. Praktischer REAPER-Test von 1.0.4 noch nicht als SAFE dokumentiert. |
| Composition Studio MiniDAW | wibem1/Composition-Studio-MiniDAW-Archive | historisch | fruehere MiniDAW/MAGDA-Architektur | HISTORICAL/OBSOLETE + GitHub ARCHIVED (verifiziert 2026-09-26). Nicht fuer die aktuelle REAPER-Entwicklung verwenden. |
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

## Architekturvertrag Composition Engine 2.4.1

Für Anwendungen, die 2.3.1 verwenden:
Kompositionsauftrag → freie vollständige Komposition → rein technische werkgetreue Übersetzung → optional kurze Beschreibung danach.
Kein vorgeschalteter musikalischer Entwurf/Formplan/Klangkonzept als eigene kreative Stufe.


## Repository-Bestand – verifiziert 2026-09-26

Aktive/erhaltene Repositories der Musikprojekte: Composition-Engine, Minimal-Composer, Music-Chat-Lab, Composition-Lab-Native, Composition-Studio, Notation-Module, Tune-Search-Module, Composition-Studio-MiniDAW-Archive sowie abctools als externe Referenz. Das zuvor beobachtete leere Repository `Composition--Studio` ist in der aktuell ueber die GitHub-Verbindung sichtbaren installierten Repository-Liste nicht mehr enthalten; daraus wird ohne separate Loeschbestaetigung keine Aussage ueber eine erfolgte Loeschung abgeleitet.

## Entwicklungsentscheidung – 07.10.2026

Vom Nutzer bestätigt: Eindeutig überholte Apps werden aus der aktiven Entwicklung genommen; vorhandene Quellen bleiben als historische Referenz erhalten.

| Projekt | Entwicklungsstatus | Technisch verifizierter Zustand |
|---|---|---|
| Composer Lab / ComposeLab, früher `wibem1/Composer-Lab` | HISTORICAL / DEVELOPMENT CLOSED. Vorläufer von MusicChat; keine neuen Funktionen, Reparaturen oder Integration als aktive Architekturquelle. | Am 07.10.2026 liefert der GitHub-Zugriff auf den früheren Repository-Namen 404. Keine Aussage, dass das Repository gelöscht oder neu archiviert wurde. Falls ein historischer Quellbestand wiedergefunden wird, bleibt er Referenz ohne aktive Entwicklung. |
| Composition Studio MiniDAW, `wibem1/Composition-Studio-MiniDAW-Archive` | ARCHIVED / DEVELOPMENT CLOSED. Kein nutzbarer freigegebener Benutzerstand; keine aktive Abhängigkeit anderer Apps. | GitHub `archived=true` am 07.10.2026 erneut verifiziert. Bereits archiviert; keine Änderung oder Löschung des Quellbestands erforderlich. |

Diese Entscheidung betrifft ausschließlich die beiden eindeutig historischen Projekte. Kompositionslabor v0.4.7, LilyPond Tools und Notation Module sind nur als möglicherweise entbehrliche eigenständige Benutzer-Apps diskutiert; sie werden durch diese Entscheidung nicht archiviert. Minimal Composer, ComposeMe, CompactScore und die übrigen spezialisierten Apps bleiben erhalten, bis ihre Kompositionsverfahren und Aufgaben verglichen sind.

Die aktive REAPER-App `wibem1/Composition-Studio` ist ausdrücklich nicht die archivierte MiniDAW und bleibt von dieser Entscheidung unberührt. Eine Wiederaufnahme historischer Projekte erfordert einen neuen ausdrücklichen Auftrag des Nutzers.

Hinweis zur Einordnung: Die obigen Versionstabellen sind mit Stand 26.09.2026 historisch. Aus ihnen darf kein aktueller Versions- oder SAFE-Status abgeleitet werden; vor Änderungen muss der tatsächliche aktuelle Code geprüft werden.

## Ergänzende Stilllegungsentscheidung – 07.10.2026

Nach Funktionsüberschneidungen mit neueren Anwendungen hat der Nutzer außerdem der Archivierung folgender eigenständiger Apps zugestimmt. Dieser Abschnitt ersetzt für diese drei Apps die oben noch offene Einordnung.

| Projekt | Entwicklungsentscheidung | Erhaltener Bestand / mögliche Nachfolge |
|---|---|---|
| Minimal Composer, `wibem1/Minimal-Composer` | Eigenständige App eingestellt; keine weitere Funktionsentwicklung ohne neuen ausdrücklichen Auftrag. | Historische Verfahren, Diagnosen und Quellen bleiben erhalten. ComposeMe und LilyPond Composition Lab übernehmen verwandte Aufgaben; eine vollständige Funktionsgleichheit wurde nicht behauptet. |
| LilyPond Tools, `wibem1/LilyPond-Tools` | Eigenständige Test-App eingestellt. | Der technische Ansatz des lokalen LilyPond-WASM-Renderings bleibt als Referenz erhalten; die verwandte Benutzerfunktion befindet sich in Notation Tools. |
| Notation Module, `wibem1/Notation-Module` | Eigenständige Test-/Benutzer-App eingestellt. | Wiederverwendbarer Modulcode bleibt erhalten. Abhängigkeiten und notwendige Pflege des Moduls sind von der Stilllegung seiner Benutzer-App zu unterscheiden. Notation Tools und ABC Tools bieten verwandte Benutzerfunktionen. |

Technischer Archivierungsstatus: In diesem Arbeitsgang wurde die Entwicklungsentscheidung im Projektindex gespeichert. Die verfügbare GitHub-Verbindung bietet keinen Aufruf zum Setzen von `archived=true`; eine technische GitHub-Archivierung dieser drei Repositories wurde deshalb nicht ausgeführt und darf nicht als erledigt bezeichnet werden. Es wurden weder Quellen gelöscht noch aktive Modulabhängigkeiten entfernt.

Die frühere offene Entscheidung zu ComposeMe wurde durch die nachfolgende bestätigte Übernahme und Stilllegung ersetzt.


## ComposeMe → LilyPond: Übernahme und Stilllegung – 07.10.2026

Der Nutzer hat der Zusammenführung durch gezielte Funktionsübernahme und anschließende Stilllegung zugestimmt. Umsetzung im bestehenden LilyPond-Projekt; keine neue App oder Parallelversion.

| Projekt | Verifizierter Stand | Entwicklungsstatus |
|---|---|---|
| LilyPond Composition Lab, `wibem1/LilyPond-Composition-Lab` | v0.1.36, main, GitHub `cfabacf81ad677ae351e45b6253fd650d26e73d3`; Sites-Quellstand `abc6ebe032a98a076db486e5e30e5941a7069a87`; Veröffentlichung im bestehenden Projekt erfolgreich. | CURRENT / TEST CANDIDATE. Build, alle 16 Testprogramme und Artefaktvalidierung bestanden. Praktische Nutzerabnahme von v0.1.36 steht aus; v0.1.35 war vom Nutzer bestätigt. |
| ComposeMe, `wibem1/ComposeMe` | Funktionaler Bestand 0.8.52 erhalten; Stilllegungsdokumentation `87595004dce735088e455d3059df5949604b74ac`. | HISTORICAL / DEVELOPMENT CLOSED. Keine weitere Funktionsentwicklung oder Reparatur ohne neuen ausdrücklichen Auftrag. README und ARCHIVE.md nennen den Nachfolger und den erhaltenen Referenzbestand. |

Übernommen: optionale bearbeitbare Klangvorstellung → direkte LilyPond-Ausarbeitung, persistenter Zwischenstand mit Fortsetzen ohne erneuten ersten KI-Aufruf, separate Modelle/Qualitätsstufen/Kosten/Dauer beider Phasen, gemeinsame Diagnose sowie vollständige Sicherung und Wiederherstellung des Verlaufs einschließlich MIDI-/SVG-Dateien. Der bisherige direkte LilyPond-Ablauf bleibt Standard; bestehende Compiler-, Oktav-, Notations- und Wiedergabefunktionen werden verwendet.

Nicht übernommen: historische JSON-/MIDI-Engine, direkte MIDI-Dateierzeugung mit Code Interpreter, allgemeine Mehrformat-Ausgabe und klassisches dreistufiges Verfahren. Diese bleiben Referenzen in ComposeMe. Es wird weder vollständige Funktionsgleichheit noch musikalische Überlegenheit des neuen optionalen Ablaufs behauptet. Die KI-Tests verwendeten simulierte Antworten, keine kostenpflichtigen Kompositionen; ein musikalischer Hörtest wurde nicht durchgeführt.

Technische GitHub-Archivierung von ComposeMe (`archived=true`) **noch nicht ausgeführt**: Die vorhandene Verbindung bietet keine Repository-Administration. Dokumentierte Entwicklungsstilllegung und GitHub-Schreibschutz sind ausdrücklich getrennt. Quellen und bestehende Browser-Verläufe wurden nicht gelöscht oder automatisch migriert.
