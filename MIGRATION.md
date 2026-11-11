# Moving over from Alarmo

This integration has its own domain (`house_modes`), folder (`custom_components/house_modes`) and storage file
(`.storage/house_modes`). It installs **next to** Alarmo, whether that is upstream Alarmo or the Alarmo-based build of
this integration (domain `alarmo`, up to v2026.11.10.93). Nothing of Alarmo is changed: its files are only read, once,
when you choose **Import**.

What stays where:

| | Alarmo (left as it is) | House Modes & Alarm Center |
|---|---|---|
| Integration | `custom_components/alarmo/` | `custom_components/house_modes/` |
| Configuration | `.storage/alarmo.storage`, `.storage/alarmo_extras` | `.storage/house_modes` (one file) |
| Activity, backups | `/config/alarmo/activity/`, `/config/alarmo/backups/` | `/config/house_modes/…` (copied on import) |
| Services, events | `alarmo.arm`, `alarmo_house_mode_changed`, … | `house_modes.arm`, `house_modes_house_mode_changed`, … |
| House Mode select | `select.alarmo_house_mode` | `select.house_mode` |
| Panel | sidebar *Alarmo* (`/alarmo`) | sidebar *House Modes & Alarm Center* (`/house_modes`) |
| Alarm entities | `alarm_control_panel.<partition>` | the same ids (once Alarmo is disabled) |

## 1. Cut-over

**Never run both at once.** Two alarms arming the same partitions, and two panel links sending keypresses to the same
Vista, is what this order prevents. While the Alarmo entry is enabled, this integration keeps its panel link in Shadow
(nothing is sent), does not take over entity ids, and refuses the import; the status strip says *Alarmo is still
enabled*.

1. **Disarm**, and make a backup in Alarmo (its Backup tab → Create backup) and a full Home Assistant backup.
2. Install this integration (README → Install) and restart. Do not add it yet.
3. **Disable Alarmo:** Settings → Devices & services → Alarmo → ⋮ → **Disable**. (Disable, not Delete: deleting wipes
   its configuration.) Its alarm entities go away; its mirror zones become unavailable.
4. **Add House Modes & Alarm Center** (Settings → Devices & services → Add integration) and open it from the sidebar.
   Quick Start opens on **Import from Alarmo?** with what was found and the counts (partitions, zones, users, House
   Modes, panel links, mirrors, …).
5. **Import.** It copies the configuration (user codes as they are: hashed), rewrites service, event and entity names
   in it, and copies `/config/alarmo/activity/` and `/config/alarmo/backups/` to `/config/house_modes/`. A backup of
   the empty start is made first. The alarm entities come back with their ids (`alarm_control_panel.master` stays
   `alarm_control_panel.master`); the mirror zones take over the old mirror ids.
6. **Alarmo names in your own configuration:** Quick Start (or Backup tab → *Import from Alarmo*) → **Scan** lists
   every `alarmo.set_house_mode`, `alarmo.panel_keypress`, `alarmo_house_mode_changed`, `select.alarmo_house_mode`, …
   in your automations, scripts, templates, blueprints and dashboards, line by line. **Rewrite** changes exactly
   those (a copy of each file and dashboard is kept in `/config/house_modes/backups/references_<date>/`) and reloads
   automations and scripts. Your own helpers whose names contain `alarmo` (e.g. `input_boolean.alarmo_change_away`)
   are left as they are. `custom:alarmo-card` on a dashboard is listed but not changed: use
   `custom:house-modes-alarm-center-card`.
7. **Check, in this order, before any Away:**
   - [ ] the House Mode is the one you were in (`select.house_mode`), and the History is there;
   - [ ] one **disarm + arm** from the panel or the card, with a user code; a wrong code is refused;
   - [ ] the **physical panel keypad**: arm and disarm at it, and the alarm follows;
   - [ ] the panel link's mode (Physical Panel tab) is what it was (Shadow or Live), and its log shows the arm/disarm;
   - [ ] **Activity** for an hour: House Mode changes, the alarm and the panel, with nothing unexpected;
   - [ ] notifications and Alarm Events still fire.

   No Away until this cycle works.

"Start fresh" instead of Import sets up an empty configuration. The Backup tab keeps **Import from Alarmo** while the
old files exist, so it can be changed later (importing then replaces the current configuration, after a backup).

## 2. Going back to Alarmo

At any time, while the old files are still there:

1. If you used **Rewrite** (step 6): Backup tab → *Import from Alarmo* → **Undo the rewrite** puts your automations,
   scripts and dashboards back.
2. **Disable** House Modes & Alarm Center (Settings → Devices & services → ⋮ → Disable). Its mirror zones give their
   entity ids back to Alarmo's.
3. **Enable** Alarmo again and reload the browser.

Alarmo starts exactly as it was before step 3 of the cut-over: none of its files were changed. Re-enable this
integration only after Alarmo is disabled again.

## 3. Removing Alarmo for good

Only after a few stable days, and with a fresh backup of `.storage/alarmo.storage`, `.storage/alarmo_extras` and
`/config/alarmo/` kept somewhere safe: delete the Alarmo integration entry, then remove `custom_components/alarmo/`
(HACS → Alarmo → Remove) and those files. After that, going back to Alarmo means restoring them first.

