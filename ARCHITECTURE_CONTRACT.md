# Verbindlicher Architekturvertrag – Composition Engine

Dieser Vertrag ist vor jeder Änderung und vor jeder Freigabe gegen den tatsächlichen Runtime-Code und die tatsächlich versendeten Prompts zu prüfen.

## Unveränderliche Regeln

1. **Der erste kreative KI-Schritt ist die Komposition selbst.**
   Vor der Komposition gibt es keinen musikalischen Entwurf, keinen Formplan, keine Dramaturgie, kein Sound-/Klangkonzept und keine von der Engine erfundene Vorstruktur.

2. **Der Nutzerauftrag ist die kreative Vorgabe.**
   Die Engine ergänzt keine stilistischen, formalen, harmonischen oder dramaturgischen Vorgaben, die der Nutzer nicht verlangt hat.

3. **Die erste KI erzeugt eine vollständige, konkrete Komposition.**
   Sie beschreibt nicht, was später komponiert werden soll. Das Ergebnis muss musikalisch so eindeutig sein, dass die nächste Stufe keine eigenen musikalischen Entscheidungen treffen muss.

4. **Erst danach folgt technische Realisation.**
   Die technische Stufe überträgt die fertige Komposition unverändert in das technische Partitur-/MIDI-Format. Sie darf nicht komponieren, ergänzen, vereinfachen, regularisieren oder verbessern.

5. **Parsing und MIDI-Erzeugung sind technisch und deterministisch.**
   Technische Reparaturen dürfen nur eindeutig technische Syntaxfehler korrigieren und keine musikalischen Inhalte erfinden.

6. **Analyse/Beschreibung kommt ausschließlich nach der fertigen Komposition.**
   Sie darf die Komposition nicht vorwegnehmen und nicht rückwirkend verändern.

7. **Experimente ändern den stabilen Pfad nicht stillschweigend.**
   Neue Architekturideen werden getrennt entwickelt und getestet. Der zentrale stabile Entry-Point wird erst nach nachgewiesener technischer Prüfung und bewusstem musikalischem Hörtest ersetzt.

## Pflichtprüfung vor Freigabe

- Dokumentation ↔ Runtime-Code ↔ tatsächlich versendete Prompts stimmen überein.
- Automatischer Architekturtest bestätigt: kein vorgeschalteter Draft-/Plan-Schritt.
- Syntax- und Parser-Regressionstests bestehen.
- Versions- und Manifestangaben stimmen überein.
- Reale Diagnose zeigt als ersten kreativen Provider-Aufruf die **Komposition**.
- Ein Hörtest prüft die musikalische Qualität. Ein grüner Build allein ist keine musikalische Freigabe.

## Änderungsregel

Eine Änderung, die einer dieser Regeln widerspricht, ist ein Architekturwechsel und darf nicht als Patch oder Fehlerbehebung in die stabile Engine gelangen.
