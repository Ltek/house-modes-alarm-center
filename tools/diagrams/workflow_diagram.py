# ruff: noqa: D100, D103, E501, E701, E702, E741, PLR0913
# House Modes & Alarm Center — workflow diagram. Run from the repo root: python3 tools/diagrams/workflow_diagram.py, then node tools/diagrams/render.mjs (PNG).
from html import escape

W, H = 1760, 1440
G, B, O, P, R, GR = '#2e7d32', '#1a3fb5', '#e65100', '#7b3fa0', '#c62828', '#555'
out = []
def t(x, y, s, size=13, color='#222', weight='normal', anchor='middle', style='normal'):
    out.append(f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" font-weight="{weight}" font-style="{style}" text-anchor="{anchor}">{escape(s)}</text>')
def lines(x, y, ls, size=12, color='#222', anchor='middle', gap=16, weight='normal'):
    for i, s in enumerate(ls):
        b = s.startswith('**')
        t(x, y + i * gap, s.strip('*'), size, color, 'bold' if b else weight, anchor)
def rect(x, y, w, h, color, title=None, body=(), rx=6, fill='#fff', thick=2, sub=None, size=12):
    out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{color}" stroke-width="{thick}"/>')
    yy = y + 20
    if title:
        t(x + w / 2, yy, title, 13, '#111', 'bold'); yy += 17
    if sub:
        t(x + w / 2, yy - 2, sub, 11, GR, 'normal', style='italic'); yy += 15
    lines(x + w / 2, yy, body, size)
def listbox(x, y, w, title, items, color, sub=None, row=21):
    h = 34 + (14 if sub else 0) + row * len(items) + 6
    out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#fff" stroke="{color}" stroke-width="2"/>')
    hh = 30 + (14 if sub else 0)
    out.append(f'<line x1="{x}" y1="{y+hh}" x2="{x+w}" y2="{y+hh}" stroke="{color}" stroke-width="1.5"/>')
    t(x + w / 2, y + 19, title, 13, '#111', 'bold')
    if sub: t(x + w / 2, y + 34, sub, 11, GR)
    for i, it in enumerate(items):
        t(x + 10, y + hh + 17 + i * row, it, 12, '#222', anchor='start')
    return h
def chevron(x, y, w, h, color, title, body=()):
    d = 18
    pts = f'{x},{y} {x+w-d},{y} {x+w},{y+h/2} {x+w-d},{y+h} {x},{y+h} {x+d},{y+h/2}'
    out.append(f'<polygon points="{pts}" fill="#fff" stroke="{color}" stroke-width="2"/>')
    t(x + w / 2 + 4, y + 20, title, 12, '#111', 'bold')
    lines(x + w / 2 + 4, y + 37, body, 11)
def ellipse(cx, cy, rx_, ry, color, label, sub=None):
    out.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx_}" ry="{ry}" fill="#fff" stroke="{color}" stroke-width="2"/>')
    t(cx, cy + (0 if sub else 5), label, 13, '#111', 'bold')
    if sub: t(cx, cy + 17, sub, 11, O, 'bold')
def diamond(cx, cy, w, h, color, ls):
    out.append(f'<polygon points="{cx},{cy-h/2} {cx+w/2},{cy} {cx},{cy+h/2} {cx-w/2},{cy}" fill="#fff" stroke="{color}" stroke-width="2"/>')
    lines(cx, cy - (len(ls) - 1) * 7 + 4, ls, 12)
def doc(x, y, w, h, color, title, body=()):
    out.append(f'<path d="M{x},{y} h{w} v{h-10} q-{w/4},-14 -{w/2},0 t-{w/2},0 z" fill="#fff" stroke="{color}" stroke-width="2"/>')
    t(x + w / 2, y + 19, title, 12, '#111', 'bold'); lines(x + w / 2, y + 36, body, 11)
def note(x, y, w, h, ls, color=P):
    out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{h/2 if h < 40 else 12}" fill="#f1e6f7" stroke="{color}" stroke-width="1.2"/>')
    lines(x + w / 2, y + 17, ls, 11, '#4a2560')
