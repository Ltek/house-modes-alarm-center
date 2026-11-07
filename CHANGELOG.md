# Changelog — Alarmo "ext" build

Private build on top of upstream [nielsfaber/alarmo](https://github.com/nielsfaber/alarmo)
v1.10.19 (main @ `47b31a6`). Upstream's own history is in its GitHub releases.

## v2026.11.07.77 — 2026-11-07

Card only; no Home Assistant restart needed (reload the browser).

- **Notifications tab:** show / hide checkboxes above each list, with counts.
  - Smart Repeating Alerts: Enabled, Disabled, Cameras, Test mode, On old blueprints.
  - Alarm notifications (and the Alarm Events tab): Enabled, Disabled, No partition (warning), and on Alarm Events
    Old list of actions.
- **House Modes tab:** *Script Actions by script*, *Automations every change triggers* and *Automations that set the
  mode from a template* are now sections at the same level as *Modes*, not inside it.
- **Every panel starts collapsed** (Modes on House Modes, Users on Users, Codes, Keypads, Sequences on Activity).
  A panel you open stays open while you work; Arm Check still opens when you come from *Why won't it arm?*.
- *Automations that set the mode from a template* shows a warning in its summary ("2 of 3 need a look") when one of
  them bypasses House Modes or sends no source, and "no problems found" otherwise.

## v2026.11.06.76 — 2026-11-06

Restart Home Assistant after the update.

- Ships Smart Repeating Alerts **v2026.11.06.43** (the camera alerts' Android channel used the camera name before it
  was set). It replaces the integration's own older copy on startup.

## v2026.11.06.75 — 2026-11-06

Restart Home Assistant after the update.

- The integration **installs the Smart Repeating Alerts blueprint on startup** when
  `blueprints/automation/LTek/smart-repeating-alerts-ltek.yaml` is missing, and updates it when that file is the
  integration's own older copy, then reloads automations. A file there that isn't Smart Repeating Alerts (or that
  you've replaced with your own) is left alone. The Install / Update button on the Notifications tab stays.

## v2026.11.06.74 — 2026-11-06

Restart Home Assistant after the update, then click **Update blueprint** under Smart Repeating Alerts (Notifications).

- Ships Smart Repeating Alerts **v2026.11.06.42**, its first published build (build numbers continue from Repeating
  Alert Notifications). Same blueprint as v2026.11.06.3.

## v2026.11.06.73 — 2026-11-06

Restart Home Assistant after the update, then click **Update blueprint** under Smart Repeating Alerts (Notifications).

- Ships Smart Repeating Alerts **v2026.11.06.3**: *Alerts per Entity* → *One alert per triggering entity* gives each
  window, leak sensor, … its own alert when one automation covers several. Before, a second one replaced the first.

## v2026.11.06.72 — 2026-11-06

Restart Home Assistant after the update.

- The blueprint is named **Smart Repeating Alerts (Ltek)** (`LTek/smart-repeating-alerts-ltek.yaml`); .71 called it Smart Alerts. Install it from the Notifications tab.

- **Smart Repeating Alerts** on the Notifications tab: repeating, actionable alerts (doors, windows, leaks, smoke, cameras …)
  as native Home Assistant automations made from the new *Smart Repeating Alerts* blueprint
  ([Ltek/smart-repeating-alerts](https://github.com/Ltek/smart-repeating-alerts): Repeating Alert Notifications plus camera snapshots,
  URI buttons, extra notify services, Android priority / alarm stream, cooldown and a test mode).
  - The integration ships the blueprint and installs it on startup (and with Install / Update) into
    `blueprints/automation/LTek/smart-repeating-alerts-ltek.yaml`. It never replaces a file there that isn't Smart Repeating Alerts.
  - One row per alert: what triggers it, how many targets, repeats, camera, buttons, critical, test mode; with an
    Enabled chip, run, edit (Home Assistant's editor) and delete. *+ New alert* makes an empty one and opens it in
    Home Assistant's editor.
  - Automations still on *Repeating Alerts* or *Smart Camera Notifications* are listed with a note to switch.
- The integration's own alarm notifications are under **Alarm notifications**, below Smart Repeating Alerts.

## v2026.11.06.71 — 2026-11-06

Restart Home Assistant after the update.

- **Smart Alerts** on the Notifications tab: repeating, actionable alerts (doors, windows, leaks, smoke, cameras …)
  as native Home Assistant automations made from the new *Smart Alerts* blueprint
  ([Ltek/smart-alerts](https://github.com/Ltek/smart-alerts): Repeating Alert Notifications plus camera snapshots,
  URI buttons, extra notify services, Android priority / alarm stream, cooldown and a test mode).
  - The integration ships the blueprint and installs it on startup (and with Install / Update) into
    `blueprints/automation/LTek/smart-alerts-ltek.yaml`. It never replaces a file there that isn't Smart Alerts.
  - One row per alert: what triggers it, how many targets, repeats, camera, buttons, critical, test mode; with an
    Enabled chip, run, edit (Home Assistant's editor) and delete. *+ New alert* makes an empty one and opens it in
    Home Assistant's editor.
  - Automations still on *Repeating Alerts* or *Smart Camera Notifications* are listed with a note to switch.
- The integration's own alarm notifications are under **Alarm notifications**, below Smart Alerts.

## v2026.11.06.70 — 2026-11-06

Card only; no Home Assistant restart needed (reload the browser).

- **Activity:** one card, with the title and the recording status at the top and collapsible sections under it:
  *Sequences* (open to start with), *Arm Check*, *Shadow comparison*, *Recording settings*, *Physical panel link log*
  and *House Mode history*.
- **Checkboxes instead of toggle switches** everywhere in the panel (code settings, users, zones, rules, general
  settings, MQTT).
- **Users, Codes, Keypads** follows the design guide: one card with collapsible *Codes*, *Users* and *Keypads*
  sections, each with a summary when closed.
  - *Codes*: the three "code required" settings as checkboxes with their explanation, and the code format as chips.
  - *Users*: one row per user (what the code can do, its format, lock slots and keypad actions), with an Enabled
    chip, edit and delete (with a confirmation). *+ New user* sits at the top.
  - The user editor is one panel with an accent outline, its name in the header, and the delete button (trash) next
    to Save and Cancel.
  - *Keypads*: the locks, without a second card around them.
- **Physical Panel:** the panel zone list is collapsible (*Zone list*, closed to start with), with the zone, mirror,
  bypassed and ignored counts in its summary.

## v2026.11.06.69 — 2026-11-06

Restart Home Assistant after the update, then reload the browser (on phones, close and reopen the app).

- **Dashboard card loading.** The integration now adds the card to **Settings → Dashboards → Resources** and updates
  that entry's URL on every update, the way dashboard cards normally load. Before, it was only injected as an extra
  frontend module, which is loaded after the page and could leave the card missing ("Custom element doesn't exist:
  house-modes-alarm-center-card"), mostly in the phone apps. Dashboards in YAML mode keep the old way, because their
  resources can't be changed.
  - If you added the card as a resource by hand, the integration keeps one entry and removes the copies.
  - The card no longer stops with an error when its file is loaded twice (an old and a new URL right after an
    update, or two resource entries).

## v2026.11.06.68 — 2026-11-06

Restart Home Assistant after the update.

- **Triggers** (new, in each mode's editor): what can start the mode.
  - *Automations that set this mode*, read from the automations' actions (calls to `alarmo.set_house_mode`, or
    writes to the House Mode select or your selector), with what triggers them (a time, presence, …), the Enabled
    chip and a run button.
  - A warning under an automation that writes the selector or calls `alarmo.set_house_mode` without a source (its
    request then arrives as "automation"), that targets a mode whose Allowed Sources refuse its source, or that
    writes the current-mode helper directly (House Modes never sees it: nothing is armed and no script runs).
  - *Built in*: timers in other modes that go to this one, lock codes mapped to it, and manual.
  - Automations that pick the mode with a template are listed under the modes.
- **Timer checks** (warnings; saving is never blocked): a timer whose target mode doesn't let timers enter, a mode
  that doesn't let its own timers exit, a timer to the mode itself, an "only when coming from" mode that no longer
  exists or is the mode itself, and two modes whose timers go to each other. Shown above the modes list, on the
  mode's row and in its Timers section.
- Renamed in each mode's editor: *Who may change it* → **Allowed Sources** (columns **May Enter**, **May Exit**,
  **Wait Before Exit (min)**); *House Mode Actions* → **Script Actions**; *Automations this mode triggers* →
  **Automation Actions**; *House Mode Actions by script* → **Script Actions by script**. New order: Partitions,
  Allowed Sources, Readiness, Triggers, Timers, Script Actions, Automation Actions.
- **Blueprints:** *House Mode on a schedule* gains "Only from these House Modes"; *House Mode on presence* gains
  "Zones that count as home" (e.g. Neighborhood). Both drop "Alarmo" from their names. Re-import them to update.

## v2026.11.06.67 — 2026-11-06

Card only; no Home Assistant restart needed (reload the browser).

- **Shadow comparison** moved from the House Modes tab to the **Activity** tab, as a collapsible section (shown while
  House Modes run in Shadow). Its summary line shows the matched and differed counts.
- House Modes tab:
  - the run-state choice is labelled **Current Run State:**;
  - the status ("Would be: Disarmed since …" or "Now: …") is on its own line: inside the Shadow explanation in
    Shadow, under the run state otherwise;
  - **Modes** and **Helpers and notifications** are collapsible sections (Modes open to start with), with a summary
    when closed, and space between the Modes title and its description;
  - each mode's row shows its counts: "1 script · 1 timer · 3 automations".

## v2026.11.06.66 — 2026-11-06

Card only; no Home Assistant restart needed (reload the browser).

- **House Mode Actions by script** (House Modes tab, under the modes): one row per script and timing, with a chip
  for each House Mode. Tick every mode that runs the script and set entering or leaving and before arming or after
  the change once, instead of adding the same script in each mode. A script that runs differently in some modes
  gets a row for each timing. *Only when coming from* and *wait for it* stay per mode, in the mode's editor.
- The actions are still stored per mode, so nothing changes in your settings, and each mode's *House Mode
  Actions* shows the same actions from the mode's side.

## v2026.11.06.65 — 2026-11-06

Card only; no Home Assistant restart needed (reload the browser).

- The **Actions tab is now the Alarm Events tab**. *What runs on each mode* is gone from it: everything it showed is in
  each mode's editor on the House Modes tab.
- **House Modes, a mode's editor:** one accent outline instead of the indented grey box. Name, icon, color and *If
  arming fails* sit on top; then collapsible sections, each with a one-line summary when closed: *Partitions*, *Who
  may change it*, *Readiness*, *Timers*, *House Mode Actions* and *Automations this mode triggers*. Open sections stay
  open while you edit and save.
  - *Timers* and *House Mode Actions* add from a button at the top; each row has its own delete (trash) button.
    Each action has an open-in-Home-Assistant and a run button.
  - *Automations this mode triggers* (was "Automations that react") shows each automation with an Enabled chip and a
    run button, the same as the old Actions view.
  - Automations that run on every House Mode change are listed under the modes, in *Automations every change
    triggers*.
- **Alarm Events:** one list grouped by event, like Notifications: each row shows the partition, the Arm Modes and the
  scripts it runs, with an Enabled chip, edit and delete. *+ New Alarm Event* sits at the top. The editor is one
  compact panel like the notification editor, with *To YAML* in its header and Save, Cancel and delete at the bottom.
- **Alarm Events run scripts only.** The editor offers only scripts; events that already run a scene keep working.
  *Migrate to scripts* now turns every old-style event into a script (it used to make scenes for simple ones).
- No more mentions of scenes in the Alarm Events tab and editor.

## v2026.11.06.64 — 2026-11-06

Restart Home Assistant after the update.

- House Mode **actions are scripts only**. The action picker lists only scripts (`hm_…` first). A script can still
  turn on a scene. An action that is still a scene keeps running, and the mode shows it as "a scene: replace it with
  a script".
- The **Scenes card is removed** from the Actions tab, along with its "Runs when these House Modes start" option.
  Scenes you made with it stay in Home Assistant; edit them there.
- The Actions tab's *Other Alarm Events* card is now **Alarm Events** and lists every Alarm Event, including the
  ones that run a scene (they were shown on the Scenes card before).

## v2026.11.05.63 — 2026-11-05

Restart Home Assistant after the update.

- House Mode **steps are now called actions**, everywhere in the panel, the Activity log and the notifications
  ("House Mode action failed"). Nothing to change: the stored settings are the same.
- When you save the House Modes, each script and scene a mode runs gets a **"House Mode: <mode>" label** (one per
  mode; removed when no mode runs it, other labels are kept), so you can filter Home Assistant's Scripts and Scenes
  lists by House Mode.
- Each such script in `scripts.yaml` also gets a first **description line**, e.g. "House Mode action: Sleep, Away ·
  entering, before arming". Your own description text is kept below it. The file is only written when a line
  changes, the same way Home Assistant's script editor saves it (so, as with that editor, comments in
  `scripts.yaml` are not kept). Scripts loaded from other files are left alone.
- Both are written from the mode's action list and never read back: the House Modes tab stays the one place to edit.
- The action picker lists `hm_…` scripts and scenes first.

## v2026.11.05.62 — 2026-11-05

Restart Home Assistant after the update.

- House Modes can send a notification on **every change**: House Modes tab → *Helpers and notifications* → tick
  *Notify on every change*. The message says the mode, where it came from and why ("House Mode: Stay — from Sleep ·
  timer"). Sources can be left out (e.g. no message for schedule changes). Live only, like the other House Mode
  messages.
- `select.alarmo_house_mode` has two new attributes: `previous_since` and `previous_duration` (seconds), so a
  "last duration" automation is no longer needed.
- Actions tab: the *House Mode Actions* grid (Home Assistant labels and suggestions) is replaced by **What runs on
  each mode**: per House Mode, the scripts and scenes it runs (its steps), its timers, and the automations whose
  triggers react when the mode starts or ends. Automations that only use the House Mode as a condition are not
  listed. The mode editor's list of related automations reads the triggers in the same way.
- Scenes: *Runs when these House Modes start* makes the scene an entering step of those modes (it was a label).
  Existing labels stay in Home Assistant but are no longer used.
- Notifications tab, per the design guide: one row per notification (event icon, name, partition, arm modes and
  where it goes, an Enabled chip, edit, delete), grouped by event, with *New notification* at the top. The editor is
  one compact panel: label and field side by side, *To YAML* in its header, Save / Cancel / delete at the bottom.
  Editing a notification no longer shows the Alarm Events list under it.

## v2026.11.05.61 — 2026-11-05

Restart Home Assistant after the update.

- House Modes tab: the row of mode buttons is gone; the Modes list has a switch button (▶) on each mode instead,
  so every mode is listed once. The entities are a list of their own, *Helpers and notifications*: House Mode
  selector, Current House Mode, Previous House Mode and Notifications, each with what it is for. Under the selector
  it says which mode names are missing from its options, or that they all match.
- Actions tab: House Mode Actions, Scenes and Other Alarm Events are collapsible cards, collapsed to start with,
  each with a one-line summary (labelled items and suggestions, number of scenes). A card stays open or closed
  while you move between tabs.

## v2026.11.05.60 — 2026-11-05

Restart Home Assistant after the update.

- Wording: "Alarmo" is gone from the panel, the card, its editor, the service descriptions, notifications, the
  Activity log and the docs. *The alarm* is the built-in alarm, *the panel* the physical one, *the alarm system*
  both. Entity ids, services and events keep their `alarmo` names. Some labels changed with it: *Link a
  partition…*, *Use mirrors as zones*, *not a zone*, *Delete zone*, and the Arm Modes tab.
- README: a **Terms** table (House Mode, Alarm, Partition, Arm Mode, Zone, Panel, Panel link, Alarm system,
  Shadow / Live), and no build number at the top any more; `tools/package.sh` now refuses a README that has one.

## v2026.11.05.59 — 2026-11-05

Restart Home Assistant after the update.

- Quick Start, *Alarm without a physical panel*: the candidate zones are grouped in collapsible panels (Doors,
  Windows, Motion, Occupancy and presence) with *all* / *none*; doors and windows are picked to start with, motion
  sensors only when ticked.
- Quick Start: the dashboard card step is done when the card is on any dashboard, however it is set up; the YAML to
  copy is only the card type.
- House Modes tab: the House Mode and Modes cards are one.
- The Zone Assignments tab is now **Zones**.

## v2026.11.05.58 — 2026-11-05

Card only; no Home Assistant restart needed (reload the browser).

- Card editor, *Sections*: each section is a row with its icon, name and contents, chips *Collapsible* and *Starts
  collapsed* (tap to switch), and eye / up / down (/ trash) icons; no column headers.
- *Collapse the card to its first section* and *Start collapsed* moved to the *Card* panel ("collapse" / "expand"
  throughout, no "fold").
- *Show the expand / collapse arrow* is in the *Section bars* sub-panel.
- An open sub-panel's border is the theme's accent color; top-level panels keep the primary color.

## v2026.11.05.57 — 2026-11-05

Restart Home Assistant after the update.

- **Quick Start** replaces the General tab: what is configured (House Modes, partitions, zones, users, panel link,
  recording) and three guided setups, each a list of steps with their status and an *Apply* that makes a backup and
  only adds what is missing:
  - *House Modes only* — starter modes that arm nothing, or your own House Mode input_selects in Shadow;
  - *Alarm without a physical panel* — Away / Home / Night, zones from your door, window and motion sensors (tick the
    ones you want), a user code step;
  - *House Modes and a physical panel* — the panel link in Shadow, the panel's zones, House Modes, the default-code
    check, the Shadow → Live step.
  Each shows the dashboard card YAML to copy.
- General's settings moved: *Alarm behavior* (disarm after trigger, the "All partitions" alarm) to Partitions & Arm
  Modes; **MQTT to the renamed Integrations & Backup tab**.
- **One Actions tab**: House Mode Actions, Scenes — each scene shows the Alarm Events that run it, and *+ Alarm event*
  makes a new one for it — and, collapsed, *Other Alarm Events* (scripts and legacy events, with Migrate). The House
  Mode Actions tab is gone; old links open Actions.

## v2026.11.05.56 — 2026-11-05

Restart Home Assistant after the update (new default House Mode colors).

- **Arm Check is a panel on the Activity tab** (the Arm Check tab is gone). The "Why won't it arm?" chip and the
  partition chips open it directly.
- **The Zones (legacy) tab and its switch are gone**; Zone Assignments replaces it. Old links open Zone Assignments.
- Activity: **RECORDING ENABLED** in the theme's accent color (or *RECORDING OFF*), so the status stands out.
- Default House Mode colors: Sleep 93,93,244 · Spa 0,168,168 · Guest 153,0,153 · Local 123,179,20 (the standard
  Night and Custom arm mode colors follow Sleep and Spa).

## v2026.11.05.55 — 2026-11-05

Card only; no Home Assistant restart needed (reload the browser).

- The card editor shows the card's name and build at the top, as the other Ltek cards do.

## v2026.11.05.54 — 2026-11-05

Card only; no Home Assistant restart needed (reload the browser).

- **Panel keypad key style**: *Filled* (as before), *Transparent with a border* or *Transparent, no border*, or your
  own key background and border colors. The key flash still shows on transparent keys.

## v2026.11.05.53 — 2026-11-05

Restart Home Assistant after the update.

- **Effects only while something is changing** by default: an exit delay (Alarmo or the panel arming) and a House
  Mode change. Entry delay and alarm are still there to tick. Cards that chose their own *When* keep it.
- A House Mode change counts for at most 3 minutes, so effects can never keep running on a stuck report; the
  editor's *Preview the effects* switches itself off after 20 s.
- Integration: a delayed House Mode request counts as a change under way only while it is still due, and not in
  Shadow (Shadow keeps its own).
- Test: Shadow's "changing to" clears when your automations got there, and after the watch time.

## v2026.11.05.52 — 2026-11-05

Restart Home Assistant after the update (the integration tells the card which helper to show in Shadow).

- **Shadow: the card shows your own House Mode**, the state of your House Mode input_select (as your old card did),
  instead of the mode Shadow works out. Picking a mode that sets the same partitions as another one (Late Night and
  Stay) now shows the one you picked.
- **Status text centered on the icon**: an empty panel display line no longer counts as a line (it pushed the text
  up when the panel's second line was blank).

## v2026.11.05.51 — 2026-11-05

Card only; no Home Assistant restart needed (reload the browser).

- **Status sections, as many as you like**: each built from an icon (House Mode, alarm state or none, optionally the
  countdown during a delay) and the lines you choose, in order — House Mode name, alarm name, alarm state, panel
  display lines, "Changing to …", "since …". Add, delete and order them in *Sections*; one editor panel each.
- Status text styles are card-wide (Card → Status text) with per-section overrides; per-section background.
- Existing cards turn into two Status sections, *House Mode Status* and *Alarm Panel Status*, in the same places
  and with the same lines; the editor writes the new form the first time you change something.

## v2026.11.05.50 — 2026-11-05

Card only; no Home Assistant restart needed (reload the browser).

- **Five separate sections, in any order**: House Mode Status (the old header), House Mode buttons, **Alarm Panel
  Status** (new: the alarm's state icon with the countdown, name, state, and optionally the panel display),
  Alarm Panel buttons, Physical panel keypad. Each can be shown, collapsed behind a bar and moved up or down.
  *Fold the whole card to its first section* replaces the header-only collapse. Old configs look the same.
- **Ready dots only when an arm mode cannot be armed** (red); no green dots.
- **Panel display text: Replace only.** The separate Strip field is gone; an old strip value becomes a replacement
  (`*` → nothing).
- **Editor: one panel open at a time** (and one sub-panel within a panel).

## v2026.11.05.49 — 2026-11-05

Restart Home Assistant after the update (the default House Mode colors are set by the integration).

- **Default House Mode colors are the original card's**: Disarmed green, Away red, Stay orange, Sleep midnight blue,
  Late Night deep sky blue, Vacation crimson, Spa cyan, Guest magenta, Local purple, anything else gray (the CSS
  colors, stored as hex). Modes with a color you chose keep it. The standard arm mode colors follow the same set.
- **Card border** is the House Mode's color by default, as the original `sensor.alarm_border_color`; *Border color →
  The alarm state* keeps the red / orange / green state border.

## v2026.11.05.48 — 2026-11-05

Card only; no Home Assistant restart needed (reload the browser).

- **Effects per part**: the card (background, border), the status icon, the House Mode buttons (background, border,
  icon) and, new, the arm buttons (background, border, icon) each glow, pulse or both. Older effect settings are
  read as before.
- **Color mapping on the card**: a card-only color per House Mode, and a color per arm mode, which can be a House
  Mode's color ("Disarmed = House Mode: Guest").
- **Countdown in the header**: optionally the countdown circle replaces the House Mode icon during an exit or entry
  delay.
- **Spacing that works both ways**: *Button width* fill or fit, for House Mode and arm buttons; with *fit* the space
  setting is the real distance between buttons. *Button padding* for both. (The arm buttons always stretched, so
  their space setting could only add.)
- **Panel keypad**: round keys, and a pressed key's border and / or background can glow for 500 ms in colors you
  choose.

## v2026.11.05.47 — 2026-11-05

Card only; no Home Assistant restart needed (reload the browser). (v2026.11.05.46 does need one.)

- **Round buttons**: House Mode buttons and arm buttons can be rounded rectangles (as before) or round, a circle
  around each icon with the text below; the circle carries the background and border colors.
- **Space between buttons**, separately for House Mode buttons and arm buttons.
- **House Modes off**: the header shows the alarm's state icon in its arm mode color instead of a gray shield.
- **Shadow without your own House Mode helper**: a House Mode button says *"Shadow: House Modes would set …; nothing was
  changed"* instead of appearing to do nothing.
- CARD.md: how the card behaves without House Modes, without a panel, and in Shadow.

## v2026.11.05.46 — 2026-11-05

Restart Home Assistant after the update (the integration now reports House Mode changes in progress).

Dashboard card:
- **Effects** (new editor panel): the card border, the status icon and the House Mode button being changed to can
  glow, pulse or both while the alarm or the panel is arming, during the entry delay, while a House Mode change is
  under way, or when the alarm is triggered (each can be chosen). Glow size, pulse speed and color (default: the
  border's state color); *Preview the effects now* in the editor. Like the Easy Thermostat Styler Card, without the
  moving backgrounds.
- **Panel display text**: strip characters from both ends of each line (e.g. `*`), and optional find / replace pairs.
- **Card background** (default for every section) and a **background per section** (Header, House Mode buttons,
  Alarm, Physical panel keypad).
- Two cards for the same alarm with different sections keep their own open / closed state.

Integration:
- `select.alarmo_house_mode` has a `changing_to` attribute: the House Mode a change is under way to (being applied,
  a delayed request, or a request Shadow is watching).

## v2026.11.05.45 — 2026-11-05

Card only; no Home Assistant restart needed (reload the browser).

- **Collapsible sections are dividers**, as on the other Ltek cards: a thin line with the icon, title and arrow in
  the middle, instead of a boxed bar.
- **Arm mode colors are one clear choice** (`alarm_colors`): *From the House Modes*, *Standard* (green disarmed, red
  away, orange home, …) or *Home Assistant theme*. The old `alarm_colors_from_modes: false` meant the theme colors,
  where Disarmed is gray, so a `mode` icon or border did not turn green; it now means *Standard*.
- **Button styles in one click**: *Filled*, *Outline when selected*, *Outline, all in color*, *Colored icon when
  selected*, for House Mode buttons and arm buttons; then fine-tune.

## v2026.11.05.44 — 2026-11-05

Card only; no Home Assistant restart needed (reload the browser).

- **The edit preview no longer refreshes or collapses** when a setting changes. The dashboard editor creates a new
  card element for many edits; open and closed sections and the card's data are now kept outside the element, so
  the new one shows the same view at once (no loading flash), and the data is refreshed in the background. Start
  collapsed / start closed only apply the first time the card is shown.
- New build check `tools/screenshots/preview-stability.mjs` (run by `tools/package.sh`): opens sections, edits the
  config, mounts a new element and checks nothing reloads or collapses.

## v2026.11.05.43 — 2026-11-05

Dashboard card:
- **Sections panel**: one row per section with *Show*, *Collapse* and *Start closed*. Header = the whole card folds
  to it; House Mode buttons, Alarm and the panel keypad each fold behind a bar. The collapse settings elsewhere are
  gone.
- **Button colors** for House Mode buttons and arm buttons: background and selected background (incl.
  transparent), border and selected border (incl. none), icon color and selected icon color, *text color follows
  the icon*; arm buttons also the bar behind them. Each can be the card default, the button's own House Mode / arm
  mode color, a theme color, a custom color or a CSS value.
- **Show / hide per set**: header icon, House Mode name, display lines; House Mode button icons and text; alarm state
  icon, name, state, arm button icons and text, option chips; keypad functions.
- US English throughout ("color", "center"), also on the House Modes tab and in the scene editor.

## v2026.11.04.42 — 2026-11-04

Dashboard card:
- **New visual editor** following the Ltek card design guide: Card, Sections, Header, House Mode buttons, Alarm and
  Physical panel keypad panels; sliders for sizes, the four-mode colour control (card default / theme / custom /
  CSS), three-state italic and capitals; only changed options are written.
- **Styles for every text and icon**: size, weight, font (monospace / sans / serif), italic, capitals and colour for
  the House Mode name, both panel display lines, House Mode button text, alarm bar / name / state, arm button text,
  option chips and keypad keys; size and colours for the header icon, House Mode button icons and arm button icons;
  border width and corner radius.
- **Show / hide each status line** (House Mode name, display lines, alarm name, alarm state).
- **Collapsible alarm section** (a bar with the alarm's state), optional.
- **House Mode button alignment**: standard (fixed columns) or centred across the width.
- **Arm buttons in the House Mode colours** (the House Mode that sets each arm mode); can be turned off.
- **Skip exit delay / Bypass open sensors are chips** under the arm buttons; the ⋮ menu is gone.
- Icons: Disarmed `lock-open-variant`, Custom `lock-percent-open` (alarm section); Local `map-marker-radius` (House
  Mode, also replacing an old automatic icon).

## v2026.11.04.41 — 2026-11-04

- Card header laid out like a button-card header: 48 px icon, 12 px gap, the pair nudged 10 px left, so the text
  sits near the middle of the card (it was about twice as far right).
- New option `show_chevron` (default off): the open / close arrow of a collapsible card. Tapping the header still
  opens and closes it.

## v2026.11.04.40 — 2026-11-04

- **Shield icons** for Disarmed (`shield-lock-open-outline`), Away (`shield-lock`), Stay (`shield-home`) and Vacation
  (`shield-airplane`): the defaults for new, starter and detected modes. Existing modes that still have the old
  automatic icon (shield-off, car, home, airplane) switch over; icons you chose stay.
- Card header: the icon is centred with the text block in real Home Assistant (`ha-icon` is inline there and sat on
  the text baseline), and the "shadow" tag moved to the top-right corner, so the mode name stays centred over the
  panel display.

## v2026.11.04.39 — 2026-11-04

- Dashboard card header: the House Mode icon and text are centred together in the card, with a larger icon, the
  mode name in the panel's monospace style, and the panel display's two lines centred in full brightness. The
  collapse chevron sits at the right edge.
- Test: the card registration is now checked end to end (extra frontend module + file served without login).

## v2026.11.04.38 — 2026-11-04

- **House Modes & Alarm Center Card** ([CARD.md](CARD.md)), served by the integration (no download, no resource):
  `custom:house-modes-alarm-center-card` with a visual editor. Sections, each optional:
  - header: House Mode icon in its colour and name, the panel's 2×16 display, a border for the state (alarm, delay /
    not ready, armed in the mode's colour, ready), collapsible;
  - House Mode buttons with the reason when a change is blocked, not ready or delayed (in Shadow they set your own
    input_select);
  - the alarm: arm / disarm, code, countdown and messages, forked from nielsfaber/alarmo-card 1.6.9 (Apache-2.0,
    elements renamed so an installed alarmo-card keeps working);
  - the physical panel keypad (12 keys with their Vista functions).
- **Panel keypad on dashboards** (Physical Panel tab): off, administrators only (default), chosen users, everyone,
  and keys never sent. New service `alarmo.panel_keypress` checks the logged-in user and logs every press (digits
  hidden); automations are not checked.
- **House Mode colours** (automatic from the name, or chosen).
- **Timers at a clock time** ("at 01:00 → Sleep"), next to "after N minutes".
- `select.alarmo_house_mode` has a `last_result` attribute (blocked / not ready / delayed, with the reason).
- `alarmo/ext/card/get`: card data for every user (modes, colours, panel link entities, keypad permission).

## v2026.11.04.37 — 2026-11-04

- **House Modes list** uses the standard table: icon first, name, partitions, and a pencil (edit / close) and a
  trash can (delete) on the right. The small arrows are gone.
- **Icon picker** for House Modes and scenes: Home Assistant's searchable icon picker where it is available,
  otherwise a box with a live preview. "mdi:" is never needed: `bed` is saved as `mdi:bed` (also when saved through
  the API).
- **Default icons from the mode name** for new, starter and detected modes: Sleep / Night → bed, Away → car,
  Disarmed → shield off, Vacation → airplane, Guest → people, Spa → hot tub, Local → map marker.

## v2026.11.04.36 — 2026-11-04

House Modes Shadow, after the first five days on a real house:

- **A failed arm counts as a match** when Alarmo itself could not arm (open zones): live House Modes would have
  failed the same way. The line names the open zones and the on-failure policy.
- **Overlapping requests are compared once:** when a request follows another within seconds, only the last one is
  compared with your current / previous House Mode entities (before, both were, with opposite results).
- **Shadow lines always reach the Activity log:** a request now opens an Activity sequence when none is open yet
  (schedule and automation requests were often missing there).
- `select.alarmo_house_mode` is now named **House Mode (Alarmo)**, so it is not confused with an existing
  "House Mode" helper in logs and lists. The entity id does not change.

## v2026.10.29.35 — 2026-10-29

- **Detect House Modes** (House Modes tab → Modes → *Detect from your input_selects*):
  - finds the selector, current-mode and previous-mode input_selects (changeable);
  - one House Mode per option, with partitions from the Activity log (majority of what Alarmo was set to each time
    the current-mode entity changed, until the next change, at most 90 s later) or from the name;
  - shows how often each mode was seen, the share, and other states seen; nothing is saved until you press Save, and
    House Modes switch to Shadow if they were off.
- **Current / Previous House Mode entities** (replace Shadow's *Compare with*, which is carried over): Live writes the
  mode names to them; Shadow compares both.

## v2026.10.29.34 — 2026-10-29

- **House Modes: Shadow** (House Modes tab: Off / Shadow / Live). House Modes run next to your own automations and
  change nothing:
  - each request (input_select, `select.alarmo_house_mode`, lock code, timer, delayed request) is checked the way Live
    would handle it (permissions, readiness, partitions, scenes and scripts), then compared with what your
    automations did to the partitions within 3 minutes: ✓ matched, ✗ differed;
  - partitions changed outside House Modes show which House Mode that would be;
  - optional *Compare with*: your own House Mode entity is checked as well;
  - nothing is armed or disarmed, no step runs, no notification or House Mode event is sent, the input_select is
    never written; timers and delays are only logged;
  - *Shadow comparison* card with matched / differed counts; the lines are also on the Activity tab (`[shadow]`);
  - switching to Live keeps the current mode. The status strip shows "· shadow".
- HOUSE-MODES.md: "Try it in shadow first".

## v2026.10.29.33 — 2026-10-29

- **Panel link start-up check.** After a Home Assistant restart, an integration reload or a panel reconnect, Alarmo
  and the physical panel are compared once both have reported and stayed unchanged for 30 s:
  - in step: logged;
  - the panel is disarmed but Alarmo restored an armed state (seen after an unclean restart): Alarmo is disarmed;
  - the panel is armed but Alarmo is not: Alarmo arms the same way (no exit delay, open HA-only zones bypassed);
  - arming, pending or an alarm on either side, or follow-panel off: nothing changes, you are notified;
  - the panel never reports within 5 minutes: you are notified;
  - shadow mode only logs. Normal use (arming, disarming) during the wait cancels the check.
- A restored Alarmo state is no longer sent to the panel as a command, and the panel's first report after
  reconnecting is no longer followed as a keypad action; both go through the start-up check instead.

## v2026.10.29.32 — 2026-10-29

- **Alarm Events run native scenes and scripts**, the same single method as House Modes:
  - a new or migrated Alarm Event picks the scenes and scripts it runs, in order;
  - scripts get the variables `event`, `area` and `arm_mode`.
- **Migrate to scenes and scripts** (Alarm Events tab), for setups coming from Alarmo:
  - shows a plan first: each event becomes a native scene (plain on/off, lock, open/close states) or a native
    script (extra data, sirens, toggles, notify calls…), with the same trigger;
  - makes an integration backup before anything is written;
  - events not yet migrated keep working, and still open with the old controls.
- "New action" is now **New Alarm Event**.

## v2026.10.29.31 — 2026-10-29

- **New House Mode Actions tab.** One overview of every native Home Assistant automation, script and scene that
  belongs to a House Mode, as a grid with one row per item and one column per House Mode, so overlaps show.
  - "Belongs to" is a native **HA label**, `House Mode: <mode>`. One item can belong to several modes, and HA's own
    automation, script and scene lists can be filtered by the same labels.
  - **Suggestions:** automations and scripts that use the House Mode (its `input_select`, the House Mode select or
    the `alarmo_house_mode_changed` event) and name a mode are marked; "Use N suggestions" labels them in one go.
  - Unlock to edit, then tick or untick a mode per item; Save applies the labels. Other labels are kept.
  - Click a name to open it in HA's editor. Automations get an enable switch; every item gets *Run now*. Last run is
    shown.
  - The modes come from the House Modes tab or, while none are defined there, from the House Mode `input_select`.
- **Inside each House Mode** (House Modes tab → open a mode): its automations, scripts and scenes, with links, and
  suggestions marked.
- **Scenes and scripts on House Modes** (House Modes tab → a mode → *Scenes and scripts*):
  - each mode can run native scenes and scripts when **entering** or **leaving** it, **before arming** (e.g. lock up)
    or **after the change** (once it succeeded), optionally only when coming from / going to certain modes;
  - order: the old mode's leaving steps, then the new mode's entering steps;
  - scripts get `from_mode`, `to_mode` and `source`, and can be waited for (up to 5 min);
  - a failing step is notified and logged on the Activity tab, and never stops the change;
  - they run only while House Modes are on in the integration.
- **Scene editor** (House Mode Actions tab → *Scenes*), ported from the Color Light & Scene Manager card:
  - create native HA scenes by capturing entities as they are, then fine-tune each one (lights: on/off, brightness,
    colour or colour temperature, effect, fade; covers, fans, climate, media, locks, switches, selects…);
  - edit, capture again, delete, activate, or open in HA's own scene editor;
  - tick House Modes to label the scene.

- The **Actions** tab is renamed **Alarm Events** (actions on armed, triggered, failed, …). Notifications stays its
  own tab.
- README screenshots: new House Mode Actions shot.

## v2026.10.26.30 — 2026-10-26

- **New version numbers: `YYYY.MM.DD.BUILD`**, the build date (UTC) plus a running build number that never resets.
  It continues the old counter: `1.10.19+ext.29` was build 29, so this is build 30. The Alarmo release it is based on
  is in the README and in every export (`based_on_alarmo: 1.10.19`).
- Release ZIPs are named `house-modes-alarm-center-v<version>.zip`.
- Includes ext.29 (backup before the integration is deleted).

## v1.10.19+ext.29 — 2026-10-26

- **Backup before the integration is deleted.** Deleting Alarmo under *Settings → Devices & services* wipes
  `alarmo.storage` (partitions, zones, users, actions). The configuration and the ext settings are now backed up
  first, as `…_before-integration-removed` in `/config/alarmo/backups/`. After adding the integration again, restore
  it from the Backup tab. If that backup fails, the raw storage files are copied to
  `backups/raw-before-remove_<time>/` instead.
- Installing through HACS as a custom repository (installs from `main`).

## v1.10.19+ext.28 — 2026-10-26

- **Vista Quick Bypass: the panel's own list decides.**
  - When the BYPASS indicator comes on, the zones open at arming (or closed shortly before) are still marked bypassed
    straight away, so mirrors hold.
  - The Vista then lists every bypassed zone ("BYPAS 09", "BYPAS 11", …). Within 25 s, guessed zones it doesn't list
    are un-marked, and the Activity log says so.
  - On 18 Oct the front door, closed 6 s before Quick Bypass, was wrongly marked as bypassed; the panel had not
    bypassed it.
- Build: the ZIP is written to the project's `release/` folder instead of `/shared/user`.

## v1.10.19+ext.27 — 2026-10-12

- **Physical panel link: panel leads arming** (new default; "When Alarmo arms"):
  - Alarmo checks every zone first; nothing is sent if a zone blocks.
  - The arm command goes to the panel the moment Alarmo **starts** arming, not after Alarmo's exit delay.
  - Alarmo counts as armed only once the panel is. If the panel hasn't finished arming within the longer exit delay
    plus the *Extra time for the panel to confirm* (default 10 s), arming fails and the failure policy applies
    (disarm Alarmo + notify).
  - Logged: when the panel started arming, when it was armed, and a hint when Alarmo's exit time is shorter than the
    panel's.
  - **Match Alarmo's exit times…** sets each Arm Mode's exit time to the panel's learned exit delay + 3 s (preview,
    backup first).
  - The old behaviour stays available: "send to the panel after Alarmo's exit delay".
- **Arming at the panel** (keypad, app):
  - Alarmo follows **from the start**: when the panel starts arming, the keypad text ("ARMED ***AWAY***", "STAY",
    "NIGHT") tells the mode and Alarmo arms with its own exit delay. Without a keypad text it follows once armed.
  - **Panel → Alarmo Arm Mode mapping**, e.g. Panel Stay → Alarmo Custom.
  - Open zones the panel doesn't watch are bypassed in Alarmo and you're notified ("Armed Away at the keypad. Not
    protected: Garage Door 2").
- In shadow mode the link observes longer, so your own automations sending later are measured instead of being
  reported as "did not reach".

## v1.10.19+ext.26 — 2026-10-12

From the first recorded logs (10–12 Oct):
- **Mirrors:** the Vista keypad sensor going unavailable (an Envisalink reconnect, seen 10 Oct 22:22) no longer
  clears the bypasses, so mirrors keep holding.
- **Activity:**
  - keypresses keep their command keys and hide only the code (`••••6#`, not `•••••#`), so you can tell Quick Bypass
    from arming;
  - "Alarmo failed to arm: not_allowed" (a second disarm while already disarmed) is now "Alarmo ignored a command"
    and no longer counts as a problem.

## v1.10.19+ext.25 — 2026-10-12

- **Activity recorder fixes:**
  - The Vista keypad sensor scrolls its fault messages ("FAULT 02 …") every few seconds. That kept every sequence
    open until the one-hour limit. Keypad text, zone changes and notifications are still recorded, but no longer
    keep a sequence open; repeated keypad messages are recorded once.
  - Each ext part (panel link, House Modes, locks, recorder) now starts on its own, so an error in one can't stop the
    others.
  - The Activity tab shows the recorder's status: running, entities watched, open sequence, last saved, and any
    error.
  - Automations are listed in a sequence only when they changed something recorded (named as the cause), not every
    time one runs.
  - At most 3 entries per zone per sequence (motion zones).
- Activity tab: **Download all days** (one JSONL file, one sequence per line).

## v1.10.19+ext.24 — 2026-10-10

- **New Activity tab: a sequence recorder.** It only observes; it never changes anything.
  - **What starts a sequence:** a House Mode helper change (`house_mode_selector`, `house_mode`, `house_mode_last`), a
    lock keypad use, an Alarmo or physical panel state change, the panel's BYPASS indicator, an alarm, or a failed arm.
  - **What joins it**, until nothing happens for the *sequence window* (adjustable, 15 s – 30 min, default 2 min; it
    also stays open while an alarm is arming or in its entry delay):
    - the panel keypad text, bypasses detected and mirrors holding;
    - Alarmo zones and mirrors changing;
    - bypass helpers and `alarmo_change_*` helpers;
    - automations that ran;
    - commands to the panel, Alarmo and locks (keypresses masked);
    - notifications sent;
    - the panel link's shadow predictions and timings.
  - Each entry shows the time since the start and its **cause** (which automation or user, from HA's context).
  - Kept in daily files under `/config/alarmo/activity/` (retention adjustable, default 30 days), so it survives
    restarts.
  - Filters by kind, "only problems", search, and a day picker.
  - A daily summary, including how long the panel takes after Alarmo per Arm Mode.
  - Extra entities can be added; codes are never recorded.
- **All activity in one place:** the panel link log and the House Mode history moved to the Activity tab; Physical
  Panel and House Modes link to it.

## v1.10.19+ext.23 — 2026-10-10

- **Vista bypasses are read from the panel itself:** the envisalink_new keypad sensor (`sensor.alarm_partition_1_keypad`).
  - The **BYPASS indicator** (`armed_bypass`) coming on with **Quick Bypass** marks the mirrored zones that were open
    at arming (or closed less than 90 s before) as bypassed, and their mirrors keep showing "open".
  - **"BYPAS zz"** messages on the keypad mark those zones as bypassed too.
  - The indicator going off (disarm) clears them.
  - Survives restarts.
- The bypass helper is now optional and rarely needed. Only use it for a helper that is on exactly while zones are
  bypassed on the panel (`input_boolean.bypass_alarm_zones` is not one: it only asks automations to Quick Bypass).

## v1.10.19+ext.22 — 2026-10-10

- **Writing a user's code to a newly added lock slot now works without retyping the code.** Alarmo keeps only a hash,
  so the code is copied from a linked slot that already holds it. If none does, use *Change code*; the new code is
  written on Save.
  - "Write the user code" button on any slot that doesn't match yet.
  - "Check the locks again" button; after a write the locks are re-checked after a few seconds.
- **Show a user's code:** the eye next to *Code* in the user editor (taken from a linked slot that holds it).
- **Code column** wording: *Slot = User Code*, *Slot ≠ User Code*, *Slot Empty*, *Not readable* (column title "Code").
- **User editor:**
  - the Alarmo settings (what the code can do, partitions, override code) are in the USER section, with no "Alarmo"
    subtitle and no "Advanced" expander;
  - the two keypad action boxes are stacked;
  - the "At the lock" subtitle is removed.

## v1.10.19+ext.21 — 2026-10-10

- **Vista bypass detection fixed**, after reading envisalink_new's source. On Honeywell/Vista panels the zone
  attribute `bypassed`:
  - is set only when the keypad shows "BYPAS zz";
  - reaches the zone entity only with that zone's next update;
  - is never cleared (the clearing code is an unfinished TODO).

  It could therefore mark a zone as bypassed long after the panel had cleared it, so it is now ignored on those
  panels. On a Vista, mirrors learn about bypasses from the **bypass helper** (and from bypasses the panel link sends
  itself). Panel zones shows a warning when a helper is needed and none is set. DSC and other panels still use the
  attribute.

## v1.10.19+ext.20 — 2026-10-10

- **Partitions & Arm Modes:** one tab (old Arm Modes links go there).
- **User editor redesigned:** one card with sections **USER** (name, enabled, code) · **ALARMO** · **LOCKS** ·
  **AT THE LOCK**, and one Save at the bottom.
  - "Allow code for arming / disarming" became one choice: *In Alarmo, this code can* arm and disarm / arm only /
    disarm only / nothing (lock only).
  - "Is override code" moved under Advanced.
  - An admin can **change a code without the old one** ("Change code"); a code another user has is refused.
  - When a keypad action needs a permission the user doesn't have, the warning has an *Allow it* button.
- **Show lock codes:** an eye button per slot (Keypads cards and the user editor) reads that slot's code from the lock
  and shows it for 30 seconds. Admin only; the code is never stored, logged or included in backups.

## v1.10.19+ext.19 — 2026-10-10

- **Mirrors, full-time bypass tracking:**
  - **Bypass helper** (Physical Panel → Panel zones): while a helper such as `input_boolean.bypass_alarm_zones` is
    on, every mirrored zone counts as bypassed and its mirror keeps showing "open" for a window that was open. This
    is the same behaviour as the `templates.yaml` mirrors.
  - Bypasses are tracked for every mirrored zone, with or without a panel link.
  - Bypasses and held states survive an HA restart.
  - A Honeywell `bypassed` attribute that stays true after a disarm no longer re-bypasses the zone (only a change of
    the attribute counts).
- **Users table:** names are no longer cut to "Na…", and rows grow with their content (the fixed row height broke
  multi-line cells).
- **Arm Check:** the walk test is collapsible.

## v1.10.19+ext.18 — 2026-10-10

- **Zone Actions tab removed**; its two parts moved where they belong (old links go to Physical Panel):
  - **Per zone → Zone Assignments**, in the zone editor (›) as *When tripped*: default / set off the alarm / notify
    only / nothing extra. It is shown only for zones the physical panel does not watch; panel zones and their mirrors
    say "the physical panel handles this zone". A zone with its own choice gets an icon in the Options column. It is
    saved with the zones (one Save, same save bar).
  - **Defaults → Physical Panel**, as the card "How HA-only zones raise the alarm" (monitored, siren / relay / panic,
    notify service), with a count of HA-only zones and how many have their own choice.

## v1.10.19+ext.17 — 2026-10-10

- **Panel zones:**
  - the save button sits on its own row under "Create mirror for", and only shows once a zone type is chosen;
  - Cancel undoes the ticks;
  - "In Alarmo" became **Entity in use**: *same*, the mirror's entity ID, or *not in Alarmo*;
  - the panel name is no longer repeated in every row (it shows only with several panels).
- **State column** (was "Now") on Panel zones and Zone Assignments: a coloured icon with the state written under it.
  Panel zones shows **State: Zone / Mirror** side by side.
- **Zone Assignments help** is one zebra-striped row per entry, with easier-to-read text.

## v1.10.19+ext.16 — 2026-10-10

- **Users, Codes, Keypads:** the Codes and Keypads tabs are one tab (old Keypads links go there). From top to bottom:
  - code settings;
  - Users, with "Lock slots" and "At the lock" columns;
  - one collapsible card per lock, with one row per code slot (Alarmo User, code check, what the code does).
- **The user editor opens in place** under the Users header, instead of replacing the page. The same goes for
  Notifications and Actions.
- **Lock slots and keypad actions when creating a user:** add slots, set the actions, and the code is written to the
  slots on Save. Everything saves with the user's Save.
- **Lock-only users:** codes imported from a lock can't arm or disarm Alarmo until allowed. A House Mode keypad action
  only needs an enabled user (each House Mode's *Lock keypad* source setting decides). Partition targets still need
  Can arm / Can disarm.
- **Codes without a user are flagged** on each lock, with "Import N code(s) as lock-only users".
- **Old "code slot → House Mode" table retired:** "Move them to users" turns each entry into a user with that
  unlock action. The entries keep working until then.
- **Physical Panel → Panel zones:**
  - "Create mirror for" (Doors / Windows / Motion) ticks the mirror for every panel zone of that type;
  - "Use the mirrors in Alarmo, remove the panel's real zones" and a button that saves the mirrors, switches the
    existing Alarmo zones to their mirrors (settings kept) and adds the rest to the partition (backup first);
  - always shown, enabled when the table is unlocked.

## v1.10.19+ext.15 — 2026-10-10

- Settings rows on the original Alarmo pages (General, Codes, Partitions, Arm Modes, Notifications, Actions,
  editors): the control now sits right beside its label instead of at the far right.
- Collapsible sections (Keypads locks, Physical Panel links) start collapsed when the page opens.

## v1.10.19+ext.14 — 2026-10-10

- **Zone Mirrors merged into the Physical Panel page** as the "Panel zones" card; the Zone Mirrors tab is gone
  (old links go to Physical Panel). One locked table lists every panel zone:
  - columns: live state, Mirror, While bypassed, In Alarmo (no / as zone / as mirror);
  - selected rows: Add as zones, Add their mirrors, Mirror on/off, Ignore / Stop ignoring.
  - The page explains that mirrors work around a Vista limitation (a bypassed zone stops reporting); DSC panels don't
    need them.
- **Panel zones not in Alarmo are flagged:** "Add all with suggested settings…" puts them on Zone Assignments as
  unsaved drafts (type and Arm Modes guessed from the device class; a mirror is used when it exists), to review and
  Save there. *Ignore* (remembered) keeps keyfob, supervision and unused zone numbers out of that list.
- "Mirror another entity" is its own small card below.

## v1.10.19+ext.13 — 2026-10-10

- **Status strip** above every page:
  - House Mode, each Alarmo alarm's state, and each physical panel link (panel state, Ready, shadow/live, a warning
    when not running);
  - pending zone rule changes and unsaved zone edits;
  - every chip opens the page that deals with it.
- **New Arm Check tab:**
  - *Why won't it arm?* runs Alarmo's own readiness check live, per partition and Arm Mode. It shows the zones that
    block arming and why (open, unavailable, missing), exit-delay and motion notes, auto-bypassed zones, physical panel
    Ready, and House Mode readiness.
  - *Walk test*: open and close each zone and it ticks off, with nothing armed. Always-on zones are left out, with a
    note about the panel's own test mode.
- **Zone Assignments:**
  - "Now" column with each zone's live state; open zones that block arming are red and list the Arm Modes they block;
  - the table no longer stretches: columns hug their content.
- **Layout (design guide):**
  - labels sit right next to their controls everywhere;
  - subtitles (Options, Delays and grouping, Who may change it, Timers, keypad actions) are ALL CAPS in the theme
    accent colour;
  - every number box became a slider with a bold readout. Optional values (entry delay override, delay on, delay out,
    panel delays, backup retention) have a checkbox, and unticked = default;
  - Keypads: each lock section is collapsible;
  - Physical Panel: each link is a collapsible section headed "<Alarmo partition> ⇄ <panel>";
  - House Modes: the page description is always shown again.

## v1.10.19+ext.12 — 2026-10-10

- **Alarmo Users ↔ Z-Wave lock codes** (Keypads tab → "Lock codes ↔ Alarmo Users"):
  - every used slot is listed with its linked user and a code check (same / different / empty / not readable /
    user disabled);
  - one-click import of unlinked slots as users, which links to an existing user when the code is the same;
  - link or unlink per slot;
  - codes are only stored bcrypt-hashed and never sent to the browser;
  - works with code-slot locks (Schlage BE469); User Credential locks are read through `zwave_js.get_users` when
    available.
- **Codes → user:**
  - new "Lock codes and keypad actions" card;
  - a new code is written to the linked slots on save;
  - delete or disable asks whether to clear the slots;
  - the user list shows the number of linked lock slots.
- **Per-user keypad actions:**
  - on unlock and on keypad lock, set a House Mode and/or per-partition targets (targets win for their partitions);
  - checked against the user's Can arm / Can disarm / partition limit;
  - anything not allowed is skipped and notified;
  - new event `alarmo_keypad_used`.
- **Keypad lock without a code** (Schlage button): one action per lock.
- The code slot → House Mode table moved below and is now marked Legacy; it skips slots handled by a linked user.
- House Modes: partition targets set by a keypad action are not counted as an external change. External-change
  tracking now reads the alarm entities' own state, which fixes a race when several partitions change at once.
- Alarmo: several users created in the same second (import) get distinct ids.
- Lock settings are part of backups and exports.

## v1.10.19+ext.11 — 2026-10-10

- **Backups and exports include the ext settings.** House Modes, keypads, physical panel link, zone trip actions,
  mirrors, zone rules and page options are now saved too: as an `extras` block in the YAML export, and as a third
  `.extras.json` file in every backup. Restore/import puts them back (merge mode merges zone rules and overrides). The
  current House Mode, its timers and history are never overwritten. Older files without ext settings leave them as
  they are, and the preview says so.
- **Role chips on every title**, including the original Alarmo pages (General, Partitions, Arm Modes, MQTT, Codes,
  user editor, Notifications, Actions, legacy zone pages).
- **Zones (legacy) tab hidden** unless General → "Show the Zones (legacy) tab" is on.
- **House Modes:** the House Mode and House Mode settings cards are merged; the explanation folds away behind
  "About House Modes".
- **Zone Assignments is slimmer:** arm modes are icon columns, the Partition column is hidden when there is only one
  partition, a compact Options column shows icons, type and partition show as chips while locked, an eye icon
  enables/disables a zone, and all other settings live in a two-column zone editor in the expanded row. Bulk bar:
  Delete from Alarmo / Enable / Disable.
- **Copy settings to…** in the zone editor copies Arm Modes, type, partition and/or options and delays to the selected
  zones, as unsaved changes.
- Line length for the Python code raised to 120 (ruff).

## v1.10.19+ext.10 — 2026-10-10

- **Pages scale with the window:** no fixed page width any more, and wide tables (Zone
  Assignments) scroll sideways inside their section instead of running off the page.
- **No duplicate titles:** the extra intro card above the original Alarmo pages (General,
  Alarmo Partitions, Alarmo Arm Modes, Codes, Notifications, Actions) is gone; their own title and
  description remain (the extra notes were merged into those descriptions). Zones (legacy) keeps a
  one-line note.
- **Renamed:** *Zone Assignments*, *Zone Actions* (was Zones - HA), *Zone Mirrors*; on Zone Actions
  the table is *Per Zone Custom Actions* and the column *Do this when tripped*.

## v1.10.19+ext.9 — 2026-10-10

- **Readability:** section titles no longer overlap their text; the role chip (Settings / Picker /
  Read only / Legacy) is blue and sits to the right of the section title; descriptions are split
  into short paragraphs and bullet lists; tables have proper padding.
- **Entity icons in every table** (Zones - Assignments, Zones - HA, Zones - Mirrors, the physical
  panel zone picker, Add zones, Keypads). Click an icon to open the entity's details (more-info).
  On Zones - Assignments the icon shows the draft state — yellow = edited, green = new, red = to
  be removed — replacing the per-row status icons and change counters.
- **Lock / Unlock:** tables with zone settings (Zones - Assignments, Zones - HA, Zones - Mirrors)
  start locked; click **Unlock to edit** at the top of the table to change anything. Saving locks
  them again. Adding zones unlocks the table so the new zones can be set up right away.

## v1.10.19+ext.8 — 2026-10-09

- **Terms:** the five states are **Arm Modes**; Alarmo's side is **Alarmo** (tabs *Alarmo
  Partitions*, *Alarmo Arm Modes*), the Vista side is **Physical Panel** (tab and all texts, e.g.
  "zones the physical panel does not watch", "Alarmo armed_home → physical panel: …").
- **Design rule:** add buttons are at the top of their section (Zones - Assignments *Add zones*,
  *Add House Mode* / *Add starter modes*, *+ Add timer*, physical panel *Add link*, keypad
  *Add slot*, *Mirror another entity*, and the upstream *Add partition*, *New user*, *New
  notification*, *New action*).
- **Same layout everywhere:** every tab starts with a title and a description with a role chip
  (Settings / Picker / Read only / Legacy); all pages use the same width.
- **Zone rule editor** is a section on the page (no popup); labels, areas and floors are picked
  from a dropdown with a filter box and a **+** button, chosen ones show as removable chips.
- **House Mode settings** (on the House Modes tab): *House Mode input_select entity* (was "Mirror
  an input_select") and **Notifications with several notify services**. The rest of the old
  *Connections & Keypads* tab is now **Keypads**.

## v1.10.19+ext.7 — 2026-10-09

- **Tabs reorganised so each zone page has one job** (every section now says whether it holds
  settings, is a picker, or is read-only):
  - **Zones - Assignments** (was *Zones*): partition, Alarm Panel Modes and options of every zone;
    zone rules.
  - **Zones - HA** (new; was *Zones the panel does not watch* on the Panel tab): what an HA-only
    zone does when it triggers the alarm.
  - **Zones - Mirrors** (new; was part of the Panel tab): one list of all panel zones with a
    checkbox to create/remove the mirror, plus *Mirror another entity*.
  - **Connections & Keypads** (new; was *Connections* on House Modes): input_select mirror,
    notifications, and **Z-Wave locks found automatically** — tick a lock to use it; its used code
    slots are read from the lock (codes are never read) and each gets a House Mode.
  - Panel tab: *Add zones from <panel>* has the selection count and *Add as zones to* at the top.
- Fix: the Partitions card's "N zones" link opens Zones - Assignments filtered to that partition,
  and "N automations" is now "N notifications and M actions" linking to those tabs (the Alarm Panel
  Modes card's "N zones active" link too) — no more links to the legacy pages.
- Second migration file for the author: `configs/alarmo_migrated_one_partition_minimal.yaml`
  (no garage doors, entry delay 0, trigger time 1800 s — closest to the old behaviour).

## v1.10.19+ext.6 — 2026-10-09 (Phases 5 and 6: House Modes and timers)

- **House Modes tab** and `select.alarmo_house_mode`: each mode sets partitions (or "All
  partitions") to an Alarm Panel Mode, Disarm, or leaves them unchanged — a mode may change none
  (House-Modes-only use).
  - **Who may change it:** per mode, which sources may switch *into* it and *out of* it, or delay
    a source (e.g. Spa delays the schedule by 30 min). Sources: manual, automation, schedule,
    presence away/home, lock keypad, alarm panel keypad, timer.
  - **Readiness:** entities or labels that should be closed; warn or block.
  - **If arming fails:** undo, keep what armed, or go to the previous mode.
  - **Timers:** after N minutes go to a mode or back to the previous one; optional "only when
    coming from …" and a time window; they survive restarts and are cancelled by any mode change.
  - Partitions changed directly (keypad, card) update the House Mode to the mode that matches,
    or unknown.
- Service **`alarmo.set_house_mode`** (`mode`, optional `source`, `force`; returns the result).
- **Mirror an input_select** (both ways) for migration; **Z-Wave lock keypads**: code slot → mode.
- Events: `alarmo_house_mode_changed`, `alarmo_house_mode_failed`, `alarmo_house_mode_blocked`.
- Blueprints: *Alarmo House Mode on a schedule*, *Alarmo House Mode on presence*.
- See `HOUSE-MODES.md` for a step-by-step migration of the existing automations.
- `MIGRATION.md`: migrating from upstream Alarmo, including setups with one partition per
  sensor type (merge into one partition, per-zone trip actions and entry delays).

## v1.10.19+ext.5 — 2026-10-09 (Phase 4: panel link)

- **Panel tab:** link an Alarmo alarm (a partition, or All partitions) to a physical alarm panel
  entity (Envisalink or any `alarm_control_panel`).
  - **Shadow** (default): nothing is sent; the Activity log shows what would have been sent and
    whether the panel reached the expected state anyway. **Live**: sends and checks.
  - Alarmo armed/disarmed → panel: HA service or Envisalink keypresses per mode (`{code}` = the
    panel entity's default code), wait for the panel, retry (default 3 × 5 s), then disarm
    Alarmo again (or keep it armed) and notify.
  - Panel keypad arm/disarm → Alarmo follows (loop-protected).
  - Zones Alarmo bypasses (force-arm / auto-bypass) are bypassed on the panel first
    (`{code}6{zone}`), per zone.
  - Learned exit delay per mode; optional panel entry/exit delays for reference.
- **Zones the panel does not watch** (HA-only): when one triggers the alarm, Alarmo also sets
  off the alarm (siren entity, relay, or programmed panic key) — or only notifies if the panel is
  professionally monitored; per-zone exceptions.
- **Mirror zones:** `binary_sensor.<zone>_mirror` for panel zones; holds "open" (or unknown)
  while the zone is bypassed on the panel. "Use mirrors" re-points zones without losing settings.
- **Import panel zones** as Alarmo zones (type and modes from the device class), backed up first.
- Events: `alarmo_ext_panel` (`command_failed`, `triggered`, `ha_zone_trip`).
- New upstream-file change: `__init__.py` forwards/unloads the ext `binary_sensor` platform.

## v1.10.19+ext.4 — 2026-10-09

- **One tab per section:** General | Partitions | Alarm Panel Modes | Zones | Zones (legacy) |
  Codes | Notifications | Actions | Backup. General now only has the general settings;
  Partitions and Alarm Panel Modes have their own tabs; notifications and actions are on
  separate tabs.
- The Zone table is now the **Zones** tab; upstream's zones page is **Zones (legacy)**.
- Old addresses still work (`/alarmo/sensors`, `/alarmo/sensor_table`, the upstream editor links),
  and saving a notification returns to the Notifications tab.
- No change to stored data. New tab titles are English only (other languages show English).

## v1.10.19+ext.3 — 2026-10-09

- **Help for every zone setting.** Hover over a Zone table column title, a checkbox or an
  option in the expanded row to see what it does; the same text is in the rule editor.
  **ⓘ What do these columns mean?** above the table shows all of it in one list (useful on
  touch screens, where hover tooltips don't appear).
- The "Bypass" column is now called **Auto-bypass**.

## v1.10.19+ext.2 — 2026-10-08

New:

- **Terminology (English UI only):** Area → **Partition**, Sensor → **Zone**, Sensor type →
  **Zone type**, Sensor groups → **Cross-zone groups**, Master → **All partitions**,
  Modes → **Alarm Panel Modes** (Home is also shown as "Stay"). Entity IDs, services, storage
  and the other 21 languages are unchanged.
- **Zone rules** (on the Zone table tab): match zones by Home Assistant labels (all of), areas
  (any of) and floors (any of) — including labels and areas set on the device — and set the
  partition, alarm panel modes, zone type or any zone option.
  - Modes from all matching rules add together; for single values the more specific rule
    (more conditions) wins; equally specific rules that disagree are flagged as conflicts and
    not applied.
  - Rule results are never written silently: changes to rules or to HA labels/areas/floors show
    up as "pending rule changes" with a preview. **Apply** backs up first (label `rules`).
  - New entities that match a rule with a partition become zones on Apply. Rules never remove
    zones.
  - Editing a rule-managed field in the zone table becomes a **manual override** (orange icon,
    click to clear). Cells set by a rule show a blue icon with the rule name; conflicts are
    outlined in red.
  - Starter templates: Area → Partition, Perimeter label → Stay/Night/Away/Vacation, Interior
    label → Away/Vacation.
- **Garage doors (covers) and locks can be zones.** A cover that is `opening` or `closing`
  counts as open (one-line change in `sensors.py`). The Add zones picker lists covers and locks;
  they default to the Door zone type.

Compatibility:

- `alarmo.storage` is still storage 6.3 with only upstream fields. Rules and overrides live in
  `.storage/alarmo_extras`, which upstream ignores.
- Edits made in the upstream Zones (Sensors) tab are not recorded as overrides, so a rule may
  list them as pending changes to revert. Use the Zone table for rule-managed zones.

## v1.10.19+ext.1 — 2026-10-08

New:

- **Sensor table** tab: every sensor × area × arm mode in one grid, with type, enabled,
  always-on, entry/exit delay and bypass columns, plus an expandable row for the less-used
  options (allow open, arm on close, trigger when unavailable, entry-delay override, delay on,
  sensor group, bypass modes).
  - Edits are drafts. Changed cells are highlighted with a pencil icon, new rows are green,
    rows to be removed are red and struck through; each row shows its change count and a bar
    shows the total. Nothing is written until **Save**.
  - Save makes a backup first, then applies the whole batch (all-or-nothing).
  - Filters (search, area, mode, type, status), multi-select bulk actions (set area/type,
    add/remove a mode, enable/disable, remove) and an "Add sensors" picker.
  - Unsaved drafts survive leaving the page (kept in the browser session); leaving the tab
    or closing the browser with unsaved changes asks first.
- **Backup** tab: create / download / delete backups, retention setting (default 30 days,
  0 = forever, newest always kept), browser **Export** of the full configuration as YAML,
  and **Import / restore** (upload or pick a saved backup → Merge or Replace → preview of
  every change → apply). Import/restore is refused while any area is armed, arming, pending
  or triggered, and always backs up first.
- Backups are written to `/config/alarmo/backups/` as a date-stamped pair:
  `alarmo_YYYY-MM-DD_HHMMSS[_label].storage.json` (exact copy of `.storage/alarmo.storage`)
  and `….yaml` (full export).
- Service **`alarmo.create_backup`** (admin, optional `label`, can return the backup info).
- All new websocket commands and the service are admin-only (files contain hashed codes).

Compatibility:

- `.storage/alarmo.storage` stays at storage version 6.3 and only ever contains fields
  upstream knows; you can copy the upstream files back at any time.
- New settings live in `.storage/alarmo_extras`; upstream ignores it.
- The upstream Sensors, General, Codes and Actions tabs are unchanged.
