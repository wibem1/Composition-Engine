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

8. **Die Kompositionsbeschreibung hat einen verbindlichen Pflichtkopf und bleibt kurz.**
   Jede für den Nutzer angezeigte Kompositionsbeschreibung enthält sichtbar und in dieser Reihenfolge mindestens: **Taktzahl, BPM, Tonart, Tokenverbrauch und Kostenschätzung**. Danach folgt nur eine kurze, konkrete, hörbezogene Werkbeschreibung. Die ausführliche interne Analyse darf für Diagnosezwecke erhalten bleiben, ist aber nicht die normale Nutzerbeschreibung. Fehlt eine musikalische Angabe tatsächlich, wird sie als nicht bestimmt gekennzeichnet und nicht erfunden. Tokenverbrauch wird aus den tatsächlich protokollierten Provider-Usage-Daten gebildet; die Kosten werden als **Schätzung** anhand der für den verwendeten Provider/das verwendete Modell hinterlegten Preise ausgewiesen und dürfen nicht als exakte Abrechnung bezeichnet werden.

## Pflichtprüfung vor Freigabe

- Dokumentation ↔ Runtime-Code ↔ tatsächlich versendete Prompts stimmen überein.
- Automatischer Architekturtest bestätigt: kein vorgeschalteter Draft-/Plan-Schritt.
- Syntax- und Parser-Regressionstests bestehen.
- Versions- und Manifestangaben stimmen überein.
- Reale Diagnose zeigt als ersten kreativen Provider-Aufruf die **Komposition**.
- Ein Hörtest prüft die musikalische Qualität. Ein grüner Build allein ist keine musikalische Freigabe.
- Die Nutzerbeschreibung enthält Taktzahl, BPM, Tonart, Tokens und Kostenschätzung und ist gegenüber der internen Analyse deutlich gekürzt.

## Änderungsregel

Eine Änderung, die einer dieser Regeln widerspricht, ist ein Architekturwechsel und darf nicht als Patch oder Fehlerbehebung in die stabile Engine gelangen.


## Allgemeine Analyse- und Verbesserungsfähigkeit (ab Engine 2.4.0)

- Die Composition Engine stellt appübergreifend eine **kritische, hörbezogene Partituranalyse** bereit. Die Analyse arbeitet ausschließlich auf der bereits technisch vorliegenden fertigen Partitur und verändert sie nicht.
- Das Analyseergebnis beginnt verbindlich mit `URTEIL: ÄNDERN` oder `URTEIL: BEHALTEN` und bleibt kurz; bei Änderungsbedarf enthält es einen konkret umsetzbaren Vorschlag.
- Die Engine stellt außerdem die **Umsetzung eines ausdrücklich freigegebenen Verbesserungsvorschlags** bereit. Dabei muss die diagnostizierte hörbare Schwäche tatsächlich adressiert werden; nicht erforderliche Änderungen sind zu vermeiden und alles andere ist zu bewahren.
- Analyse und Verbesserung sind **Fähigkeiten der Engine**. Ob und wie eine App sie in ihrer Oberfläche anbietet, entscheidet die jeweilige App.
- Provider-Leistungssteuerung ist stufenbezogen: kreative Komposition und kritische musikalische Analyse bleiben ungedrosselt; rein technische Übersetzung sowie die Ausführung einer bereits freigegebenen Änderung dürfen providerabhängig mit niedriger Reasoning-Stufe laufen.