def arrow(pts, label=None, color='#333', lx=None, ly=None, lcolor=None, dash=False):
    d = 'M' + ' L'.join(f'{a},{b}' for a, b in pts)
    out.append(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="1.6" {"stroke-dasharray=\"6 4\"" if dash else ""} marker-end="url(#ah)"/>')
    if label:
        if lx is None:
            (x1, y1), (x2, y2) = pts[len(pts)//2 - 1], pts[len(pts)//2]
            lx, ly = (x1 + x2) / 2, (y1 + y2) / 2 - 4
        wl = 7 * len(label) + 8
        out.append(f'<rect x="{lx-wl/2}" y="{ly-12}" width="{wl}" height="16" fill="#fff" opacity="0.9"/>')
        t(lx, ly, label, 11, lcolor or color, 'bold')
def heading(x, y, s):
    t(x, y, s, 17, '#c2185b', 'bold', 'start')

# ============================================================ 1. APP INTERACTIONS (Live)
heading(30, 34, 'APP INTERACTIONS — how the parts connect')

# requests (left)
ellipse(130, 92, 108, 36, G, 'DASHBOARD CARD', None)
t(130, 115, 'House Mode buttons', 11, GR)
chevron(22, 150, 216, 64, G, 'AUTOMATIONS', ['schedule / presence', 'set_house_mode (mode + source)'])
chevron(22, 226, 216, 64, G, 'LOCK KEYPADS', ['Z-Wave user codes', 'per user: House Mode / arm'])
listbox(22, 304, 216, 'House Mode Selector', ['your input_select', '(kept in step both ways)'], G, sub='input_select', row=18)
ellipse(130, 448, 108, 32, O, 'VISTA KEYPAD', None)

# House Modes engine
EX, EY, EW = 300, 58, 330
rect(EX, EY, EW, 448, B, 'HOUSE MODES', sub='integration · one source of truth')
lines(EX + 14, EY + 62, [
    '**1  Who may change it?',
    '   per mode: into / out of / delay, per source',
    '**2  Ready?',
    '   readiness zones or labels → block or warn',
    '**3  "Before" Script Actions',
    '   e.g. Lock up (wait for it if asked)',
    '**4  Set the partitions',
    '   each mode → an Arm Mode per partition',
    '**5  Did they arm?',
    '   on failure: undo · keep · previous',
    '**6  Record',
    '   current · previous · changing to · result',
    '**7  "After" Script Actions',
    '**8  Timers',
    '   after N min · at 01:00 → next mode',
], 12, anchor='start', gap=17)
note(EX + 18, EY + 398, EW - 36, 38, ['Shadow: same checks, nothing changed;', 'compared with your automations'])
for yy in (92, 182, 258, 340):
    arrow([(240 if yy != 92 else 238, yy), (EX, yy)])
arrow([(238, 448), (268, 448), (268, 470), (EX, 470)], 'follow', lx=272, ly=463, color=O)

# outputs of the engine
listbox(EX + 2, 530, 160, 'House Mode entity', ['House Mode select', 'previous · changing_to', 'last_result · since'], B, row=18)
listbox(EX + 172, 530, 158, 'Your helpers', ['House Mode (current)', 'House Mode - Last'], G, sub='input_selects, written', row=18)
arrow([(EX + 80, EY + 448), (EX + 80, 530)])
arrow([(EX + 250, EY + 448), (EX + 250, 530)])

# House Mode -> partitions mapping
listbox(EX + 2, 640, EW - 2, 'House Mode → partitions (examples)', [
    'Disarmed → Master: disarmed', 'Stay / Late Night → Master: Home', 'Sleep → Master: Home (or Night)',
    'Away → Master: Away · Vacation → Vacation', 'Guest / Local → disarmed, Spa → Custom (bypass)'], B, row=18)

# Alarm partitions
AX, AY = 690, 150
rect(AX, AY, 230, 150, B, 'ALARM PARTITIONS', sub='the built-in alarm')
lines(AX + 115, AY + 58, ['zones per Arm Mode', 'exit / entry delay, ready to arm', 'bypass open zones, retries', 'triggered → alarm'], 12)
arrow([(EX + EW, 270), (AX, 270)], 'arm / disarm')
listbox(AX, 330, 230, 'Zones', ['doors · windows · garage', 'indoor / outdoor motion', 'panel zones (mirrors when', '  bypassed on the Vista)', 'fire · water (always on)'], B, sub='Zone Assignments', row=18)
listbox(AX, 506, 230, 'Arm Modes', ['Home · Away · Night', 'Vacation · Custom · Disarmed'], B, row=18)

# Alarm events, notifications
doc(990, 54, 190, 76, B, 'NOTIFICATIONS', ['alarm messages', 'Smart Repeating Alerts'])
rect(990, 140, 190, 70, B, 'ALARM EVENTS', ['armed / disarmed / triggered', '→ Home Assistant scripts'])
arrow([(AX + 230, 180), (990, 100)], 'events', lx=955, ly=126)
arrow([(AX + 230, 190), (990, 175)])

# Native HA scripts / automations
listbox(1220, 58, 210, 'Native scripts & automations', ['Script Actions (from / to mode)', 'Automations - All Modes grid', 'labels "House Mode: …"'], G, sub='Home Assistant', row=18)
arrow([(1180, 175), (1205, 175), (1205, 110), (1220, 110)])
arrow([(EX + EW, 140), (660, 140), (660, 30), (1325, 30), (1325, 58)], 'before / after Script Actions', lx=980, ly=26)

# Panel link
LX, LY = 990, 262
rect(LX, LY, 240, 182, B, 'PANEL LINK', sub='Alarm ⇄ physical panel')
lines(LX + 120, LY + 58, ['Alarm arming → send at once', '(panel leads: one exit delay)', 'retries · failure: disarm + notify',
                          'keypad arm / disarm → follow', 'start-up check after a restart', 'bypasses re-sent before arming'], 11, gap=17)
arrow([(AX + 230, 255), (LX, 300)], 'state', lx=955, ly=270)
arrow([(LX, 380), (AX + 230, 290)], 'follow keypad', lx=950, ly=340, color=O)

ellipse(1470, 352, 126, 44, '#222', 'Envisalink', 'Vista 20P panel')
arrow([(LX + 240, 330), (1344, 340)], 'keys / service', lx=1290, ly=326)
arrow([(1344, 368), (LX + 240, 390)], 'state · zones', lx=1290, ly=396, color=O)

# Dashboard card (output)
rect(1290, 470, 260, 132, G, 'DASHBOARD CARD', sub='House Modes & Alarm Center Card')
lines(1420, 524, ['Status sections · House Mode / arm buttons', 'Button Menus (in place or popup) · History', 'panel keypad → panel_keypress service',
                  '(who may press: integration setting)'], 11)
arrow([(EX + 330, 600), (960, 600), (960, 625), (1240, 625), (1240, 560), (1290, 560)], 'shows', lx=1100, ly=621)
arrow([(1470, 396), (1470, 470)], 'display', lx=1500, ly=440, color=O)

# Activity
doc(990, 466, 240, 96, B, 'ACTIVITY', ['every sequence: House Mode, alarm,', 'panel, locks, causes', 'Arm Check: why won\'t it arm?'])

# key
out.append('<rect x="1590" y="62" width="160" height="116" fill="#fff" stroke="#999" stroke-width="1.5"/>'); t(1670, 82, 'KEY', 13, '#111', 'bold')
t(1600, 108, 'GREEN  Home Assistant', 11, G, 'bold', 'start')
t(1600, 126, 'BLUE   this integration', 11, B, 'bold', 'start')
t(1600, 144, 'ORANGE physical panel', 11, O, 'bold', 'start')
t(1600, 162, 'PURPLE note', 11, P, 'bold', 'start')

# ============================================================ 2. HOUSE MODE CHANGE LOGIC
Y0 = 790
heading(30, Y0, 'HOUSE MODE CHANGE — what happens to one request')
ellipse(110, Y0 + 70, 86, 32, G, 'REQUEST', None); t(110, Y0 + 92, 'mode + source', 11, GR)
diamond(310, Y0 + 70, 170, 80, '#333', ['Same as the', 'current mode?'])
ellipse(1640, Y0 + 70, 70, 28, '#333', 'DONE')
arrow([(196, Y0 + 70), (225, Y0 + 70)])
arrow([(310, Y0 + 30), (310, Y0 + 14), (1640, Y0 + 14), (1640, Y0 + 42)], 'YES — nothing to do', lx=900, ly=Y0 + 10)

diamond(310, Y0 + 210, 170, 90, '#333', ['May this source', 'change it?'])
arrow([(310, Y0 + 110), (310, Y0 + 165)], 'NO', lx=330, ly=Y0 + 142)
rect(470, Y0 + 180, 200, 60, R, 'BLOCKED', ['card says why · event · log', 'mode unchanged → done'], size=11)
arrow([(395, Y0 + 210), (470, Y0 + 210)], 'no', lcolor=R)
rect(470, Y0 + 262, 200, 60, P, 'DELAYED', ['waits N min, then the request', 'starts again (as a new request)'], size=11)
arrow([(330, Y0 + 245), (330, Y0 + 292), (470, Y0 + 292)], 'delay', lx=380, ly=Y0 + 288)

diamond(860, Y0 + 210, 160, 90, '#333', ['Readiness', 'zones closed?'])
arrow([(310, Y0 + 255), (310, Y0 + 270), (450, Y0 + 270), (450, Y0 + 250), (720, Y0 + 250), (720, Y0 + 210), (780, Y0 + 210)], 'yes', lx=740, ly=Y0 + 205)
rect(780, Y0 + 290, 160, 56, R, 'NOT READY', ['"block": stop, notify', 'mode unchanged → done'], size=11)
arrow([(860, Y0 + 255), (860, Y0 + 290)], 'open', lx=885, ly=Y0 + 278, lcolor=R)

diamond(1070, Y0 + 210, 150, 80, '#333', ['Shadow?'])
arrow([(940, Y0 + 210), (995, Y0 + 210)], 'ok / warn', lx=966, ly=Y0 + 204)
rect(990, Y0 + 290, 160, 74, P, 'SHADOW', ['logs "would set …",', 'compares with your', 'automations (3 min) → done'], size=11)
arrow([(1070, Y0 + 250), (1070, Y0 + 290)], 'yes', lx=1090, ly=Y0 + 278)

# live path
rect(1200, Y0 + 170, 190, 80, B, '"BEFORE" STEPS', ['Script Actions', 'e.g. lock up first'], size=11)
arrow([(1145, Y0 + 210), (1200, Y0 + 210)], 'Live', lx=1172, ly=Y0 + 204)
rect(1430, Y0 + 170, 200, 80, B, 'SET THE PARTITIONS', ['the alarm arms / disarms', 'panel link → Vista (retries)'], size=11)
arrow([(1390, Y0 + 210), (1430, Y0 + 210)])
diamond(1530, Y0 + 360, 170, 90, '#333', ['Partitions', 'reached the mode?'])
arrow([(1530, Y0 + 250), (1530, Y0 + 315)])

rect(1190, Y0 + 460, 230, 112, B, 'RECORD', ['previous = current', 'current = new mode', 'write your helpers', 'card · events · Activity'], size=11)
arrow([(1530, Y0 + 405), (1530, Y0 + 516), (1420, Y0 + 516)], 'YES', lx=1555, ly=Y0 + 470)
rect(900, Y0 + 460, 230, 112, B, 'AFTER THE CHANGE', ['"after" Script Actions', 'timers start (after N min,', 'at a clock time)', 'e.g. Late Night → Sleep 01:00'], size=11)
arrow([(1190, Y0 + 516), (1130, Y0 + 516)])
arrow([(900, Y0 + 516), (860, Y0 + 516), (860, Y0 + 610), (1640, Y0 + 610), (1640, Y0 + 98)], lx=1300, ly=Y0 + 605)
rect(1610, Y0 + 300, 130, 120, R, 'FAILED', ['on failure:', 'undo · keep ·', 'previous mode', '+ notify'], size=11)
arrow([(1600, Y0 + 360), (1610, Y0 + 360)], 'NO', lx=1600, ly=Y0 + 352, lcolor=R)
arrow([(1675, Y0 + 300), (1675, Y0 + 98)], '→ done', lx=1712, ly=Y0 + 200)
note(30, Y0 + 400, 520, 100, ['The same flow for every source: dashboard card, your selector, schedule and',
                              'presence automations, lock codes, timers. Sources are checked per mode, e.g.',
                              '"Schedule may not leave Late Night" keeps the 23:30 Sleep schedule out.',
                              'Exit delays: the panel link sends at once (panel leads), so there is one delay.',
                              'Shadow first: House Modes only log what they would do; switch to Live when they match.'])

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Segoe UI, Roboto, Arial, sans-serif">
<defs><marker id="ah" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 z" fill="#333"/></marker></defs>
<rect width="100%" height="100%" fill="#fff"/>
{chr(10).join(out)}
</svg>'''
open(__import__('sys').argv[1] if len(__import__('sys').argv) > 1 else 'docs/diagrams/workflow.svg', 'w').write(svg)
