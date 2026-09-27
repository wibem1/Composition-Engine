# Composition Engine 2.11.1 — durchgängige Ausdruckskette

Datum: 2026-09-27

## Ziel
Ausdrucksinformationen werden nicht mehr nur im ABC-Parser berücksichtigt, sondern in einer gemeinsamen Performance-Repräsentation erhalten und von Export/Playback verwendet.

## Konsolidierung vor Ausbau
Die obsolete globale ABC-Dynamik-Nachbearbeitung `abcVelocityMap/applyAbcVelocities` wurde entfernt. Dynamik wird ausschließlich im stimmenbezogenen ABC-Parser verarbeitet. Veraltete Tests dieser Patch-Schicht wurden ebenfalls entfernt.

## Performance-Modell
Tracks können neben Noten `cc`, `pitchBend` und symbolische `expressions` tragen. Erhalten werden derzeit Dynamik, Hairpins, Artikulation, Slur-Grenzen, Fermaten, Ornamente, Grace Notes und sonstige Spiel-/Textanweisungen. `performanceSnapshot()` und `expressionAudit()` dienen als gemeinsamer Übergabe- und Prüfpfad.

## MIDI
Exportiert Noten/Velocity, Programme, CC (u.a. CC11 Expression und CC64 Sustain), Pitch Bend sowie Tempoänderungen.

## ABC
Bei einer aus ABC stammenden Partitur wird die originale `abcSource` exportiert. Dadurch bleiben die notierten Ausdruckszeichen einschließlich Ornamente und Vorschläge verlustfrei erhalten.

## MusicXML
Der zentrale Engine-Export schreibt alle Instrument-Tracks statt nur einer ersten Spur. Er überträgt Instrumentprogramme sowie Dynamik, Hairpins, Artikulation, Slurs, Fermaten und unterstützte Ornamente.

## Playback
`playbackScore()` realisiert CC11 in der Anschlagsstärke, Sustain-Pedal in klingenden Dauern, Grace Notes als kurze Vorereignisse, Triller als Wechselnoten und Fermaten als verlängerte Dauern. Symbolische Daten bleiben im Originalscore erhalten.

## Host
Minimal Composer 1.0.4 delegiert ABC- und MusicXML-Export sowie expressive Playback-Vorbereitung an die gemeinsame Engine. Die App-Version wurde erhöht, weil hierfür Host-Code geändert wurde.

## Tests
Regressionen decken Cello+Klavier, per-voice dynamics, CC11, CC64, Pitch Bend, Tempoänderungen, Triller, Vorschläge, Staccato, Slurs, Fermaten, ABC-Erhalt, mehrstimmigen MusicXML-Export und Playback-Realisierung ab.

## Grenzen
Die aktuelle Trillerrealisierung verwendet als obere Wechselnote zunächst +2 Halbtöne und ist noch nicht tonart-/ornamenthistorisch differenziert. Pitch Bend wird im MIDI-Export erhalten, vom WebAudioFont-Playback aber noch nicht klanglich realisiert. Instrumentenspezifische Extended Techniques werden symbolisch erhalten, soweit sie als Directions erkannt werden; eine allgemeine Klangrealisierung erfordert instrument-/Sampler-spezifische Regeln.
