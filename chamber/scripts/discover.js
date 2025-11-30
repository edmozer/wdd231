import { places } from '../data/places.mjs';

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Nav Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
        });
    }

    // Footer Last Modified
    const lastModifiedSpan = document.getElementById('lastModified');
    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = `Last Modification: ${document.lastModified}`;
    }

    // Visitor Message (localStorage)
    const visitorMessage = document.getElementById('visitor-message');
    const lastVisit = localStorage.getItem('lastVisit');
    const now = Date.now();
    
    if (!lastVisit) {
        visitorMessage.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const daysBetween = (now - parseInt(lastVisit)) / (1000 * 60 * 60 * 24);
        if (daysBetween < 1) {
            visitorMessage.textContent = "Back so soon! Awesome!";
        } else {
            const days = Math.floor(daysBetween);
            visitorMessage.textContent = `You last visited ${days} ${days === 1 ? 'day' : 'days'} ago.`;
        }
    }
    localStorage.setItem('lastVisit', now);

    // Render Places
    const placesContainer = document.getElementById('places-container');
    if (placesContainer) {
        places.forEach(place => {
            const card = document.createElement('div');
            card.className = 'place-card';
            
            const title = document.createElement('h2');
            title.textContent = place.name;
            
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            img.src = place.image;
            img.alt = place.name;
            img.loading = 'lazy';
            img.width = 300;
            img.height = 200;
            figure.appendChild(img);
            
            const address = document.createElement('address');
            address.textContent = place.address;
            
            const desc = document.createElement('p');
            desc.textContent = place.description;
            
            const btn = document.createElement('button');
            btn.textContent = 'Learn More';
            btn.className = 'learn-more-btn';
            
            card.appendChild(title);
            card.appendChild(figure);
            card.appendChild(address);
            card.appendChild(desc);
            card.appendChild(btn);
            
            placesContainer.appendChild(card);
        });
    }
});
