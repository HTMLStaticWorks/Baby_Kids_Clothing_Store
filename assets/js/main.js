document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle (Dark Mode)
    const themeToggleBtns = document.querySelectorAll('.theme-toggle');
    
    function setTheme(isDark) {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }

    // Initialize Theme - Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        setTheme(true);
    } else {
        setTheme(false);
    }

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark');
            setTheme(!isDark);
        });
    });

    // 2. RTL Toggle
    const rtlToggleBtns = document.querySelectorAll('.rtl-toggle');
    
    function setRTL(isRTL) {
        if (isRTL) {
            document.documentElement.setAttribute('dir', 'rtl');
            localStorage.setItem('dir', 'rtl');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            localStorage.setItem('dir', 'ltr');
        }
    }

    // Initialize RTL
    const savedDir = localStorage.getItem('dir');
    if (savedDir) {
        setRTL(savedDir === 'rtl');
    }

    rtlToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
            setRTL(!isRTL);
        });
    });

    // 3. Mobile Menu Offcanvas (Right Side, Max Width 320px)
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenu = document.getElementById('close-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    function openMenu() {
        mobileMenu.classList.remove('translate-x-full', 'rtl:-translate-x-full');
        menuOverlay.classList.remove('hidden', 'opacity-0');
        menuOverlay.classList.add('opacity-100');
        document.body.style.overflow = 'hidden';
    }

    function closeMenuFn() {
        mobileMenu.classList.add('translate-x-full', 'rtl:-translate-x-full');
        menuOverlay.classList.remove('opacity-100');
        menuOverlay.classList.add('opacity-0');
        setTimeout(() => menuOverlay.classList.add('hidden'), 300);
        document.body.style.overflow = '';
    }

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', openMenu);
        if (closeMenu) closeMenu.addEventListener('click', closeMenuFn);
        if (menuOverlay) menuOverlay.addEventListener('click', closeMenuFn);
    }

    // 4. Cart Quantity Selectors & Totals (Event Delegation)
    function initCartTotals() {
        const cartPanel = document.getElementById('cartPanel');
        if (!cartPanel) return;
        const itemRows = cartPanel.querySelectorAll('.flex.gap-6');
        itemRows.forEach(row => {
            const qtySpan = row.querySelector('.rounded-full span');
            const priceSpan = row.querySelector('.font-semibold.text-lg');
            if (qtySpan && priceSpan && !priceSpan.dataset.basePrice) {
                const qty = parseInt(qtySpan.textContent);
                const currentPrice = parseFloat(priceSpan.textContent.replace('$', '').trim());
                priceSpan.dataset.basePrice = (currentPrice / qty).toFixed(2);
            }
        });
    }

    function updateCartTotals() {
        const cartPanel = document.getElementById('cartPanel');
        if (!cartPanel) return;

        let subtotal = 0;
        const itemRows = cartPanel.querySelectorAll('.flex.gap-6');
        
        itemRows.forEach(row => {
            const qtySpan = row.querySelector('.rounded-full span');
            const priceSpan = row.querySelector('.font-semibold.text-lg');
            
            if (qtySpan && priceSpan) {
                const qty = parseInt(qtySpan.textContent);
                const basePrice = parseFloat(priceSpan.dataset.basePrice || 0);
                const itemTotal = basePrice * qty;
                priceSpan.textContent = '$' + itemTotal.toFixed(2);
                subtotal += itemTotal;
            }
        });

        // Update subtotal display
        const subtotalSpan = cartPanel.querySelector('.font-serif.text-3xl');
        if (subtotalSpan) {
            subtotalSpan.textContent = '$' + subtotal.toFixed(2);
        }
    }

    // Initialize base prices right away
    initCartTotals();

    document.body.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            if (e.target.textContent.trim() === '+') {
                const span = e.target.previousElementSibling;
                if (span && span.tagName === 'SPAN' && !isNaN(parseInt(span.textContent))) {
                    span.textContent = parseInt(span.textContent) + 1;
                    updateCartTotals();
                }
            } else if (e.target.textContent.trim() === '-') {
                const span = e.target.nextElementSibling;
                if (span && span.tagName === 'SPAN' && !isNaN(parseInt(span.textContent))) {
                    let val = parseInt(span.textContent);
                    if (val > 1) {
                        span.textContent = val - 1;
                        updateCartTotals();
                    }
                }
            }
        }
    });
});

// Initialize GSAP & ScrollTrigger
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Universal soft fade up for elements with .animate-fade-up
    const fadeUpElements = document.querySelectorAll('.animate-fade-up');
    fadeUpElements.forEach(el => {
        gsap.fromTo(el, 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 1, 
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                }
            }
        );
    });
}

// Initialize Swiper
if (typeof Swiper !== 'undefined') {
    const testimonialSwiper = new Swiper('.testimonial-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            }
        }
    });

    const newArrivalsSwiper = new Swiper('.new-arrivals-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
            nextEl: '.swiper-btn-next',
            prevEl: '.swiper-btn-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 40,
            }
        }
    });
}
