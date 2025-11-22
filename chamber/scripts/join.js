// Set timestamp
document.addEventListener('DOMContentLoaded', () => {
    const timestampInput = document.getElementById('timestamp');
    if (timestampInput) {
        timestampInput.value = new Date().toISOString();
    }

    // Modal logic
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const closeButtons = document.querySelectorAll('.close-modal');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default if it's a link, though we used button
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.showModal();
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('dialog');
            if (modal) {
                modal.close();
            }
        });
    });

    // Close modal when clicking outside
    const dialogs = document.querySelectorAll('dialog');
    dialogs.forEach(dialog => {
        dialog.addEventListener('click', (e) => {
            const rect = dialog.getBoundingClientRect();
            const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
              rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
            if (!isInDialog) {
                dialog.close();
            }
        });
    });
    
    // Footer year and last modified (reusing logic if not importing chamberHome.js)
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    
    const lastModifiedSpan = document.getElementById('lastModified');
    if (lastModifiedSpan) lastModifiedSpan.textContent = `Last Modification: ${document.lastModified}`;

    // Mobile Nav Toggle (reusing logic)
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
        });
    }
});
