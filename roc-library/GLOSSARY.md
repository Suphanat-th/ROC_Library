# ROC Library

A collection of helper tools for players of Ragnarok Online Classic (ROC): calculators, guides, and lookups.

## Language

**Tool**:
One self-contained helper page aimed at a single player task, such as a calculator, guide, or search.
_Avoid_: Feature, module, app

**Shell**:
The frame shared by every Tool: the Navbar, the Sidebar, and the content area that holds the active Tool.
_Avoid_: Layout, wrapper, chrome

**Navbar**:
The bar across the top of the Shell. It stays fixed to the top-left of the screen while the content scrolls, with the Menu toggle at the far left and the Theme mode control at the far right.
_Avoid_: Header, topbar, sidebar

**Sidebar**:
The menu panel listing every Tool. It slides over the content from the left only when the player opens it, stays fixed on screen while the content scrolls, and closes itself once a Tool is chosen.
_Avoid_: Drawer, side menu, navbar

**Menu toggle**:
The hamburger button at the far left of the Navbar that opens and closes the Sidebar.
_Avoid_: Hamburger, burger, drawer button

**Item card**:
One item's tooltip (name, picture, options, description) laid out as a card that the player can download as a PNG to share. It always uses the light look, whichever Theme mode the player has chosen, so the downloaded picture is the same every time.
_Avoid_: Tooltip, item sheet

**MUAD**:
The page that shows the equipment set of the character หมากัดหมวด, as a normal set or as a costume/shadow set, with an Item card for each piece.
_Avoid_: Showcase page, gear page

**Central Laboratory**:
The in-game dungeon that the Central Lab Tool covers. Entering it needs the day's Entry code, and it is played in three Stages after a Mini Boss.
_Avoid_: Cenlab, lab (alone)

**Light code**:
The day's code shown as 8 lamps, each lit or dark, which the player copies in the dungeon. It is worked out from the date in Thailand time (GMT+7) and changes at 00:00.
_Avoid_: Binary code, switch code

**Entry code**:
The same day's code as a decimal number, used to enter the Central Laboratory. It always matches the Light code of that date.
_Avoid_: Access code, daily code (alone)

**Stage**:
One of the three timed rounds inside the Central Laboratory (Stage 1–3), each with its own countdown and its own set of monsters. The Mini Boss round is listed with the Stages but is not timed.
_Avoid_: Round, wave, level

**Server Info**:
The panel on the home page that tells the player the state of the server right now: whether it is on or in maintenance, and the current Rate for EXP, DROP and DEATH with the Rate events behind each.
_Avoid_: Server status, status page

**Rate**:
One of the three server multipliers the player cares about: EXP, DROP, or DEATH. EXP and DROP are better the higher they are; DEATH is the share of the death penalty that remains, so lower is better.
_Avoid_: Multiplier, boost (alone)

**Rate event**:
A temporary change to one Rate that runs between a start and an end time (Thailand time), on top of the Base rate. An event that has not started yet is shown as upcoming; one that has ended is not shown.
_Avoid_: Promotion, buff, campaign

**Base rate**:
The Rate the server always has, 100% for each of EXP, DROP and DEATH, before any Rate event.
_Avoid_: Default rate, normal rate

**Maintenance window**:
The period when the server is down for maintenance, so the player cannot log in. It repeats every Wednesday 06:00–14:00 (Thailand time); one-off windows can be added for special dates.
_Avoid_: Downtime, server off

**Donate page**:
The Tool where a player can voluntarily support the developer by transferring money through the bank QR code or account number shown there. It promises no perks and shows no list of donors. It is reached from the Navbar heart button and from the Sidebar.
_Avoid_: Support page, payment page

**Donor**:
A player who has transferred money on the Donate page, thanked collectively and never listed by name. Thai: ผู้ร่วมสนับสนุน.
_Avoid_: Supporter, sponsor

**Supporter**:
A guild whose logo is shown at the bottom of the Sidebar for backing the site. It is a different thing from a Donor.
_Avoid_: Donor, sponsor

**Visit tracking**:
Google Analytics 4 counting visits and page views on every Tool. It runs only on the live production site, never during development or on preview deployments, and it asks the player for no consent and records no custom events.
_Avoid_: Analytics (alone), GA, stats

**Theme mode**:
The visual mode the player has chosen: light or dark. Light is the default until the player picks one.
_Avoid_: Color scheme, skin

**Navigation feedback**:
What the Shell shows while moving from one Tool to another, so the site never looks frozen.
_Avoid_: Loader, spinner, loading screen
