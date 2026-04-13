// Inicialización de Lucide Icons
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    
    // Inicializar todas las funcionalidades
    initScrollReveal();
    initFAQ();
    initNavbar();
    initSmoothScroll();
    initAnimations();
});

// Scroll Reveal con Intersection Observer
function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Solo animar una vez
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => observer.observe(el));
}

// FAQ Accordion
function initFAQ() {
    const faqButtons = document.querySelectorAll('.faq-btn');
    
    faqButtons.forEach(button => {
        button.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.faq-icon');
            const isActive = content.classList.contains('active');
            
            // Cerrar todos los demás
            document.querySelectorAll('.faq-content').forEach(c => {
                c.classList.remove('active');
                c.style.maxHeight = null;
            });
            document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('active'));
            
            // Si no estaba activo, abrirlo
            if (!isActive) {
                content.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
                icon.classList.add('active');
            }
        });
    });

    // Abrir el primero por defecto si existe
    const firstFaq = document.querySelector('.faq-btn');
    if (firstFaq) {
        firstFaq.click();
    }
}

// Navbar scroll effect
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Agregar clase scrolled para sombra
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const isOpen = !mobileMenu.classList.contains('hidden');
            mobileBtn.innerHTML = isOpen 
                ? '<i data-lucide="x" class="w-6 h-6 text-slate-700"></i>'
                : '<i data-lucide="menu" class="w-6 h-6 text-slate-700"></i>';
            lucide.createIcons();
        });

        // Cerrar menú al hacer clic en un enlace
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

// Smooth Scroll para anclas
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Ajuste por navbar fijo
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animaciones adicionales y efectos
function initAnimations() {
    // Efecto parallax suave en hero (solo desktop)
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.animate-float');
            
            parallaxElements.forEach((el, index) => {
                const speed = 0.5 + (index * 0.1);
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // Botón de WhatsApp flotante - mostrar/ocultar según scroll
    const whatsappBtn = document.getElementById('whatsapp-float');
    let btnVisible = false;

    const btnObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting && window.scrollY > 500) {
                if (!btnVisible) {
                    whatsappBtn.style.opacity = '1';
                    whatsappBtn.style.transform = 'translateY(0)';
                    btnVisible = true;
                }
            } else {
                if (btnVisible) {
                    whatsappBtn.style.opacity = '0';
                    whatsappBtn.style.transform = 'translateY(20px)';
                    btnVisible = false;
                }
            }
        });
    });

    // Observar el footer para ocultar botón cuando llegamos al final
    const footer = document.querySelector('footer');
    if (footer && whatsappBtn) {
        btnObserver.observe(footer);
        
        // Estado inicial
        whatsappBtn.style.opacity = '0';
        whatsappBtn.style.transform = 'translateY(20px)';
        whatsappBtn.style.transition = 'all 0.3s ease';
    }

    // Mostrar botón después de un poco de scroll
    window.addEventListener('scroll', () => {
        if (whatsappBtn && window.scrollY > 800) {
            whatsappBtn.style.opacity = '1';
            whatsappBtn.style.transform = 'translateY(0)';
        } else if (whatsappBtn) {
            whatsappBtn.style.opacity = '0';
            whatsappBtn.style.transform = 'translateY(20px)';
        }
    });

    // Contador animado para estadísticas (si existen)
    animateCounters();
}

// Contador animado
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                let count = 0;
                const duration = 2000; // 2 segundos
                const increment = target / (duration / 16); // 60fps
                
                const timer = setInterval(() => {
                    count += increment;
                    if (count >= target) {
                        entry.target.textContent = target;
                        clearInterval(timer);
                    } else {
                        entry.target.textContent = Math.floor(count);
                    }
                }, 16);
                
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

// Función para manejar el envío de formularios (si se agregan en el futuro)
function handleFormSubmit(e) {
    e.preventDefault();
    // Lógica de envío aquí
    alert('¡Gracias por tu interés! Te contactaremos pronto.');
}

// Detectar cuando el usuario intenta salir de la página (Exit Intent)
let exitIntentShown = false;
document.addEventListener('mouseout', (e) => {
    if (e.clientY < 10 && !exitIntentShown && window.scrollY > 1000) {
        // Aquí se podría mostrar un modal o mensaje especial
        exitIntentShown = true;
        console.log('Exit intent detected');
    }
});

// Precargar imágenes importantes
window.addEventListener('load', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });
});