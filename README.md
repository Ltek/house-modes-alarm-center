# House Modes & Alarm Center

> Based on Alarmo 1.10.19 by Niels Faber · full history in [CHANGELOG.md](CHANGELOG.md)

A Home Assistant integration for **House Modes**, an alarm with **partitions and zones**, a **physical alarm panel**
(Honeywell/Ademco Vista or DSC via Envisalink), **users and Z-Wave lock codes**, and an **activity log** of everything
that happens. Domain `house_modes`.

It started as an extension of [Alarmo](https://github.com/nielsfaber/alarmo) and has its own domain now, so it installs
next to Alarmo. Coming from Alarmo (or from the Alarmo-based build of this integration)? On first start, Quick Start
offers a one-time **Import from Alarmo**; the Alarmo files are only read, so going back stays possible. See
[MIGRATION.md](MIGRATION.md).

## Screenshots

Rendered from a demo house (made-up names) — see *Development* for how they are made.

<!-- SCREENSHOTS:START -->
<table>
  <tr>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/00-quick-start.png"><img src="screenshots/00-quick-start.png" width="100%" alt="Quick start"></a><br><sub>Quick start</sub>
    </td>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/01-house-modes.png"><img src="screenshots/01-house-modes.png" width="100%" alt="House modes"></a><br><sub>House modes</sub>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/02-alarm-events.png"><img src="screenshots/02-alarm-events.png" width="100%" alt="Alarm events"></a><br><sub>Alarm events</sub>
    </td>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/04-zone-assignments.png"><img src="screenshots/04-zone-assignments.png" width="100%" alt="Zone assignments"></a><br><sub>Zone assignments</sub>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/05-zone-editor.png"><img src="screenshots/05-zone-editor.png" width="100%" alt="Zone editor"></a><br><sub>Zone editor</sub>
    </td>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/06-physical-panel.png"><img src="screenshots/06-physical-panel.png" width="100%" alt="Physical panel"></a><br><sub>Physical panel</sub>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/07-users-codes-keypads.png"><img src="screenshots/07-users-codes-keypads.png" width="100%" alt="Users codes keypads"></a><br><sub>Users codes keypads</sub>
    </td>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/08-arm-check.png"><img src="screenshots/08-arm-check.png" width="100%" alt="Arm check"></a><br><sub>Arm check</sub>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/09-activity.png"><img src="screenshots/09-activity.png" width="100%" alt="Activity"></a><br><sub>Activity</sub>
    </td>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/10-backup.png"><img src="screenshots/10-backup.png" width="100%" alt="Backup"></a><br><sub>Backup</sub>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/11-alarm-events-migrate.png"><img src="screenshots/11-alarm-events-migrate.png" width="100%" alt="Alarm events migrate"></a><br><sub>Alarm events migrate</sub>
    </td>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/12-house-modes-shadow.png"><img src="screenshots/12-house-modes-shadow.png" width="100%" alt="House modes shadow"></a><br><sub>House modes shadow</sub>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/13-house-modes-detect.png"><img src="screenshots/13-house-modes-detect.png" width="100%" alt="House modes detect"></a><br><sub>House modes detect</sub>
    </td>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/14-house-mode-editor.png"><img src="screenshots/14-house-mode-editor.png" width="100%" alt="House mode editor"></a><br><sub>House mode editor</sub>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/15-dashboard-card.png"><img src="screenshots/15-dashboard-card.png" width="100%" alt="Dashboard card"></a><br><sub>Dashboard card</sub>
    </td>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/16-card-editor.png"><img src="screenshots/16-card-editor.png" width="100%" alt="Card editor"></a><br><sub>Card editor</sub>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/17-notifications.png"><img src="screenshots/17-notifications.png" width="100%" alt="Notifications"></a><br><sub>Notifications</sub>
    </td>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/18-notification-editor.png"><img src="screenshots/18-notification-editor.png" width="100%" alt="Notification editor"></a><br><sub>Notification editor</sub>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/19-alarm-event-editor.png"><img src="screenshots/19-alarm-event-editor.png" width="100%" alt="Alarm event editor"></a><br><sub>Alarm event editor</sub>
    </td>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/20-script-actions-all-modes.png"><img src="screenshots/20-script-actions-all-modes.png" width="100%" alt="Script actions all modes"></a><br><sub>Script actions all modes</sub>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/21-shadow-comparison.png"><img src="screenshots/21-shadow-comparison.png" width="100%" alt="Shadow comparison"></a><br><sub>Shadow comparison</sub>
    </td>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/22-partitions-arm-modes.png"><img src="screenshots/22-partitions-arm-modes.png" width="100%" alt="Partitions arm modes"></a><br><sub>Partitions arm modes</sub>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/23-automations-all-modes.png"><img src="screenshots/23-automations-all-modes.png" width="100%" alt="Automations all modes"></a><br><sub>Automations all modes</sub>
    </td>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/24-import-from-alarmo.png"><img src="screenshots/24-import-from-alarmo.png" width="100%" alt="Import from alarmo"></a><br><sub>Import from alarmo</sub>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top" width="50%">
      <a href="screenshots/25-import-done-and-references.png"><img src="screenshots/25-import-done-and-references.png" width="100%" alt="Import done and references"></a><br><sub>Import done and references</sub>
    </td>
    <td></td>
  </tr>
</table>
<!-- SCREENSHOTS:END -->

## Terms

| Term | Meaning |
|---|---|
| **House Mode** | What is going on at home: Away, Stay, Sleep, Guest, … Each mode sets partitions to an Arm Mode. |
| **Alarm** | The alarm built into this integration. Also called the virtual alarm where it has to be told apart from the panel. |
| **Partition** | A part of the building that is armed on its own. Each has an `alarm_control_panel` entity. |
| **Arm Mode** | Away, Home (Stay), Night, Vacation or Custom, with exit and entry delays. |
| **Zone** | A sensor the alarm watches: a door, window, motion sensor, lock or garage door. |
| **Panel** | The physical alarm panel, e.g. a Honeywell Vista through Envisalink. |
| **Panel link** | Keeps the alarm and the panel in step, in both directions. |
| **Alarm system** | The alarm and the panel together. |
| **Script Action** | A Home Assistant script a House Mode runs when it starts or ends. |
| **Automation Action** | A Home Assistant automation whose trigger is a House Mode starting or ending. |
| **Trigger** | What starts a House Mode: an automation that sets it, a timer, a lock code, manual. |
| **Allowed Sources** | Per House Mode: which kinds of request (manual, schedule, presence, lock, timer, …) may enter or exit it. |
| **Shadow / Live** | Shadow only logs what it would do, next to your own automations; Live does it. Used by House Modes and the panel link. |

## What it does

**Quick Start** — the first tab: the one-time import from Alarmo when Alarmo's files are found, what is configured, and
three guided setups (House Modes only; an alarm without a
physical panel; House Modes and a physical panel). Each shows its steps and makes a backup before it changes anything.

**House Modes** — Away, Stay, Sleep, Guest, Spa, … ([HOUSE-MODES.md](HOUSE-MODES.md))
- Each mode sets partitions to an Arm Mode (or leaves them), has **Allowed Sources**: which kinds of request may
  enter or exit it (manual, automations, schedule, presence, a lock code, the panel keypad, timers), can check zones are closed and change itself back on a timer.
- Each mode lists its **Triggers**: the automations whose actions set it (with a warning when one writes the selector
  or leaves out the source), timers in other modes, lock codes and manual. Timers that can't work are flagged.
- Each mode runs native scripts as **Script Actions** (entering or leaving, before arming or after), and has **timers**
  (after N minutes or at a clock time, to a mode or back to the previous one). Each script it runs gets a
  "House Mode: <mode>" label and a "House Mode action: …" line in its description, so you can find them in Home
  Assistant. Name them `hm_…` to have them listed first. A script can turn on a scene if you want one.
- Each mode's editor also lists its **Automation Actions**: the automations whose triggers are this mode (read from them), with an
  Enabled chip and a run button, and the tab lists the automations every change triggers.
- A notification on every change, if you want one, saying where it came from and why.
- `select.house_mode`, the `house_modes.set_house_mode` service, events, two blueprints, an optional `input_select`
  kept in step.
- **Shadow** runs House Modes next to the automations you already have, without arming anything or running scripts:
  each request (your selector, the House Mode select, a lock code, a timer) is checked as Live would handle it and
  compared with what your automations did to the partitions within 3 minutes (✓ / ✗, on the Activity tab). It works
  for any setup, but is only useful when you have such automations to compare with:
  - **New setup, no House Mode automations:** start in Live; Shadow would only show ✗ "never got there".
  - **Your automations arm only the physical panel:** the comparison reads the alarm's partitions, so set up the
    panel link (its own Shadow) as well.
  - **No selector `input_select`:** your automations' changes appear only as "partitions changed outside House Modes".

**Alarm Events** — scripts that run when the alarm arms, disarms, triggers, fails to arm and more, per partition, in
one list grouped by event. Old-style events (a list of actions, as Alarmo has them) can be migrated to scripts, with a
backup first. **Notifications** — messages on the same events, listed the same way.

**Physical panel link** (Envisalink; other panels via HA services)
- **Shadow mode** first: logs what it would do next to your own automations; **live** when the log matches.
- **Start-up check:** after a restart, reload or panel reconnect, the alarm is compared with the panel once both have
  settled; if a restored alarm state is stale, the alarm follows the panel and you are told (alarms are never cleared).
- **Panel-led arming:** the alarm checks every zone, the panel gets the command at once, the alarm counts as armed when
  the panel is — one exit delay. Retries, failure policy, learned exit delays and *Match the alarm's exit times*.
- **Arming at the panel keypad** is followed from the start (mode read from the keypad text, mapping per mode); zones
  only Home Assistant watches are bypassed and you are told.
- What happens when a zone the panel does not watch trips: set off the panel (siren, relay, panic key) or notify.

**Panel zones and mirrors**
- Every panel zone with live state, *add as zone*, *ignore*, and **mirrors**: a copy of a zone that keeps its last
  state while the zone is bypassed — a **Vista** stops reporting bypassed zones (DSC does not need mirrors).
- Vista bypasses are read from the panel itself (BYPASS indicator and the "BYPAS zz" keypad list), across restarts.

**Zones** (the Zones tab)
- One table with drafts (edit many, review, save once), lock/unlock, live state, *Copy settings to…*, bulk changes.
- **Zone rules:** assign zones from HA labels, areas and floors, with per-zone overrides.
- Garage doors (covers) and locks as zones; per-zone *When tripped* for zones only HA watches.

**Users, Codes, Keypads**
- One User per person: what the code may do with the alarm (arm and disarm / arm only / lock only), partitions.
- **Z-Wave lock code slots** linked to users: import a lock's codes as users, check *Slot = User Code*, write a user's
  code to its slots, show a slot's code for 30 s (admin only, never stored). Codes are stored only hashed.
- **Keypad actions per user:** when the code unlocks (or keypad-locks) a lock → a House Mode and/or partition targets.

**Arm Check** (a panel on the Activity tab) — *Why won't it arm?* (the alarm's own check, live, per partition and Arm Mode, plus the panel's Ready) and
a **walk test**.

**Dashboard card** — *House Modes & Alarm Center Card*, included ([CARD.md](CARD.md)): the House Mode with its icon and
color, the panel's display, House Mode buttons, the alarm's arm / disarm and code entry, and the panel keypad (who may
use it is set in the integration). No separate download; the integration adds and updates its Dashboard resource.

**Activity** — a recorder of sequences: House Mode helpers, the alarm, the panel and its keypad text, locks, bypasses,
mirrors, automations that ran (as the *cause*), commands and notifications, grouped from the trigger until things go
quiet. Daily files, filters, download, a summary with panel timings. Only observes; never records codes.

**Housekeeping** — one storage file (`.storage/house_modes`), date-stamped backups with retention, YAML export/import
with a preview, a status strip on every page, pages laid out to one design.

## Install

**HACS (custom repository)**

1. *HACS → ⋮ → Custom repositories* → `Ltek/house-modes-alarm-center`, type **Integration** → download.
2. Restart Home Assistant, then *Settings → Devices & services → Add integration → House Modes & Alarm Center*.
3. Open **House Modes & Alarm Center** in the sidebar.

**Manual:** copy `custom_components/house_modes` from a release ZIP to `/config/custom_components/house_modes` and
restart.

It installs next to Alarmo (`custom_components/alarmo`) without replacing it. **Never run both at once:** disable the
Alarmo integration before this one takes over (double arming, double keypresses to the panel). While Alarmo is enabled,
this integration's panel link stays in Shadow and the import refuses. Moving over from Alarmo, and going back:
[MIGRATION.md](MIGRATION.md).

## Documentation

| | |
|---|---|
| [HOUSE-MODES.md](HOUSE-MODES.md) | House Modes, sources, timers, lock codes and keypad actions |
| [CARD.md](CARD.md) | The dashboard card: sections, options, panel keypad permissions |
| [MIGRATION.md](MIGRATION.md) | Moving over from Alarmo (import, cut-over, going back); one partition; template mirrors |
| [INSTALL.md](INSTALL.md) | Checks after an update, linking a panel, backups, restoring |
| [CHANGELOG.md](CHANGELOG.md) | Every build |
| [docs/diagrams/workflow.png](docs/diagrams/workflow.png) | How the parts connect, and what happens to one House Mode change |
| [docs/diagrams/example-system.png](docs/diagrams/example-system.png) | A real house set up with it (names removed): sources, modes, scripts, timers, panel |
| [Alarmo's README](https://github.com/nielsfaber/alarmo#readme) | The integration this one is based on: entity, states, services, events, MQTT (here under `house_modes`) |

## Development

- Python: `uv run pytest -q`, `uv run ruff check custom_components/house_modes tests tools`.
- Frontend (`custom_components/house_modes/frontend`): `npm ci`, `npm run build`, `npm test`.
- Build a release: write the `## v<version>` CHANGELOG entry (`bash tools/package.sh --print` shows the next version,
  `YYYY.MM.DD.BUILD`), then `bash tools/package.sh` (version bump, build, tests, ZIP in `release/`).
- Screenshots (demo data, no real house): `HOUSE_MODES_SCREENSHOT_DEMO=1 uv run pytest -q tests/test_screenshot_demo.py`
  then `node tools/screenshots/capture.mjs` (needs `playwright-core` and Chromium) → `screenshots/*.png`. Pushing
  them runs the *Update Screenshot Grid* workflow, which rebuilds the gallery above.
- Based on [nielsfaber/alarmo](https://github.com/nielsfaber/alarmo) at commit `47b31a6` (v1.10.19). Upstream is not
  merged any more.

## Credits and license

Based on [Alarmo](https://github.com/nielsfaber/alarmo) © Niels Faber and contributors, licensed under the
[Apache License 2.0](LICENSE); see [NOTICE](NOTICE). This integration is not Alarmo and is not supported by its authors:
it is modified extensively, and the changes are listed in [CHANGELOG.md](CHANGELOG.md). The dashboard card's alarm
section is forked from [alarmo-card](https://github.com/nielsfaber/alarmo-card) © Niels Faber (Apache License 2.0,
`custom_components/house_modes/frontend/card/LICENSE-alarmo-card`).
Please report problems at [Ltek/house-modes-alarm-center](https://github.com/Ltek/house-modes-alarm-center/issues), not
on Alarmo's tracker.
