# Stabilitätsaudit – 25.09.2026

Zweck: konsolidierter Basisstand vor weiterer Funktionsentwicklung. Dieses Dokument unterscheidet ausdrücklich zwischen statisch/automatisierbar geprüft und noch manuell zu prüfenden Runtime-Eigenschaften.

## Composition Engine 2.1.0

Behoben:
- falsche Standardpipeline `sound_concept → score_realization` entfernt;
- Standard ist wieder Nutzerauftrag → freie vollständige Komposition → rein technische Übersetzung;
- technische Stufe darf nicht neu komponieren, vereinfachen oder regularisieren;
- abgeschnittene technische JSON-Ausgabe kann höchstens zweimal technisch fortgesetzt werden, ohne neue musikalische Entscheidungen;
- Manifest, README und Runtime-Entry-Point auf denselben Standard gebracht;
- experimentelle Klangvorstellungsengine als nicht standardmäßig gekennzeichnet.

Geprüft:
- JavaScript-Syntax;
- kein `sound_concept`/Klangvorstellungsaufruf im Standard-Entry-Point;
- keine feste 1.3-Runtimebindung im Standard-Entry-Point.

## Minimal Composer 0.8.7

Behoben:
- alte Engine-Katalog-/Resolverreste aus dem aktiven Pfad entfernt;
- zentrale Engine statt app-lokaler Kompositionsengine;
- Versions-, Manifest- und Service-Worker-Bindung auf 0.8.7 vereinheitlicht;
- Architekturvertrag und Entwicklungsdokument auf aktuellen Runtime-Stand gebracht;
- Smoke-Test schützt gegen Rückkehr von Engine-Manifestresolver und harter 1.3-Bindung.

Geprüft:
- PR-Smoke-Test erfolgreich;
- sichtbare Version/Cachebindung statisch geprüft.

## Music Chat Lab 1.9.0

Behoben:
- Orchestrator erzeugt keine eigenen Provider-Prompt-Bodies mehr, sondern verwendet den Provider-Adapter der zentralen Engine;
- doppelte technische Fortsetzungs-/Reparaturzuständigkeit aus dem Orchestrator entfernt;
- Kompositionsauftrag und erzeugte Kompositionsbeschreibung beim CLAB-Speichern getrennt; Auftrag überschreibt `score.sm` nicht mehr;
- Version/Service Worker/Assetbindung konsolidiert;
- Architekturvertrag und STABILITY-Dokument auf 1.9.0 aktualisiert.

Geprüft:
- JavaScript-Syntax der geänderten Kerndateien;
- GitHub-Pages-PR-Workflow erfolgreich;
- keine harte 1.3-/`sound_concept`-Bindung im Orchestrator.

Noch manuell:
- intermittierendes Geräteaudio kann nur auf dem Zielgerät endgültig bestätigt werden. Die Diagnose muss bei einem erneuten Ausfall AudioContext, SoundFont und Schedulerzustand liefern.

## Composition Lab Native 6.1.1 / Build 94 / Engine Build 21

Behoben:
- vorgeschaltete Klangvorstellungs-/Dramaturgie-Stufe entfernt;
- erster KI-Aufruf ist freie vollständige Komposition aus dem Auftrag;
- zweiter KI-Aufruf erhält den fertigen musikalischen Entwurf und ist technische Übersetzung;
- Diagnose benennt die Architektur entsprechend;
- Info.plist, Buildskript und README auf 6.1.1 / 94 / Engine Build 21 vereinheitlicht.

Noch manuell:
- nativer Universal-Build und hörbare Wiedergabe sind Runtime-/Gerätetests; sie werden nicht allein aus Quellprüfung als bestanden behauptet.

## Notation Module 0.1.23

Ergebnis der erneuten Prüfung:
- bestätigter Referenzstand bleibt unverändert;
- Versionsanzeige, JavaScript-Asset, Service Worker und Cache sind bereits versionsgebunden;
- dokumentierter iPad-Praxistest bleibt Referenz.
Keine Änderung nötig.

## Tune Search 0.6.2

Behoben:
- sichtbare Quellen-/Versionsangaben an tatsächlich aktive Provider angepasst;
- JavaScript-Asset und Service Worker versionsgebunden;
- Cache auf 0.6.2;
- README dokumentiert den tatsächlich aktiven Stand; vorbereitete Quellen bleiben als nicht aktiv gekennzeichnet.

## Reaper Composition

Behoben:
- Dokumentation auf Composition Engine 2.1 ausgerichtet;
- REAPER bleibt reine lokale Bridge, keine zweite Kompositionsengine und keine zusätzliche Web-Abhängigkeit;
- Klang-/Formplan vor der Komposition ist auch hier nicht Teil des freigegebenen Vertrags.

Noch manuell:
- REAPER-spezifischer Roundtrip und nicht destruktive Rückgabe müssen bei Änderungen weiterhin in REAPER geprüft werden.

## Composition Studio

Konsolidierung:
- ausdrücklich als nicht stabiler Benutzerstand / Architektur- und Forschungsstand gekennzeichnet;
- keine stabile App darf davon abhängen;
- Wiederaufnahme erst nach reproduzierbarem Runtime-Preflight und eigener Freigabe.

## Verbindliche Arbeitsregel

Vor jeder künftigen Freigabe werden **Dokumentation → tatsächlicher Code → tatsächlich versendete KI-Prompts → Diagnose → Versions-/Cachepfad** gegeneinander geprüft.

Aussagen werden getrennt als:
- **festgestellt/geprüft**,
- **abgeleitet/wahrscheinlich** oder
- **noch nicht geprüft**
behandelt. Ein Build- oder Syntaxerfolg wird nicht als Nachweis musikalischer Qualität oder gerätespezifischer Audiofunktion ausgegeben.
