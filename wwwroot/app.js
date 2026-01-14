// Gallery Filters
window.initializeGalleryFilters = function () {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
};

// Lazy Loading for Images
window.initializeLazyLoading = function () {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    window.initializeLazyLoading();
});

// Add CSS animation for fade in
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Analytics Tracking
window.trackEvent = function(category, action, label = null, value = null) {
    // Google Analytics 4 tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
    
    // Custom analytics for internal tracking
    console.log('Analytics Event:', { category, action, label, value });
    
    // Send to server if needed
    fetch('/api/analytics', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            category,
            action,
            label,
            value,
            timestamp: new Date().toISOString(),
            url: window.location.pathname
        })
    }).catch(error => {
        console.log('Analytics tracking failed:', error);
    });
};

// Track page views
window.trackPageView = function(page) {
    window.trackEvent('Navigation', 'Page View', page);
};

// Track form submissions
window.trackFormSubmission = function(formType) {
    window.trackEvent('Forms', 'Form Submission', formType);
};

// Track quote calculator usage
window.trackQuoteCalculation = function(package, total) {
    window.trackEvent('Quote Calculator', 'Quote Calculated', package, total);
};

// Track booking events
window.trackBooking = function(service, date) {
    window.trackEvent('Booking', 'Appointment Booked', service, date);
};

// Initialize service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Dynamic script loading
window.loadScript = function(src) {
    console.log(`Loading script: ${src}`);
    return new Promise((resolve, reject) => {
        // Check if script is already loaded
        if (document.querySelector(`script[src="${src}"]`)) {
            console.log(`Script ${src} already loaded`);
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            console.log(`Script ${src} loaded successfully`);
            resolve();
        };
        script.onerror = (error) => {
            console.error(`Failed to load script ${src}:`, error);
            reject(error);
        };
        document.head.appendChild(script);
    });
}; 