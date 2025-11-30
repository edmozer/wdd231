// Main JavaScript Module

// 1. Navigation
const nav = document.querySelector('nav');
const menuToggle = document.querySelector('.menu-toggle');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
    menuToggle.setAttribute('aria-expanded', !expanded);
    menuToggle.innerHTML = expanded ? '&#9776;' : 'X';
  });
}

// 2. Footer Year
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// 3. Data Fetching & Display
const projectsContainer = document.getElementById('projects-container');
const featuredContainer = document.getElementById('featured-container');
const modal = document.getElementById('project-modal');
const closeModalBtn = document.querySelector('.close-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-description');
const modalTech = document.getElementById('modal-tech');

async function loadProjects() {
  try {
    const response = await fetch('data/projects.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const projects = data.projects;

    // Display on Projects Page
    if (projectsContainer) {
      displayProjects(projects, projectsContainer);
      setupFilters(projects);
    }

    // Display on Home Page (Featured - first 3)
    if (featuredContainer) {
      const featured = projects.slice(0, 3);
      displayProjects(featured, featuredContainer);
    }

  } catch (error) {
    console.error('Error fetching projects:', error);
    if (projectsContainer) projectsContainer.innerHTML = '<p>Error loading projects.</p>';
    if (featuredContainer) featuredContainer.innerHTML = '<p>Error loading projects.</p>';
  }
}

function displayProjects(projects, container) {
  container.innerHTML = '';
  const projectCards = projects.map(project => {
    const card = document.createElement('div');
    card.classList.add('project-card');
    card.innerHTML = `
      <img src="${project.image}" alt="${project.title}" loading="lazy" width="300" height="200" style="width: 100%; height: auto; border-radius: 4px;">
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="tags">
        ${project.technology.map(tech => `<span class="tag">${tech}</span>`).join('')}
      </div>
      <button class="view-details" data-id="${project.id}" style="margin-top: 1rem; padding: 0.5rem; cursor: pointer;">View Details</button>
    `;
    return card;
  });

  projectCards.forEach(card => container.appendChild(card));

  // Add Event Listeners for Modals
  container.querySelectorAll('.view-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      const project = projects.find(p => p.id === id);
      openModal(project);
    });
  });
}

// 4. Modal Logic
function openModal(project) {
  if (!modal) return;
  modalTitle.textContent = project.title;
  modalDesc.textContent = project.description;
  modalTech.textContent = project.technology.join(', ');
  modal.showModal();
}

if (closeModalBtn && modal) {
  closeModalBtn.addEventListener('click', () => {
    modal.close();
  });
  
  modal.addEventListener('click', (e) => {
      if (e.target === modal) {
          modal.close();
      }
  });
}

// 5. Filters (Array Method: filter)
function setupFilters(projects) {
  const filterAll = document.getElementById('filter-all');
  const filterWebApp = document.getElementById('filter-webapp');
  const filterTools = document.getElementById('filter-tools');

  if (filterAll) {
    filterAll.addEventListener('click', () => displayProjects(projects, projectsContainer));
  }
  if (filterWebApp) {
    filterWebApp.addEventListener('click', () => {
      const filtered = projects.filter(p => p.category === 'Web App');
      displayProjects(filtered, projectsContainer);
    });
  }
  if (filterTools) {
    filterTools.addEventListener('click', () => {
      const filtered = projects.filter(p => p.category === 'Tool');
      displayProjects(filtered, projectsContainer);
    });
  }
}

// 6. Local Storage (Visitor Counter)
function updateVisitorCount() {
  let count = localStorage.getItem('visitorCount');
  if (!count) {
    count = 0;
  }
  count++;
  localStorage.setItem('visitorCount', count);
  // console.log(`You have visited this site ${count} times.`);
}

// 7. Form Data Display (Thank You Page)
const formResults = document.getElementById('form-results');
if (formResults) {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name');
  const email = params.get('email');
  const message = params.get('message');

  if (name && email) {
    formResults.innerHTML = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;
  }
}

// Initialize
loadProjects();
updateVisitorCount();
