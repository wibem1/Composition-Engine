# Composition Engine

Gemeinsamer appübergreifender Kompositionskern für die Klangwerke-Kompositionswerkzeuge.

## Stabile Architektur – 2.1.0

Der verbindliche Normalfall ist:

1. **Kompositionsauftrag → freie vollständige Komposition.** Die komponierende KI erhält keine von der Engine erfundene Form, Harmonik, Dramaturgie oder vorgeschaltete Klangbeschreibung. Musikalische Zusatzvorgaben stammen nur aus dem Auftrag des Nutzers.
2. **Fertige Komposition → technische Übersetzung.** Erst danach wird der fertige musikalische Entwurf vollständig und unverändert in das kompakte Partiturformat übertragen. Diese Stufe darf nicht neu komponieren, vereinfachen oder regularisieren.
3. **Technischer Core.** Parsing und MIDI-Erzeugung sind deterministisch und verändern keine musikalischen Entscheidungen.
4. **Beschreibung.** Eine Beschreibung wird erst aus der fertigen Komposition abgeleitet; sie darf die Komposition nicht vorwegnehmen.

Eine abgeschnittene technische JSON-Ausgabe darf höchstens zweimal ausschließlich technisch fortgesetzt werden. Die Fortsetzung darf keine neuen musikalischen Entscheidungen treffen.

## Verbindliche Grenzen

- Kein vorgeschalteter `sound_concept`-, Klangvorstellungs-, Formplan- oder Dramaturgie-Aufruf im Standardpfad.
- Keine app-lokalen Varianten des Standard-Kompositionsprompts.
- Keine stille Umschaltung der stabilen Engine.
- Diagnose muss die tatsächlich versendeten Prompts und Stufen sichtbar machen.
- Ein erfolgreicher Build beweist technische Konsistenz, nicht musikalische Qualität. Musikalische Freigabe erfolgt erst nach Hörtest.

## Apps

Minimal Composer und MusicChat laden den zentralen freigegebenen Entry-Point. Native/DAW-Werkzeuge dürfen die freigegebene Logik lokal spiegeln, damit keine zusätzliche Web-Abhängigkeit entsteht; lokale Kopien müssen Version/Engine-Build und Architekturstand sichtbar dokumentieren.

## Experimente

`composition-engine-v2.js` (Klangvorstellung vor Komposition) bleibt nur als historisches Experiment erhalten und ist **nicht** Standard. Experimente dürfen die stabile Referenz nicht überschreiben.

## Entwicklungsregel

Vor jeder Freigabe werden Architekturvertrag, tatsächlicher Code, Diagnosepfad und Versions-/Cachebindung gegeneinander geprüft. Aussagen werden als festgestellt, abgeleitet oder unbestätigt unterschieden.

SemVer: MAJOR.MINOR.PATCH.


## Verbindlicher Freigabe- und Rollback-Vertrag
`composition-engine.js` auf `main` ist der einzige zentral freigegebene Runtime-Entry-Point für die Web-Apps. Apps laden diesen Pfad ohne Versionsparameter und ohne lokale Kopie der Standard-Engine. Neue Engine-Stände werden zunächst getrennt entwickelt und geprüft. Erst die Freigabe ersetzt den Inhalt des zentralen Entry-Points. Bei einem Fehler wird ausschließlich dieser zentrale Engine-Stand auf den letzten nachweislich funktionierenden Commit zurückgesetzt; die Apps werden dafür nicht versioniert oder geforkt.
