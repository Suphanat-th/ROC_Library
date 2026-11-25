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
The banners at the top of the home page, one poster per event or Scroll, looping on their own and pausing under the pointer. Each poster keeps its event's own colours in both Theme modes, and its text and pictures are built from the same files as the event's page, so a new round of an event or a new Scroll needs no change to the slider. Order: Monster x3, 5th Anniversary, Libra Scroll, Festa Scroll, Zodiac Capricorn Scroll, Taurus Crown Scroll. They are never hidden by date.
_Avoid_: Carousel, hero, ad

**Monster x3**:
The recurring event that multiplies the EXP and JOB of listed monsters by 3. It runs in Rounds, each with its own period and its own monster list.
_Avoid_: Triple EXP, tipple monster

**Round**:
One run of Monster x3, as announced: a start, an end, and each listed monster with its area and normal EXP and JOB. A new announcement is a new Round, even when some monsters repeat.
_Avoid_: Season, batch

**Bot key page**:
The owner-only page at /botgeneratekey that issues a License Key for the botRedm Bot from the Machine ID its user sends, with an optional name and number of days (empty means permanent). It is in no menu or link and is kept out of search engines, and what really protects it is an admin password; the signing key never leaves the server. Keys it issues are the same as the desktop key generator's, so the Bot accepts them unchanged. Every key it issues is first saved in the **Key record** (Supabase); if the save fails no key is given out, so the record is always complete. The page lists all past keys from the record and can download them as a CSV; "clear list" only hides them on screen.
_Avoid_: Keygen page, admin page

**Key record**:
The permanent list of every License Key the Bot key page has issued: when, Machine ID, name, days, the key itself and its expiry. Kept in Supabase and readable only through the Bot key page after the admin password.
_Avoid_: Log, history, key database

**Feedback page**:
The Tool at /say-something, reached from the Sidebar as "บอกเรา", where any player can send the developer a message: an optional name (or Anonymous, which keeps no name at all) and a message of 5 to 1,000 characters. Each message is saved in Supabase and read by the owner there; the page shows the sender only a thank-you and has no list of messages. It limits each address to 3 messages per 10 minutes.
_Avoid_: Contact page, suggestion box

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
One item's tooltip (name, picture, options, description) laid out as a card that the player can download as a PNG to share. It always uses the light look, whichever Theme mode the player has chosen, so the downloaded picture looks the same whichever mode they browse in. When the item has an Item change, its description carries the Change note marks, and the download shows them too.
_Avoid_: Tooltip, item sheet

**Card illustration**:
The large artwork of a monster card, shown in the game when the player right-clicks the card. Each card has its own, unlike its small inventory picture, which is the same blank card for every card. An item counts as a card when the game lists an illustration for it, not because its name says "Card".
_Avoid_: Card image, card picture, Item card (that is the tooltip card)

**Item change**:
What a Patch alters in an item that already existed: a line of its description, its name, or another of its values, as opposed to a New item. Shown for every item the Patch marks as modified that has such a record.
_Avoid_: Diff, update, edit

**Change note**:
How an Item change shows on the Patch Convert page: in the Item card's description the old words are struck through and the new words highlighted green (a line rewritten almost in full is struck and highlighted whole), and a Removed line stays visible, struck. Changed values the card does not show sit in a box below it, which is on screen only and not in the download.
_Avoid_: Change list, changelog

**Patch key**:
The key in the Patch Convert address (`?Key=`) that opens the page for players once the week's patch notes go out. It changes every week. Without a right key the page says access denied everywhere except on the owner's own computer.
_Avoid_: Password, token

**Member key**:
The second key that opens Patch Convert, given to Members. It never changes, so a Member can look at any week's patch on any day. It opens only that page, nothing in the dev tools.
_Avoid_: Bypass key, master key

**Item card banner**:
The advertisement picture at the foot of an Item card, which players call "สปอน". Together with the logo before the item name it always comes with the downloaded picture, on every device. It is not a Supporter or a Donor.
_Avoid_: Sponsor, ad, Supporter

