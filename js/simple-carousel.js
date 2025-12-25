// Простая рабочая карусель - БЕЗ ЛИШНЕЙ ХУЙНИ
document.addEventListener('DOMContentLoaded', function() {
    
    // Находим карусель
    const carousel = document.querySelector('.carousel-container');
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');
    
    if (!carousel || !track || slides.length === 0) {
        console.log('Карусель не найдена');
        return;
    }
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    console.log(`Карусель найдена: ${totalSlides} слайдов`);
    
    // Функция обновления карусели
    function updateCarousel() {
        // Перемещаем трек
        const translateX = -currentSlide * 100;
        track.style.transform = `translateX(${translateX}%)`;
        
        // Обновляем точки
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Обновляем кнопки
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
        
        console.log(`Слайд: ${currentSlide + 1}/${totalSlides}`);
    }
    
    // Следующий слайд
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateCarousel();
        }
    }
    
    // Предыдущий слайд
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    }
    
    // Переход к конкретному слайду
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
    }
    
    // Обработчики кнопок
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // Обработчики точек
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Автопрокрутка (ОПЦИОНАЛЬНО)
    let autoplayInterval;
    
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            if (currentSlide >= totalSlides - 1) {
                currentSlide = 0;
            } else {
                currentSlide++;
            }
            updateCarousel();
        }, 4000);
    }
    
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }
    
    // Запускаем автопрокрутку
    startAutoplay();
    
    // Останавливаем при наведении
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    
    // Свайпы на мобильных
    let startX = 0;
    let endX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAutoplay();
    });
    
    carousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentSlide < totalSlides - 1) {
                nextSlide();
            } else if (diff < 0 && currentSlide > 0) {
                prevSlide();
            }
        }
        
        startAutoplay();
    });
    
    // Клавиатурная навигация
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Инициализация
    updateCarousel();
    
    console.log('Карусель инициализирована успешно');
});