<h1 align="center">House Modes & Alarm Center (Ltek)</h1>

<p align="center">
  <strong>Fully Customizable House Modes, Virtual Alarm and Physical Alarm Panel all in one Home Assistant integration</strong><br>
  Any House Mode you want, as many as you want. Alarm with partitions and zones, a two-way link to a Honeywell/Ademco Vista or DSC panel through Envisalink, users and Z-Wave lock codes, a dashboard card, and an activity log of everything that happens. NO YAML required.
</p>

<p align="center">
  <a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=Ltek&repository=house-modes-alarm-center&category=integration"><img src="https://my.home-assistant.io/badges/hacs_repository.svg" alt="Open your Home Assistant instance and open this repository in HACS."></a>
</p>

Moving from [Alarmo](https://github.com/nielsfaber/alarmo)? See [Moving from Alarmo](#-moving-from-alarmo). Disable Alarmo before installing. User choice for automatic Alarmo import on first run.

---

### ✨ Highlights

- 🏠 **House Modes** — Away, Stay, Sleep, Guest, Spa or your own; each sets partitions to an Arm Mode, runs your scripts, and can change itself back on a timer
- 🚦 **Allowed Sources** — per mode, which kinds of request may enter or leave it: manual, automations, schedule, presence, a lock code, the panel keypad, timers
- 🛡️ **Alarm with partitions and zones** — doors, windows, motion, locks and garage doors; assign zones from labels, areas and floors
- 🔗 **Physical panel link** — Vista or DSC through Envisalink, kept in step in both directions, with one exit delay and arming from the keypad followed
- 👥 **Users, codes and keypads** — one user per person, Z-Wave lock code slots linked to users, keypad actions per user; codes are stored only hashed
- 🔎 **Finds your existing House Mode setup** — already run House Modes with your own helpers, automations and scripts? It finds them: suggests House Modes from your mode `input_select` and what your partitions did after each change, lists every automation and script that sets or reacts to a House Mode, and flags the ones that bypass House Modes
- 🧪 **Shadow mode** — House Modes and the panel link first only log what they would do, next to your own automations, and compare it with what your automations did; go Live when the log matches
- 🔁 **Moving from Alarmo** — a one-time import on first run (your choice), and a scan that lists every Alarmo service, event and entity in your automations, scripts and dashboards and rewrites them when you confirm (with Undo)
- 🔍 **Arm Check** — *Why won't it arm?*, live per partition and Arm Mode, plus a walk test
- 📋 **Activity log** — every House Mode change, alarm and panel event, lock, bypass and automation that ran, grouped into sequences
- 🖼️ **Dashboard card included** — Very customizable Card can show you and do almost anything you can ever need. House Mode buttons, arm / disarm with code entry and the panel keypad. Show/hide anything and Includes User Permissions!
- 💾 **Backups** — date-stamped backups with retention, YAML export and import with a preview

---

## 📚 Table of Contents

- [Moving from Alarmo](#-moving-from-alarmo)
- [Screenshots](#-screenshots)
- [Terms](#-terms) — the words used on every page
- [Features at a Glance](#features-at-a-glance)
- [House Modes](#-house-modes) — modes, sources, triggers, actions, Shadow
- [Alarm Events & Notifications](#-alarm-events--notifications)
- [Physical Panel Link](#-physical-panel-link) — Envisalink, mirrors, bypasses
- [Zones](#-zones)
- [Users, Codes & Keypads](#-users-codes--keypads)
- [Arm Check & Activity](#-arm-check--activity)
- [Dashboard Card](#-dashboard-card)
- [Entities, Services & Events](#-entities-services--events) — for your automations
- [Installation](#installation) — HACS + manual
- [Documentation](#documentation)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [License](#license)

---

## 🚚 Moving from Alarmo

House Modes & Alarm Center reads Alarmo's configuration, so you don't set things up again.

1. **Install** House Modes & Alarm Center from HACS (see [Installation](#installation)). Alarmo can stay installed; nothing of Alarmo is changed.
2. **Import** — on first start, the **Quick Start** tab offers a one-time **Import from Alarmo**. It reads `.storage/alarmo.storage` (and `alarmo_extras` from the Alarmo-based build of this integration) and copies partitions, zones, users with their code hashes, Alarm Events and every other setting. Alarmo's files are only read, so going back stays possible.
3. **Cut over** — disable the Alarmo integration, then point your automations and dashboards at the new names (`house_modes.*` services, `select.house_mode`). The alarm entities keep their ids (`alarm_control_panel.<partition>`).

> ⚠️ **Never run both at once.** Two integrations arming and sending keypresses to the same panel conflict. While Alarmo is enabled, this integration's panel link stays in Shadow and the import refuses.

Step-by-step cut-over and going back: [MIGRATION.md](MIGRATION.md).

---

## 📸 Screenshots

Rendered from a demo house with made-up names (see [Development](#development)).

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
    <td align="center" valign="top" width="50%">
      <a href="screenshots/26-quick-start-moving-from-alarmo.png"><img src="screenshots/26-quick-start-moving-from-alarmo.png" width="100%" alt="Quick start moving from alarmo"></a><br><sub>Quick start moving from alarmo</sub>
    </td>
  </tr>
</table>
<!-- SCREENSHOTS:END -->

---

## 📖 Terms

| Term | Meaning |
|---|---|
| **House Mode** | What is going on at home: Away, Stay, Sleep, Guest, … Each mode sets partitions to an Arm Mode. |
| **Alarm** | The alarm built into this integration. Called the virtual alarm where it has to be told apart from the panel. |
| **Partition** | A part of the building that is armed on its own. Each has an `alarm_control_panel` entity. |
| **Arm Mode** | Away, Home (Stay), Night, Vacation or Custom, with exit and entry delays. |
| **Zone** | A sensor the alarm watches: a door, window, motion sensor, lock or garage door. |
| **Panel** | The physical alarm panel, e.g. a Honeywell Vista through Envisalink. |
| **Panel link** | Keeps the alarm and the panel in step, in both directions. |
| **Alarm system** | The alarm and the panel together. |
| **Script Action** | A Home Assistant script a House Mode runs when it starts or ends. |
| **Automation Action** | A Home Assistant automation whose trigger is a House Mode starting or ending. |
| **Trigger** | What starts a House Mode: an automation that sets it, a timer, a lock code, manual. |
| **Allowed Sources** | Per House Mode: which kinds of request may enter or exit it. |
| **Shadow / Live** | Shadow only logs what it would do, next to your own automations; Live does it. Used by House Modes and the panel link. |

---

## Features at a Glance

| Feature | Details |
|---------|---------|
| **Quick Start** | The first tab: the one-time import from Alarmo, what is configured, and three guided setups (House Modes only; an alarm without a panel; House Modes and a panel). Each makes a backup before it changes anything |
| **House Modes** | Your own list of modes, each setting partitions to an Arm Mode or leaving them |
| **Allowed Sources** | Manual, automations, schedule, presence, lock code, panel keypad, timers — per mode, for entering and leaving |
| **Zone check** | A mode can require its zones to be closed before it starts |
| **Mode timers** | After N minutes or at a clock time, change to another mode or back to the previous one |
| **Script Actions** | Native HA scripts run when a mode starts or ends, before or after arming |
| **Automation Actions** | The automations triggered by a mode, read from them, with an Enabled chip and a run button |
| **Change notifications** | Optional message on every change, saying where it came from and why |
| **Shadow mode** | House Modes and the panel link log what they would do; compare, then go Live |
| **Partitions & Arm Modes** | One `alarm_control_panel` per partition; Away, Home, Night, Vacation, Custom with exit and entry delays |
| **Zone rules** | Assign zones from HA labels, areas and floors, with per-zone overrides |
| **Zone types** | Binary sensors, garage doors (covers) and locks |
| **Alarm Events** | Scripts that run when the alarm arms, disarms, triggers, fails to arm and more, per partition |
| **Notifications** | Messages on the same events, with actionable buttons (disarm, arm, retry, force arm) |
| **Panel link** | Envisalink (Vista, DSC); other panels through HA services |
| **Panel-led arming** | Zones checked, the panel armed at once, one exit delay; retries, failure policy, learned exit delays |
| **Keypad arming** | Arming at the panel keypad is followed from the start; zones only HA watches are bypassed |
| **Mirrors** | A copy of a Vista zone that keeps its last state while the zone is bypassed |
| **Bypasses** | Read from the Vista itself (BYPASS indicator and keypad list), across restarts |
| **Users** | One per person: arm and disarm / arm only / lock only, per partition |
| **Z-Wave lock codes** | Import a lock's codes as users, check *Slot = User Code*, write a code to its slots, show a slot's code for 30 s (admin only, never stored) |
| **Keypad actions** | Per user: a code that unlocks or keypad-locks a lock sets a House Mode and/or partitions |
| **Arm Check** | *Why won't it arm?* per partition and Arm Mode, with the panel's Ready, and a walk test |
| **Activity** | Grouped sequences from trigger to quiet; daily files, filters, download, panel timings; never records codes |
| **Dashboard card** | Included and registered automatically; House Mode, panel display, buttons, arm / disarm, keypad |
| **Backups** | Date-stamped, with retention; YAML export and import with a preview |
| **Blueprints** | House Mode by presence, House Mode on a schedule |
| **MQTT** | Optional state, command and event topics (`house_modes/state`, `/command`, `/event`) |

---

## 🏠 House Modes

Away, Stay, Sleep, Guest, Spa, whatever you can imagine… on the **House Modes** tab and in `select.house_mode`. Full guide: [HOUSE-MODES.md](HOUSE-MODES.md).

- Each mode sets partitions to an Arm Mode (or leaves them), has **Allowed Sources**, can check zones are closed, and can change itself back on a timer.
- Each mode lists its **Triggers**: the automations whose actions set it (with a warning when one writes the selector or leaves out the source), timers in other modes, lock codes and manual. Timers that can't work are flagged.
- **Script Actions** run when entering or leaving, before arming or after. Each script gets a "House Mode: <mode>" label and a "House Mode action: …" line in its description, so you can find it in Home Assistant. Name scripts `hm_…` to have them listed first. A script can turn on a scene if you want one.
- **Automation Actions** — the editor lists the automations whose triggers are this mode, with an Enabled chip and a run button; the tab lists the automations every change triggers.
- An optional `input_select` is kept in step, and the current and previous mode can be written to helpers.

### Shadow

Shadow runs House Modes next to the automations you already have, without arming anything or running scripts. Each request (your selector, `select.house_mode`, a lock code, a timer) is checked as Live would handle it and compared with what your automations did to the partitions within 3 minutes (✓ / ✗ on the Activity tab).

| Your setup | What to do |
|---|---|
| New setup, no House Mode automations | Start in Live; Shadow would only show ✗ "never got there" |
| Your automations arm only the physical panel | The comparison reads the alarm's partitions, so set up the panel link (with its own Shadow) as well |
| No selector `input_select` | Your automations' changes appear only as "partitions changed outside House Modes" |

---

## 🔔 Alarm Events & Notifications

**Alarm Events** are scripts that run when the alarm arms, disarms, triggers, fails to arm and more, per partition, in one list grouped by event. Events written the older way, as a list of actions, can be migrated to scripts, with a backup first.

**Notifications** are messages on the same events, listed the same way, with actionable buttons on the phone (`HOUSE_MODES_DISARM`, `HOUSE_MODES_ARM_AWAY`, `HOUSE_MODES_RETRY_ARM`, `HOUSE_MODES_FORCE_ARM`, …).

---

## 🔗 Physical Panel Link

Envisalink (Honeywell/Ademco Vista and DSC); other panels through HA services.

- **Shadow first** — logs what it would do next to your own automations; switch to **Live** when the log matches.
- **Start-up check** — after a restart, reload or panel reconnect, the alarm is compared with the panel once both have settled. If a restored alarm state is stale, the alarm follows the panel and you are told. Alarms are never cleared.
- **Panel-led arming** — the alarm checks every zone, the panel gets the command at once, and the alarm counts as armed when the panel is: one exit delay. Retries, failure policy, learned exit delays and *Match the alarm's exit times*.
- **Arming at the panel keypad** is followed from the start (the mode is read from the keypad text, with a mapping per mode). Zones only Home Assistant watches are bypassed and you are told.
- **Zones the panel doesn't watch** — choose what happens when one trips: set off the panel (siren, relay, panic key) or notify.

### Panel zones and mirrors

- Every panel zone with its live state, *add as zone* and *ignore*.
- **Mirrors** — a copy of a zone that keeps its last state while the zone is bypassed. A **Vista** stops reporting bypassed zones; DSC doesn't need mirrors.
- Vista bypasses are read from the panel itself (the BYPASS indicator and the "BYPAS zz" keypad list), across restarts.

---

## 🚪 Zones

- One table with drafts (edit many, review, save once), lock / unlock, live state, *Copy settings to…* and bulk changes.
- **Zone rules** assign zones from HA labels, areas and floors, with per-zone overrides.
- Garage doors (covers) and locks as zones; a per-zone *When tripped* for zones only HA watches.

---

## 👥 Users, Codes & Keypads

- **One user per person** — what the code may do (arm and disarm / arm only / lock only) and on which partitions.
- **Z-Wave lock code slots** linked to users — import a lock's codes as users, check *Slot = User Code*, write a user's code to its slots, show a slot's code for 30 s (admin only, never stored). Codes are stored only hashed.
- **Keypad actions per user** — when the code unlocks (or keypad-locks) a lock, set a House Mode and/or partition targets.

---

## 🔍 Arm Check & Activity

**Arm Check** (a panel on the Activity tab) — *Why won't it arm?*: the alarm's own check, live, per partition and Arm Mode, plus the panel's Ready, and a **walk test**.

**Activity** records sequences: House Mode helpers, the alarm, the panel and its keypad text, locks, bypasses, mirrors, automations that ran (as the *cause*), commands and notifications, grouped from the trigger until things go quiet. Daily files, filters, download, and a summary with panel timings. It only observes and never records codes.

---

## 🖼️ Dashboard Card

*House Modes & Alarm Center Card* is included ([CARD.md](CARD.md)): the House Mode with its icon and color, the panel's display, House Mode buttons, the alarm's arm / disarm with code entry, and the panel keypad (who may use it is set in the integration). There is no separate download: the integration adds and updates its Dashboard resource.

---

## ⚙️ Entities, Services & Events

**Entities**

| Entity | What it is |
|---|---|
| `alarm_control_panel.<partition>` | One per partition, plus a master entity for all of them when there are several |
| `select.house_mode` | The current House Mode; selecting an option changes it (source `manual` from a dashboard, `automation` from an automation) |
| `binary_sensor.<zone>_mirror` | A mirror of a bypassed Vista zone (only when mirrors are on) |

**Services**

| Service | What it does |
|---|---|
| `house_modes.set_house_mode` | Change the House Mode; `source` tells the Allowed Sources check where the request came from; `force` skips it |
| `house_modes.arm` | Arm a partition in a mode, with optional `code`, `skip_delay` and `force` |
| `house_modes.disarm` | Disarm a partition, with optional `code` |
| `house_modes.skip_delay` | Skip the rest of the exit or entry delay |
| `house_modes.enable_user` / `disable_user` | Turn a user's code on or off |
| `house_modes.create_backup` | Make a backup now, with an optional label |
| `house_modes.panel_keypress` | Send keys to the linked panel, as typed on its keypad |

**Events** (for automation triggers)

| Event | Fired when |
|---|---|
| `house_modes_house_mode_changed` | A House Mode started (`mode`, `name`, `source`, `previous`) |
| `house_modes_house_mode_blocked` | A request was refused (`reason`: source not allowed, zones open, …) |
| `house_modes_house_mode_failed` | A mode started but a partition didn't arm (`failed`, `policy`) |
| `house_modes_keypad_used` | A user's code was used on a lock keypad |
| `house_modes_failed_to_arm` | The alarm couldn't arm (`sensors`: the open zones) |
| `house_modes_command_success` | An arm or disarm command succeeded |

The two blueprints in [`blueprints/automation`](blueprints/automation) set the House Mode by presence and on a schedule.

---

## Installation

### Install via HACS

[![Open your Home Assistant instance and open this repository in HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Ltek&repository=house-modes-alarm-center&category=integration)

1. Click the button above, **or** open **HACS → ⋮ → Custom repositories** and add `https://github.com/Ltek/house-modes-alarm-center` as type **Integration**
2. Find **House Modes & Alarm Center (Ltek)** and click **Download**
3. **Restart** Home Assistant
4. **Settings → Devices & services → Add integration → House Modes & Alarm Center**
5. Open **House Modes & Alarm Center** in the sidebar; **Quick Start** takes it from there

Requires Home Assistant 2026.5 or newer.

### Manual

Copy `custom_components/house_modes` from a release ZIP to `/config/custom_components/house_modes` and restart Home Assistant.

---

## Documentation

| Document | What's in it |
|---|---|
| [HOUSE-MODES.md](HOUSE-MODES.md) | House Modes, sources, timers, lock codes and keypad actions |
| [CARD.md](CARD.md) | The dashboard card: sections, options, panel keypad permissions |
| [MIGRATION.md](MIGRATION.md) | Moving from Alarmo (import, cut-over, going back); one partition; template mirrors |
| [INSTALL.md](INSTALL.md) | Checks after an update, linking a panel, backups, restoring |
| [CHANGELOG.md](CHANGELOG.md) | Every build |
| [Workflow diagram](docs/diagrams/workflow.png) | How the parts connect, and what happens to one House Mode change |
| [Example system](docs/diagrams/example-system.png) | A real house set up with it (names removed): sources, modes, scripts, timers, panel |

---

## Troubleshooting

**The integration doesn't appear under Add integration**
- Restart Home Assistant after downloading, then hard-reload the browser (Ctrl+Shift+R / Cmd+Shift+R).

**The panel link stays in Shadow / the import refuses**
- The Alarmo integration is still enabled. Disable it under Settings → Devices & services, then reload this integration.

**A House Mode doesn't change**
- Open the mode's editor and check its **Allowed Sources**: a request from a source that isn't allowed is refused and logged on the Activity tab (and fires `house_modes_house_mode_blocked`).

**The alarm won't arm**
- Open **Arm Check** on the Activity tab: it shows, per partition and Arm Mode, which zones block arming and whether the panel is Ready.

**The alarm and the panel disagree after a restart**
- The start-up check compares them once both have settled; the Activity tab shows what it did and why.

**The card is missing or old after an update**
- The integration registers the card's Dashboard resource itself. Hard-reload the browser, or Settings → System → Restart → Clear cache and restart.

Report problems at [Ltek/house-modes-alarm-center issues](https://github.com/Ltek/house-modes-alarm-center/issues).

---

## Development

- Python: `uv run pytest -q`, `uv run ruff check custom_components/house_modes tests tools`.
- Frontend (`custom_components/house_modes/frontend`): `npm ci`, `npm run build`, `npm test`.
- Build a release: write the `## v<version>` CHANGELOG entry (`bash tools/package.sh --print` shows the next version, `YYYY.MM.DD.BUILD`), then `bash tools/package.sh` (version bump, build, tests, ZIP in `release/`).
- Screenshots (demo data, no real house): `HOUSE_MODES_SCREENSHOT_DEMO=1 uv run pytest -q tests/test_screenshot_demo.py`, then `node tools/screenshots/capture.mjs` (needs `playwright-core` and Chromium) → `screenshots/*.png`. Pushing them runs the *Update Screenshot Grid* workflow, which rebuilds the gallery above.

---

## License

Apache License 2.0 — see [LICENSE](LICENSE) and [NOTICE](NOTICE). House Modes & Alarm Center is based on [Alarmo](https://github.com/nielsfaber/alarmo) by Niels Faber and contributors (v1.10.19, commit `47b31a6`), modified extensively; the changes are listed in [CHANGELOG.md](CHANGELOG.md). The dashboard card's alarm section is based on [alarmo-card](https://github.com/nielsfaber/alarmo-card) by Niels Faber (Apache License 2.0, `custom_components/house_modes/frontend/card/LICENSE-alarmo-card`).

A huge thank you to Niels Faber, whose Alarmo this integration is based on.

This integration is not Alarmo and is not supported by its authors. Report problems at [Ltek/house-modes-alarm-center issues](https://github.com/Ltek/house-modes-alarm-center/issues), not on Alarmo's tracker.
