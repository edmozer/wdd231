document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);

    const fields = [
        'firstName',
        'lastName',
        'email',
        'phone',
        'orgName',
        'timestamp'
    ];

    fields.forEach(field => {
        const element = document.getElementById(`result-${field}`);
        if (element) {
            const value = urlParams.get(field);
            if (value) {
                // Decode URI component to handle special characters
                element.textContent = decodeURIComponent(value);
            } else {
                element.textContent = 'Not provided';
            }
        }
    });

    // Footer year and last modified
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    
    const lastModifiedSpan = document.getElementById('lastModified');
    if (lastModifiedSpan) lastModifiedSpan.textContent = `Last Modification: ${document.lastModified}`;

    // Mobile Nav Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
        });
    }
});
