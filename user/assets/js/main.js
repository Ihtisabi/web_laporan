document.addEventListener('DOMContentLoaded', function() {
    // Get current page path
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Set active nav link
    const navLinks = document.querySelectorAll('.nav-logo a');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active-nav');
        }
        
        // Add hover effect
        link.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active-nav')) {
                this.style.color = 'white';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active-nav')) {
                this.style.color = '';
            }
        });
    });
    
    // Menu toggle functionality for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            // Toggle mobile menu functionality would go here
            console.log('Menu toggle clicked');
        });
    }
    
    // Add pulse animation to user avatar
    const userAvatar = document.querySelector('.user-info .avatar');
    if (userAvatar) {
        userAvatar.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.3)';
        });
        
        userAvatar.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    }
});

/**
 * Display error message
 * @param {string} message - Error message to display
 * @param {HTMLElement} element - Element to show error for
 */
function showError(message, element) {
    // Remove any existing error message
    const existingError = element.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.style.color = 'var(--error-color)';
    errorMessage.style.fontSize = '0.85rem';
    errorMessage.style.marginTop = '5px';
    errorMessage.textContent = message;
    
    // Insert error after the element
    element.parentNode.insertBefore(errorMessage, element.nextSibling);
    
    // Highlight the field
    element.style.borderColor = 'var(--error-color)';
    
    // Remove error after 3 seconds
    setTimeout(() => {
        errorMessage.remove();
        element.style.borderColor = '';
    }, 3000);
}

/**
 * Format date to locale string
 * @param {Date} date - Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

/**
 * Store data in localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 */
function storeData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Get data from localStorage
 * @param {string} key - Storage key
 * @returns {any} Stored data
 */
function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

/**
 * Basic modal functionality
 * @param {string} modalId - Modal element ID
 * @param {boolean} show - Whether to show or hide the modal
 */
function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    if (show) {
        modal.classList.add('active');
    } else {
        modal.classList.remove('active');
    }
}