**Costume preview**:
A window on the Patch Convert page, opened by the "สวมใส่" button (a shirt icon) beside the name of a wearable item, that shows the item worn on one standard character (a Novice with one hairstyle), male or female. The player can turn the character through 8 directions, pick one of the three Poses, and pause or resume the motion; the item plays its own effect exactly as its sprite file animates. A headgear sits on the head; a Robe falls in front of or behind the body as the game draws it for that direction; a Hat effect plays around the character; a Footprint is left on the ground as the character walks, at the game's own stride and pace; the stage steps back so the whole trail stays in view, which makes the character smaller than for other items. The button appears for every item the converter found a headgear, a Robe, a Hat effect or a Footprint for, whether or not the game calls it a costume, so an effect item such as Blue Spirit Effect (Middle) or an ordinary headgear can be previewed too. A Footprint item opens in the Walk Pose. It is on screen only and never appears in the downloaded Item card picture.
_Avoid_: Try-on, 3D preview, fitting room, panel

**GIF export**:
The "บันทึกเป็น GIF" button in the Costume preview, which saves one loop of what the window shows now (the chosen gender, Pose and direction) as a GIF file named after the item and Pose with no spaces (such as Blue_Spirit_Effect_Walk.gif). The loop is the shortest time the walk cycle, the item's effect and a headgear's own animation all repeat together, never over 6 seconds (past that, the longest of them); the stage colour as shown is part of the picture, and the Logo mark sits in its bottom-left corner. It is unavailable only in a Pose where none of those moves; a headgear that animates itself, such as Costume Divine Twinkling, can be saved in Idle and Sit too. The Logo mark is in the file only, not on screen.
_Avoid_: Record, screenshot, download animation

**Logo mark**:
The หมากัดหมวด dog logo, the same one before the item name on an Item card, drawn small and round in the corner of a GIF export so the picture says where it came from.
_Avoid_: Watermark, sponsor

**Robe**:
A garment costume such as a cape or wings, worn on the back. It moves frame for frame with the body, and the game's own table decides when it is drawn behind the body (mostly when the character faces the viewer) and when in front.
_Avoid_: Cape (for the whole kind), wing sprite

**Hat effect**:
A looping light effect (an STR file) that a costume item plays around its wearer, such as Whisper's Blessing's ghosts or a magic circle under the feet. Some play behind the character, others over it. It adds light onto the scene, so the Costume preview shows it on a dark stage, at the character's in-game size even when the effect spreads past the window.
_Avoid_: Aura (only some are auras), particle, STR

**Footprint**:
An effect item, such as Blue Butterfly Footprint or Flower Garden, that plays a small effect at each step its wearer takes while walking, and may also leave a mark on the ground. It is not a Hat effect: it shows only in the Walk Pose of the Costume preview.
_Avoid_: Footstep effect, Hat effect (for this kind)

**Pose**:
One of the three motions the Costume preview offers: Idle, Sit or Walk. Idle and Sit are held still (their frames only turn the head); Walk moves the legs, and the character walks on the spot. An item with one effect of its own, such as Cons of Poison, keeps playing that effect whatever the direction or Pose.
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
One of the three timed rounds inside the Central Laboratory (Stage 1–3), each with its own Wait time and its own set of monsters. The Mini Boss round is listed with the Stages but is not timed.
_Avoid_: Round, wave, level

**Wait time**:
How long a player must wait after finishing a Stage before the next can be entered: 2:30 for Stage 1, 1:20 for Stage 2, 2:40 for Stage 3.
_Avoid_: Cooldown, countdown (alone)

**Extra time**:
The 0, 5, 10 or 15 seconds a player chooses to add to every Stage's Wait time before starting its timer. With 15 seconds, Stage 1 counts down from 2:45. The choice is the same for all three Stages and is remembered in the player's own browser.
_Avoid_: Delay, buffer, lead-in

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

**ASPD calculator**:
The Tool at /aspd-calc where a player picks a Main job, then a job under it, a weapon and what the other hand holds, enters AGI, DEX and ASPD bonuses, and sees the resulting attack speed and attacks per second. The attack speed is the whole number the game shows, with the value to two decimals beside it. It can also tell how much more AGI or DEX a target ASPD needs.
_Avoid_: The Flash Calc, speed calculator

**Cast calculator**:
The Tool at /cast-calc (it replaces the old VCT calculator) where a player enters a skill's Fixed cast, Base VCT and After-cast delay with their % reductions, plus DEX, INT and ASPD, and sees the Cast bar. It also tells how soon the same skill can be used again.
_Avoid_: VCT calculator, cast time calculator

**Fixed cast**:
The part of a skill's casting time that stats cannot shorten, in seconds. Only its own % reduction lowers it.
_Avoid_: Fix, FCT

