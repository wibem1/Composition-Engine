## 1.3.0 — 2026-09-22

- Datenfluss konsolidiert: reguläre Komposition benötigt nur noch kreativen Entwurf + technische Übersetzung; die Kompositionsbeschreibung wird lokal aus dem bereits vorhandenen Entwurf abgeleitet.
- Kompaktes technisches Austauschformat bleibt vollständig notengetreu und bewahrt optional die notierte Tonhöhe.
- Doppelte Titel senden nur noch einen kurzen Kontext statt des vollständigen Entwurfs.
- Aktive Varianten verwenden dieselbe kostenbewusste technische Grundlage; archivierte Engines werden vom Katalog nicht mehr geladen.
- Grundsatz: große musikalische Nutzdaten werden nur an eine KI gesendet, wenn der jeweilige Arbeitsschritt sie tatsächlich benötigt.

# Changelog

## 1.1.2 – 2026-09-20
- Fehlerkorrektur: Das in v1.1.0 definierte Kompositionsprofil wird nach der Kompositionsbeschreibung nun tatsächlich mit `compositionProfile(...)` erzeugt und als `run.profile` gespeichert.
- Diagnose protokolliert `composition_profile_created` mit BPM, Tempoangabe, Tonart, Taktanzahl und Provider/Modell.
- Keine Änderung an musikalischem Entwurf, MIDI-Übersetzung oder MIDI-Erzeugung.

## 1.1.0 – 2026-09-20
- Einheitliches appübergreifendes Kompositionsprofil in der Engine.
- Standard: BPM, musikalische Tempoangabe, Tonart, Taktanzahl, KI/Modell und knappe musikalische Beschreibung.
- BPM und Taktanzahl werden aus der fertigen Partitur bestimmt; Provider/Modell stammen aus dem Lauf.
- Tonart und Tempoangabe werden aus vorhandenen Partiturfeldern oder dem musikalischen Entwurf übernommen.
- Apps sollen dieses Engine-Profil anzeigen und keine eigene Beschreibungskonvention pflegen.
- Die technische Partitur bleibt vom Beschreibungsaufruf ausgeschlossen.

## 1.0.1 – 2026-09-20
- Kosten-/Datenflusskorrektur: `composition_idea_afterwards` erhält nicht mehr die vollständige technische Partitur.
- Die Kompositionsbeschreibung basiert weiterhin auf ursprünglichem Auftrag und vollständigem musikalischem Entwurf.
- Musikalischer Entwurf, MIDI-Übersetzung und lokale MIDI-Erzeugung bleiben unverändert.

## 1.0.0 — 2026-09-20
- Erster verbindlicher appübergreifender Engine-Stand.
- Freier musikalischer Entwurf und technische Übersetzung getrennt.
- Provider-Adapter für OpenAI, Anthropic und Google.
- Technischer Partiturvertrag und lokale deterministische MIDI-Erzeugung.
- Nachträgliche Kompositionsidee.
- Behandlung doppelter Werktitel.
- Keine Retry-/Kontroll-KI und keine zusätzlichen musikalischen Regelketten.


## 2.2.0-rc1 – 2026-09-25
- Basis bleibt die zweistufige freie Kompositionsarchitektur von 2.1.
- Neue echte KI-Nachanalyse der fertigen Komposition.
- Kompositionsbeschreibung wird aus dem fertigen Werk analysiert statt lokal aus einer Entwurfszeile abgeleitet.
- Analyse benennt bei tatsächlichem Auftreten auch Figurationsmelodik, schematische Wiederholung, geringe Entwicklung und mangelnden rhythmischen/stimmlichen Dialog.
- Keine Bewertungsskala, kein BEHALTEN/ÄNDERN, keine Verbesserungsschleife und keine Neukomposition in der Analysephase.
