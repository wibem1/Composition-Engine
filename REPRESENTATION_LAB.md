# Representation Lab 2.9.0

Experimenteller Zweig zur kontrollierten Untersuchung, wie die musikalische Repräsentation die Kompositionsleistung desselben KI-Modells beeinflusst.

## Versuchsregel

Konstant bleiben:
- Kompositionsauftrag
- Provider und Modell
- kreative Einstufigkeit: die erste KI-Antwort ist die Komposition
- nachgelagerte Analyse
- deterministische MIDI-Erzeugung

Geändert wird ausschließlich die musikalische Repräsentation.

## Repräsentationen

1. **Compact 2.8** – bisheriges kompaktes zeilenorientiertes Partiturformat.
2. **ABC** – vollständige ABC-Notation; Konvertierung erfolgt technisch über den vorhandenen ABC-Parser der Client-App.
3. **MIDI Performance** – textuelle MIDI-Semantik mit 960 PPQ, Note-Start, Dauer, Pitch, Velocity und optionalen CC-Ereignissen. Keine Notenwertquantisierung.
4. **Freie Wahl** – das Modell wählt selbst Compact, ABC oder MIDI Performance und kennzeichnet die Wahl.

## Methodik

Die Ergebnisse werden nicht automatisch musikalisch bewertet oder repariert. Syntax-/Parserfehler werden als Versuchsergebnis protokolliert. Der eigentliche Vergleich erfolgt durch Hören; eine Analyse kann erst danach separat aufgerufen werden.

## Sicherheit des Entwicklungsstands

Der freigegebene zentrale Entry-Point auf `main` wird durch dieses Experiment nicht ersetzt. Entwicklung erfolgt auf `representation-lab-2.9.0`. Minimal Composer nutzt dafür den separaten Zweig `representation-lab-0.9.0`.
