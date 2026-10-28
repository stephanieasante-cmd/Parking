/* DOM rendering: all parking visuals are derived from the actual Stack. */
const UI = (() => {
  const $ = id => document.getElementById(id);
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const carSVG = color => `<svg class="car-icon" viewBox="0 0 64 48" aria-hidden="true" style="--car-color:${escapeHTML(color || 'Silver')}"><path class="body" d="M10 20 16 9Q18 5 23 5h18q5 0 8 5l6 10 4 3q3 2 3 6v9H5v-9q0-4 3-6z"/><path class="window" d="m20 10-5 10h34L43 10q-1-2-4-2H24q-3 0-4 2"/><rect class="wheel" x="10" y="32" width="11" height="12" rx="4"/><rect class="wheel" x="43" y="32" width="11" height="12" rx="4"/><circle class="wheel-inner" cx="15.5" cy="38" r="2.5"/><circle class="wheel-inner" cx="48.5" cy="38" r="2.5"/></svg>`;
  const tinyCar = color => carSVG(color).replace('class="car-icon"','class="stack-car"');
  function render(lot, logs, moving = []) {
    const items = lot.getItems();
    $('capacityStat').textContent = lot.capacity;
    $('parkedStat').textContent = items.length;
    $('availableStat').textContent = lot.capacity - items.length;
    $('departedStat').textContent = lot.departed;
    $('stackCount').textContent = `${items.length} / ${lot.capacity}`;
    $('lotStatus').textContent = lot.stack.isFull() ? 'Lot full' : `${lot.capacity - items.length} spaces available`;
    $('lotStatus').style.background = lot.stack.isFull() ? '#fff0f0' : '';
    $('lotStatus').style.color = lot.stack.isFull() ? '#c24553' : '';
    const grid = $('parkingGrid'); grid.innerHTML = '';
    // Visual slots are assigned bottom-to-top in the same order as the stack array.
    for (let i = 0; i < lot.capacity; i++) {
      const v = items[i]; const isMoving = v && moving.includes(Stack.normalizeRegistration(v.registration));
      const el = document.createElement('div'); el.className = `parking-space${v ? ' occupied' : ''}${isMoving ? ' moving' : ''}`;
      el.innerHTML = `<span class="space-number">SPACE ${String(i+1).padStart(2,'0')}</span>${v ? `${carSVG(v.color)}<span class="space-registration">${escapeHTML(v.registration)}</span><span class="space-model">${escapeHTML(v.model || v.owner)}</span><span class="space-status">${isMoving ? 'Moving…' : (i === items.length-1 ? 'Top of stack' : 'Occupied')}</span>` : `<div style="height:48px;display:grid;place-items:center;color:#c4cfd4;font-size:20px">＋</div><span class="space-registration" style="color:#a6b1b8">Available</span><span class="space-status">Empty</span>`}`;
      grid.appendChild(el);
    }
    const stack = $('stackView'); stack.innerHTML = '';
    if (!items.length) stack.innerHTML = '<div class="empty-stack">Stack is empty<br><small>Park a vehicle to push the first item.</small></div>';
    else [...items].reverse().forEach((v, reverseIndex) => {
      const realIndex = items.length - reverseIndex - 1; const el = document.createElement('div');
      el.className = `stack-item${realIndex === items.length-1 ? ' top' : ''}`;
      el.innerHTML = `<span class="stack-index">${realIndex+1}</span>${tinyCar(v.color)}<div class="stack-item-main"><strong>${escapeHTML(v.registration)}</strong><small>${escapeHTML(v.model || 'Vehicle')} · ${escapeHTML(v.owner)}</small></div>${realIndex === items.length-1 ? '<span class="top-tag">TOP</span>' : ''}`;
      stack.appendChild(el);
    });
    const select = $('exitSelect'); const old = select.value; select.innerHTML = '';
    if (!items.length) select.add(new Option('No vehicles parked', ''));
    else [...items].reverse().forEach(v => select.add(new Option(`${v.registration} — ${v.model || v.owner}`, v.registration)));
    if ([...select.options].some(o => o.value === old)) select.value = old;
    updateExitInfo(lot);
    const log = $('activityLog'); log.innerHTML = '';
    if (!logs.length) log.innerHTML = '<div class="log-empty">No activity yet. Operations will appear here.</div>';
    else logs.forEach(entry => {
      const row = document.createElement('div'); row.className = 'log-entry';
      row.innerHTML = `<span class="log-time">${escapeHTML(entry.time)}</span><div class="log-content"><span class="log-type ${entry.kind || ''}">${escapeHTML(entry.type)}</span><p>${escapeHTML(entry.message)}</p></div>`;
      log.appendChild(row);
    });
  }
  function updateExitInfo(lot) {
    const value = $('exitSelect').value; const info = $('exitInfo'); const btn = $('departBtn');
    if (!value) { info.textContent = 'Choose a vehicle to see its stack position.'; btn.disabled = true; return; }
    const found = lot.find(value); if (!found) { info.textContent = 'Vehicle not found.'; btn.disabled = true; return; }
    info.textContent = found.vehiclesAbove === 0 ? `Position ${found.position} of ${lot.stack.size()}: at TOP. It can leave directly with pop().` : `Position ${found.position} of ${lot.stack.size()}: ${found.vehiclesAbove} vehicle(s) above it must temporarily move.`;
    btn.disabled = false;
  }
  function notice(message, kind = 'success') { const n = $('notice'); n.textContent = message; n.className = `notice${kind === 'error' ? ' error' : kind === 'info' ? ' info' : ''}`; }
  function clock() { $('clock').textContent = new Date().toLocaleString(undefined, { weekday:'short', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit' }); }
  return { $, render, notice, clock, updateExitInfo, escapeHTML };
})();
