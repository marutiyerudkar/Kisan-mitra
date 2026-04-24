// ============================================================
// Global Toast Notification System
// Usage: showToast('Your message', 'success') or 'error' or 'info'
// ============================================================

function showToast(message, type = 'info') {
    // Create container if not exists
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // Icon mapping
    const icons = {
        success: '<i class="fa-solid fa-circle-check"></i>',
        error: '<i class="fa-solid fa-circle-xmark"></i>',
        info: '<i class="fa-solid fa-circle-info"></i>'
    };

    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    container.appendChild(toast);

    // Trigger slide-in animation
    requestAnimationFrame(() => {
        toast.classList.add('toast-visible');
    });

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
        toast.classList.remove('toast-visible');
        toast.classList.add('toast-hiding');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// ============================================================
// Main Application Logic
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Toggle animation for bars
        mobileMenu.classList.toggle('active');
    });

    // Intersection Observer for Scroll Animations
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Scheme Filtering Logic
    const filterTags = document.querySelectorAll('.filter-tag');
    const schemeCards = document.querySelectorAll('.scheme-card');
    const searchInput = document.getElementById('scheme-search');

    // Filter by tags
    filterTags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            // Remove active class from all tags
            filterTags.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tag
            e.target.classList.add('active');

            const filterValue = e.target.getAttribute('data-filter');

            schemeCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'flex';
                    // small animation reset
                    card.style.animation = 'none';
                    card.offsetHeight; /* trigger reflow */
                    card.style.animation = null; 
                } else {
                    if (card.getAttribute('data-category').includes(filterValue)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // Filter by search input
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const searchValue = e.target.value.toLowerCase();
            
            // Reset active tags to All when searching
            filterTags.forEach(t => t.classList.remove('active'));
            document.querySelector('.filter-tag[data-filter="all"]').classList.add('active');

            schemeCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const desc = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchValue) || desc.includes(searchValue)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

});