**VCT**:
The variable part of a skill's casting time. It starts from the skill's Base VCT and shrinks with DEX (counted double), INT, gear % and skill % reductions.
_Avoid_: Cast time (alone), variable cast

**After-cast delay**:
The skill's own pause after a cast finishes, in seconds, lowered by its % reduction. The pause the player actually waits is the longer of this and the delay set by ASPD. Not the same as the skill's Cooldown, which only limits using that same skill again.
_Avoid_: Delay (alone), Cast delay

**Cast bar**:
The single horizontal bar in the Cast calculator with three stretches in time order (Fixed cast, VCT, the wait after the cast), each sized to its real seconds, with the total at the end. The wait after the cast shows whether After-cast delay or ASPD set it. It runs by itself in real time, filling left to right over the calculated seconds with the current stretch named above it, and starts again on its own once the skill can be used again, after resting half a second at the end. A thin Cooldown bar under it runs alongside. Changing any number restarts it with the new values. It keeps running even when the player's device asks for less motion.
_Avoid_: Cast gauge, cast timeline

**Main job**:
The first job of a line (Novice, Swordman, Acolyte, Magician, Merchant, Archer, Thief, Taekwon, Ninja, Gunslinger), used in the ASPD calculator to narrow the list of jobs to that line.
_Avoid_: Base class, job family

**Class tier**:
The group a job belongs to in the ASPD calculator, which sets the highest ASPD it can reach, shown to players as **Max**: Class 1-2 and High Class stop at 190; Extended and Awakened stop at 193. A High Class job has the same numbers as the Class 2 job it comes from. Awakened holds the twelve Awakened jobs as the game announced them, with Clown and Gypsy as one entry.
_Avoid_: Job tier, class group

**Weapon factor**:
How much ASPD one job gains or loses for holding one kind of weapon, as the game's own table lists it for that job. Mostly a loss, sometimes a gain (a Book for an Awakened High Priest is +1). A shield has its own number per job. An Awakened Assassin Cross has a separate, heavier number for a weapon in the left hand; the other Awakened jobs hold only a shield or nothing there.
_Avoid_: Weapon penalty, weapon delay

**Map viewer**:
The shared view that shows one game map's terrain in 3D, which the player can rotate, tilt and zoom with mouse or fingers. Each map gets its own page that opens the same Map viewer. It can colour the ground by height or light, and can overlay which cells are walkable. It shows the ground and the still objects placed on it, such as buildings, walls and trees, in the real-surface mode; the black map shows the ground only. It is lit the way the map's file says (colour and direction of the light), so a night map looks dark; a switch brings back an even bright light. Water, effects, sounds and animation are not shown.
_Avoid_: Map page, 3D map

**New map**:
A game map whose files came with the latest patch, such as a new dungeon or event map. The Patch Convert page lists the patch's New maps by name behind a "แผนที่ใหม่" button at its top right, and shows the chosen one in the Map viewer; with no New maps the button is not there. The list is kept by hand.
_Avoid_: Patch map, event map (for this meaning)

**New item**:
An item that comes with the latest patch for the first time. The Patch Convert page lists New items under "ใหม่", which is the list it opens on; an item with no kind recorded counts as a New item.
_Avoid_: Patch item (for this meaning)

**Modified item**:
An item that already existed and was changed by the latest patch. The Patch Convert page lists Modified items under "แก้ไข"; "ทั้งหมด" lists both kinds together.
_Avoid_: Updated item, changed item

**Hint map**:
A Map viewer page that also carries a dungeon's guide under the map: how to enter, the route, the monsters and the rewards. Jittlebug is the first. Positions of doors, boss rooms and NPCs are not shown until they are recorded.
_Avoid_: Dungeon page, guide page

**Faceworm Nest**:
The Hint map of the dungeon whose game map is 1@face. It is one game map divided into four Zones. Over the Map viewer it pins the Warps, Treasure chests, Mini bosses and the MVP (Faceworm Queen) at the cells the guide's author marked, and can draw the Recommended routes; the monsters' details (HP, element, drops) are written outside the map, under it. Pressing a pin shows nothing. Each pin is a small picture standing on the cell the author marked, as the game numbers it: a portal for a Warp, a chest for a Treasure chest, and the monster's own picture for a Mini boss and the MVP (larger). The pictures show as still images.

