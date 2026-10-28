# SMARTPARK: PARKING LOT MANAGEMENT SYSTEM USING THE STACK DATA STRUCTURE

**Student name:** ____________________________________  
**Student ID:** ______________________________________  
**Course title:** _____________________________________  
**Lecturer name:** ___________________________________  
**Department:** ______________________________________  
**Submission date:** __________________________________

## Abstract
SmartPark is a browser-based parking lot simulation developed to demonstrate the Stack data structure and its Last In, First Out (LIFO) behaviour. Vehicle records are stored in a bounded, array-backed JavaScript stack with a default capacity of eight. The system provides parking entry, departure, inspection, search, capacity checks, activity logging, and local persistence. A vehicle at the top can leave through a normal `pop()` operation. To remove a vehicle from a lower position, the system temporarily pops vehicles above it, removes the selected vehicle, and restores the displaced vehicles in their original relative order. The project combines an interactive interface with explicit stack logic so the data structure can be observed and tested.

## 1. Introduction
Data structures organize information so that programs can store, retrieve, and update it efficiently. A stack is a linear data structure in which insertion and removal occur at one end, called the top. A parking arrangement where vehicles block one another provides an intuitive simulation of this restriction: the most recently parked vehicle is the first one able to leave without other vehicles moving.

## 2. Problem statement
A learner may understand a stack definition but find it difficult to connect the abstract operations to a practical scenario. The project addresses this by simulating a finite parking lane and showing the underlying stack, parking spaces, operation messages, and activity history. It also demonstrates that removing an arbitrary item is not a basic constant-time stack operation.

## 3. Project objectives
1. Implement a real array-backed Stack class in JavaScript.
2. Demonstrate `push`, `pop`, `peek`, `isEmpty`, `isFull`, `size`, `find`, and `getItems`.
3. Enforce a fixed parking capacity and unique vehicle registrations.
4. Support departures from the top and from lower positions.
5. Preserve the order of all vehicles not departing.
6. Render accurate stack/parking views and record operations.
7. Save and restore simulation state using LocalStorage.
8. Document and test expected behaviour.

## 4. Scope
SmartPark is an educational, single-lane simulation that runs in a modern browser. It records a vehicle's registration, owner, model, colour, and parking timestamp. It does not connect to physical gates, sensors, payment services, or a central server.

## 5. Background: the Stack data structure
A stack is a linear collection whose insertion and deletion follow LIFO. The final element in the implementation's JavaScript array is treated as the top. If A, B, and C are pushed in that order, C is the top and is removed first.

### 5.1 LIFO principle
LIFO means Last In, First Out. The item most recently added is the first item removed. In SmartPark, a vehicle that enters after the others is positioned at the top of the stack and can leave directly.

### 5.2 Core operations
- **push(vehicle):** adds a vehicle to the top unless capacity is reached.
- **pop():** removes and returns the top item; returns `null` on an empty stack.
- **peek():** returns the top item without removing it; returns `null` when empty.
- **isEmpty():** returns whether the stack contains zero items.
- **isFull():** returns whether the number of items has reached capacity.
- **size():** returns the current number of items.
- **find(registrationNumber):** searches by normalized registration and reports the item and its position.
- **getItems():** returns a shallow copy of the stack's vehicle records so the caller cannot change the internal array by mutating the returned array.

## 6. System requirements
### Hardware
A typical desktop, laptop, tablet, or phone capable of running a modern browser.

### Software
A modern web browser. Node.js is optional and required only to run the automated test suite. No backend, database, paid API, or application build process is required.

## 7. System design and architecture
The project separates responsibilities into four JavaScript files:
- `stack.js` contains the data structure and its primitive operations.
- `parking.js` contains parking rules and the arbitrary-departure algorithm.
- `ui.js` renders the stack, spaces, statistics, selection list, activity log, and notifications.
- `app.js` wires browser events, LocalStorage, timestamps, and the educational mini-demo.

The rendered parking lot and stack are generated from `ParkingLot.getItems()`, which reads from the real Stack object. They are not independently maintained counters or decorative mock data.

## 8. Stack implementation
The `Stack` constructor accepts a positive integer capacity and optional initial items. The internal `items` array is ordered from bottom to top; therefore `items[items.length - 1]` is the top. Capacity checks happen before insertion. Registrations are normalized to uppercase and whitespace is standardized before duplicate checks and searching.

