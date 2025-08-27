// == State ==
let coins = 100;
let heartCount = 0;
let copyCount = 2;

// == Elements ==
const coinEl = document.getElementById('coin-count');
const heartEl = document.getElementById('heart-count');
const copyEl = document.getElementById('copy-count');
const historyList = document.getElementById('history-list');
const clearBtn = document.getElementById('clear-history');

// Update navbar values
function updateNavbar(){
  coinEl.textContent = coins;
  heartEl.textContent = heartCount;
  copyEl.textContent = copyCount;
}

function showAlert(msg){
  alert(msg);
}

function addHistory(name, number, timeStr){
  // Remove placeholder
  if(historyList.children.length === 1 && historyList.children[0].textContent.includes('No calls yet')){
    historyList.innerHTML = '';
  }
  const item = document.createElement('div');
  item.className = 'history-item';
  item.innerHTML = `
    <div class="meta">
      <div style="font-weight:700">${name}</div>
      <div style="font-size:13px;color:var(--muted)">${number}</div>
    </div>
    <div class="time">${timeStr}</div>
  `;
  historyList.prepend(item);
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    document.body.removeChild(textArea);
    return false;
  }
}

async function copyText(text){
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ok = fallbackCopyTextToClipboard(text);
      if (!ok) throw e;
    }
  } else {
    const ok = fallbackCopyTextToClipboard(text);
    if (!ok) throw new Error('Copy failed');
  }
  copyCount++;
  updateNavbar();
  showAlert(`Copied ${text} to clipboard`);
}

function callService(name, number){
  if (coins < 20) {
    showAlert('Not enough coins to make a call. Each call costs 20 coins.');
    return;
  }
  coins -= 20;
  updateNavbar();
  showAlert(`Calling ${name}\nNumber: ${number}`);
  const now = new Date();
  const timeStr = now.toLocaleTimeString();
  addHistory(name, number, timeStr);
}

// Event bindings
document.querySelectorAll('.card').forEach(card => {
  const copyBtn = card.querySelector('.copy');
  const callBtn = card.querySelector('.call');
  const heartBtn = card.querySelector('.heart-btn');

  const name = card.dataset.name;
  const number = card.dataset.number;

  copyBtn.addEventListener('click', e => {
    e.stopPropagation();
    copyText(number).catch(() => {
      showAlert('Unable to copy. Please copy manually: ' + number);
    });
  });

  callBtn.addEventListener('click', e => {
    e.stopPropagation();
    callService(name, number);
  });

  heartBtn.addEventListener('click', e => {
    e.stopPropagation();
    heartCount++;
    heartBtn.classList.toggle('liked');
    updateNavbar();
  });
});

clearBtn.addEventListener('click', () => {
  historyList.innerHTML = '<div style="color:var(--muted);font-size:13px;padding:8px 4px">No calls yet.</div>';
});

updateNavbar();
