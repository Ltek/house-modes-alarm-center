# House Modes — setup and migrating your automations

House Modes live on the **House Modes** tab and in `select.alarmo_house_mode`.
Automations change the mode with `alarmo.set_house_mode` (`mode`, `source`); Alarmo decides
whether that is allowed, arms/disarms the partitions, handles failures and timers. Lights,
locks, curtains, cameras and the water main stay in your own automations.

## 1. Create the modes

**Quickest: detect them.** House Modes tab → *Modes* → **Detect from your input_selects**:

- it finds your selector (manual choice), current-mode and previous-mode input_selects (change them in the drop-downs);
- one House Mode per option; the partitions come from the Activity log (what Alarmo was set to each time your
  current-mode entity changed), or from the mode's name when it never appears there (Away → Away, Sleep → Night, …);
- *also seen* shows other states the partitions were in for that mode (for example Custom when Stay ran with bypasses);
- tick the ones you want → **Use**: they go into the draft with the three entities, and House Modes switch to Shadow if
  they were off. Check them, then **Save**.

Or create them by hand:


House Modes tab → **Add starter modes** (Disarmed, Stay, Sleep, Away, Vacation, Guest, Local,
Spa), add **Late Night** (Arm Mode Home), then adjust:

| Mode | Partitions | Into this mode | Out of this mode | Other |
|---|---|---|---|---|
| Disarmed | Disarm | all | all | timers below |
| Stay | Home (Stay) | all | all | |
| Late Night | Home (Stay) | all | all | keep the 23:30 schedule automation's condition "not Late Night" |
| Sleep | Night | all | all but *presence: everyone left* | |
| Away | Away | all | all but *schedule* | |
| Vacation | Vacation | all | only manual, presence home, lock, keypad | |
| Guest | Disarm | all | all but *presence: everyone left*; *schedule* delayed 1 min | |
| Local | Disarm | **manual only** | all but *presence: everyone left* | |
| Spa | Custom | **manual only** | all; *schedule* delayed 30 min | timer 45 min → previous mode |

Mode names must match the options of `input_select.house_mode_selector` if you mirror it.

**Timers that replace "House Modes : 10 min Rearm"** (window 20:30–05:00):

- on *Disarmed*: after 10 min → Stay, only when coming from Stay, Late Night or Away;
  a second timer after 10 min → Sleep, only when coming from Sleep;
- on *Stay*: after 10 min → Sleep, only when coming from Sleep.

## Try it in shadow first

On the **House Modes** tab choose **Shadow** (instead of Off or Live) and save. House Modes then run next to your own
automations and change nothing:

- every request (your input_select, `select.alarmo_house_mode`, a lock code, a timer) is checked the way Live would
  handle it: who may change the mode, readiness, which partitions it would set, which scenes and scripts would run;
- then it is compared with what your automations really did to the partitions within 3 minutes: **✓** they ended
  where House Modes would have, **✗** they differ (blocked or not ready but changed anyway, or never got there);
- partitions changed outside House Modes (keypad, Alarmo card) show which House Mode that would be;
- *Compare with* (shown in Shadow): your own House Mode entity, e.g. `input_select.house_mode`, is checked too;
- nothing is armed or disarmed, no scene or script runs, no notification or House Mode event is sent, and the
  input_select is never written. Timers and delayed requests are only logged (in memory).

The results are in the *Shadow comparison* card and, marked `[shadow]`, on the Activity tab. When the ✗ lines are
explained, switch to **Live** (the current mode is kept) and disable the automations in step 3.

## 2. Keep your dashboards working while you migrate

*Current House Mode entity* and *Previous House Mode entity* (e.g. `input_select.house_mode` and
`input_select.house_mode_last`): in Live, House Modes write the mode names to them (previous first), so automations
and dashboards that use them keep working; in Shadow they are compared with what House Modes would have set.

**House Modes** tab → *House Mode settings* → **House Mode input_select entity** = `input_select.house_mode_selector`, Save. Changing the
input_select now goes through Alarmo, and Alarmo writes its mode back to it.

## 3. Replace automations (disable, don't delete, until you are happy)

