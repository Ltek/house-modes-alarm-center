# Migrating from upstream Alarmo to the ext build

The ext build reads your existing Alarmo configuration as-is: installing it changes nothing
until you use the new pages. This guide covers what to change afterwards, so the new features
(Zone Assignments, zone rules, panel link, House Modes) work well.

Before any of the steps: **Backup tab → Create backup** (label e.g. `before-migration`).
Every save on the new pages also makes a backup first, and **Import / restore** can put any of
them back.

## 1. Every install

1. **Check the Zone Assignments tab.** It shows all your zones with their partition and Arm Modes.
   Nothing has moved; the old page is still there as *Zones (legacy)*.
2. **Garage doors and locks** (cover and lock entities) can now be zones: Zones → Add zones.
   A cover that is opening or closing counts as open.
3. **Optional: zone rules.** Put HA labels on your entities (e.g. `alarm_window`,
   `alarm_interior_motion`) and add rules on the Zone Assignments tab so new sensors get the right modes
   automatically. Rules only change zones when you click Apply.
4. **Optional: physical panel.** Physical Panel tab → link it in **shadow** mode first (see INSTALL-EXT.md
   section 3d).
5. **Optional: House Modes.** See HOUSE-MODES.md.

## 2. If you used partitions to group sensors (one partition per sensor type)

In upstream Alarmo some people (this repository's author included) made one partition per
sensor type — Doors, Windows, Indoor Motion, Outdoor Motion, Fire … — and armed them together
with the *All partitions* (Master) entity, so a whole group could be turned off or treated
differently. That is no longer needed:

| What the partition did | Now |
|---|---|
| Which modes a group is active in | Each zone has its own Arm Modes (Zone Assignments; or a label + zone rule) |
| Turning a whole group off | Zone Assignments → filter by type/label → select → Disable (or Remove mode) |
| Different behaviour for outdoor motion | **Zone Assignments** → open the zone (›) → *When tripped*: notify only / set off the alarm / nothing |
| Different delays for a group | Per zone: entry delay override and *Delay on* (expanded row on Zone Assignments) |
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
   - **Exit delay:** the longest one your old partitions had per mode (Alarmo zones that only HA
     watches, like Zigbee motion, need it to let you leave). With a physical panel, keep it short:
     the panel link sends the arm command when Alarmo is armed, so it adds to the panel's own.
   - **Entry delay:** your panel's entry delay (30 s if unknown); it only applies to zones with
     *Use entry delay* (doors, motion), not to windows or smoke.
   - **Trigger time:** 0 keeps Alarmo triggered until it is disarmed.
3. **Zone Assignments → select all → Set partition → (the new partition) → Save.** Each zone keeps its own modes and
   options; only the partition changes.
4. **Per-zone settings that the old partition used to give** (expanded row on Zone Assignments):
   - zones you come in through that the panel does not watch (garage motion, garage doors):
     *Entry delay override* = your panel's entry delay;
   - outdoor motion: **Zone Assignments** → open the zone → *When tripped* → *notify only*.
5. **Check every old partition shows 0 zones**, then delete them on the Partitions & Arm Modes tab.
   Deleting a partition also deletes its zones and its notifications/actions — that is why the
   zones move first.
6. **The *All partitions* (Master) entity disappears** once only one partition is left. Alarmo
   derives a partition's entity ID from its name and re-creates it whenever Alarmo reloads, so
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
- 21 `template_window_real_zone_*` zones → **Physical Panel → Panel zones**: Unlock, tick Mirror for Vista zones 9–32 → Save → **Use mirrors in Alarmo**
  (keeps their settings); until then set their trip action to *nothing extra*, because Alarmo
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

## 3. Going back to upstream

Your `alarmo.storage` stays in upstream's format, so copying the original files back works at
any time (INSTALL-EXT.md section 4). The merged partition stays merged — use a backup from before
the migration (Backup tab → Restore) first if you want the old partitions back.
