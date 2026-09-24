# Composition Engine

Gemeinsamer appübergreifender Kompositionskern für die Klangwerke-Kompositionswerkzeuge.

## Stabile Referenz

**Composition Engine v1.3.0 – Referenz**

Die musikalisch bestätigte Referenz ist `composition-engine.js`. Sie bleibt die stabile Basis, bis eine alternative Strategie im Hörvergleich nachweislich überzeugt.

Die Referenzpipeline ist:

1. **Musikalischer Entwurf:** Die KI komponiert das verlangte Stück frei und eigenständig, noch ohne technisches Ausgabeformat.
2. **Technische Übersetzung:** Der fertige musikalische Entwurf wird vollständig und unverändert in das kompakte Partiturformat übertragen. Keine Neukomposition.
3. **Technischer Core:** Parsing und MIDI-Erzeugung erfolgen deterministisch und ohne musikalische Nachbearbeitung.
4. **Beschreibung:** Die Kompositionsbeschreibung wird aus dem bereits vorhandenen Entwurf abgeleitet; sie steht nicht vor der Komposition.

## Modulare Architektur

Die Engine ist der gemeinsame musikalische Kern. Die Apps sind Oberflächen und Integrationen.

- **Composition Engine:** Prompt-/Pipeline-Logik, Provider-Adapter, Partiturvertrag, technische MIDI-Erzeugung.
- **Minimal Composer / MusicChat:** UI, Bedienung, Verlauf, Player, Dateien und Diagnose. Sie dürfen die musikalische Engine nicht stillschweigend verändern.
- **Composition Lab / DAW-Werkzeuge:** übernehmen dieselbe freigegebene Engine-Logik lokal, damit keine zusätzliche Web-Abhängigkeit entsteht.

Die geplante innere Gliederung **Creative Composer („Bauch“) – Musical Realizer („Kopf“) – Technical Core („Hand“) – Provider Adapter – Composition Orchestrator („Synthese“)** bleibt das Architekturziel. Sie bedeutet ausdrücklich nicht, dass „Bauch“ zwingend einen vorgeschalteten sprachlichen Plan erzeugen muss. Komponierstrategien sind austauschbar.

## Experimente

Alternative Strategien wie **Klangvorstellung**, Pure oder Sound-first bleiben erhalten, sind aber Experimente. Sie ersetzen die stabile Referenz erst nach einem kontrollierten Hörvergleich.

Insbesondere ist Engine 2.0 „Klangvorstellung“ derzeit **nicht** die Standardengine.

## Verbindliche Entwicklungsregel

1. Musikalische Änderungen werden zuerst im zentralen Composition-Engine-Modul versioniert.
2. Die stabile Referenz wird nicht durch Experimente überschrieben.
3. Apps erhalten keine abweichenden lokalen musikalischen Promptvarianten als neuen Standard.
4. Ein Experiment wird separat gekapselt und muss jederzeit ohne technischen Rückbau gegen die Referenz austauschbar sein.
5. Mehr KI-Aufrufe, Regeln oder Komplexität gelten nicht als Qualitätsgewinn. Entscheidend ist der Hörvergleich.
6. Ein Commit oder erfolgreicher Build ist kein musikalischer Funktionstest.

## Versionierung

SemVer: MAJOR.MINOR.PATCH.
