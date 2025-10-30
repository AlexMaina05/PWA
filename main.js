// Replace the badge-related functions in main.js with these updated versions.
// They detect mobile devices / small screens and toggle `.bottom` class so the badge
// appears at the bottom (slide-up) on mobile, top (slide-down) on desktop.
// Also add a resize listener to update placement dynamically.

// returns true if device likely mobile / narrow
function isMobilePlacement() {
  try {
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    const narrow = window.innerWidth <= 520;
    return isTouch || narrow;
  } catch (e) {
    return false;
  }
}

function createBadgeElement() {
  let badge = document.getElementById('pwa-badge');
  if (badge) return setBadgePlacement(badge), badge;

  badge = document.createElement('div');
  badge.id = 'pwa-badge';
  badge.classList.add('pwa-badge'); // base class

  const text = document.createElement('span');
  text.id = 'pwa-badge-text';
  text.className = 'pwa-badge-text';
  badge.appendChild(text);

  const action = document.createElement('button');
  action.id = 'pwa-badge-action';
  action.className = 'pwa-badge-action';
  action.setAttribute('hidden', '');
  badge.appendChild(action);

  const closeBtn = document.createElement('button');
  closeBtn.id = 'pwa-badge-close';
  closeBtn.className = 'pwa-badge-close';
  closeBtn.innerText = '✕';
  closeBtn.title = 'Nascondi';
  closeBtn.setAttribute('hidden', '');
  closeBtn.addEventListener('click', () => { animateHide(badge); });
  badge.appendChild(closeBtn);

  document.body.appendChild(badge);

  // set initial placement
  setBadgePlacement(badge);

  // update placement on resize (debounced)
  let rto = null;
  window.addEventListener('resize', () => {
    if (rto) clearTimeout(rto);
    rto = setTimeout(() => setBadgePlacement(badge), 180);
  });

  return badge;
}

function setBadgePlacement(badge) {
  if (!badge) return;
  if (isMobilePlacement()) {
    badge.classList.add('bottom');
  } else {
    badge.classList.remove('bottom');
  }
}

// show with animation
function animateShow(badge) {
  if (!badge) return;
  // remove hide if present and force reflow
  badge.classList.remove('hide');
  void badge.offsetWidth;
  badge.style.display = 'flex';
  badge.classList.add('visible');
}

// hide with animation, then set display none when done
function animateHide(badge, timeout = 260) {
  if (!badge) return;
  badge.classList.remove('visible');
  badge.classList.add('hide');
  setTimeout(() => {
    try { badge.style.display = 'none'; } catch (e) {}
    badge.classList.remove('hide');
  }, timeout + 20);
}

function setBadge(status, options = {}) {
  const badge = createBadgeElement();
  const text = badge.querySelector('#pwa-badge-text');
  const action = badge.querySelector('#pwa-badge-action');
  const closeBtn = badge.querySelector('#pwa-badge-close');

  // reset
  badge.classList.remove('offline', 'online', 'update-available', 'installable');
  action.onclick = null;
  action.setAttribute('hidden', '');
  closeBtn.setAttribute('hidden', '');

  if (status === 'hidden') { animateHide(badge); return; }

  if (status === 'offline') {
    badge.classList.add('offline');
    text.textContent = 'Offline';
    closeBtn.removeAttribute('hidden');
    animateShow(badge);
  } else if (status === 'online') {
    badge.classList.add('online');
    text.textContent = 'Online';
    animateShow(badge);
    setTimeout(() => animateHide(badge), 3000);
  } else if (status === 'update-available') {
    badge.classList.add('update-available');
    text.textContent = options.message || 'Aggiornamento disponibile';
    action.removeAttribute('hidden');
    action.textContent = options.actionText || 'Ricarica';
    action.onclick = options.onAction || (() => applyUpdate(swRegistration));
    closeBtn.removeAttribute('hidden');
    animateShow(badge);
  } else if (status === 'installable') {
    badge.classList.add('installable');
    text.textContent = options.message || 'Installa app';
    action.removeAttribute('hidden');
    action.textContent = options.actionText || 'Installa';
    action.onclick = options.onAction || (() => {
      if (window.deferredPrompt) {
        window.deferredPrompt.prompt();
        window.deferredPrompt.userChoice.then(choice => {
          if (choice.outcome === 'accepted') {
            setBadge('online');
          }
          window.deferredPrompt = null;
        });
      } else {
        alert('Installazione non disponibile in questo browser.');
      }
    });
    closeBtn.removeAttribute('hidden');
    animateShow(badge);
  } else {
    animateHide(badge);
  }
}

// minimal helper called at app init
function setupPwaBadge() {
  createBadgeElement();
  updateNetworkBadge(); // existing function that shows offline/online
}
