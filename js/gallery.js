// ===================================
// Gallery & Lightbox JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {

    // ===================================
    // Gallery Image Data
    // ===================================
    const galleryImages = [
        {
            src: './images/downloaded/hero-1.jpg',
            alt: 'Café Marameo exterior view',
            caption: 'Welcome to Café Marameo'
        },
        {
            src: './images/downloaded/gallery-1.jpg',
            alt: 'Cozy interior of the café',
            caption: 'Our cozy interior'
        },
        {
            src: './images/downloaded/gallery-2.jpg',
            alt: 'Fresh coffee and pastries',
            caption: 'Fresh coffee and pastries'
        },
        {
            src: './images/downloaded/gallery-3.jpg',
            alt: 'Comfortable seating area',
            caption: 'Comfortable seating'
        },
        {
            src: './images/downloaded/gallery-4.jpg',
            alt: 'Delicious homemade pastries',
            caption: 'Homemade Italian pastries'
        },
        {
            src: './images/downloaded/gallery-5.jpg',
            alt: 'Expert coffee preparation',
            caption: 'Expert coffee preparation'
        },
        {
            src: './images/downloaded/gallery-6.jpg',
            alt: 'Warm café atmosphere',
            caption: 'Warm atmosphere'
        },
        {
            src: './images/downloaded/gallery-7.jpg',
            alt: 'Italian specialties',
            caption: 'Italian specialties'
        },
        {
            src: './images/downloaded/gallery-8.jpg',
            alt: 'Café interior details',
            caption: 'Attention to detail'
        },
        {
            src: './images/downloaded/gallery-9.jpg',
            alt: 'Outdoor seating area',
            caption: 'Outdoor seating available'
        }
    ];

    // ===================================
    // Lightbox Elements
    // ===================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-item');

    let currentImageIndex = 0;

    // ===================================
    // Open Lightbox
    // ===================================
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open

        // Add keyboard navigation
        document.addEventListener('keydown', handleKeyboard);
    }

    // ===================================
    // Close Lightbox
    // ===================================
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        document.removeEventListener('keydown', handleKeyboard);
    }

    // ===================================
    // Update Lightbox Image
    // ===================================
    function updateLightboxImage() {
        const imageData = galleryImages[currentImageIndex];
        lightboxImg.src = imageData.src;
        lightboxImg.alt = imageData.alt;

        // Add fade animation
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.style.transition = 'opacity 0.3s ease';
            lightboxImg.style.opacity = '1';
        }, 50);
    }

    // ===================================
    // Navigate to Previous Image
    // ===================================
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    }

    // ===================================
    // Navigate to Next Image
    // ===================================
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightboxImage();
    }

    // ===================================
    // Keyboard Navigation
    // ===================================
    function handleKeyboard(e) {
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    }

    // ===================================
    // Event Listeners for Gallery Items
    // ===================================
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            openLightbox(index);
        });

        // Add keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `View image ${index + 1} in lightbox`);

        item.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });

    // ===================================
    // Event Listeners for Lightbox Controls
    // ===================================
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPrevImage);
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }

    // Close lightbox when clicking on the background
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // ===================================
    // Touch/Swipe Support for Mobile
    // ===================================
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - show next image
                showNextImage();
            } else {
                // Swipe right - show previous image
                showPrevImage();
            }
        }
    }

    // ===================================
    // Preload Adjacent Images
    // ===================================
    function preloadAdjacentImages(index) {
        const prevIndex = (index - 1 + galleryImages.length) % galleryImages.length;
        const nextIndex = (index + 1) % galleryImages.length;

        [prevIndex, nextIndex].forEach(i => {
            const img = new Image();
            img.src = galleryImages[i].src;
        });
    }

    // Preload images when lightbox opens
    lightbox.addEventListener('transitionend', function(e) {
        if (lightbox.classList.contains('active')) {
            preloadAdjacentImages(currentImageIndex);
        }
    });

    // ===================================
    // Gallery Grid Animation on Scroll
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const galleryObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation for each gallery item
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 50);
                galleryObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe gallery items for staggered animation
    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px) scale(0.95)';
        item.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        galleryObserver.observe(item);
    });

    // ===================================
    // Image Error Handling
    // ===================================
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            img.addEventListener('error', function() {
                // Replace with placeholder or show error message
                console.warn(`Failed to load image: ${this.src}`);
                this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not available%3C/text%3E%3C/svg%3E';
            });
        }
    });

    // ===================================
    // Gallery Image Counter (optional enhancement)
    // ===================================
    function createImageCounter() {
        const counter = document.createElement('div');
        counter.className = 'lightbox-counter';
        counter.style.cssText = `
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: 16px;
            background: rgba(0, 0, 0, 0.5);
            padding: 8px 16px;
            border-radius: 20px;
            font-family: var(--font-body);
        `;
        lightbox.appendChild(counter);

        return counter;
    }

    const imageCounter = createImageCounter();

    function updateCounter() {
        imageCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    }

    // Update counter when lightbox opens or image changes
    const originalUpdateLightboxImage = updateLightboxImage;
    updateLightboxImage = function() {
        originalUpdateLightboxImage();
        updateCounter();
    };

    // ===================================
    // Console Log for Debugging
    // ===================================
    console.log(`Gallery initialized with ${galleryImages.length} images`);
});
