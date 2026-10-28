# SmartPark Test Plan

## How to run automated tests
Install Node.js if it is not already available, open a terminal in the `SmartPark` folder, and run:

```bash
node --test tests/stack.test.js
```

These automated tests exercise the actual Stack and ParkingLot classes. They do not replace visual/manual checks in a browser.

## Automated test cases

| ID | Test | Steps | Expected result | Actual result |
|---|---|---|---|---|
| A01 | Empty stack | Create `Stack(8)`, call `isEmpty`, `peek`, and `pop` | `true`, `null`, `null`; no corruption | Passed (automated) |
| A02 | Push order | Push CAR-A, CAR-B, CAR-C | CAR-C is top | Passed (automated) |
| A03 | Pop | Pop once from three items | CAR-C removed; CAR-B becomes top | Passed (automated) |
| A04 | Peek | Peek on a non-empty stack | Top returned and size unchanged | Passed (automated) |
| A05 | Capacity | Fill eight slots and push a ninth | Ninth push rejected; size remains eight | Passed (automated) |
| A06 | Arbitrary departure | Park A, B, C; depart A | A departs; B then C remain; C top | Passed (automated) |
| A07 | Full-lot departure | Fill eight; depart bottom item | Target departs; seven remain in order | Passed (automated) |
| A08 | Duplicate registration | Park ABC-123, then try lowercase/space variation | Duplicate rejected | Passed (automated) |
| A09 | LocalStorage payload | Serialize and parse saved stack data | Vehicle records and order retained | Passed (automated serialization test; browser refresh not automated) |

## Manual browser checklist
Mark a manual item complete only after checking it in a browser.

| ID | Check | Steps | Expected result | Actual result |
|---|---|---|---|---|
| M01 | Local launch | Open `index.html` directly | Dashboard loads without a build step | Not yet verified by automated Node tests |
| M02 | Entry validation | Submit empty registration or owner | Browser validation prevents submission | Not yet verified manually |
| M03 | Visual PUSH | Park three vehicles | Parking spaces, stack, stats, and log update | Not yet verified manually |
| M04 | Visual POP | Click POP with vehicles present | Top vehicle departs and next becomes top | Not yet verified manually |
| M05 | PEEK | Click PEEK | Top is reported and remains parked | Not yet verified manually |
| M06 | ISEMPTY / ISFULL | Check on empty and full lot | Correct boolean is reported | Not yet verified manually |
| M07 | Bottom departure | Select bottom vehicle and depart | Temporary relocation logged; remaining order preserved | Not yet verified manually |
| M08 | Persistence | Park a vehicle and refresh | Vehicle and order restore from LocalStorage | Not yet verified manually |
| M09 | Reset confirmation | Reset, then cancel and confirm in separate attempts | Cancel preserves state; confirm clears simulation | Not yet verified manually |
| M10 | Clear log | Clear activity log while vehicles are parked | Log clears; stack remains unchanged | Not yet verified manually |
| M11 | Responsive layout | Inspect desktop and narrow/mobile width | Controls and stack remain usable | Not yet verified manually |
| M12 | Demo widget | Push/pop demo blocks | Demo illustrates LIFO independently of parking lot | Not yet verified manually |

## Reporting rule
Do not state that manual browser checks passed unless they have actually been performed. Automated results should be taken from the Node.js test-run output and included in the submission report if desired.