| Your automation | Replaced by |
|---|---|
| House Modes 1 : Selector set → wait for Alarmo → set helpers | House Modes (the select / mirror) |
| House Modes 3 : Alarmo Failed to Arm, Retry | Panel link retries + failure policy |
| House Mode 2 : Alarmo set → set Panel | Panel link (live) |
| House Modes : Panel Disarms → Disarm Selector | Panel link "follow keypad" + mode tracking |
| House Modes : 10 min Rearm | Timers (above) |
| House Mode - Spa (the 45-min revert part) | Spa timer; keep the lights/curtain part |
| House Modes Trigger - Time | Blueprint *Alarmo House Mode on a schedule* (one per time; source schedule) |
| House Mode change when All Away | Blueprint *Alarmo House Mode on presence* (away part) — keep extra presence checks (e.g. a phone-off sensor) as conditions if needed |
| House Modes - Disarm when returning home | Blueprint (home part) → Disarmed; keep the lights/unlock part in your automation |
| Lock keypad part of the lock-status automation | **Keypads** tab → tick both locks (found automatically) → slots 1, 2 = Disarmed; 3, 4, 6, 8 = Guest |
| `input_boolean.alarmo_change_*` and the three Alarmo actions that set them | not needed (events `alarmo_house_mode_changed` / `_failed`) |

Keep (re-point the trigger from `input_select.house_mode` to `select.alarmo_house_mode`):
*House Mode change - Basic Actions & Notifications*, *House Modes - Lighting Changes*,
*House Mode - Spa* (lights/curtain), *House Mode change - Last Duration*, *House Mode Away or
Vacation - Force All People Not Home*.

Blueprints are in `blueprints/automation/alarmo/` in the ZIP: copy them to
`/config/blueprints/automation/alarmo/` and reload automations.

## Sources

`manual` (dashboard / a person), `automation` (anything else without a source), `schedule`,
`presence_away`, `presence_home`, `lock`, `panel_keypad`, `timer`. If an automation does not pass
`source`, it counts as `automation`.

## Lock codes and keypad actions

Everything is on one tab, **Users, Codes, Keypads**. From top to bottom: the code settings, the Users table, and one
collapsible card per Z-Wave lock with one row per code slot.

- **A code slot belongs to an Alarmo User.** When the code is used at the lock, that user's keypad actions run.
- **Keypad actions:** *when this code unlocks* and *when this code locks*. Each one sets a House Mode, Alarmo
  partition targets (Away / Home / Night / … / Disarm), or both. Partition targets win over the House Mode for those
  partitions.
  - A House Mode only needs the user to be enabled. Whether a lock keypad may change the House Mode is decided per
    House Mode, in its "Who may change it" table (source *Lock keypad*).
  - Partition targets need *Can arm* / *Can disarm* and the user's partition limit.
- **Lock-only users.** Codes imported from a lock become lock-only users: they cannot arm or disarm Alarmo itself
  until you turn on Can arm / Can disarm. They still switch House Modes from the lock.
- **Codes without a user** are flagged on each lock card: "Import N code(s) as lock-only users". A code that is
  already an Alarmo User's code is linked to that user instead of creating a duplicate.
- **Code** compares the slot's code with the user's code (*Slot = User Code*, *Slot Empty*, …). Alarmo stores codes only bcrypt-hashed. The eye
  button shows one slot's code for 30 seconds, read from the lock at that moment (admin only, never stored).
- **The user editor** (Add user, or click a user) opens in place under the Users header.
  - *Lock codes and keypad actions*: add lock slots, set the keypad actions, and choose whether the user's code is
    written to the linked slots on Save.
  - This works when creating a user too.
  - Deleting or disabling a user asks whether to clear its slots.
- **Keypad lock without a code** (the Schlage outside button): one action per lock, on its card.
- **The old "code slot → House Mode" settings** still work until you click **Move them to users** on the Keypads card.
  Each slot then gets a lock-only user (or the user with the same code) with that House Mode as its unlock action.
  A slot whose code can't be read gets a stand-in code that never works in Alarmo, until you set the real one.
- Every keypad use fires `alarmo_keypad_used` (entity_id, operation, slot, user_id, user_name, house_mode, targets,
  denied).
- **Adding a slot to an existing user:** on Save (or with *Write the user code*), the code is copied from a linked slot
  that already holds it, since Alarmo only keeps a hash. If no slot holds it, set it with *Change code*.
