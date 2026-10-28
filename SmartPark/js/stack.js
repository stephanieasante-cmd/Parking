/* Genuine bounded Stack implementation. The final array element is TOP. */
class Stack {
  constructor(capacity = 8, items = []) {
    if (!Number.isInteger(capacity) || capacity < 1) throw new TypeError('Capacity must be a positive integer.');
    if (!Array.isArray(items) || items.length > capacity) throw new RangeError('Initial items exceed stack capacity.');
    this.capacity = capacity;
    this.items = items.map(item => ({ ...item }));
  }
  push(vehicle) {
    if (this.isFull()) throw new RangeError('Parking stack is full.');
    this.items.push({ ...vehicle });
    return this.peek();
  }
  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }
  peek() { return this.isEmpty() ? null : this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
  isFull() { return this.items.length >= this.capacity; }
  size() { return this.items.length; }
  find(registrationNumber) {
    const key = Stack.normalizeRegistration(registrationNumber);
    const index = this.items.findIndex(v => Stack.normalizeRegistration(v.registration) === key);
    return index < 0 ? null : { vehicle: { ...this.items[index] }, index, position: index + 1, vehiclesAbove: this.items.length - index - 1 };
  }
  getItems() { return this.items.map(item => ({ ...item })); }
  static normalizeRegistration(value) { return String(value ?? '').trim().toUpperCase().replace(/\s+/g, ' '); }
}
if (typeof module !== 'undefined' && module.exports) module.exports = Stack;
