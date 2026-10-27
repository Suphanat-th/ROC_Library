# ROC Library

A collection of helper tools for players of Ragnarok Online Classic (ROC): calculators, guides, and lookups.

## Language

**Tool**:
One self-contained helper page aimed at a single player task, such as a calculator, guide, or search.
_Avoid_: Feature, module, app

**Shell**:
The frame shared by every Tool: the Navbar, the Sidebar, and the content area that holds the active Tool.
_Avoid_: Layout, wrapper, chrome

**Home slider**:
The banners at the top of the home page, one poster per event or Scroll, looping on their own and pausing under the pointer. Each poster keeps its event's own colours in both Theme modes, and its text and pictures are built from the same files as the event's page, so a new round of an event or a new Scroll needs no change to the slider. Order: Monster x3, 5th Anniversary, Libra Scroll, Festa Scroll. They are never hidden by date.
_Avoid_: Carousel, hero, ad

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

**Costume preview**:
A window on the Patch Convert page, opened by the "สวมใส่" button (a shirt icon) beside the name of a costume item, that shows the item worn on one standard character (a Novice with one hairstyle), male or female. The player can turn the character through 8 directions, pick one of the two Poses, and pause or resume the motion; the item plays its own effect exactly as its sprite file animates. The button appears only for items that have sprite files. It is on screen only and never appears in the downloaded Item card picture.
_Avoid_: Try-on, 3D preview, fitting room, panel

**Pose**:
One of the two motions the Costume preview offers: Idle or Sit. Both are held still (their frames only turn the head). An item with one effect of its own, such as Cons of Poison, keeps playing that effect whatever the direction or Pose.
_Avoid_: Action, animation, stance

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
The Tool where a player can voluntarily support the developer by transferring money through the bank QR code or account number shown there. It promises no perks and shows no list of donors. Below the account details it lists two Facebook Contact links (the developer and the page หมากัดหมวด) that open in a new tab. It is reached from the Navbar heart button and from the Sidebar.
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

**ATK calculator**:
The Tool where a player enters their Status, weapon and bonuses to see the Min, Max and Average damage of one normal attack. It leaves out skill-specific rules, and the target's DEF is a field that starts at 0 and is not yet applied. The entered values stay in the player's own browser, with a reset button.
_Avoid_: Damage calculator, DPS tool

**Status ATK**:
The attack power that comes from the character's Base Level, STR, DEX and LUK, worked out differently for a melee attack and a ranged attack. The game window shows half of what is really counted, so it is counted twice. It receives only the Level 3 multipliers and the skill's % damage.
_Avoid_: Base ATK, stat damage

**Weapon ATK**:
The attack power that comes from the equipped weapon: its Base Weapon ATK, a bonus from STR (or DEX for ranged weapons), a random Variance, and the bonus from Refine. The game window shows only the Base Weapon ATK and the Refine bonus, so the real value is higher. It receives the Level 1, 2 and 3 multipliers and the size penalty of the weapon.
_Avoid_: Equip ATK, gear damage

**Equip ATK**:
Attack power that comes from anything other than the weapon itself: other equipment, consumables, ammunition such as arrows and bullets, buffs from items and skills, and special weapon properties such as "every x refine". It behaves like Weapon ATK except it carries no size penalty.
_Avoid_: Flat ATK, gear ATK

**Mastery ATK**:
Attack power from job Mastery skills, some skill buffs such as Camouflage, and Blacksmith Star Crumbs. It ignores element and receives only the Level 3 multipliers and the skill's % damage.
_Avoid_: Skill ATK

**ATK multiplier**:
A % bonus that raises attack power under a stated condition, in three Levels. Level 1 is the %ATK group. Level 2 is the race, size, element and monster type group. Level 3 is the %melee / %ranged and %Critical damage / %Hit physical damage group, also called Final multipliers. A skill's % damage is not an ATK multiplier.
_Avoid_: Damage bonus, buff %

**Final ATK**:
The attack power after the Weapon ATK, Equip ATK, Status ATK, Mastery ATK and all three Levels of ATK multiplier are combined. It is what skill formulas, %reduction and DEF work on afterwards.
_Avoid_: Total ATK, damage

**Map viewer**:
The shared view that shows one game map's terrain in 3D, which the player can rotate, tilt and zoom with mouse or fingers. Each map gets its own page that opens the same Map viewer. It can colour the ground by height or light, and can overlay which cells are walkable. It shows the ground and the still objects placed on it, such as buildings, walls and trees, in the real-surface mode; the black map shows the ground only. It is lit the way the map's file says (colour and direction of the light), so a night map looks dark; a switch brings back an even bright light. Water, effects, sounds and animation are not shown.
_Avoid_: Map page, 3D map

