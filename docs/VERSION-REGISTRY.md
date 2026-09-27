# Zentrales Versions- und Wiederherstellungsregister

Stand: 2026-09-27. **Teilweise rekonstruierter Index**: Git-Commits sind nachgewiesen; vollständige Lauffähigkeit, Artefakte und Engine-Kopplungen sind NICHT pauschal verifiziert. Die Historie umfasst weitere Commits und ggf. weitere Repositories.

## Registerformat (für jedes künftige Release verpflichtend)
| Feld | Bedeutung |
|---|---|
| Projekt / App-Version | Exakt sichtbare Release-Version; App und Engine getrennt |
| Host-SHA / Engine-SHA | Unveränderliche Commits, weitere Modul-SHAs nach Bedarf |
| Engine-Ladeart | Lokal eingebettet / fest gepinnte URL / dynamische aktuelle URL |
| Build / Laufzeit | Build-Tool-Versionen, Plattform, Abhängigkeiten, Konfiguration ohne Geheimnisse |
| Belege | CI-Workflow, praktische Funktionsprüfung, Diagnose-ID, ggf. Hörtest |
| Status | Quellcode auffindbar / Kombination rekonstruierbar / Build getestet / Lauf getestet / musikalisch beurteilt |
| Rollback | Exakte Befehle bzw. Archiv-Branches und nachgewiesene Installationsartefakte |

## Nachgewiesene historische Anker (nicht vollständige Versionsliste)

| Projekt | Stand laut Commit | Commit-SHA | Stand der Wiederherstellung |
|---|---|---|---|
| Composition Engine | 2.0.1 | dd23ef8c2b9ffb59d67f9327b011d58bf17c58c3 | Quellcodehistorie nachgewiesen |
| Composition Engine | 2.1.0 | 3d70bc329ffc5b22ddcb42e8dff0e2192a98fcf6 | Quellcodehistorie nachgewiesen |
| Composition Engine | 2.2.0 | 8fd1bd7382fc00eb8c7bc0852464cd4b6df8aac2 | Quellcodehistorie nachgewiesen |
| Composition Engine | 2.3.0 | 6f9a9887f024b487c3eed614102e2742f0a1fe76 | Quellcodehistorie nachgewiesen |
| Composition Engine | 2.9.0 | 6881f063dafe350094c3b50ac00c462da363e618 | Historischer Archivzweig vorhanden |
| Minimal Composer | 0.8.7 | 1ab2fc8d633ff67399c61bade60c9aa041ba876a | Quellcodehistorie nachgewiesen |
| Minimal Composer | 1.0.0 | 9e73bb8210a82864a1211d32e959d52beb9ef2f1 | Historischer Archivzweig vorhanden; Laufzeitkopplung noch nicht eingefroren |
| Music Chat Lab | 1.9.0 | 2ccae9a94e6daa532c2743c102dcfc44b063c312 | Quellcodehistorie nachgewiesen |
| Music Chat Lab | 1.9.5 | 5b7b9d6196d949b5b7381fdded49d9f327aa4619 | Quellcodehistorie nachgewiesen; spätere Korrekturcommits vorhanden |
| Composition Lab Native | 3.5.1 | fb7a3b35205159701bcce1fd0f38309d44a3db76 | Build-Commit nachgewiesen, Artefakt/Lauftest offen |
| Composition Lab Native | 3.5.3 | a2aefd72c53878019058bdc6f6a2ffec2c4615dc | Als Entwicklungslinie dokumentiert; nicht als geprüfter Release behauptet |
| Composition Studio | — | — | Repository-Historie vorhanden; konkrete Release-Anker noch nicht rekonstruiert |

## Besonders wichtige Paarung
Minimal Composer 1.0.0 (9e73bb8210a82864a1211d32e959d52beb9ef2f1) und Composition Engine 2.9.0 (6881f063dafe350094c3b50ac00c462da363e618) sind als separate Archivzweige gesichert. **Achtung**: Host lädt die aktuelle Engine über eine dynamische Webadresse; für echten historischen Lauf ist eine getrennte, fest gepinnte Referenz nötig. Details: https://github.com/wibem1/Minimal-Composer/blob/main/docs/ARCHIVED-RELEASES.md

## Pflichtprozess
1. Historische Releases nur aus belegten Quellcode- und Build-Metadaten nachtragen. Nie aus einer Versionsnummer auf tatsächlich geladene Engine schließen.
2. Neue Releases mit unveränderlichem Git-Tag in JEDEM betroffenen Repo markieren; keine Release-Tags umsetzen oder überschreiben. Keine Host-Versionserhöhung für reine Engine-Änderung.
3. Für jede neue Host-Veröffentlichung maschinenlesbares Manifest mit Host-SHA, Engine-SHA und Modul-SHAs veröffentlichen; dynamisch ladende Web-Hosts brauchen zusätzlich eine versionierte, fest gepinnte Wiederherstellungsvariante.
4. Für native Builds Artefakt/Checksumme und Buildumgebung sichern; API-Schlüssel niemals sichern.
5. Rollback in isolierter Umgebung prüfen und Ergebnis samt Diagnose archivieren. Status nur bei belegtem Test erhöhen.
6. Historische Entwicklungslinien und Archive nie als Ersatz für die aktuelle Produktivlinie überschreiben.

Die Regeln gelten für **alle** Projekte, nicht nur die beiden bereits archivierten Versionen. Noch fehlende Releases und tatsächliche Laufzeitkombinationen bleiben explizit offen.
