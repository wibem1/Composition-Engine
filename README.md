# Composition Engine

Gemeinsamer appübergreifender Kompositionskern für die Klangwerke-Kompositionswerkzeuge.

## Aktuelle Version
**Composition Engine v2.0.0 – Klangvorstellung**

Die musikalisch entscheidende Pipeline ist:
1. **Klangvorstellung (Bauch):** ausschließlich klingende Idee, Gestik, Spannung, Bewegung, Dichte, Register, Kontraste, Phrasierung und Dramaturgie. Keine Notation, keine Notennamen, kein LilyPond/ABC/MusicXML/JSON/MIDI.
2. **Partiturrealisierung (Kopf):** aus der Klangvorstellung wird das vollständige Werk komponiert; alle nötigen musikalischen Entscheidungen werden hier getroffen.
3. **Technische MIDI-Erzeugung (Hand):** deterministische lokale Materialisierung ohne zusätzliche musikalische Korrektur.

v2.0.0 basiert unverändert auf dem in Minimal Composer v0.5.99 praktisch getesteten Klangvorstellungs-Experiment, das bei den Vergleichstests mit OpenAI Sol den deutlichen Qualitätssprung erzeugte.

## Gemeinsame Nutzung
- Minimal Composer und MusicChat laden die freigegebene Engine über den zentralen Engine-Katalog.
- Native Apps und DAW-Werkzeuge übernehmen dieselbe Prompt-/Pipeline-Logik lokal. Dadurch entsteht **keine zusätzliche Web-Abhängigkeit**.
- App-spezifische UI-, Player-, Datei- und DAW-Funktionen gehören nicht in den musikalischen Kern.

## Regel
Musikalische Änderungen werden zuerst hier versioniert und danach gezielt in die Apps übernommen. Die Engine darf nicht durch app-spezifische Zusatzregeln stillschweigend verändert werden.

## Versionierung
SemVer: MAJOR.MINOR.PATCH.
