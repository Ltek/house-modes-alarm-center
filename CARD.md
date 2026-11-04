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

- **Header** — the House Mode's icon in its colour and its name, and the physical panel's 2×16 display (when a panel
  link has a keypad sensor). The border shows the state: red alarm, orange arming / entry delay / not ready, the House
  Mode's colour while armed, green ready. "shadow" while House Modes run in Shadow. Long-press (right-click) opens the
  panel display's details.
- **House Mode buttons** — one per House Mode, with the icon and colour from the House Modes tab. When a change is
  blocked, not ready or delayed, the card says why ("Away not set: open Front Door"). In Shadow the buttons set your
  own House Mode input_select, so your automations stay in charge.
- **Alarm** — Alarmo's arm / disarm buttons, code entry, countdown and messages (from nielsfaber/alarmo-card).
- **Physical panel keypad** — the panel's 12 keys with their functions (OFF, AWAY, STAY, MAX, …), sent through
  `alarmo.panel_keypress`.

## Options

| Option | Default | |
|---|---|---|
| `entity` | first Alarmo alarm | Alarmo `alarm_control_panel` for the alarm section and the panel link |
| `name` | | Title when House Modes are off |
| `show_header`, `show_house_modes`, `show_alarm` | `true` | |
| `show_panel_keypad` | `false` | |
| `collapsible` / `start_collapsed` | `false` / `true` | Tap the header to open or close |
| `show_chevron` | `false` | The open / close arrow at the right of the header (when collapsible) |
| `columns` | `5` | House Mode buttons per row (2–9) |
| `hidden_modes` | | House Modes (id or name) without a button |
| `keypad_labels` | Vista | e.g. `{"6": "BYP"}` |
| `alarm` | | alarmo-card options: `keep_keypad_visible`, `use_code_dialog`, `hide_keypad`, `show_messages`, `show_ready_indicator`, `show_bypassed_sensors`, `button_scale_actions`, `button_scale_keypad`, `states` |

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
the House Mode buttons are the grid, the keypad is the key grid. House Mode icons and colours move to the House Modes
tab (open a mode with the pencil); a `sensor.*_border_color` template is no longer needed.

Credits: the alarm section is forked from [alarmo-card](https://github.com/nielsfaber/alarmo-card) © Niels Faber,
Apache License 2.0 (`custom_components/alarmo/frontend/card/LICENSE-alarmo-card`).
