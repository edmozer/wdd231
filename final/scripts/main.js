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

// 3. Theme Toggle (Dark Mode)
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check local storage for theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
  body.setAttribute('data-theme', currentTheme);
  if (currentTheme === 'dark') {
    themeToggle.textContent = '☀️';
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    if (body.getAttribute('data-theme') === 'dark') {
      body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      themeToggle.textContent = '🌙';
    } else {
      body.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      themeToggle.textContent = '☀️';
    }
  });
}

// 4. Data Fetching & Display
const projectsContainer = document.getElementById('projects-container');
const featuredContainer = document.getElementById('featured-container');
const modal = document.getElementById('project-modal');
const closeModalBtn = document.querySelector('.close-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-description');
const modalTech = document.getElementById('modal-tech');

// State for filtering and sorting
let allProjects = [];

async function loadProjects() {
  try {
    const response = await fetch('data/projects.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    allProjects = data.projects;

    // Display on Projects Page
    if (projectsContainer) {
      renderProjects(allProjects, projectsContainer);
      setupControls();
    }

    // Display on Home Page (Featured - first 3)
    if (featuredContainer) {
      const featured = allProjects.slice(0, 3);
      renderProjects(featured, featuredContainer);
    }

  } catch (error) {
    console.error('Error fetching projects:', error);
    if (projectsContainer) projectsContainer.innerHTML = '<p>Error loading projects.</p>';
    if (featuredContainer) featuredContainer.innerHTML = '<p>Error loading projects.</p>';
  }
}

function renderProjects(projects, container) {
  container.innerHTML = '';
  
  if (projects.length === 0) {
    container.innerHTML = '<p>No projects found matching your criteria.</p>';
    return;
  }

  const projectCards = projects.map(project => {
    const card = document.createElement('div');
    card.classList.add('project-card');
    
    // Check if liked
    const isLiked = localStorage.getItem(`like-${project.id}`) === 'true';
    const likeClass = isLiked ? 'liked' : '';
    const likeIcon = isLiked ? '❤️' : '🤍';

    card.innerHTML = `
      <img src="${project.image}" alt="${project.title}" loading="lazy" width="300" height="200" class="project-img-trigger" data-id="${project.id}" style="width: 100%; height: auto; border-radius: 4px; cursor: pointer;">
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="tags">
        ${project.technology.map(tech => `<span class="tag">${tech}</span>`).join('')}
      </div>
      <div class="card-actions">
        <button class="view-details" data-id="${project.id}">View Details</button>
        <button class="like-btn ${likeClass}" data-id="${project.id}" aria-label="Like project">${likeIcon}</button>
      </div>
    `;
    return card;
  });

  projectCards.forEach(card => container.appendChild(card));

  // Add Event Listeners
  const openModalHandler = (e) => {
    const id = parseInt(e.target.getAttribute('data-id'));
    const project = allProjects.find(p => p.id === id);
    openModal(project);
  };

  container.querySelectorAll('.view-details').forEach(btn => {
    btn.addEventListener('click', openModalHandler);
  });

  container.querySelectorAll('.project-img-trigger').forEach(img => {
    img.addEventListener('click', openModalHandler);
  });

  container.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      toggleLike(id, e.target);
    });
  });
}

// 5. Like Functionality
function toggleLike(id, btn) {
  const key = `like-${id}`;
  const isLiked = localStorage.getItem(key) === 'true';
  
  if (isLiked) {
    localStorage.removeItem(key);
    btn.classList.remove('liked');
    btn.textContent = '🤍';
  } else {
    localStorage.setItem(key, 'true');
    btn.classList.add('liked');
    btn.textContent = '❤️';
  }
}

// 6. Modal Logic
function openModal(project) {
  if (!modal) return;
  
  // Create modal content dynamically if elements don't exist (for robustness)
  let content = modal.querySelector('.modal-content');
  if (!content) {
      content = document.createElement('div');
      content.classList.add('modal-content');
      modal.prepend(content);
  }
  
  content.innerHTML = `
    <h2>${project.title}</h2>
    <img src="${project.image}" alt="${project.title}" style="width:100%; border-radius: 8px; margin-bottom: 1rem;">
    <p><strong>Category:</strong> ${project.category}</p>
    <p><strong>Date:</strong> ${project.date || 'N/A'}</p>
    <p>${project.description}</p>
    <p><strong>Technologies:</strong> ${project.technology.join(', ')}</p>
    <button class="close-modal">Close</button>
    <a href="demo.html?id=${project.id}" class="launch-demo-btn" style="display:block; text-align:center; margin-top:1rem; background:var(--accent-color); color:#333; padding:0.75rem; text-decoration:none; font-weight:bold; border-radius:4px;">🚀 Launch Live Demo</a>
  `;

  modal.showModal();
  
  // Re-attach close listener since we overwrote HTML
  modal.querySelector('.close-modal').addEventListener('click', () => modal.close());
}

if (modal) {
  modal.addEventListener('click', (e) => {
      if (e.target === modal) {
          modal.close();
      }
  });
}

// 7. Advanced Controls (Filter, Search, Sort)
function setupControls() {
  const filterBtns = document.querySelectorAll('.filters button');
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');

  if (!filterBtns.length) return;

  // Filter Click
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      applyFilters();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  // Sort Select
  if (sortSelect) {
    sortSelect.addEventListener('change', applyFilters);
  }
}

function applyFilters() {
  const activeFilter = document.querySelector('.filters button.active').id;
  const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
  const sortValue = document.getElementById('sort-select')?.value || 'default';

  let filtered = allProjects;

  // 1. Filter by Category
  if (activeFilter === 'filter-webapp') {
    filtered = filtered.filter(p => p.category === 'Web App');
  } else if (activeFilter === 'filter-tools') {
    filtered = filtered.filter(p => p.category === 'Tool');
  }

  // 2. Filter by Search
  if (searchTerm) {
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(searchTerm) || 
      p.description.toLowerCase().includes(searchTerm) ||
      p.technology.some(t => t.toLowerCase().includes(searchTerm))
    );
  }

  // 3. Sort
  if (sortValue === 'name-asc') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortValue === 'name-desc') {
    filtered.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortValue === 'date-new') {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortValue === 'date-old') {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  renderProjects(filtered, projectsContainer);
}

// 8. Local Storage (Visitor Counter)
function updateVisitorCount() {
  let count = localStorage.getItem('visitorCount');
  if (!count) {
    count = 0;
  }
  count++;
  localStorage.setItem('visitorCount', count);
}

// 9. Form Data Display (Thank You Page)
const formResults = document.getElementById('form-results');
if (formResults) {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name');
  const email = params.get('email');
  const message = params.get('message');

  if (name && email) {
    formResults.innerHTML = `
      <div style="background: var(--card-bg); padding: 2rem; border-radius: 8px; box-shadow: var(--shadow);">
        <h3 style="color: var(--primary-color);">Submission Details</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><em>We will get back to you shortly!</em></p>
      </div>
    `;
  }
}

// Initialize
loadProjects();
updateVisitorCount();
