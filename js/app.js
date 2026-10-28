(() => {
  // Change DEFAULT_CAPACITY here to change the simulation's parking capacity.
  const DEFAULT_CAPACITY = 8;
  const STORAGE_KEY = 'smartpark-state-v1';
  let lot, logs = [], demoItems = [];
  const $ = UI.$;
  function addLog(type, message, kind = '') {
    logs.unshift({ time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'}), type, message, kind });
    logs = logs.slice(0, 100); save();
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ capacity: lot.capacity, items: lot.getItems(), departed: lot.departed, logs })); }
    catch (error) { console.warn('Could not save SmartPark state:', error); }
  }
  function refresh(moving = []) { UI.render(lot, logs, moving); }
  function perform(action, fn) { try { fn(); refresh(); } catch (e) { UI.notice(e.message || 'Operation failed.', 'error'); addLog('ERROR', e.message || 'Operation failed.', 'error'); refresh(); } }
  function parkFromForm() {
    const form = $('entryForm'); if (!form.reportValidity()) return;
    perform('park', () => {
      const vehicle = { registration: $('registration').value, owner: $('owner').value, model: $('model').value, color: $('color').value };
      const parked = lot.park(vehicle); addLog('PUSH', `Vehicle ${parked.registration} entered the parking lot. PUSH operation completed.`);
      UI.notice(`${parked.registration} parked successfully and pushed to the top of the stack.`);
      form.reset(); $('registration').focus();
    });
  }
  function depart(registration) {
    perform('depart', () => {
      const found = lot.find(registration); if (!found) throw new Error('Select a valid parked vehicle.');
      const displacedRegs = lot.getItems().slice(found.index + 1).map(v => v.registration);
      if (displacedRegs.length) {
        displacedRegs.slice().reverse().forEach(reg => addLog('RELOCATE', `Vehicle ${reg} temporarily relocated to allow ${found.vehicle.registration} to leave.`, 'info'));
        refresh(displacedRegs);
      }
      const result = lot.depart(registration);
      addLog('POP', `Vehicle ${result.vehicle.registration} departed. ${result.displacedCount ? `${result.displacedCount} vehicle(s) temporarily moved and restored in order. ` : ''}POP operation completed.`);
      UI.notice(`${result.vehicle.registration} departed successfully${result.displacedCount ? `; ${result.displacedCount} vehicle(s) were moved temporarily and restored in the correct order` : ''}.`);
    });
  }
  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && saved.capacity === DEFAULT_CAPACITY && Array.isArray(saved.items) && saved.items.length <= DEFAULT_CAPACITY) {
        lot = new ParkingLot(DEFAULT_CAPACITY, saved.items); lot.departed = Number.isInteger(saved.departed) && saved.departed >= 0 ? saved.departed : 0; logs = Array.isArray(saved.logs) ? saved.logs.slice(0,100) : [];
        UI.notice('Previous parking state restored from this browser.'); return;
      }
    } catch (error) { console.warn('Saved SmartPark state was invalid; starting fresh.', error); }
    lot = new ParkingLot(DEFAULT_CAPACITY); logs = [];
  }
  $('entryForm').addEventListener('submit', e => { e.preventDefault(); parkFromForm(); });
  $('exitSelect').addEventListener('change', () => UI.updateExitInfo(lot));
  $('departBtn').addEventListener('click', () => depart($('exitSelect').value));
  $('pushBtn').addEventListener('click', () => { $('registration').focus(); UI.notice('Enter vehicle details and choose “Park vehicle” to perform PUSH.', 'info'); });
  $('popBtn').addEventListener('click', () => { const v = lot.top(); if (!v) { addLog('POP', 'Cannot pop: parking stack is empty.', 'error'); UI.notice('POP: parking stack is empty.', 'error'); refresh(); return; } depart(v.registration); });
  $('peekBtn').addEventListener('click', () => perform('peek', () => { const v = lot.top(); if (!v) { addLog('PEEK', 'Parking stack is empty.', 'error'); UI.notice('PEEK: parking stack is empty.', 'error'); return; } addLog('PEEK', `PEEK returned vehicle ${v.registration}; it remains parked.`, 'info'); UI.notice(`PEEK: ${v.registration} is at the top. The vehicle remains parked.`, 'info'); }));
  $('emptyBtn').addEventListener('click', () => { const empty = lot.stack.isEmpty(); addLog('ISEMPTY', `ISEMPTY returned ${empty}.`, 'info'); UI.notice(`ISEMPTY: ${empty ? 'true — the parking stack is empty.' : 'false — the stack contains vehicles.'}`, 'info'); refresh(); });
  $('fullBtn').addEventListener('click', () => { const full = lot.stack.isFull(); addLog('ISFULL', `ISFULL returned ${full}.`, 'info'); UI.notice(`ISFULL: ${full ? 'true — the parking lot has reached capacity.' : 'false — parking spaces remain available.'}`, 'info'); refresh(); });
  $('searchBtn').addEventListener('click', () => { const q = $('searchInput').value.trim(); if (!q) { UI.notice('Enter a registration number to search.', 'error'); return; } const f = lot.find(q); if (!f) { addLog('SEARCH', `Vehicle ${q} was not found.`, 'error'); UI.notice(`No parked vehicle found with registration ${q}.`, 'error'); } else { addLog('SEARCH', `Found ${f.vehicle.registration} at stack position ${f.position}; ${f.vehiclesAbove} vehicle(s) above it.`, 'info'); UI.notice(`Found ${f.vehicle.registration}: position ${f.position}, ${f.vehiclesAbove} vehicle(s) above it.`, 'info'); $('exitSelect').value = f.vehicle.registration; UI.updateExitInfo(lot); } refresh(); });
  $('searchInput').addEventListener('keydown', e => { if (e.key === 'Enter') $('searchBtn').click(); });
  $('clearLogBtn').addEventListener('click', () => { logs = []; save(); refresh(); UI.notice('Activity log cleared. The parking stack has not been changed.', 'info'); });
  $('resetBtn').addEventListener('click', () => { if (!window.confirm('Reset the simulation? All currently parked vehicles and the activity log will be cleared.')) return; lot = new ParkingLot(DEFAULT_CAPACITY); logs = []; save(); refresh(); UI.notice('Simulation reset. The parking lot is empty.'); });
  $('demoPush').addEventListener('click', () => { if (demoItems.length >= 4) { $('demoText').textContent = 'Demo stack is full. Pop an item or reset the demo.'; return; } demoItems.push(String.fromCharCode(65 + demoItems.length)); renderDemo(`PUSH added ${demoItems[demoItems.length-1]} to the top.`); });
  $('demoPop').addEventListener('click', () => { if (!demoItems.length) { $('demoText').textContent = 'Cannot POP: demo stack is empty.'; return; } const item = demoItems.pop(); renderDemo(`POP removed ${item}, the most recently added item.`); });
  $('demoReset').addEventListener('click', () => { demoItems = []; renderDemo('Demo reset. Push items to see LIFO in action.'); });
  function renderDemo(message) { $('demoText').textContent = message; $('demoBlocks').innerHTML = ''; [...demoItems].forEach((v, i) => { const el = document.createElement('span'); el.className = 'demo-block'; el.textContent = v + (i === demoItems.length - 1 ? ' · TOP' : ''); $('demoBlocks').appendChild(el); }); }
  loadState(); refresh(); UI.clock(); setInterval(UI.clock, 1000);
})();
