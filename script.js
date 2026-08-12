// ===== DOM ELEMENTS =====
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const sidebarClose = document.getElementById('sidebarClose');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const langToggle = document.getElementById('langToggle');
const backToTop = document.getElementById('backToTop');
const navLinks = document.querySelectorAll('.nav-link');
const sectionToggles = document.querySelectorAll('.nav-section-toggle');
const sections = document.querySelectorAll('.section');

// ===== SIDEBAR TOGGLE =====
function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

menuToggle.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

// Close sidebar on link click (mobile)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
            closeSidebar();
        }
    });
});

// ===== SECTION TOGGLES =====
sectionToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        const subsection = toggle.nextElementSibling;
        subsection.classList.toggle('open');
    });
});

// ===== SCROLL SPY =====
function updateActiveNav() {
    const scrollPos = window.scrollY + 150;
    
    let currentSection = '';
    sections.forEach(section => {
        if (section.offsetTop <= scrollPos) {
            currentSection = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
            // Auto-expand parent section
            const parentSubsection = link.closest('.nav-subsection');
            if (parentSubsection && !parentSubsection.classList.contains('open')) {
                parentSubsection.classList.add('open');
                const parentToggle = parentSubsection.previousElementSibling;
                if (parentToggle) {
                    parentToggle.setAttribute('aria-expanded', 'true');
                }
            }
        }
    });
}

// Throttled scroll handler
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
        updateActiveNav();
        toggleBackToTop();
        scrollTimeout = null;
    }, 100);
});

// ===== BACK TO TOP =====
function toggleBackToTop() {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== LANGUAGE TOGGLE =====
let currentLang = 'es';

function switchLanguage() {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    document.documentElement.setAttribute('data-lang', currentLang);
    document.documentElement.setAttribute('lang', currentLang);
    
    // Update toggle button
    const langFlag = langToggle.querySelector('.lang-flag');
    const langText = langToggle.querySelector('.lang-text');
    
    if (currentLang === 'es') {
        langFlag.textContent = '🇬🇧';
        langText.textContent = 'EN';
    } else {
        langFlag.textContent = '🇪🇸';
        langText.textContent = 'ES';
    }

    // Update all translatable elements
    document.querySelectorAll('[data-es][data-en]').forEach(el => {
        const text = el.getAttribute(`data-${currentLang}`);
        if (text) {
            if (el.children.length === 0 || el.tagName === 'DIV') {
                // For elements with innerHTML content
                if (el.classList.contains('author-text')) {
                    el.innerHTML = text.split('<br><br>').map(p => `<p>${p}</p>`).join('');
                } else {
                    el.textContent = text;
                }
            } else if (el.tagName === 'SPAN' || el.tagName === 'P' || el.tagName === 'H2' || 
                       el.tagName === 'H3' || el.tagName === 'H4' || el.tagName === 'LI' || 
                       el.tagName === 'A' || el.tagName === 'BLOCKQUOTE' || el.tagName === 'TD' ||
                       el.tagName === 'TH') {
                el.textContent = text;
            }
        }
    });

    // Update page title
    document.title = currentLang === 'es' 
        ? 'Engancha. Escala. Personaliza. — Charly Meza'
        : 'Hook. Scale. Personalize. — Charly Meza';

    // Save preference
    localStorage.setItem('book-lang', currentLang);
}

langToggle.addEventListener('click', switchLanguage);

// Load saved language preference
const savedLang = localStorage.getItem('book-lang');
if (savedLang && savedLang !== currentLang) {
    switchLanguage();
}

// ===== SMOOTH SCROLL FOR NAV LINKS =====
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const offset = 20;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSidebar();
    }
});

// ===== RESIZE HANDLER =====
window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
        closeSidebar();
    }
});

// Initialize
updateActiveNav();