**Hint map**:
A Map viewer page that also carries a dungeon's guide under the map: how to enter, the route, the monsters and the rewards. Jittlebug is the first. Positions of doors, boss rooms and NPCs are not shown until they are recorded.
_Avoid_: Dungeon page, guide page

**Warp**:
A way to move the player to another place, either in the same map or to another map: a portal the player walks onto, or an NPC the player talks to. It is recorded with where it stands, where it leads, and the NPC's name when it is an NPC.
_Avoid_: Portal, teleport

**GND**:
The map's ground file, holding the terrain's shape, light and the names of its ground pictures. It names the pictures but does not contain them.
_Avoid_: Ground map, terrain file

**GAT**:
The map's walkability file, saying for each cell whether a character can stand on it. Its cells are half the size of a GND cell.
_Avoid_: Collision map, walk map

**Scroll**:
A random item draw for one in-game event, such as Festa 2026, with a fixed list of Prizes. Each Row of a Roll draws one Prize from it. Players call one "ไข่" (egg), and the site offers every Scroll it knows, one at a time, through the Scroll picker.
_Avoid_: Gacha, case, box, egg (in code and docs; "ไข่" is only the players' word)

**Scroll picker**:
The dropdown at the top of the Random Scroll page for choosing which Scroll to simulate; the closed button and every row show the Scroll's picture, title and number of Prizes. It is always shown, even while the site holds a single Scroll, and the choice is kept in the page address so a link opens the same Scroll. Choosing another Scroll starts clean: the Roll history, the running Row count and any Announcement are cleared.
_Avoid_: Scroll menu, egg selector, card row

**Prize**:
One in-game item that a Scroll can give, with its name, picture, quantity per draw, Tier and drop rate in %. The rates are shown as the game publishes them and may not add up to 100%; a draw is weighted by their proportions either way.
_Avoid_: Reward, loot, drop

**5th Anniversary page**:
The Tool that presents the 5th Anniversary event on a main page of three numbered sections (the Chapter map, the Recurring quests, and a way into the Rewards page) plus a separate Rewards page with a link back. It follows the project's orange-and-cream poster look in both Theme modes, and animates only when the player has not asked for reduced motion.
_Avoid_: Landing page, event page

**Hero**:
The poster-style top block of the 5th Anniversary page: the event title, links to each section, and the Floating art.
_Avoid_: Banner, header (alone)

**Floating art**:
The decorative pictures (balloon, gift, ticket, coin, star, streamer, party hat, clouds) composed in one picture beside the Hero's title, floating and shifting as the page scrolls. They are the site's own drawings and carry no information. The same drawings also mark the cost and place in the Exchange notes and the Quest cards.
_Avoid_: Stickers, sprites

**Rewards page**:
The separate page of the 5th Anniversary Tool, at its own address, where the player exchanges for Anniversary rewards: server choice, Exchange notes, the rewards by Reward type, Picked rewards and their summary. The main page reaches it through a big Rewards card, and the page links back to the main page at its top and its bottom.
_Avoid_: Shop page, store

**Chapter map**:
The start of the 5th Anniversary page: one drawn continent split into six regions that share their borders, one per town, in two rows: I II III over IV V VI. Each region has its own colour and emblem (or a "?" while its Chapter is hidden). Pointing at a region (or tapping or focusing it) lifts it and opens its Chapter; clicking it opens the Chapter quest in a window. The Hero and the older Event info sections are kept aside to return later. It is different from the Map viewer, which shows a game map in 3D.
_Avoid_: World map, Map viewer

**Location window**:
The window a player gets by pressing a map coordinate such as prt_q 156 188: the game map in 3D with a pin and a pulsing ring on that spot, the camera flown over it. A Chapter's box coordinates can also be opened all at once: every pin is numbered, and buttons fly to one of them or take them all in. It shows no walkable overlay. If the map's files are not on the site yet, it says so and gives the coordinate in words.
_Avoid_: Map popup, minimap

**Chapter quest**:
The quest of one Chapter, as the game words it: what kind of quest it is (kill, collect, answer questions, find boxes), its Quest tasks, and where it ends. Chapter VI lists the six coordinates of its boxes. The game's own title of a Chapter quest can differ from the story title shown on the map.
_Avoid_: Mission, chapter task

**Quest task**:
One thing a quest asks the player to do: kill a monster, collect an item, answer questions, or find a place, with how many and, for items, which monster drops it.
_Avoid_: Objective, step

**Recurring quests**:
The Daily and Weekly quests of the event side by side, and the World quest on its own row below, all under the Chapter map. Daily quests must be reported again after one day. The World quest is two linked quests. Dragon Cataclysm is a personal hunt of 50 Hydrolancer, once every four days, that pays Black Soul and Jam Pancake. The World Event adds up every Dragon Cataclysm quest handed in by the whole server; at 555, 5,555 and 55,555 every player gets a reward (the Buffer User, then World Fruit and Echo Stone every day).
_Avoid_: Side quests

**Chapter**:
One of the six story parts of the 5th Anniversary event, one per town, numbered I to VI. Each has an English name, a Thai name, a short passage and a closing line. A Chapter whose picture is not revealed yet shows a "?" box.
_Avoid_: Stage, episode, Quest

**Event info section**:
A titled block of the 5th Anniversary page that explains one part of the event. The Chapters of the six towns (Izlude, Payon, Alberta, Geffen, Morroc, Prontera) are stops along a zigzag path, one card each; the Daily, Weekly and World Quests are three big coloured cards. They show "collecting data" until the content is entered.
_Avoid_: Panel, tab

**Anniversary reward**:
One in-game item given for the 5th Anniversary event. Each server (Baphomet, Moonlight) has its own set, shown on its own tab of the 5th Anniversary page, grouped by Reward type. Its name, picture and Item card come from that server's reward data. Thai: ของรางวัลฉลองครบรอบ.
_Avoid_: Prize (that is a Scroll's), loot, drop, Item Reward

**Reward type**:
The kind of equipment an Anniversary reward is: Header Gear (headgear and helms) or Accessory (everything else). It is read from the item's own "ประเภท" line, and a type with no rewards is hidden.
_Avoid_: Category, slot

**Exchange notes**:
The three things a player must know before exchanging for an Anniversary reward: it costs one [NFS] Gacha Ticket and 1,000,000 Zeny per exchange, and it is done at the NPC Dr.Time in Invaded Prontera (prt_q 139 182). They are the same for both servers and shown on the 5th Anniversary page above the server choice.
_Avoid_: Requirements, instructions

**Exchange cost**:
What one exchange of an Anniversary reward costs: one [NFS] Gacha Ticket and 1,000,000 Zeny, the same for every reward. The player chooses which reward to exchange for; it is not random.
_Avoid_: Price, gacha rate

**Picked reward**:
An Anniversary reward the player has added on the 5th Anniversary page to see what the whole set would cost. A reward can be picked more than once, each pick being one more exchange. A bar at the bottom of the screen shows the running total, and a Summary opens a window listing each picked reward with its count and the total Exchange cost. Picks are cleared when the player switches server, and nothing is bought or saved.
_Avoid_: Cart, selection, order

**Reward search**:
The search box each Reward type has beside its title. It filters that type's Anniversary rewards while the player types, by part of the item name and ignoring upper/lower case, and shows how many matched out of the total. It is cleared when the player switches server.
_Avoid_: Filter, global search

**Tier**:
The rarity grade of a Prize, from rarest to commonest: SSR, SR, R, A, B, C, E. Each Tier has its own colour; R is violet because the theme has no spare colour for it.
_Avoid_: Rank, grade, rarity

**Roll**:
One press of the draw button, which spins every Row together at the chosen speed (Fast, 3 seconds, or Normal, 5 seconds) and gives one Prize per Row.
_Avoid_: Spin (alone), pull, open

**Row**:
One strip of a Roll that slides and stops on one Prize. A Roll has 1, 5, 10, 20, 50, 100, 500 or 1000 Rows, each drawn independently of the others. At most 10 Rows are shown at once; a bigger Roll runs on its own in rounds of 10 until every Row is drawn.
_Avoid_: Reel, lane, line

**Roll history**:
The Prizes drawn since the player opened the page, grouped into one line per Prize with how many times it came up, rarest first (lowest drop rate on top). It is cleared when the player leaves or reloads the page.
_Avoid_: Log, record

**Announcement**:
The congratulation card shown when a Prize flagged for it is drawn, naming the Prize and its running Row number since the page opened (for example Row 8,253, counted across every Roll). It floats at the top-right under the Navbar, newest on top, and stays until the player closes it.
_Avoid_: Popup, banner, notification

**Theme mode**:
The visual mode the player has chosen: light or dark. Light is the default until the player picks one.
_Avoid_: Color scheme, skin

**Navigation feedback**:
What the Shell shows while moving from one Tool to another, so the site never looks frozen.
_Avoid_: Loader, spinner, loading screen
