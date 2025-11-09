// directory.js
// Fetch and render members from JSON, toggle grid/list view
const membersUrl = 'data/members.json';
const container = document.getElementById('members-container');
const gridBtn = document.getElementById('grid-view');
const listBtn = document.getElementById('list-view');

async function fetchMembers() {
  const res = await fetch(membersUrl);
  return res.json();
}

function renderMembers(members, view = 'grid') {
  if (!container) return;
  container.className = view;
  container.innerHTML = '';
  members.forEach(m => {
    const card = document.createElement('div');
    card.className = view === 'grid' ? 'member-card' : 'member-list-item';
    card.innerHTML = `
  <img src="images/images/chamber/${m.image}" alt="${m.name} logo" class="member-img">
      <div class="member-info">
        <h3>${m.name}</h3>
        <p>${m.address}</p>
        <p>${m.phone}</p>
        <a href="${m.website}" target="_blank">Website</a>
        <span class="membership level-${m.membership}">Level: ${['Member','Silver','Gold'][m.membership-1]}</span>
        <p>${m.info}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function setView(view) {
  fetchMembers().then(members => renderMembers(members, view));
}

gridBtn.addEventListener('click', () => setView('grid'));
listBtn.addEventListener('click', () => setView('list'));

// Initial render
setView('grid');

// Footer year and last modified
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();
const lastMod = document.getElementById('lastModified');
if (lastMod) lastMod.textContent = `Last Modified: ${document.lastModified}`;
