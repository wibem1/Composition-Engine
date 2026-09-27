# Composition Engine 2.11.0 — ABC Performance

Datum: 2026-09-27  
Vorgänger: 2.10.1  
Status: In main übernommen; Engine-Regressionssuite nach Merge erfolgreich. Host-Praxistest mit neu erzeugter Komposition noch offen.

## Anlass
Minimal Composer 1.0.3 erzeugte für den Auftrag „Erstelle ein Stück für Cello und Klavier“ eine gültige dreistimmige ABC-Partitur (Cello, Klavier Diskant, Klavier Bass). Die bisherige Engine erkannte die Cellonoten, wies aber allen nicht als Violine erkannten Stimmen General-MIDI-Programm 0 (Klavier) zu. Dadurch ging die Instrumentierung bei ABC→MIDI verloren.

## Neu
- Allgemeine General-MIDI-Zuordnung für benannte ABC-Stimmen; Cello wird als GM Cello (0-basiertes MIDI-Programm 42) exportiert.
- Zwei Klavierstimmen können getrennte MIDI-Tracks bleiben und erhalten beide Piano-Programm 0.
- Unterstützung für `%%MIDI program` sowie `%%MIDI voice ... instrument=...` als explizite Instrumentvorgabe.
- Dynamikzustand bleibt pro ABC-Stimme getrennt: ppp, pp, p, mp, mf, f, ff, fff, fp, sfz, ffz.
- Crescendo/Diminuendo werden pro Stimme als Velocity-Verlauf interpretiert.
- Artikulation: Staccato, Staccatissimo, Tenuto, Akzent/Marcato sowie ABC-Staccato-Punkt.
- Bindebögen erhalten die volle Dauer und dürfen für eine gebundene MIDI-Wiedergabe leicht überlappen.
- Normale Noten werden nicht pauschal verkürzt; ihre notierte Dauer bleibt erhalten.
- Text-/Akkordanweisungen in Anführungszeichen (z. B. `"dolce"`) werden niemals als Noten interpretiert.
- Der ABC-Kompositionsvertrag fordert ausdrücklich sinnvolle Dynamik, Artikulation, Phrasierung und Spielanweisungen.

## Unverändert
- Minimal Composer bleibt 1.0.3; dies ist eine Engine-Änderung.
- Öffentliche Engine-Schnittstelle und die Repräsentationen COMPACT/MIDI/FREE bleiben bestehen.
- ABC-Quelltext wird weiterhin als `abcSource` erhalten.

## Tests
Regressionen prüfen: bestehende COMPACT/MIDI/FREE-Funktionen, drei ABC-Stimmen, Dynamikdekorationen, Cello+zweistimmiges Klavier, Crescendo, Bindebogen, Staccato, Akzent und quoted directions. Erster Testlauf zeigte eine unerwünschte pauschale 90%-Notenverkürzung; diese wurde vor Freigabe entfernt. Der anschließende CI-Lauf war grün.

## Noch nicht behauptet
Ein grüner technischer Regressionstest beweist weder musikalische Qualität noch vollständige Unterstützung der gesamten ABC-Spezifikation. Insbesondere komplexe Ornamentik, Pedal, kontinuierliche Controllerkurven und instrumentenspezifische Extended Techniques benötigen weitere gezielte Ausbaustufen und Hörtests.

## Wiederherstellung
Entwicklungszweig: `dev/abc-performance-2.11.0`. Merge-/Release-SHA: `85837c33c08b567423259fa6e89e9512466730bd`.
