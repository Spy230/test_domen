// Карусель "Наши работы" - Чистый JavaScript
// Адаптивная карусель с поддержкой свайпов и клавиатуры

class WorksCarousel {
    constructor(selector) {
        this.carousel = document.querySelector(selector);
        if (!this.carousel) return;
        
        this.track = this.carousel.querySelector('.carousel-track');
        this.slides = this.carousel.querySelectorAll('.carousel-slide');
        this.prevBtn = this.carousel.querySelector('.carousel-prev');
        this.nextBtn = this.carousel.querySelector('.carousel-next');
        
        this.currentIndex = 0;
        this.slidesToShow = this.getSlidesToShow();
        this.slideWidth = 0;
        this.isAnimating = false;
        
        // Touch/swipe поддержка
        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;
        
        this.init();
    }
    
    init() {
        this.setupSlides();
        this.bindEvents();
        this.setupLazyLoading();
        this.setupLightbox();
        
        // Обновляем при изменении размера окна
        window.addEventListener('resize', this.debounce(() => {
            this.slidesToShow = this.getSlidesToShow();
            this.setupSlides();
        }, 250));
    }
    
    getSlidesToShow() {
        const width = window.innerWidth;
        if (width < 768) return 1;      // Мобильные
        if (width < 1024) return 2;     // Планшеты
        if (width < 1200) return 3;     // Десктоп
        return 4;                       // Большие экраны
    }
    
    setupSlides() {
        const containerWidth = this.carousel.querySelector('.carousel-container').offsetWidth;
        const gap = 16; // Отступ между слайдами
        
        if (this.slidesToShow === 1) {
            // Мобильные: peek effect
            this.slideWidth = containerWidth * 0.85;
        } else {
            this.slideWidth = (containerWidth - (gap * (this.slidesToShow - 1))) / this.slidesToShow;
        }
        
        this.slides.forEach((slide, index) => {
            slide.style.width = `${this.slideWidth}px`;
            slide.style.marginRight = index < this.slides.length - 1 ? `${gap}px` : '0';
        });
        
        this.updateCarousel();
    }
    
    bindEvents() {
        // Кнопки навигации
        this.prevBtn?.addEventListener('click', () => this.prev());
        this.nextBtn?.addEventListener('click', () => this.next());
        
        // Клавиатурная навигация
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
        
        // Touch события
        this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.track.addEventListener('touchend', () => this.handleTouchEnd());
        
        // Mouse события для десктопа
        this.track.addEventListener('mousedown', (e) => this.handleMouseStart(e));
        this.track.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.track.addEventListener('mouseup', () => this.handleMouseEnd());
        this.track.addEventListener('mouseleave', () => this.handleMouseEnd());
    }
    
    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.isDragging = true;
        this.track.style.transition = 'none';
    }
    
    handleTouchMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.currentX = e.touches[0].clientX;
        const diff = this.startX - this.currentX;
        
        // Предварительный просмотр движения
        const currentTransform = this.getCurrentTransform();
        this.track.style.transform = `translateX(${currentTransform - diff}px)`;
    }
    
    handleTouchEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.track.style.transition = '';
        
        const diff = this.startX - this.currentX;
        const threshold = this.slideWidth * 0.2; // 20% от ширины слайда
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        } else {
            this.updateCarousel();
        }
    }
    
    handleMouseStart(e) {
        e.preventDefault();
        this.startX = e.clientX;
        this.isDragging = true;
        this.track.style.transition = 'none';
        this.track.style.cursor = 'grabbing';
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.currentX = e.clientX;
        const diff = this.startX - this.currentX;
        
        const currentTransform = this.getCurrentTransform();
        this.track.style.transform = `translateX(${currentTransform - diff}px)`;
    }
    
    handleMouseEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.track.style.transition = '';
        this.track.style.cursor = '';
        
        const diff = this.startX - this.currentX;
        const threshold = this.slideWidth * 0.2;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        } else {
            this.updateCarousel();
        }
    }
    
    getCurrentTransform() {
        const transform = window.getComputedStyle(this.track).transform;
        if (transform === 'none') return 0;
        
        const matrix = transform.match(/matrix.*\((.+)\)/)[1].split(', ');
        return parseFloat(matrix[4]) || 0;
    }
    
    prev() {
        if (this.isAnimating) return;
        
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }
    
    next() {
        if (this.isAnimating) return;
        
        const maxIndex = Math.max(0, this.slides.length - this.slidesToShow);
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }
    
    updateCarousel() {
        this.isAnimating = true;
        
        const gap = 16;
        const offset = this.currentIndex * (this.slideWidth + gap);
        
        this.track.style.transform = `translateX(-${offset}px)`;
        
        // Обновляем состояние кнопок
        this.updateButtons();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 400);
    }
    
    updateButtons() {
        const maxIndex = Math.max(0, this.slides.length - this.slidesToShow);
        
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
            this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex >= maxIndex;
            this.nextBtn.style.opacity = this.currentIndex >= maxIndex ? '0.5' : '1';
        }
    }
    
    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        this.slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img) {
                imageObserver.observe(img);
            }
        });
    }
    
    setupLightbox() {
        this.slides.forEach(slide => {
            slide.addEventListener('click', () => {
                const img = slide.querySelector('img');
                if (img && img.src) {
                    this.openLightbox(img.src, img.alt);
                }
            });
        });
    }
    
    openLightbox(src, alt) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${src}" alt="${alt}">
                <button class="lightbox-close" aria-label="Закрыть">&times;</button>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Закрытие
        const closeHandler = (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                this.closeLightbox(lightbox);
            }
        };
        
        const keyHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeLightbox(lightbox);
            }
        };
        
        lightbox.addEventListener('click', closeHandler);
        document.addEventListener('keydown', keyHandler);
        
        // Сохраняем обработчики для удаления
        lightbox._closeHandler = closeHandler;
        lightbox._keyHandler = keyHandler;
    }
    
    closeLightbox(lightbox) {
        document.removeEventListener('keydown', lightbox._keyHandler);
        document.body.removeChild(lightbox);
        document.body.style.overflow = '';
    }
    
    // Утилита debounce
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    new WorksCarousel('.works-carousel');
});