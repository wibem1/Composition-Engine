# Composition Engine

Gemeinsames appübergreifendes Kompositionsmodul für die Klangwerke-Kompositionswerkzeuge.

## Aktuelle Version
**Composition Engine v1.1.2**

Dieser Stand ist die verbindliche Quelle der Engine, die in Minimal Composer und MusicChat lokal eingebettet wird. Native Apps und DAW-Werkzeuge sollen dieselbe freigegebene Engine-Version lokal übernehmen bzw. an ihre Laufzeitumgebung adaptieren. Es entsteht dadurch keine zusätzliche Web-Abhängigkeit.

## Grundprinzip
Die Engine trennt musikalisches Komponieren von technischer MIDI-/Partitur-Materialisierung. Die etablierte Pipeline lautet:
1. musical_draft
2. midi_translation
3. lokale deterministische MIDI-Erzeugung
4. composition_idea_afterwards
5. einheitliches Kompositionsprofil: BPM · Tempoangabe · Tonart · Taktanzahl · KI/Modell · knappe musikalische Beschreibung
6. bestehende Behandlung doppelter Titel

Keine App darf ihre lokale Engine-Kopie stillschweigend musikalisch verändern. Änderungen werden zuerst hier versioniert und anschließend gezielt in die Apps übernommen.

## Herkunft von v1.0.0
v1.0.0 basiert auf dem praktisch erprobten gemeinsamen Engine-Stand, der in Minimal Composer Modular und MusicChat verwendet wurde. Die Produktidentität der aufrufenden App gehört nicht zur Engine-Version.

## Versionsregel
SemVer: MAJOR.MINOR.PATCH.
- MAJOR: inkompatible Schnittstellen-/Architekturänderung
- MINOR: neue kompatible Engine-Funktion
- PATCH: kompatible Fehlerkorrektur ohne beabsichtigte musikalische Verhaltensänderung


## Experiment v1.2.0 – Sound-first / „Bauch → Kopf → Hand“
Der Branch `experimental-v1.2.0-sound-first` verändert bewusst nur die kreative erste Stufe. Der musikalische Entwurf beginnt mit einer vorgestellten klingenden Gestalt (Klangraum, Bewegung, Spannung, Gestik, Dichte, Atem, zeitlicher Verlauf), bevor diese konkret ausnotiert wird. Eigenwillige oder asymmetrische Lösungen sollen nicht vorsorglich regularisiert werden.

`midi_translation`, technischer Vertrag und lokale MIDI-Erzeugung bleiben gegenüber v1.1.2 unverändert. Ziel ist ein direkter Hörvergleich mit identischen Kompositionsaufträgen; zusätzliche KI-Kontroll- oder Reparaturstufen werden zunächst nicht eingeführt.
