# Gemeinsamer Workflow-Kern 1.0.0 · 19.10.2026

Gemeinsame Grundlage für Composition Studio (REAPER), AI Notation Studio (MuseScore) und die Maestro-Anbindung. Neue Testfassungen: Composition Studio 1.1.0 und AI Notation Studio 0.11.1. Der bestätigte Maestro-Windows-Stand 2.5.1 bleibt unverändert.

## Zuständigkeit

`spec.json` ist die einzige Quelle für die gemeinsamen musikalischen Grundregeln, Arbeitsmodi, zulässigen Übergangslängen, Zustandswechsel, Originalprüfung und Textsymbole. Kleine Interpreter führen dieselben Regeln in Lua, JavaScript und Python aus. `build.py` bettet den Kern in die bestehenden Einzeldateien ein. Für den Benutzer entsteht keine zusätzliche Laufzeit-Abhängigkeit.

Die bestehende musikalische Quelle bleibt erhalten: Reaper-JSON/CS/LilyPond, MuseScore-CS1/MusicXML, Maestro-JSON. Der Kern erzwingt kein ärmeres gemeinsames Notenformat und ersetzt nicht die vorhandenen Kompositionsverfahren. Provider-Anfragen und native Schreibfunktionen gehören weiterhin zur jeweiligen Anbindung. Das ältere zentrale `composition-engine.js` wird durch diese Ergänzung nicht verändert.

Ablauf: Auftrag und Ausgangsmusik erfassen → KI-Antwort speichern → lokal prüfen → Vorschlag anzeigen → Original erneut prüfen → ausdrücklich anwenden → Ergebnisstand speichern. Analyse und erneute Überarbeitung bleiben optionale Aufträge mit frei gewähltem Modell; es gibt keine automatische Optimierungsschleife.

## Erzeugung

```bash
python3 workflow-core/build.py --reaper /pfad/Composition-Studio --musescore /pfad/AI-Notation-Studio --maestro /pfad/maestro/engine
```

Standardlayout für Entwicklung und beigefügte Quellen: `Engine/workflow-core`, daneben `Reaper`, `MuseScore`, `Maestro/engine`. Nach Änderungen am MuseScore-MusicXML-Modul zusätzlich dessen `scripts/embed-compactscore.cjs` ausführen. Danach die App in die aktuelle versionierte QML-Datei und nach `versions` kopieren. Dieses Erzeugen benötigt Babel ausschließlich auf dem Entwicklungsrechner.

`test_core.py` führt 49 identische Prüfungen, 12 Zustandswechsel und fünf Textbeispiele in Python, Lua 5.4 und Qt-JavaScript aus. Die tatsächlich eingebetteten Module werden getestet. Benötigt: Python, lupa, PySide6. Host-Tests stehen in den jeweiligen Projekten.

## Übernahme in die Programme

| Fähigkeit | Reaper 1.1.0 | MuseScore 0.11.1 | Maestro-Referenz |
|---|---|---|---|
| Analyse → gezielte Überarbeitung | Aktuelles Modell frei wählen, Ergebnis als Vorschlag | Aktuelles Modell frei wählen; vollständige Takte derselben Besetzung ersetzen | Bestehender Review-Ablauf |
| Ergebnisse wieder laden | Sofortige Dateiablage und Projektmetadaten | Bestehender Dateiverlauf, jetzt auch Analysen und ungültige Antworten | Bestehender Ergebnisverlauf |
| Originalschutz | Native Item-Inhalte, Spuren und Tempo-/Taktkarte vergleichen | Notationsinhalt von Parts/Partliste vergleichen | Exakter nativer Partiturvergleich |
| Übergang | 0/2/3/4 Schlusstakte; erhaltenen Anfang auf neue Fassung kopieren | 0/2/3/4 Schlusstakte; Original mit Ersatz und neuen Takten zusammenführen | Bestehender Übergangsablauf |
| Ausdruck | Notendauer/Velocity, Tempo, Sustain/Expression als MIDI-CC; separate CC-Ereignisse pro JSON-Spur | Bestehendes CS1 und MusicXML einschließlich Artikulation, Bögen, Dynamik, Pedal und Tempo | Bestehende Maestro-Spielanweisungen |
| Modelle einlesen | Neu: Anbieterabfrage, Seitennavigation und Cache | Vorhandene dynamische Abfrage bleibt erhalten | Vorhandene dynamische Abfrage bleibt erhalten |

Die Schreibanbindungen sind unterschiedlich: Maestro verwendet ein Undo, Reaper erstellt neue Items/Spuren in einem Undo-Block, MuseScore öffnet eine neue Partitur und lässt das Original bestehen. MIDI enthält nicht automatisch sichtbare Notationssymbole. Die hörbare Wirkung von Controllern und MusicXML-Spielanweisungen hängt vom jeweiligen Instrument und Import ab.

## Grenzen des Kandidaten

- Reaper-Fortsetzungen verwenden den bestehenden LilyPond-Import für Windows. LilyPond muss installiert und im Menü eingestellt sein. Übergänge verlangen vollständige Taktgrenzen, eine eindeutige Spurzuordnung und keine überspannende Note bzw. aktives Sustain. Taktwechsel im Übergang werden abgelehnt. Beim Vergleich die gewünschte neue Fassung solo abhören; das Original wird nicht automatisch stummgeschaltet.
- Reaper-Varianten erhalten die vorhandene globale Tempo-/Taktkarte. Globale Tempoänderungen in einer solchen Bearbeitung werden vor dem Schreiben abgelehnt. Neue JSON-Kompositionen können eigene Tempoereignisse enthalten.
- MuseScore-Überarbeitungen aus einer Analyse benötigen vollständige Takte. Bögen, Pedal und andere Linien über der Bearbeitungsgrenze blockieren den Vorgang. MusicXML kann das Layout verändern.
- Der Maestro-Ordner enthält eine geprüfte Quellintegration auf Basis der Windows-Engine 2.5.1, kein neues installierbares Maestro-Programm und keine Änderung der parallel weiterentwickelten Mac-App.
- Keine Live-Provider-Anfrage, kein bezahlter Kompositionslauf und kein musikalischer Hörtest wurden für diesen Kandidaten ausgeführt. Native Programme müssen noch praktisch geprüft werden.

API-Referenzen: [REAPER ReaScript](https://www.reaper.fm/sdk/reascript/reascripthelp.html), [Anthropic Models](https://platform.claude.com/docs/en/api/models/list), [Google Models](https://ai.google.dev/api/models), [OpenAI Models](https://developers.openai.com/api/reference/resources/models/methods/list).

Auslieferung: Die Anbindungen werden über ihre vorhandenen Updater auf main angeboten. MuseScore 0.11.1 aktualisiert den Starter auf 0.7.27; Qt 5/6 und die Migration von 0.10.33 sind geprüft. Bei alten Qt-6-Versionen kann vor dem ersten erfolgreichen Update ein vollständiger Neustart und erneuter Update-Aufruf nötig sein.