**Zone**:
One of the four numbered parts of Faceworm Nest, 1 to 4, each holding its own Treasure chests and Recommended routes. A Zone does not cut the map or move the camera; choosing one (or "all") only filters which Treasure chests and Recommended routes are shown.
_Avoid_: Stage, Map 1-4

**Treasure chest**:
A chest in Faceworm Nest that holds a reward, numbered by its Zone and order in it (such as 1.1 or 4.7), with a picture of where it stands.
_Avoid_: Teasure, box (the 5th Anniversary's Chapter VI boxes are a different thing)

**Recommended route**:
A line drawn on the ground of Faceworm Nest from a Warp to a Treasure chest, belonging to one Zone.
_Avoid_: Guide path

**Warp**:
A way to move the player to another place, either in the same map or to another map: a portal the player walks onto, or an NPC the player talks to. It is recorded with where it stands, where it leads, and the NPC's name when it is an NPC.
_Avoid_: Portal, teleport

**MVP Hunter**:
The Tool at /mvp, in the Sidebar as "MVP Hunter", that lists the MVPs and Mini bosses found on ordinary maps (none from Endless Tower, Ghost Palace or other instances, and none from guild dungeons), each with its picture, name, Spawn map and Respawn window. The player picks MVP or Mini Boss, types a Death time and the page works out when the boss returns; the player can also ask for the Route from a main town. Both servers share one list and one set of times.
_Avoid_: MVP tracker, boss timer, MVP page

**Mini boss**:
A boss monster weaker than an MVP that also returns a set time after its death, such as Angeling, Ghostring or Mysteltainn. The MVP Hunter lists Mini bosses apart from MVPs. A map may hold several of the same Mini boss; the MVP Hunter still keeps one Death time for that map. Some Mini bosses, such as Owl Duke or Kasa, return within seconds instead: the MVP Hunter lists their Spawn maps and Routes, says they return at once, and takes no Death time for them.
_Avoid_: Mini, semi-boss, boss monster

**Spawn map**:
A map where an MVP or Mini boss appears, named as the game names it (such as moc_pryd04). A boss can have several, each with its own Respawn window and its own Death time.
_Avoid_: Boss map, location

**Respawn window**:
How long after its death an MVP or Mini boss returns, as a shortest and a longest wait in minutes (such as 60–70). With a Death time of 12:30 the boss returns between 13:30 and 13:40. Where a map holds some of a Mini boss that return at once and some that take longer, the window is written as "at most" the longer wait (such as at most 30 minutes). The values are kept by hand, since the game's files do not hold them; they follow RateMyServer's Renewal monster list. A few Spawn maps seen in this server's game but not on that list, such as Baphomet at gl_cas02, are added by hand.
_Avoid_: Cooldown (in docs), spawn time, respawn timer

**Death time**:
The time of day (Thailand time) at which the player saw an MVP or Mini boss die on one Spawn map, typed by the player into the MVP Hunter as hours and minutes only, or taken as "now" by one press; the page fills in the date itself (a time later than now means yesterday) and shows it with the time, as "today", "yesterday" or the date. It is remembered, date included, only in the player's own browser, and stays until the player removes it or types a new one: it is never hidden for being old. The page only works out the Respawn window from it: it never claims the boss is alive or dead.
_Avoid_: Kill time, time of death

**Queue**:
The "กำลังจับเวลา" list at the top of the MVP Hunter: every Spawn map that has a Death time, soonest Respawn window first. A Spawn map enters it when a Death time is set and leaves it when the player stops timing it or clears all.
_Avoid_: Tracked list, watchlist

**Memo**:
A short note of up to 100 characters that a player types for one Spawn map in the Queue, such as who is hunting it, shown on that map's row only. It stays when the Death time is reset with "ตายตอนนี้", goes when the map leaves the Queue, and is kept only on the player's own device.
_Avoid_: Comment, note, tag

**Spawn report**:
A note a player sends from a Spawn map in the MVP Hunter saying its data looks wrong: the boss does not appear on that map, the Respawn window is off, or the Route is wrong, with what the player saw in the game. Each report is saved in Supabase and read by the owner there; the sender only gets a thank-you. It limits each address to 5 reports per 10 minutes.
_Avoid_: Bug report, ticket, issue

**Report board**:
The dev-only page at /dev/mvp-reports where the owner reads the Spawn reports as ten sticky notes a page, filters them to open, fixed or all, and ticks a note as fixed (or open again) once the data has been corrected. Like the Comment draw it is in no menu, answers 404 on a production build, and opens only from this computer. Ticking a note changes only the note, never the boss data.
_Avoid_: Admin page, inbox

**Feedback board**:
The dev-only page at /dev/feedback, built like the Report board, where the owner reads the Feedback messages as ten sticky notes a page, filters them to unread, read or all, and ticks a message once read so it is clear which are still waiting. It has the same dev-only and this-computer-only limits, and a tab links it with the Report board.
_Avoid_: Admin page, inbox

**Name mask**:
The single switch at the top right of the Report board and the Feedback board that hides the sender's name on every note at once, so a screenshot of a board does not show who wrote. It starts off (names shown), is not remembered after a reload, and covers only the sender's name, not the boss, map or message; a hidden name is always the same five stars, and a note with no name is starred too, so a note with a name cannot be told from one without.
_Avoid_: Hide name button, privacy mode

**Route**:
The Warps to take, in order, from a main town the player chooses to a boss's Spawn map, using the fewest Warps; Kafra, ship and airship count as Warps. Where the game's own Warp list stops short of the Spawn map (a quest or a special NPC is needed), a hand-written note finishes the Route. A Gate Warp is taken only when it makes the Route shorter in Warps; when two Routes are as short, the one that costs less Zeny is taken. The step then names the choice to pick in the menu and its price.
_Avoid_: Path, directions, navigation

**Gate Warp**:
The NPC "Gate Warp (Dungeon)" in Morroc Ruins that sends the player straight to one of nine dungeons for 5,000 Zeny, at any time. Each choice in its menu is one Warp. The game's own Warp list does not know it, so its place, choices and price are kept by hand.
_Avoid_: Warp pillar, เสาวาป, dungeon warper

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

**Comment draw**:
A developer-only draw that picks winners among the Entrants of one post on the site's Facebook page, with the same spinning strip as a Scroll's Row. Each draw picks one Entrant, both servers share one pool, and an Entrant wins at most once. Every Entrant's card, on the strip and among the Winners, takes its server's colour: blue for Baphomet, yellow for Moonlight. It lives on its own page, not in the Scroll picker, and players never see it.
_Avoid_: Scroll, Facebook scroll, giveaway

**Draw screen**:
One of the two panels of the Comment draw page, meant to be shown to an audience: the draw's title, the current Award in large type, the spinning strip, the latest Winner and the Winners as cards. Its only controls are the Award box and the draw button, which waits until an Award is typed. Until the first draw the strip drifts slowly through the Entrants still in the pool, in a new random order each time the page opens; a draw spins for about 3 seconds and the strip then stays on the Winner until the next draw. Opening it folds the Draw settings away, and the other way round. Thai: ส่วนสุ่ม.
_Avoid_: Tab, stage, presentation mode, roller page

**Draw settings**:
The other panel of the Comment draw page, folded away while the Draw screen is open: fetching the post, pasting Facebook names, reviewing Held comments and Entrants, and copying or resetting the Winners. Thai: ส่วนตั้งค่า.
_Avoid_: Tab, admin, config page

**Entrant**:
One game character taking part in a Comment draw through a comment on the post: the Facebook name of whoever wrote it, and the character name, C-Code and server read from the comment's text. Facebook's data gives only the text, so the Facebook name comes from the developer pasting the post's comments as copied from Facebook, matched to each comment by its text. A C-Code counts once, and so does a Facebook name; on a repeat, the earliest comment with a C-Code is the one that counts (a chat comment without a C-Code is not a repeat). The developer may correct any Entrant's Facebook name, character name, C-Code or server, but an Entrant always has a Facebook name, a C-Code and a server (Baphomet or Moonlight). A server name the player clearly misspelled, such as "Balhomet", is read as the server they meant.
_Avoid_: Prize, commenter, participant, user

**Held comment**:
A comment of a Comment draw that is not an Entrant until the developer reviews it: it has no C-Code, names no server, has no Facebook name yet, repeats a C-Code (shown beside the first comment with it), or comes from a Facebook name that already commented (all of that person's comments shown together, with how many people this applies to). Until marked to count, it stays out of the draw. Thai: รอตรวจ.
_Avoid_: Rejected comment, invalid entry

**Winner**:
An Entrant drawn in a Comment draw, together with the Award it was drawn for. Winners are kept with the post's draw until the developer resets them, never drawn again, and can be copied as a list grouped by Award, in the order drawn (name, C-Code, server), to announce on the post.
_Avoid_: Prize, result

**Award**:
What a Winner of a Comment draw receives, typed by the developer as free text (such as "Costume Wings ×1") before each draw; a draw cannot start without one. It stays in place after a draw, so several Winners of the same Award are drawn one after another.
_Avoid_: Prize (that is a Scroll's), Anniversary reward, reward

**C-Code**:
The in-game code of a character, 6 or 7 digits, written like 186-253 or 0048-051. It is what tells one Entrant from another.
_Avoid_: ID, character code

**5th Anniversary page**:
The Tool that presents the 5th Anniversary event on a main page of six numbered sections (the Chapter map, the Recurring quests, the story guide, Reward & Exchange (a way into the Rewards page, and the Garantee Gacha slots), the World Fruit plan, and the Warp portals), headed by a Section nav, plus a separate Rewards page with a link back. It follows the project's orange-and-cream poster look in both Theme modes, and animates only when the player has not asked for reduced motion.
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

**Section nav**:
The row of buttons under the 5th Anniversary page's title, one per numbered section, saying how many main sections the page has and jumping to the one pressed. It sits in place at the top of the page, and once the player scrolls past it, it stays fixed just under the Navbar; scrolled back to the top it is in its own place again. The button of the section being read is filled in: the last section whose heading has reached the top of the screen, or the last one when the page is scrolled to its end; none is filled above the first section. Pressing a button scrolls smoothly (even for players who asked for reduced motion; the site's owner chose so) so the section's heading stops just under the bar; the steps of the "ทำตามลำดับนี้" flow do the same, each to its own place (Daily, Weekly and Dragon Cataclysm to their own cards).
_Avoid_: Table of contents, tabs, menu

**Guarantee machine**:
The 5th Anniversary's way to a sure rare item, shown beside the Rewards page in section 04 (Reward & Exchange). Each open of a 5th Anniversary Scroll gives one 5th Anniversary Coin; 250 Coins buy an Anniver Silver Key77 (one [Not For Sale] item of grade S) and 500 an Anniver Gold Key77 (grade SS), traded at the NPC Garantee Gacha in Invaded Prontera. Coins stop when the Scroll's sale ends on 25 November 2569. The two keys keep their own colour wherever they appear: yellow gold for the Gold Key (SS) and cool silver for the Silver Key (S), both apart from the page's orange. Section 04 shows it as a single animated slot machine on one big card that opens the Guarantee page; the Guarantee page, at /5thAnvs/guarantee, explains the Coins and keys and lets the player choose a server and a slot to see its items. Baphomet has Garantee Gacha V.1 to V.5 and Moonlight V.1; a slot shows its items in two groups, grade SS for the Gold Key and grade S for the Silver Key, each item a card with its picture and name that opens its Item card; a slot whose items are not entered yet says it is being collected. A search bar above them, with a choice of all, Gold only or Silver only, filters the groups at once by part of the item name, ignoring upper/lower case, and shows how many matched out of the total in each group; it is cleared when the player changes server or slot.
_Avoid_: Pity, guarantee gacha (alone)

**Garantee Gacha**:
One slot of the Guarantee machine, named as the game spells it: "Garantee Gacha V.1", V.2 and so on. Each has its own list of items that a key can be traded for. Drawn as a slot machine from its own .spr and .act files, played in a loop.
_Avoid_: Slot (alone), gacha machine

**Warp portal**:
The NPC Warp Portal that stands in each of six main towns (Izlude, Payon, Alberta, Geffen, Morroc, Prontera, in Chapter order) and takes the player into the event's map. Players of LV 1 to 99 Class 1 and 2 use it free; High Class, Extend and Awakened players pay 5,000 Zeny per use. Section 06 of the 5th Anniversary page shows the six on a picture of the continent, cut down to the area around them, each town named in a tag above it, where only these towns can be chosen: pointing at one lifts it, and pressing it opens that town's black map with a pin on the NPC (the Location window). A town whose map files are not on the site yet says so and gives the coordinate in words.
_Avoid_: Portal (alone), teleport, warper

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

**Asset host**:
The separate address that serves the site's heavy static files (monster pictures, minimaps, sprites, maps) so the Shell and Tools do not carry them. Every picture of that kind is asked for through it; when none is set, they come from the site itself.
_Avoid_: CDN, image server, bucket
