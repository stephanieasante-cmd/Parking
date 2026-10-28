/* Domain logic kept separate from the visual interface. */
if (typeof require !== 'undefined' && typeof Stack === 'undefined') var Stack = require('./stack.js');
class ParkingLot {
  constructor(capacity = 8, initialItems = []) {
    this.capacity = capacity;
    this.stack = new Stack(capacity, initialItems);
    this.departed = 0;
  }
  park(vehicle) {
    const registration = Stack.normalizeRegistration(vehicle.registration);
    if (!registration) throw new TypeError('Registration number is required.');
    if (!String(vehicle.owner ?? '').trim()) throw new TypeError('Owner name is required.');
    if (this.stack.find(registration)) throw new Error(`Vehicle ${registration} is already parked.`);
    if (this.stack.isFull()) throw new RangeError('Parking lot is full. No space is available.');
    const normalized = { ...vehicle, registration, owner: String(vehicle.owner).trim(), model: String(vehicle.model ?? '').trim(), color: String(vehicle.color ?? 'Silver'), parkedAt: vehicle.parkedAt || new Date().toISOString() };
    this.stack.push(normalized);
    return normalized;
  }
  depart(registration) {
    const found = this.stack.find(registration);
    if (!found) throw new Error('That vehicle is not currently parked.');
    const displaced = [];
    // Pop all vehicles above the target into temporary storage.
    while (this.stack.peek() && Stack.normalizeRegistration(this.stack.peek().registration) !== Stack.normalizeRegistration(registration)) displaced.push(this.stack.pop());
    const departed = this.stack.pop();
    // Reverse the temporary array while pushing back to preserve the original order.
    while (displaced.length) this.stack.push(displaced.pop());
    this.departed += 1;
    return { vehicle: departed, displacedCount: found.vehiclesAbove, displaced: displaced.length };
  }
  top() { return this.stack.peek(); }
  find(registration) { return this.stack.find(registration); }
  getItems() { return this.stack.getItems(); }
}
if (typeof module !== 'undefined' && module.exports) module.exports = ParkingLot;
