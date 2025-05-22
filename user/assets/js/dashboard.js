document.addEventListener('DOMContentLoaded', function() {
    // Initialize slider
    initSlider();
    
    // Load latest reports
    loadLatestReports();
});

/**
 * Initialize image slider
 */
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    
    // Function to show slide
    function showSlide(index) {
        // Remove active class from all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    // Add click event to dots
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            showSlide(slideIndex);
            resetAutoSlide(); // Reset timer when manually changing slides
        });
    });
    
    // Auto slide functionality
    let slideInterval;
    
    function autoSlide() {
        let nextSlide = (currentSlide + 1) % slides.length;
        showSlide(nextSlide);
    }
    
    function startAutoSlide() {
        slideInterval = setInterval(autoSlide, 5000); // Change slide every 5 seconds
    }
    
    function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
    }
    
    // Start auto slide
    startAutoSlide();
    
    // Click on slider to go to next slide
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('click', function(e) {
            // Only trigger if clicking on the slider itself, not the dots
            if (!e.target.classList.contains('dot')) {
                autoSlide();
                resetAutoSlide();
            }
        });
    }
}

/**
 * Load latest reports from localStorage and display them on the dashboard
 */
function loadLatestReports() {
    // Get reports from localStorage
    const reports = getData('reports') || [];
    
    // Sort reports by date (newest first)
    reports.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Get latest reports container
    const latestReportsContainer = document.querySelector('.report-cards');
    if (!latestReportsContainer) return;
    
    // If there are no reports, show a message
    if (reports.length === 0) {
        const noReportsMessage = document.createElement('p');
        noReportsMessage.textContent = 'Belum ada laporan. Silakan buat laporan baru.';
        noReportsMessage.style.textAlign = 'center';
        noReportsMessage.style.padding = '20px';
        noReportsMessage.style.color = 'var(--text-light)';
        noReportsMessage.style.gridColumn = '1 / -1';
        
        // Clear any existing reports and add the message
        latestReportsContainer.innerHTML = '';
        latestReportsContainer.appendChild(noReportsMessage);
        return;
    }
    
    // Display up to 6 latest reports
    const latestReports = reports.slice(0, 6);
    
    // Clear the container
    latestReportsContainer.innerHTML = '';
    
    // Add each report to the container
    latestReports.forEach(report => {
        const reportCard = createReportCard(report);
        latestReportsContainer.appendChild(reportCard);
    });
    
    // Add hover animations to report cards
    addReportCardAnimations();
}

/**
 * Create a report card element
 * @param {Object} report - Report data
 * @returns {HTMLElement} Report card element
 */
function createReportCard(report) {
    const reportCard = document.createElement('div');
    reportCard.className = 'report-card';
    
    // Reporter information
    const reporter = document.createElement('div');
    reporter.className = 'reporter';
    
    const avatar = document.createElement('img');
    avatar.className = 'avatar';
    avatar.src = 'assets/img/avatar.png';
    avatar.alt = 'Reporter Avatar';
    
    const reporterInfo = document.createElement('div');
    reporterInfo.className = 'reporter-info';
    
    const reporterName = document.createElement('h3');
    reporterName.textContent = report.reporterName || 'Unknown';
    
    const reportDate = document.createElement('span');
    reportDate.textContent = formatDate(new Date(report.date));
    
    reporterInfo.appendChild(reporterName);
    reporterInfo.appendChild(reportDate);
    
    reporter.appendChild(avatar);
    reporter.appendChild(reporterInfo);
    
    // Report content
    const reportContent = document.createElement('div');
    reportContent.className = 'report-content';
    
    let reportImage;
    if (report.imageUrl) {
        reportImage = document.createElement('img');
        reportImage.className = 'report-image';
        reportImage.src = report.imageUrl;
        reportImage.alt = 'Report Image';
        reportContent.appendChild(reportImage);
    } else {
        reportImage = document.createElement('img');
        reportImage.className = 'report-image';
        reportImage.src = 'assets/img/report-image.jpg';
        reportImage.alt = 'Default Report Image';
        reportContent.appendChild(reportImage);
    }
    
    const reportDescription = document.createElement('p');
    reportDescription.textContent = report.description;
    reportContent.appendChild(reportDescription);
    
    // Add all elements to the card
    reportCard.appendChild(reporter);
    reportCard.appendChild(reportContent);
    
    return reportCard;
}

/**
 * Add hover animations to report cards
 */
function addReportCardAnimations() {
    const reportCards = document.querySelectorAll('.report-card');
    
    reportCards.forEach(card => {
        // Add bubble effect on hover
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
        });
    });
}