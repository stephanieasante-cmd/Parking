const test = require('node:test');
const assert = require('node:assert/strict');
const Stack = require('../js/stack.js');
const ParkingLot = require('../js/parking.js');
const car = (registration, owner = registration) => ({ registration, owner, model: 'Test model', color: 'Blue' });

test('empty stack returns safe values', () => {
  const s = new Stack(8);
  assert.equal(s.isEmpty(), true); assert.equal(s.peek(), null); assert.equal(s.pop(), null); assert.equal(s.size(), 0);
});
test('push places latest item at top and peek does not remove', () => {
  const s = new Stack(5); s.push(car('CAR-A')); s.push(car('CAR-B')); s.push(car('CAR-C'));
  assert.equal(s.peek().registration, 'CAR-C'); assert.equal(s.size(), 3);
});
test('pop removes top and exposes previous item', () => {
  const s = new Stack(5); ['CAR-A','CAR-B','CAR-C'].forEach(r => s.push(car(r)));
  assert.equal(s.pop().registration, 'CAR-C'); assert.equal(s.peek().registration, 'CAR-B');
});
test('capacity prevents ninth vehicle', () => {
  const s = new Stack(8); for (let i=0;i<8;i++) s.push(car(`CAR-${i}`));
  assert.equal(s.isFull(), true); assert.throws(() => s.push(car('CAR-9')), /full/i); assert.equal(s.size(), 8);
});
test('arbitrary departure preserves remaining relative order', () => {
  const lot = new ParkingLot(8); ['CAR-A','CAR-B','CAR-C'].forEach(r => lot.park(car(r)));
  const result = lot.depart('CAR-A'); assert.equal(result.vehicle.registration, 'CAR-A');
  assert.deepEqual(lot.getItems().map(v => v.registration), ['CAR-B','CAR-C']); assert.equal(lot.top().registration, 'CAR-C');
});
test('full-lot arbitrary departure leaves seven vehicles in order', () => {
  const lot = new ParkingLot(8); for (let i=0;i<8;i++) lot.park(car(`CAR-${i}`));
  const result = lot.depart('CAR-0'); assert.equal(result.vehicle.registration, 'CAR-0');
  assert.deepEqual(lot.getItems().map(v => v.registration), ['CAR-1','CAR-2','CAR-3','CAR-4','CAR-5','CAR-6','CAR-7']);
  assert.equal(lot.stack.isFull(), false); assert.equal(lot.stack.size(), 7);
});
test('duplicate registration is case-insensitive and whitespace-normalized', () => {
  const lot = new ParkingLot(8); lot.park(car('abc-123'));
  assert.throws(() => lot.park(car(' ABC-123 ')), /already parked/i);
});
test('find reports position and number above target', () => {
  const lot = new ParkingLot(8); ['A','B','C'].forEach(r => lot.park(car(r)));
  const found = lot.find('B'); assert.equal(found.position, 2); assert.equal(found.vehiclesAbove, 1);
});
test('getItems returns a copy and cannot mutate internal array', () => {
  const s = new Stack(3); s.push(car('A')); const copy = s.getItems(); copy.pop();
  assert.equal(s.size(), 1);
});
test('parking capacity and owner validation', () => {
  const lot = new ParkingLot(2); assert.throws(() => lot.park({registration:'A', owner:' '}), /owner/i);
  lot.park(car('A')); lot.park(car('B')); assert.throws(() => lot.park(car('C')), /full/i);
});
test('state can be serialized and restored in order', () => {
  const lot = new ParkingLot(8); ['A','B','C'].forEach(r => lot.park(car(r)));
  const saved = JSON.parse(JSON.stringify({capacity:lot.capacity,items:lot.getItems(),departed:lot.departed}));
  const restored = new ParkingLot(saved.capacity, saved.items);
  assert.deepEqual(restored.getItems().map(v => v.registration), ['A','B','C']); assert.equal(restored.top().registration, 'C');
});
