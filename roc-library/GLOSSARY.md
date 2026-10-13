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

**Theme mode**:
The visual mode the player has chosen: light or dark. Light is the default until the player picks one.
_Avoid_: Color scheme, skin

**Navigation feedback**:
What the Shell shows while moving from one Tool to another, so the site never looks frozen.
_Avoid_: Loader, spinner, loading screen
