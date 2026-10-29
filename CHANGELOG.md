# Changelog — Alarmo "ext" build

Private build on top of upstream [nielsfaber/alarmo](https://github.com/nielsfaber/alarmo)
v1.10.19 (main @ `47b31a6`). Upstream's own history is in its GitHub releases.

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
