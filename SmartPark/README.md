# SmartPark — Stack-Based Parking Lot Management

## Project overview
SmartPark is a local, browser-based simulation for a university Data Structures and Algorithms project. Vehicles are held in a genuine bounded JavaScript stack, demonstrating the Last In, First Out (LIFO) rule. The interface visualizes parking spaces, stack contents, operation results, statistics, and a timestamped activity log.

## Objectives
- Demonstrate stack operations with a real array-backed `Stack` class.
- Illustrate why the newest vehicle can leave directly and why a vehicle below the top requires temporary relocation.
- Preserve the relative order of remaining vehicles during arbitrary departures.
- Persist the simulation locally without a server or database.

## Features
- Park vehicles with registration, owner, model, and colour; reject blank required fields, duplicates, and over-capacity entries.
- Direct top departure and arbitrary departure using temporary relocation.
- PUSH, POP, PEEK, ISEMPTY, ISFULL, and registration search controls.
- Live lot view, stack view, statistics, operation log, reset confirmation, and a separate LIFO demo.
- LocalStorage persistence and responsive desktop/mobile layout.

## Technology
HTML5, CSS3, vanilla JavaScript, SVG vehicle illustrations, and browser LocalStorage. No build step, backend, or package installation is needed. The stylesheet includes a remote Google Fonts import for optional typography; the system font fallback and all core functionality work offline.

## How to run
1. Extract `SmartPark_DSA_Project.zip`.
2. Open the `SmartPark` folder.
3. Open `index.html` in a current Chrome, Edge, Firefox, or Safari browser.
4. Enter a registration and owner name, then click **Park vehicle**.
5. Use the stack operation controls or select a vehicle and request departure.

The app is designed to work when opened directly as a local file (`file://`). Browser privacy settings may affect LocalStorage in some unusual configurations; if state does not persist, run it from a simple local static server.

## How the stack works
`js/stack.js` defines `Stack`. The last element in its internal `items` array is the top. `push(vehicle)` adds to the end; `pop()` removes from the end; `peek()` reads the end without removing it. `isEmpty()`, `isFull()`, `size()`, `find()`, and `getItems()` expose checks and safe copies. Capacity defaults to eight and can be changed in the `DEFAULT_CAPACITY` constant in `js/app.js`.

`js/parking.js` contains parking-domain rules. For a vehicle not at the top, it pops each vehicle above the target into temporary storage, pops the target, then pushes the displaced vehicles back in reverse temporary-storage order. This keeps their original relative order and works even if the lot was full before the departure.

## Example usage
Park CAR-A, then CAR-B, then CAR-C. The stack top-to-bottom is CAR-C, CAR-B, CAR-A. PEEK returns CAR-C without removing it. POP removes CAR-C. If CAR-A is selected while CAR-B and CAR-C remain above it, SmartPark temporarily moves CAR-C and CAR-B, removes CAR-A, and restores CAR-B then CAR-C; CAR-C remains the top vehicle.

## Project files
- `index.html` — semantic page structure and controls.
- `css/styles.css` — responsive dashboard styling and animations.
- `js/stack.js` — bounded array-backed Stack class.
- `js/parking.js` — parking and departure algorithms.
- `js/ui.js` — DOM rendering and user messages.
- `js/app.js` — event handlers, persistence, logging, and demo.
- `tests/stack.test.js` — automated tests using Node.js built-in test runner.
- `PROJECT_REPORT.md` — editable academic project report.
- `TEST_PLAN.md` — automated test cases and manual browser checklist.

## Known limitations
- This is a simulation, not a live sensor-connected parking facility.
- State is stored in the current browser profile and is not synchronized across devices.
- The lot uses one stack lane; real parking lots may have multiple lanes, accessible bays, or different movement rules.
- Browser confirmation is used for reset. No accounts or access-control system is implemented.
