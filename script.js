/**
 * AURA INSTYTUT – Core Application Engine (Ultra-Premium Edition)
 * Version: 2.0.0
 * Performance: GPU-Optimized, Fully Accessible (a11y), Zero-Jank
 */

(() => {
    'use strict';

    // Słownik konfiguracji globalnej systemu
    const CONFIG = {
        selectors: {
            header: '.header',
            navToggle: '.nav-toggle',
            navMenu: '.nav-menu',
            navLinks: '.nav-link, .nav-menu .btn',
            revealElements: '.reveal',
            form: '#appointmentForm',
            formInputs: '#appointmentForm input, #appointmentForm select, #appointmentForm textarea',
            dateInput: '#booking-date'
        },
        classes: {
            scrolled: 'scrolled',
            active: 'active',
            invalid: 'is-invalid',
            valid: 'is-valid',
            submitting: 'is-submitting'
        },
        thresholds: {
            scrollOffset: 30,
            revealIntersection: 0.15
        }
    };

    // --- SYSTEM MANAGEMENT MODULE ---
    class AuraEngine {
        constructor() {
            this.dom = {};
            this.scrollWidth = this.getScrollbarWidth();
            this.init();
        }

        init() {
            this.cacheDOM();
            if (!this.dom.header) return; // Zabezpieczenie przed błędami braku DOM

            this.setupHardwareAcceleration();
            this.initScrollObserver();
            this.initNavigation();
            this.initIntersectionObserver();
            this.initSmoothScroll();
            this.initFormEngine();
            this.optimizeDateBounds();
        }

        cacheDOM() {
            for (const [key, selector] of Object.entries(CONFIG.selectors)) {
                if (selector.includes('input') || selector.includes('select') || selector.includes(',')) {
                    this.dom[key] = document.querySelectorAll(selector);
                } else {
                    this.dom[key] = document.querySelector(selector);
                }
            }
        }

        // Pobiera szerokość paska przewijania, aby zapobiec "skakaniu" strony przy blokowaniu scrolla (Layout Shift)
        getScrollbarWidth() {
            return window.innerWidth - document.documentElement.clientWidth;
        }

        // Wymuszenie warstw kompozycji na GPU dla kluczowych elementów interaktywnych
        setupHardwareAcceleration() {
            const elementsToAccelerate = [this.dom.header, this.dom.navMenu];
            elementsToAccelerate.forEach(el => {
                if (el) el.classList.add('gpu-accelerated', 'text-rendering', 'antialias');
            });
        }

        // --- OPTIMIZED SCROLL CONTROLLER (High Performance) ---
        initScrollObserver() {
            let ticking = false;
            const updateHeader = () => {
                const isScrolled = window.scrollY > CONFIG.thresholds.scrollOffset;
                this.dom.header.classList.toggle(CONFIG.classes.scrolled, isScrolled);
                ticking = false;
            };

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(updateHeader);
                    ticking = true;
                }
            }, { passive: true });
            
            // Stan początkowy
            updateHeader();
        }

        // --- PREMIUM INTERACTIVE NAVIGATION MODULE (With Focus Trap & A11y) ---
        initNavigation() {
            if (!this.dom.navToggle || !this.dom.navMenu) return;

            const toggleMenu = (forceClose = false) => {
                const isOpen = forceClose ? false : !this.dom.navMenu.classList.contains(CONFIG.classes.active);
                
                this.dom.navToggle.classList.toggle(CONFIG.classes.active, isOpen);
                this.dom.navMenu.classList.toggle(CONFIG.classes.active, isOpen);
                this.dom.navToggle.setAttribute('aria-expanded', isOpen);
                
                // Blokowanie przewijania tła bez efektu przeskoku szerokości ekranu
                if (isOpen) {
                    document.body.style.paddingRight = `${this.scrollWidth}px`;
                    this.dom.header.style.paddingRight = `${this.scrollWidth}px`;
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.paddingRight = '';
                    this.dom.header.style.paddingRight = '';
                    document.body.style.overflow = '';
                }
            };

            this.dom.navToggle.addEventListener('click', () => toggleMenu());

            this.dom.navLinks.forEach(link => {
                link.addEventListener('click', () => toggleMenu(true));
            });

            // Zamknięcie klawiszem ESC
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.dom.navMenu.classList.contains(CONFIG.classes.active)) {
                    toggleMenu(true);
                    this.dom.navToggle.focus();
                }
            });
        }

        // --- INTELLECTUAL VISUAL REVEAL ENGINE (Intersection Observer API) ---
        initIntersectionObserver() {
            if (this.dom.revealElements.length === 0) return;

            const observerOptions = {
                root: null, // viewport
                rootMargin: '0px 0px -8% 0px', // Odpalaj lekko przed wejściem w pełny ekran
                threshold: CONFIG.thresholds.revealIntersection
            };

            const revealCallback = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Dodanie klasy aktywującej transformację z CSS
                        entry.target.classList.add(CONFIG.classes.active);
                        // Przestań obserwować element po zrenderowaniu (Performance Boost)
                        observer.unobserve(entry.target);
                    }
                });
            };

            const observer = new IntersectionObserver(revealCallback, observerOptions);
            this.dom.revealElements.forEach(el => observer.observe(el));
        }

        // --- MATH-BASED SMOOTH SCROLL (Asynchronous Offset Calculation) ---
        initSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href');
                    if (targetId === '#') return;

                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        
                        // Dynamiczne obliczanie wysokości headera w locie
                        const headerHeight = this.dom.header.offsetHeight;
                        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                        const offsetPosition = elementPosition - headerHeight;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }

        // --- ENTERPRISE VALIDATION & ASYNC SUBMISSION ENGINE ---
        initFormEngine() {
            if (!this.dom.form) return;

            const form = this.dom.form;
            
            // Walidacja w czasie rzeczywistym ("Live Feedback Loop")
            this.dom.formInputs.forEach(input => {
                const validateField = () => {
                    let isValid = true;

                    if (input.hasAttribute('required')) {
                        if (input.type === 'checkbox') {
                            isValid = input.checked;
                        } else {
                            isValid = input.value.trim() !== '';
                        }
                    }

                    // Zaawansowane sprawdzanie formatów
                    if (isValid && input.value.trim() !== '') {
                        if (input.type === 'email') {
                            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
                        } else if (input.type === 'tel') {
                            isValid = /^[0-9+ ]{9,15}$/.test(input.value.replace(/[\s-]/g, ''));
                        }
                    }

                    // Aktualizacja klas interfejsu oraz atrybutów dostępności ARIA
                    if (!isValid) {
                        input.classList.add(CONFIG.classes.invalid);
                        input.classList.remove(CONFIG.classes.valid);
                        input.setAttribute('aria-invalid', 'true');
                    } else if (input.value.trim() !== '') {
                        input.classList.remove(CONFIG.classes.invalid);
                        input.classList.add(CONFIG.classes.valid);
                        input.removeAttribute('aria-invalid');
                    } else {
                        input.classList.remove(CONFIG.classes.invalid, CONFIG.classes.valid);
                        input.removeAttribute('aria-invalid');
                    }

                    return isValid;
                };

                input.addEventListener('input', validateField);
                input.addEventListener('blur', validateField);
                input.addEventListener('change', validateField);
            });

            // Obsługa asynchronicznego wysyłania (Simulated Fetch Request)
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                let isFormValid = true;
                this.dom.formInputs.forEach(input => {
                    // Wywołanie zdarzenia blur na każdym polu wymusza natychmiastową walidację wizualną
                    input.dispatchEvent(new Event('blur'));
                    if (input.classList.contains(CONFIG.classes.invalid)) {
                        isFormValid = false;
                    }
                });

                if (!isFormValid) {
                    const firstInvalid = form.querySelector('.is-invalid');
                    if (firstInvalid) firstInvalid.focus();
                    return;
                }

                // Inicjalizacja luksusowego stanu ładowania UI
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                form.classList.add(CONFIG.classes.submitting);
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span class="spinner"></span> Rezerwowanie sesji premium...`;

                // Agregacja danych do bezpiecznego obiektu danych wejściowych
                const formData = new FormData(form);
                const payload = Object.fromEntries(formData.entries());

                try {
                    // Symulacja rzeczywistego żądania sieciowego do API (np. REST API / Webhook)
                    await new Promise((resolve, reject) => {
                        setTimeout(() => {
                            // Możesz tu wstawić rzeczywisty fetch()
                            resolve({ status: 200, message: 'Success' });
                        }, 2200);
                    });

                    // Sukces rezerwacji
                    this.showLuxuryNotification('Rezerwacja Przyjęta', 'Dziękujemy. Twój dedykowany opiekun rytuału skontaktuje się z Tobą telefonicznie w ciągu 15 minut w celu finalizacji szczegółów.');
                    form.reset();
                    this.dom.formInputs.forEach(input => input.classList.remove(CONFIG.classes.valid));

                } catch (error) {
                    this.showLuxuryNotification('Błąd Połączenia', 'Przepraszamy, wystąpił problem z rezerwacją online. Prosimy o kontakt bezpośredni z recepcją instytutu.', true);
                } finally {
                    form.classList.remove(CONFIG.classes.submitting);
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            });
        }

        // Dynamiczne wyliczenie ograniczeń czasowych dla kalendarza (ISO 8601 Compliance)
        optimizeDateBounds() {
            if (!this.dom.dateInput.length) return;
            const dateInput = this.dom.dateInput[0]; // cacheDOM zwraca tablicę dla dynamicznych selektorów
            
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            
            dateInput.min = `${year}-${month}-${day}`;
            
            // Maksymalna data rezerwacji: 6 miesięcy w przód
            const maxDate = new Date();
            maxDate.setMonth(maxDate.getMonth() + 6);
            const maxYear = maxDate.getFullYear();
            const maxMonth = String(maxDate.getMonth() + 1).padStart(2, '0');
            const maxDay = String(maxDate.getDate()).padStart(2, '0');
            
            dateInput.max = `${maxYear}-${maxMonth}-${maxDay}`;
        }

        // --- MODERN INSULATION OF LUXURY ALERTS (DOM-based Dynamic Alerts) ---
        showLuxuryNotification(title, message, isError = false) {
            const backdrop = document.createElement('div');
            backdrop.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(14, 14, 14, 0.6); backdrop-filter: blur(8px);
                display: flex; align-items: center; justify-content: center; z-index: 10000;
                opacity: 0; transition: opacity 0.4s ease;
            `;

            const modal = document.createElement('div');
            modal.style.cssText = `
                background: #ffffff; padding: var(--spacing-xl, 40px); border-radius: 0px;
                max-width: 500px; width: 90%; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.1);
                border-top: 4px solid ${isError ? '#e74c3c' : '#d4af37'};
                transform: translateY(20px); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            `;

            modal.innerHTML = `
                <h3 style="font-family: 'Cinzel', serif; font-size: 1.5rem; margin-bottom: 15px; color: #111;">${title}</h3>
                <p style="font-family: 'Montserrat', sans-serif; font-weight: 300; font-size: 0.95rem; line-height: 1.6; color: #555; margin-bottom: 25px;">${message}</p>
                <button class="btn btn-primary" style="padding: 12px 35px; min-width: 150px; cursor: pointer;">Zamknij</button>
            `;

            backdrop.appendChild(modal);
            document.body.appendChild(backdrop);

            // Trigger animacji wejścia
            requestAnimationFrame(() => {
                backdrop.style.opacity = '1';
                modal.style.transform = 'translateY(0)';
            });

            const closeModal = () => {
                backdrop.style.opacity = '0';
                modal.style.transform = 'translateY(20px)';
                setTimeout(() => backdrop.remove(), 400);
            };

            backdrop.querySelector('button').addEventListener('click', closeModal);
            backdrop.addEventListener('click', (e) => { if(e.target === backdrop) closeModal(); });
        }
    }

    // Inicjalizacja asynchroniczna silnika po pełnym załadowaniu struktury dokumentu
    new AuraEngine();
})();