## 9. Handling vehicles below the top
A standard stack does not support removing an arbitrary middle item directly. SmartPark uses a temporary array to hold every vehicle above the selected target. Each such vehicle is removed with `pop()`. The target is then popped. Finally, displaced vehicles are pushed back in reverse temporary-array order. Because the temporary array contains the former top first, reversing its removal order reconstructs the original relative order.

For example, the initial stack from bottom to top is `[CAR-A, CAR-B, CAR-C]`. To remove CAR-A, the temporary array becomes `[CAR-C, CAR-B]`; CAR-A is removed; then CAR-B and CAR-C are pushed back. The resulting stack is `[CAR-B, CAR-C]`, with CAR-C still at the top. The implementation restores items directly through stack operations and does not reject them based on the lot's original full state: after the target has been removed, there is sufficient capacity for the displaced vehicles.

## 10. Algorithms and pseudocode
### 10.1 Park a vehicle
```text
PARK(vehicle)
  normalize vehicle registration
  if registration is blank or owner is blank: reject
  if registration already exists: reject duplicate
  if stack is full: reject capacity exceeded
  stack.push(vehicle)
  record PUSH in activity log
  save and redraw interface
```

### 10.2 Depart a selected vehicle
```text
DEPART(registration)
  locate target in stack
  if target does not exist: report not found
  temporary = empty array
  while stack.peek() is not target:
    temporary.push(stack.pop())
  departed = stack.pop()
  while temporary is not empty:
    stack.push(temporary.pop())
  record relocation and POP operations
  save and redraw interface
```

### 10.3 Text flowchart
```text
Start
  |
  v
Validate vehicle selection
  |
  v
Target exists? ---- no ----> Show error / stop
  |
 yes
  v
Vehicles above target?
  | yes                         | no
  v                             |
Pop above vehicles to temp      |
  |                             |
  +-------------+---------------+
                v
          Pop target vehicle
                |
                v
      Push displaced vehicles back
                |
                v
       Log, save state, redraw
                |
                v
               End
```

## 11. Complexity analysis
Let `n` be the number of parked vehicles.

| Operation | Time complexity | Reason |
|---|---:|---|
| `push()` | O(1) amortized | Appends to the array after a capacity check. |
| `pop()` | O(1) | Removes the last array element. |
| `peek()` | O(1) | Reads the last array element. |
| `isEmpty()` | O(1) | Checks the array length. |
| `isFull()` | O(1) | Compares length with capacity. |
| `size()` | O(1) | Reads the array length. |
| `find()` | O(n) | May inspect each vehicle. |
| Arbitrary departure | O(n) | May pop and restore every vehicle above the target. |

### Space complexity
The stack stores O(n) vehicle records. Arbitrary departure can use up to O(n) additional temporary storage for displaced vehicles. The UI also creates a rendered representation of the current items, which is O(n).

## 12. Testing
Automated tests are defined in `tests/stack.test.js` and use Node.js's built-in test runner. The packaged version was tested with `node --test tests/stack.test.js`: 11 tests passed and 0 failed. Coverage includes empty operations, push/pop/peek, capacity, duplicate registration, arbitrary departure order, full-lot arbitrary departure, and serialization/restoration order. JavaScript syntax checks also completed successfully, and the ZIP archive integrity check passed. The `TEST_PLAN.md` separately lists manual browser checks; those visual and browser-persistence checks have not been performed automatically and are marked accordingly.

## 13. Limitations
The simulation represents one constrained lane and is not a complete commercial parking product. State is local to one browser profile. It has no user authentication, multi-user synchronization, payment, physical sensor integration, or live occupancy detection. The LocalStorage data is intended for a teaching demonstration rather than secure or tamper-proof records.

## 14. Future improvements
Possible extensions include multiple parking lanes, exportable reports, time-based parking fees, accessibility bays, richer vehicle filtering, server-backed multi-user state, and automated end-to-end browser tests.

## 15. Conclusion
SmartPark makes the Stack data structure observable through a parking scenario. It implements core stack methods using a real array and illustrates LIFO in both direct departures and departures that require temporary relocation. The interface, logging, and persistence support demonstration and classroom testing while keeping the underlying algorithm visible and explainable.

## 16. References
1. Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2022). *Introduction to Algorithms* (4th ed.). MIT Press.
2. Sedgewick, R., & Wayne, K. (2011). *Algorithms* (4th ed.). Addison-Wesley.
3. MDN Web Docs. “Web Storage API.” https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
4. MDN Web Docs. “Array.” https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
