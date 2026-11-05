# House Modes & Alarm Center Card

A dashboard card for the House Mode, the Alarmo alarm and the physical panel's keypad. It comes with the integration:
no separate HACS download and no dashboard resource. After an update, reload the browser.

```yaml
type: custom:house-modes-alarm-center-card
entity: alarm_control_panel.master     # the Alarmo alarm (partition) for the alarm section
```

Or *Edit dashboard → Add card → House Modes & Alarm Center Card*; every option is in the visual editor.

## Sections

Each one can be turned off.

- **Header** — the House Mode's icon in its color and its name, and the physical panel's 2×16 display (when a panel
  link has a keypad sensor). The border is the House Mode's color (or, with `border_color: state`, the alarm state). "shadow" while House Modes run in Shadow. Long-press (right-click) opens the
  panel display's details.
- **House Mode buttons** — one per House Mode, with the icon and color from the House Modes tab. When a change is
  blocked, not ready or delayed, the card says why ("Away not set: open Front Door"). In Shadow the buttons set your
  own House Mode input_select, so your automations stay in charge.
- **Alarm** — Alarmo's arm / disarm buttons, code entry, countdown and messages (from nielsfaber/alarmo-card).
- **Physical panel keypad** — the panel's 12 keys with their functions (OFF, AWAY, STAY, MAX, …), sent through
  `alarmo.panel_keypress`.

## Options

Everything below is in the visual editor (*Card*, *Sections*, *Header*, *House Mode buttons*, *Alarm*, *Physical
panel keypad*). Only options you change are written to the YAML.

