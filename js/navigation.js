// navigation.js
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('primary-nav');

if (toggle && nav) {
  const firstLink = nav.querySelector('a');

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen && firstLink) {
      // Move focus into the nav for keyboard users
      firstLink.focus();
    }
  });

  // Close menu with Escape key when nav is open
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
}
