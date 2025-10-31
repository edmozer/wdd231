// course.js
// Course list array
const courses = [
  { code: 'WDD 130', title: 'Web Fundamentals', credits: 2, category: 'WDD', completed: true },
  { code: 'WDD 131', title: 'Dynamic Web Fundamentals', credits: 2, category: 'WDD', completed: true },
  { code: 'WDD 231', title: 'Web Frontend Development I', credits: 3, category: 'WDD', completed: false },
  { code: 'CSE 111', title: 'Programming with Functions', credits: 2, category: 'CSE', completed: true },
  { code: 'CSE 121b', title: 'JavaScript Language', credits: 2, category: 'CSE', completed: false },
  { code: 'CSE 210', title: 'Programming with Classes', credits: 2, category: 'CSE', completed: false },
];

const listEl = document.getElementById('course-list');
const totalEl = document.getElementById('credit-total');

if (!listEl || !totalEl) {
  // If required DOM elements are missing, bail out gracefully.
  console.warn('Course list or total element missing, course script will not run.');
}

function render(items){
  if (!listEl || !totalEl) return;
  listEl.innerHTML = '';
  items.forEach(course => {
    const article = document.createElement('article');
    article.className = 'course' + (course.completed ? ' completed' : '');

    const left = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = course.code + ' • ' + course.title;
    title.className = 'title';

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = course.category + ' • ' + course.credits + ' credits';

    left.appendChild(title);
    left.appendChild(meta);

    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = course.completed ? 'Completed' : 'Planned';
    // Provide an accessible label for screen readers
    const sr = document.createElement('span');
    sr.className = 'visually-hidden';
    sr.textContent = course.completed ? 'Course completed' : 'Course planned';
    badge.appendChild(sr);

    article.appendChild(left);
    article.appendChild(badge);
    listEl.appendChild(article);
  });

  const total = items.reduce((sum, c) => sum + Number(c.credits || 0), 0);
  totalEl.textContent = 'Total credits currently shown: ' + total;
}

// Filters
const btnAll = document.getElementById('filter-all');
const btnCSE = document.getElementById('filter-cse');
const btnWDD = document.getElementById('filter-wdd');
const buttons = [btnAll, btnCSE, btnWDD];

function select(btn){
  buttons.forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

btnAll.addEventListener('click', () => { select(btnAll); render(courses); });
btnCSE.addEventListener('click', () => { select(btnCSE); render(courses.filter(c => c.category === 'CSE')); });
btnWDD.addEventListener('click', () => { select(btnWDD); render(courses.filter(c => c.category === 'WDD')); });

// Initial render
render(courses);