| Option | Default | |
|---|---|---|
| `entity` | first linked alarm | Alarmo `alarm_control_panel` for the alarm section and the panel link |
| `name` | | Title when House Modes are off |
| **Sections** (*Sections* panel) | | |
| `show_header`, `show_house_modes`, `show_alarm` / `show_panel_keypad` | `true` / `false` | Turn a section on or off |
| `collapsible` / `start_collapsed` | `false` / `true` | Header: the whole card folds to the header (tap it) |
| `modes_collapsible`, `alarm_collapsible`, `keypad_collapsible` | `false` | The section sits behind a bar that opens and closes it |
| `modes_start_collapsed`, `alarm_start_collapsed`, `keypad_start_collapsed` | `true` | |
| `show_chevron` | `false` | The open / close arrow on the header and the bars |
| **Show / hide**, per set | `true` | |
| header | | `show_header_icon`, `show_mode_name`, `show_line1`, `show_line2` |
| House Mode buttons | | `show_mode_icons`, `show_mode_labels` |
| alarm | | `show_alarm_icon`, `show_alarm_name`, `show_alarm_state`, `show_arm_icons`, `show_arm_labels`, `show_arm_options` (the chips) |
| keypad | | `show_key_labels` (OFF, AWAY, …) |
| **Layout** | | |
| `modes_align` | `grid` | `grid`: fixed columns, the last row wraps left; `center`: every row centered across the width |
| `columns` | `5` | House Mode buttons per row (2–9) |
| `modes_shape`, `arm_shape` | `rounded` | `rounded` rectangles, or `round`: a circle around each icon with the text below |
| `modes_width`, `arm_width` | `fill` | `fill`: the buttons share the width; `fit`: as wide as their content, centered (the space setting is then the distance between them) |
| `modes_gap`, `arm_gap` | `4` / `0` | Space between the House Mode buttons / the arm buttons, px |
| `modes_padding`, `arm_padding` | `6` / `8` | Inner padding of the buttons, px |
| `keypad_shape` | `rounded` | `round` keys |
| `key_flash` | | `{border: <color>, background: <color>}`: a pressed key glows / flashes for 500 ms |
| `border_color` | `mode` | `mode`: the House Mode's color, always; `state`: red alarm, orange arming / not ready, the mode's color while armed, green ready |
| `header_countdown` | `false` | The countdown circle in place of the header icon during an exit or entry delay |
| `mode_colors` | | Card-only House Mode colors: `{stay: "#ff9800"}` |
| `arm_colors` | | Per arm mode: `{disarmed: "house:guest", armed_away: "#f44336"}` (`house:<id>` = that House Mode's color) |
| `hidden_modes` | | House Modes (id or name) without a button |
| `alarm_colors` | `modes` | Arm mode colors (arm buttons, alarm bar, the `mode` keyword): `modes` = the House Mode that sets each arm mode, `standard` = green disarmed / red away / orange home / …, `theme` = Home Assistant's alarm state colors |
| `keypad_labels` | Vista | e.g. `{"6": "BYP"}` |
| `display_strip` | | Characters stripped from both ends of each panel display line, e.g. `"*"` (****DISARMED**** → DISARMED) |
| `display_replace` | | Text replaced in the display lines, in order, after stripping: `[{from: "DISARMED", to: "Disarmed"}]` (`to` empty = remove) |
| `effects` | | Glow / pulse while something is under way, see below |
| `alarm` | | alarmo-card options: `keep_keypad_visible`, `use_code_dialog`, `hide_keypad`, `show_messages`, `show_ready_indicator`, `show_bypassed_sensors`, `button_scale_actions`, `button_scale_keypad`, `states` |
| `styles` | | Per element, see below |

### Styles

```yaml
styles:
  mode_name: { size: 26, weight: 600, font: sans, italic: false, caps: true, color: var(--accent-color) }
  mode_icon: { size: 40, color: mode, active_color: "#ffffff" }
  mode_button: { background: transparent, border: mode, active_background: mode, text_follows_icon: true }
  card: { border_width: 2, radius: 12 }
```

- **Text** (`size` px, `weight` 300–800, `font` `monospace` / `sans` / `serif`, `italic`, `caps`, `color`):
  `mode_name`, `line1`, `line2`, `mode_label`, `alarm_bar`, `alarm_name`, `alarm_state`, `alarm_button`, `chip`,
  `key_digit`, `key_label`.
- **Icons** (`size`; `color` for `header_icon`; `color` and `active_color` for `mode_icon` and `alarm_icon`).
- **Buttons** (`mode_button`, `arm_button`): `background`, `active_background`, `border`, `active_border`,
  `text_follows_icon`; `arm_button.track` is the bar behind the arm buttons.
- Color keywords: `mode` (each button's own House Mode / arm mode color), `transparent`, `none` (borders).
- The editor's **Style** choice sets a whole look at once: *Filled*, *Outline when selected*, *Outline, all in color*,
  *Colored icon when selected*; then fine-tune.
- **Frame and backgrounds**: `card.border_width`, `card.radius`, `card.background` (the default for every
  section); `header_section`, `modes_section`, `alarm_section`, `keypad_section` each take a `background`.
- Colors: `#rrggbb`, a theme color `var(--…)`, or any CSS color. Unset keys keep the card's defaults.

### Effects

```yaml
effects:
  card: { border: both, background: glow }        # none / glow / pulse / both, per part
  status_icon: { icon: glow }
  mode_button: { background: pulse, border: glow, icon: pulse }   # the House Mode being changed to
  arm_button: { border: both, icon: glow }        # the arm mode being set
  when: [arming, entry, changing, triggered]     # default: all four
  size: 16              # glow size, px
  speed: 1.6            # pulse period, s
  color: var(--warning-color)   # card and status icon; default: the border's state color
```

- *arming*: Alarmo or the physical panel counts down the exit delay; *entry*: the entry delay; *changing*: a House
  Mode change is being applied, waits (delayed request) or, in Shadow, is being watched; *triggered*: an alarm.
- Buttons glow and pulse in their own House Mode / arm mode color.
- The editor's *Preview the effects now* shows them without waiting for the real thing (not saved).
- Respects the system's reduced-motion setting. Settings saved by v2026.11.05.46–.47 (`border: glow` …) still work.

## Without House Modes, without a panel, in Shadow

- **House Modes off** (or none set up): no House Mode buttons; the header shows the alarm instead — its state icon in
  the arm mode color and the alarm's state (or `name`).
- **No physical panel link**: the header has no display lines, the keypad section is not shown, and the border uses
  the alarm's state only. Everything else works.
- **Shadow**: House Mode buttons set your own House Mode input_select, so your automations stay in charge. Without one,
  they ask House Modes, which only log what they would do: the card then says *"Shadow: House Modes would set Stay;
  nothing was changed"*. The alarm section always arms and disarms Alarmo itself. With the panel link in Shadow,
  Alarmo does not pass that on to the panel (your automations do). The panel keypad always sends straight to the
  panel, checked against *Panel keypad on dashboards*.

## Who may use the panel keypad

Physical Panel tab → **Panel keypad on dashboards**: off, administrators only (default), administrators and chosen
users, or everyone, plus keys that are never sent (e.g. `6`, bypass). The card shows the keys to everyone and
disables them for users who may not use them. Every press is in the Activity log (who, and the keys with digits
hidden).

This limits the card and the `alarmo.panel_keypress` service, not Home Assistant: a logged-in user can still call
`envisalink_new.alarm_keypress` directly. The panel code stays the real protection. Automations that call
`alarmo.panel_keypress` are not checked.

## Replacing a button-card / expander-card setup

The card replaces an expander-card + button-card + layout-card + card_mod combination: the header is the title card,
the House Mode buttons are the grid, the keypad is the key grid. House Mode icons and colors move to the House Modes
tab (open a mode with the pencil); a `sensor.*_border_color` template is no longer needed.

Credits: the alarm section is forked from [alarmo-card](https://github.com/nielsfaber/alarmo-card) © Niels Faber,
Apache License 2.0 (`custom_components/alarmo/frontend/card/LICENSE-alarmo-card`).