## 4. If you used partitions to group sensors (one partition per sensor type)

In Alarmo some people (this repository's author included) made one partition per
sensor type — Doors, Windows, Indoor Motion, Outdoor Motion, Fire … — and armed them together
with the *All partitions* (Master) entity, so a whole group could be turned off or treated
differently. That is no longer needed:

| What the partition did | Now |
|---|---|
| Which modes a group is active in | Each zone has its own Arm Modes (Zones; or a label + zone rule) |
| Turning a whole group off | Zones → filter by type/label → select → Disable (or Remove mode) |
| Different behaviour for outdoor motion | **Zones** → open the zone (›) → *When tripped*: notify only / set off the alarm / nothing |
| Different delays for a group | Per zone: entry delay override and *Delay on* (expanded row on Zones) |
| One notification per group | One partition → one set of notifications |

Why merge: partitions are meant for parts of a building that are **armed separately**. With
type-partitions, delays depend on the group (e.g. windows silently using the motion
partition's delays), arming waits for the slowest group, you need one notification per group,
and a physical panel or House Mode has to drive many partitions instead of one.

### Steps

1. **Backup** (see above).
2. **Partitions & Arm Modes tab → create one partition** and enable every Arm Mode you use.
   **Name it `Master`** if your automations use `alarm_control_panel.master` (see step 6).
   Delays:
   - **Exit delay:** the longest one your old partitions had per mode (zones that only HA
     watches, like Zigbee motion, need it to let you leave). With a physical panel, keep it short:
     with *send to the panel after the alarm's exit delay* the two delays add up; the default (*panel leads*)
     uses one.
   - **Entry delay:** your panel's entry delay (30 s if unknown); it only applies to zones with
     *Use entry delay* (doors, motion), not to windows or smoke.
   - **Trigger time:** 0 keeps the alarm triggered until it is disarmed.
3. **Zones → select all → Set partition → (the new partition) → Save.** Each zone keeps its own modes and
   options; only the partition changes.
4. **Per-zone settings that the old partition used to give** (expanded row on Zones):
   - zones you come in through that the panel does not watch (garage motion, garage doors):
     *Entry delay override* = your panel's entry delay;
   - outdoor motion: **Zones** → open the zone → *When tripped* → *notify only*.
5. **Check every old partition shows 0 zones**, then delete them on the Partitions & Arm Modes tab.
   Deleting a partition also deletes its zones and its notifications/actions — that is why the
   zones move first.
6. **The *All partitions* (Master) entity disappears** once only one partition is left. The
   integration derives a partition's entity ID from its name and re-creates it whenever it reloads, so
   changing the entity ID in HA's entity settings does **not** last. Name the partition `Master`
   instead: its entity is then `alarm_control_panel.master`, so automations keep working.
7. **Re-create notifications/actions** that were on the Master or on the old partitions (Armed,
   Disarmed, Failed to arm, Triggered) on the new partition.
8. **Panel link:** if it was linked to *All partitions*, remove that link and link the new
   partition instead. (If you link a panel only after migrating, just link the new partition.)

### The author's setup as an example

Vista 20P via Envisalink, 8 type-partitions (Indoor Motion, Doors, Windows, Locks, Outdoor
Motion - Back, Outdoor Motion - Front, Fire, Garage Motion), all armed through Master:

- one partition named **Master** (→ `alarm_control_panel.master`); exit delay Away 20 s,
  Home/Night/Custom 10 s, Vacation 0 (what arming took before); entry delay 30 s; trigger time 0;
- a ready-made import file does all of the zone/partition/notification changes:
  `configs/alarmo_migrated_one_partition.yaml` (Backup tab → Import / restore → upload →
  **Replace** → preview → apply);
- 21 `template_window_real_zone_*` zones → **Physical Panel → Panel zones**: Unlock, tick Mirror for Vista zones 9–32 → Save → **Use mirrors as zones**
  (keeps their settings); until then set their trip action to *nothing extra*, because the alarm
  can't tell they are panel zones;
- `binary_sensor.alarm_partition_1_fire` (the Vista's own fire status) → trip action *notify only*;
- outdoor motion (decks, patio, front entry) → *notify only*;
- `garage_motion_group` uses the partition's 30 s entry delay (time the Vista's and adjust);
- `cover.gdo1_garage_door` / `cover.gdo2_garage_door` added as Door zones (Away/Home/Night/Vacation);
- patio door (no Custom) and mudroom door (no Home) keep their own modes — nothing to do;
- the 8 *Failed : <partition>* notifications go away with their partitions; keep one *Failed*
  notification on Master; the three `alarmo_change_*` actions go when House Modes take over.

**Finding your panel's entry delay:** it is in the panel's installer programming. If you don't
know it, time it: arm Away, wait for the exit delay to end, open the entry door and count the
seconds until the alarm sounds (disarm right away). Until then 20 s is a safe guess for the
override; too short only means an HA-only entry zone may sound before you reach the keypad.

