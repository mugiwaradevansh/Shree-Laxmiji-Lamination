// main.js

const routes = {
  '/': 'page-home',
  '/about': 'page-about', 
  '/about-us': 'page-about',
  '/products': 'page-products',
  '/products-and-services': 'page-products',
  '/get-a-quote': 'page-quote',
  '/quote': 'page-quote',
  '/contact': 'page-contact',
  '/contact-us': 'page-contact'
};

const metaTitles = {
  '/': 'Shree Laxmiji Lamination | Plastic Roll Printing & Flexible Packaging Ahmedabad',
  '/about': 'About Us | Shree Laxmiji Lamination — Since 2000',
  '/about-us': 'About Us | Shree Laxmiji Lamination — Since 2000',
  '/products': 'Our Product Range | Shree Laxmiji Lamination Ahmedabad',
  '/products-and-services': 'Our Product Range | Shree Laxmiji Lamination Ahmedabad',
  '/get-a-quote': 'Get a Quote | Shree Laxmiji Lamination',
  '/quote': 'Get a Quote | Shree Laxmiji Lamination',
  '/contact': 'Contact Us | Shree Laxmiji Lamination — Odhav, Ahmedabad',
  '/contact-us': 'Contact Us | Shree Laxmiji Lamination — Odhav, Ahmedabad'
};

// 1. SPA Router
function initRouter() {
    window.addEventListener('hashchange', handleRoute);
    // Trigger on first load
    handleRoute();
}

function handleRoute() {
    let raw = window.location.hash.replace(/^#/, '');
    if (!raw) {
        raw = '/';
    }
    
    // Separate path from query string (e.g. /products-and-services?product=printed-plastic-wrapping-ribbon)
    let [path, queryString] = raw.split('?');
    if (!path.startsWith('/')) {
        path = '/' + path;
    }
    if (path.length > 1 && path.endsWith('/')) {
        path = path.slice(0, -1);
    }
    
    if (!routes[path]) {
        path = '/';
        window.history.replaceState(null, null, '#/');
    }
    
    const targetPageId = routes[path];
    const urlParams = new URLSearchParams(queryString || '');
    const productParam = urlParams.get('product');
    
    // Hide all pages
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(el => {
        el.style.display = 'none';
        el.classList.remove('active-page');
    });
    
    // Show target page
    const targetPage = document.getElementById(targetPageId);
    if (targetPage) {
        targetPage.style.display = 'block';
        targetPage.classList.add('active-page');
        
        // Handle scroll position and product tabs
        if (targetPageId === 'page-products') {
            const activeTabKey = (productParam && productParam !== 'bopp-pearlized-film') ? productParam : 'plastic-printed-film';
            setProductTab(activeTabKey, false);
            
            if (productParam) {
                setTimeout(() => {
                    const wrapper = document.getElementById('products-display-wrapper');
                    if (wrapper) {
                        const navHeight = 130;
                        const topPos = wrapper.getBoundingClientRect().top + window.scrollY - navHeight;
                        window.scrollTo({ top: topPos, behavior: 'smooth' });
                    }
                }, 120);
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else if (targetPageId === 'page-quote') {
            if (productParam) {
                const productSelect = document.getElementById('quote-product-select') || document.querySelector('[name="product"]');
                if (productSelect) {
                    const productMap = {
                        'plastic-printed-film': 'Bopp Pearl Printed Film Roll',
                        'bopp-pearl-printed-film-roll': 'Bopp Pearl Printed Film Roll',
                        'printed-plastic-wrapping-ribbon': 'Printed Plastic Wrapping Ribbon',
                        'printed-packing-patta': 'Bopp Pearl Printed Patta',
                        'bopp-pearl-printed-patta': 'Bopp Pearl Printed Patta',
                        'packaging-material-flexible-packing': 'Flexible Packaging Material',
                        'flexible-packaging-material': 'Flexible Packaging Material'
                    };
                    const targetVal = (productMap[productParam] || productParam).toLowerCase();
                    for (let i = 0; i < productSelect.options.length; i++) {
                        if (productSelect.options[i].value.toLowerCase() === targetVal || 
                            productSelect.options[i].text.toLowerCase() === targetVal) {
                            productSelect.selectedIndex = i;
                            break;
                        }
                    }
                }
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Update active nav links based on current page
        const pageToNavPath = {
            'page-home': '#/',
            'page-about': '#/about',
            'page-products': '#/products-and-services',
            'page-contact': '#/contact'
        };
        const expectedHref = pageToNavPath[targetPageId];
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (expectedHref && (href === expectedHref || href === `#${path}`)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Animate entrance
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(targetPage, 
                { opacity: 0, y: 30 }, 
                { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }
            );
        }
        
        // Update title
        document.title = metaTitles[path] || 'Shree Laxmiji Lamination';
        
        // Close mobile drawer if open
        closeMobileDrawer();
        
        // Re-init animations
        initScrollAnimations(targetPage);
        
        // Specific page animations
        if (path === '/') {
            animateHero();
        }

        // Re-render Lucide icons for active page and footer
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// 2. GSAP Scroll Animations
function initScrollAnimations(page) {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Kill all existing ScrollTriggers to avoid layout issues on page switch
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    if (!page) return;

    // Animate on scroll elements
    const elements = page.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 40 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    once: true
                }
            }
        );
    });

    // Stats bar numbers
    const counters = page.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target')) || 0;
        const suffix = counter.getAttribute('data-suffix') || '';
        
        gsap.to(counter, {
            innerHTML: target,
            duration: 2,
            ease: 'power2.out',
            snap: { innerHTML: 1 },
            onUpdate: function() {
                counter.innerHTML = Math.round(this.targets()[0].innerHTML) + suffix;
            },
            scrollTrigger: {
                trigger: counter,
                start: 'top 85%',
                once: true
            }
        });
    });

    // Service cards stagger
    const serviceGrids = page.querySelectorAll('.service-grid');
    serviceGrids.forEach(grid => {
        const cards = grid.querySelectorAll('.service-card');
        if (cards.length > 0) {
            gsap.fromTo(cards,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: grid,
                        start: 'top 85%',
                        once: true
                    }
                }
            );
        }
    });

    // Refresh ScrollTrigger to recalculate positions
    ScrollTrigger.refresh();
}

// 3. Hero Animation
function animateHero() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline();
    tl.fromTo('.hero-eyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.2)
      .fromTo('.hero-headline', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.4)
      .fromTo('.hero-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.6)
      .fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.8);
      
    // Parallax on hero decorative background
    const heroBg = document.querySelector('.hero-bg');
    const heroSection = document.querySelector('.hero-section');
    if (heroBg && heroSection && typeof ScrollTrigger !== 'undefined') {
        gsap.to(heroBg, {
            y: '30%',
            ease: 'none',
            scrollTrigger: {
                trigger: heroSection,
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }
}

// 4. Navbar
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            // Assuming .scrolled class handles shrink & shadow via CSS
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

// 5. Mobile Navigation
let drawerOpen = false;
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger-btn, .mobile-menu-btn');
    const overlay = document.querySelector('.mobile-drawer-overlay, .mobile-overlay');
    const closeBtn = document.querySelector('.mobile-drawer-close');
    const navLinks = document.querySelectorAll('.mobile-drawer a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            if (drawerOpen) closeMobileDrawer();
            else openMobileDrawer();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeMobileDrawer);
    }

    if (overlay) {
        overlay.addEventListener('click', closeMobileDrawer);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileDrawer);
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawerOpen) {
            closeMobileDrawer();
        }
    });
}

function openMobileDrawer() {
    const drawer = document.querySelector('.mobile-drawer');
    const overlay = document.querySelector('.mobile-drawer-overlay, .mobile-overlay');
    const hamburger = document.querySelector('.hamburger-btn, .mobile-menu-btn');
    
    if (!drawer) return;

    drawer.classList.remove('translate-x-full');
    drawer.classList.add('translate-x-0', 'active');
    
    if (overlay) {
        overlay.classList.remove('hidden');
        overlay.classList.add('block');
    }
    
    document.body.style.overflow = 'hidden';
    drawerOpen = true;

    if (hamburger) {
        hamburger.classList.add('active');
        const icon = hamburger.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', 'x');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }
}

function closeMobileDrawer() {
    const drawer = document.querySelector('.mobile-drawer');
    const overlay = document.querySelector('.mobile-drawer-overlay, .mobile-overlay');
    const hamburger = document.querySelector('.hamburger-btn, .mobile-menu-btn');
    
    if (!drawer || !drawerOpen) return;

    drawer.classList.remove('translate-x-0', 'active');
    drawer.classList.add('translate-x-full');
    
    if (overlay) {
        overlay.classList.remove('block');
        overlay.classList.add('hidden');
    }

    if (hamburger) {
        hamburger.classList.remove('active');
        const icon = hamburger.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', 'menu');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }

    document.body.style.overflow = '';
    drawerOpen = false;
}

// 6. Form Handling & WhatsApp Inquiry Dispatch
function initForm() {
    const form = document.getElementById('quote-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Real-time validation clear
    inputs.forEach(input => {
        const clearErr = () => {
            input.classList.remove('error', 'border-red-500');
            const errorMsg = input.parentElement.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        };
        input.addEventListener('input', clearErr);
        input.addEventListener('change', clearErr);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        let firstInvalid = null;

        // Reset all errors
        form.querySelectorAll('.error-message').forEach(el => el.remove());
        inputs.forEach(input => input.classList.remove('error', 'border-red-500'));

        const showError = (input, msg) => {
            input.classList.add('error', 'border-red-500');
            const errorEl = document.createElement('div');
            errorEl.className = 'error-message text-red-500 text-xs font-semibold mt-1.5 flex items-center gap-1';
            errorEl.innerHTML = `<i data-lucide="alert-circle" class="w-3.5 h-3.5 inline"></i> ${msg}`;
            input.parentElement.appendChild(errorEl);
            if (typeof lucide !== 'undefined') lucide.createIcons();
            isValid = false;
            if (!firstInvalid) firstInvalid = input;
        };

        const fullName = form.querySelector('[name="fullName"]');
        const phone = form.querySelector('[name="phone"]');
        const email = form.querySelector('[name="email"]');
        const company = form.querySelector('[name="company"]');
        const product = form.querySelector('[name="product"]') || form.querySelector('[name="service"]');
        const quantity = form.querySelector('[name="quantity"]');
        const city = form.querySelector('[name="city"]');
        const message = form.querySelector('[name="message"]');

        if (fullName && !fullName.value.trim()) showError(fullName, 'Full Name is required');
        
        if (phone) {
            const rawPhone = phone.value.trim().replace(/\D/g, '');
            if (!rawPhone) {
                showError(phone, 'Phone number is required');
            } else if (rawPhone.length < 10) {
                showError(phone, 'Please enter a valid 10-digit phone number');
            }
        }

        if (email) {
            const emailVal = email.value.trim();
            if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
                showError(email, 'Please enter a valid email address');
            }
        }

        if (company && !company.value.trim()) showError(company, 'Company name is required');
        if (product && !product.value.trim()) showError(product, 'Please select a product');
        if (quantity && !quantity.value.trim()) showError(quantity, 'Quantity is required');
        if (city && !city.value.trim()) showError(city, 'Delivery city / state is required');

        if (!isValid && firstInvalid) {
            firstInvalid.focus();
            return;
        }

        // Selected product title
        const selectedProductText = product ? (product.options[product.selectedIndex]?.text || product.value) : 'Packaging Product';
        const clientName = fullName ? fullName.value.trim() : '';
        const clientPhone = phone ? phone.value.trim() : '';
        const clientEmail = (email && email.value.trim()) ? email.value.trim() : 'N/A';
        const clientCompany = company ? company.value.trim() : '';
        const clientQuantity = quantity ? quantity.value.trim() : '';
        const clientCity = city ? city.value.trim() : '';
        const clientMessage = (message && message.value.trim()) ? message.value.trim() : 'No additional notes provided.';

        // Structured WhatsApp message
        const whatsappText = 
`*NEW INQUIRY — SHREE LAXMIJI LAMINATION*
━━━━━━━━━━━━━━━━━━━━
*Customer Details:*
• *Name:* ${clientName}
• *Company / Brand:* ${clientCompany}
• *Phone:* ${clientPhone}
• *Email:* ${clientEmail}
• *Delivery Location:* ${clientCity}

*Product & Order Details:*
• *Product Required:* ${selectedProductText}
• *Quantity / Order Size:* ${clientQuantity}

*Specific Requirements / Message:*
${clientMessage}
━━━━━━━━━━━━━━━━━━━━
_Received via Website Quote Form_`;

        const ownerWhatsAppNumber = '919227551482';
        const whatsappUrl = `https://wa.me/${ownerWhatsAppNumber}?text=${encodeURIComponent(whatsappText)}`;

        // Open WhatsApp
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) {
            window.location.href = whatsappUrl;
        } else {
            window.open(whatsappUrl, '_blank');
        }

        // Show structured success card
        const successMsg = document.getElementById('form-success');
        if (successMsg) {
            successMsg.classList.remove('hidden');
            successMsg.innerHTML = `
                <div class="w-16 h-16 rounded-2xl bg-green-100 text-green-600 mx-auto flex items-center justify-center mb-4 shadow-sm">
                    <i data-lucide="check-circle" class="w-8 h-8 text-green-600"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Inquiry Prepared &amp; Forwarded!</h3>
                <p class="text-gray-700 text-sm max-w-md mx-auto mb-5 leading-relaxed">
                    Your inquiry has been compiled and forwarded to our official WhatsApp (<strong>+91 92275 51482</strong>). Our team will review your order requirements and reply with a quote.
                </p>
                <div class="flex flex-wrap items-center justify-center gap-3">
                    <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-6 py-3 rounded-full text-xs font-bold transition-all duration-300 shadow-md">
                        <i data-lucide="message-circle" class="w-4 h-4"></i>
                        <span>Open WhatsApp Chat Directly</span>
                    </a>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(successMsg, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 });
            }
        }

        form.reset();
    });
}

// 7. Copy Address
function initCopyAddress() {
    const btn = document.getElementById('copy-address-btn');
    if (!btn) return;

    const addressText = 'Odhav, Ahmedabad, Gujarat — 382415';
    const originalHTML = btn.innerHTML;

    btn.addEventListener('click', () => {
        navigator.clipboard.writeText(addressText).then(() => {
            btn.innerHTML = '<i data-lucide="check" class="w-4 h-4 mr-2 inline-block"></i> Copied!';
            if (typeof lucide !== 'undefined') lucide.createIcons();
            
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(btn, { scale: 0.95 }, { scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
            }

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }, 2000);
        });
    });
}

// 8. Service Tabs (if any on page)
function initServiceTabs() {
    const tabs = document.querySelectorAll('.service-tab');
    if (tabs.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('active')) return;

            tabs.forEach(t => {
                t.classList.remove('active', 'border-blue-600', 'text-blue-600');
                t.classList.add('border-transparent', 'text-gray-500');
            });
            
            tab.classList.add('active', 'border-blue-600', 'text-blue-600');
            tab.classList.remove('border-transparent', 'text-gray-500');

            const targetId = tab.getAttribute('data-target');
            const allContent = document.querySelectorAll('.service-tab-content');
            
            allContent.forEach(content => {
                if (content.style.display !== 'none' && typeof gsap !== 'undefined') {
                    gsap.to(content, { 
                        opacity: 0, 
                        duration: 0.2, 
                        onComplete: () => {
                            content.style.display = 'none';
                            const targetContent = document.getElementById(targetId);
                            if (targetContent) {
                                targetContent.style.display = 'block';
                                gsap.fromTo(targetContent, 
                                    { opacity: 0, y: 20 }, 
                                    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
                                );
                            }
                        }
                    });
                } else if (content.style.display !== 'none') {
                    content.style.display = 'none';
                    const targetContent = document.getElementById(targetId);
                    if (targetContent) targetContent.style.display = 'block';
                }
            });
        });
    });
}

// 9. Product Auto-Images System (Folder Drop & Slider)
async function initProductAutoImages() {
    const cards = document.querySelectorAll('[data-product-card]');
    if (!cards || cards.length === 0) return;

    cards.forEach(card => {
        const productKey = card.getAttribute('data-product-card');
        const folder = card.getAttribute('data-folder') || `public/products/${productKey}/`;
        const container = document.getElementById(`img-container-${productKey}`);
        if (!container) return;

        const manifestUrl = `${folder}manifest.json`;
        fetch(manifestUrl)
            .then(res => {
                if (!res.ok) throw new Error('No manifest');
                return res.json();
            })
            .then(images => {
                if (!Array.isArray(images) || images.length === 0) {
                    // Leave default clean grey placeholder
                    return;
                }

                if (images.length === 1) {
                    // Single image
                    const imgSrc = `${folder}${images[0]}`;
                    container.innerHTML = `
                        <div class="w-full h-full relative overflow-hidden rounded-2xl">
                            <img src="${imgSrc}" alt="${productKey}" class="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out hover:scale-105" loading="lazy">
                        </div>
                    `;
                } else {
                    // Multiple images: Interactive Slider
                    renderProductSlider(container, folder, images, productKey);
                }
            })
            .catch(() => {
                // Fallback if accessed via file:// protocol directly in browser
                const fallbackMap = {
                    'plastic-printed-film': ['d1.jpeg', 'd2.jpeg', 'd3.jpeg', 'd4.jpeg', 'd5.jpeg', 'd6.jpeg'],
                    'printed-plastic-wrapping-ribbon': ['design_1.png', 'design_2.png', 'design_3.png', 'design_4.png', 'design_5.png', 'design_6.png', 'design_7.png'],
                    'printed-packing-patta': ['design_1.png', 'design_2.png', 'design_3.png', 'design_4.png', 'design_5.png', 'design_6.png', 'design_7.png'],
                    'packaging-material-flexible-packing': ['d1.jpg', 'd2.jpg', 'd3.jpg', 'd4.jpg', 'd5.jpg', 'd6.jpg', 'd7.jpg', 'd8.jpg', 'd9.jpg', 'd10.png', 'd11.jpg', 'd12.jpg']
                };
                if (fallbackMap[productKey]) {
                    renderProductSlider(container, folder, fallbackMap[productKey], productKey);
                }
            });
    });
}

function renderProductSlider(container, folder, images, productKey) {
    let currentIndex = 0;
    const slidesHTML = images.map(img => `
        <div class="product-slide">
            <img src="${folder}${img}" alt="Sample packaging" class="w-full h-full object-cover object-center" loading="lazy">
        </div>
    `).join('');

    const dotsHTML = images.map((_, i) => `
        <div class="slider-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>
    `).join('');

    container.innerHTML = `
        <div class="product-slider relative group h-full w-full" id="slider-${productKey}">
            <div class="product-slider-track flex h-full w-full transition-transform duration-500 ease-in-out" id="track-${productKey}">
                ${slidesHTML}
            </div>
            <button class="slider-btn prev opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-label="Previous image">
                <i data-lucide="chevron-left" class="w-4 h-4"></i>
            </button>
            <button class="slider-btn next opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-label="Next image">
                <i data-lucide="chevron-right" class="w-4 h-4"></i>
            </button>
            <div class="slider-dots">
                ${dotsHTML}
            </div>
        </div>
    `;

    if (typeof lucide !== 'undefined') lucide.createIcons();

    const track = container.querySelector('.product-slider-track');
    const dots = container.querySelectorAll('.slider-dot');
    const prevBtn = container.querySelector('.slider-btn.prev');
    const nextBtn = container.querySelector('.slider-btn.next');

    function goToSlide(index) {
        currentIndex = (index + images.length) % images.length;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, i) => {
            if (i === currentIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); goToSlide(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); goToSlide(currentIndex + 1); });
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const idx = parseInt(dot.getAttribute('data-index'), 10);
            goToSlide(idx);
        });
    });
}

// 10. Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Ignore SPA route links or empty hashes
            if (href.startsWith('#/') || href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = 72; // Standard navbar height offset
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 11. Back to Top Button
function initBackToTop() {
    let btn = document.getElementById('back-to-top');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'back-to-top';
        btn.className = 'fixed bottom-6 right-6 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg z-40 opacity-0 pointer-events-none transition-all duration-300 hover:bg-blue-700 hover:-translate-y-1';
        btn.innerHTML = '<i data-lucide="arrow-up" class="w-6 h-6"></i>';
        document.body.appendChild(btn);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.remove('opacity-0', 'pointer-events-none');
            btn.classList.add('opacity-100');
        } else {
            btn.classList.add('opacity-0', 'pointer-events-none');
            btn.classList.remove('opacity-100');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 12. Product Galleries & Zoom Lightbox System
let lightboxState = {
    images: [],
    currentIndex: 0,
    currentScale: 1,
    panX: 0,
    panY: 0,
    isDragging: false,
    startX: 0,
    startY: 0
};

function initProductGalleries() {
    // Intercept clicks on any photo thumbnail in .product-photo-grid
    document.querySelectorAll('.photo-grid-item').forEach(item => {
        item.addEventListener('click', () => {
            const parentGrid = item.closest('.product-photo-grid');
            if (!parentGrid) return;
            
            const gridItems = Array.from(parentGrid.querySelectorAll('.photo-grid-item'));
            const images = gridItems.map(el => ({
                src: el.getAttribute('data-zoom-src') || el.querySelector('img')?.getAttribute('src'),
                title: el.getAttribute('data-zoom-title') || parentGrid.getAttribute('data-product-title') || 'Product Sample'
            }));
            
            const index = gridItems.indexOf(item);
            openZoomLightbox(images, index >= 0 ? index : 0);
        });
    });

    // Check manifest for any dynamically loaded products
    const productGrids = document.querySelectorAll('[data-product-grid]');
    productGrids.forEach(grid => {
        const productKey = grid.getAttribute('data-product-grid');
        // If it's already pre-rendered with designs in HTML (ribbon, patta, film, or flexible packaging), skip dynamic overwrite
        if (productKey !== 'printed-plastic-wrapping-ribbon' && productKey !== 'printed-packing-patta' && productKey !== 'plastic-printed-film' && productKey !== 'packaging-material-flexible-packing') {
            const folder = `public/products/${productKey}/`;
            fetch(`${folder}manifest.json`)
                .then(res => res.ok ? res.json() : [])
                .then(images => {
                    if (Array.isArray(images) && images.length > 0) {
                        const title = grid.getAttribute('data-product-title') || 'Product Sample';
                        grid.innerHTML = images.map((img, idx) => `
                            <div class="photo-grid-item group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200/80 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out" 
                                 data-zoom-src="${folder}${img}"
                                 data-zoom-title="${title} — Design #${idx + 1}"
                                 data-zoom-index="${idx}">
                              <img src="${folder}${img}" alt="${title}" class="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-108" loading="lazy">
                              <div class="photo-hover-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5">
                                <span class="self-end px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white flex items-center gap-1.5 shadow-sm">
                                  <i data-lucide="zoom-in" class="w-3.5 h-3.5 text-pink-400"></i> Zoom
                                </span>
                                <div class="text-white">
                                  <span class="text-xs font-bold block drop-shadow">Design #${idx + 1}</span>
                                  <span class="text-[10px] text-gray-300">Click to view &amp; zoom</span>
                                </div>
                              </div>
                              <span class="photo-badge absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[10px] font-bold text-gray-800 shadow-sm group-hover:opacity-0 transition-opacity">#${idx + 1}</span>
                            </div>
                        `).join('');

                        if (typeof lucide !== 'undefined') lucide.createIcons();

                        // Re-bind click handlers on the newly injected items
                        grid.querySelectorAll('.photo-grid-item').forEach((item, i) => {
                            item.addEventListener('click', () => {
                                const imgList = images.map((im, index) => ({
                                    src: `${folder}${im}`,
                                    title: `${title} — Design #${index + 1}`
                                }));
                                openZoomLightbox(imgList, i);
                            });
                        });
                    }
                })
                .catch(() => {
                    // Stay with default clean sample swatch placeholder
                });
        }
    });
}

function openZoomLightbox(images, startIndex = 0) {
    if (!images || images.length === 0) return;
    
    lightboxState.images = images;
    lightboxState.currentIndex = Math.max(0, Math.min(startIndex, images.length - 1));
    lightboxState.currentScale = 1;
    lightboxState.panX = 0;
    lightboxState.panY = 0;

    const modal = document.getElementById('product-zoom-modal');
    if (!modal) return;

    updateLightboxView();

    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        modal.classList.add('active');
    });

    document.body.style.overflow = 'hidden';
}

function closeZoomLightbox() {
    const modal = document.getElementById('product-zoom-modal');
    if (!modal) return;

    modal.classList.remove('active');
    setTimeout(() => {
        modal.classList.add('hidden');
        lightboxState.currentScale = 1;
        lightboxState.panX = 0;
        lightboxState.panY = 0;
        updateTransform();
    }, 300);

    document.body.style.overflow = '';
}

function updateLightboxView() {
    const item = lightboxState.images[lightboxState.currentIndex];
    if (!item) return;

    const img = document.getElementById('zoom-modal-img');
    const titleEl = document.getElementById('zoom-modal-title');
    const counterEl = document.getElementById('zoom-modal-counter');
    const prevBtn = document.getElementById('zoom-nav-prev');
    const nextBtn = document.getElementById('zoom-nav-next');

    if (img) {
        img.src = item.src;
        img.alt = item.title || 'Product Sample';
    }
    if (titleEl) {
        titleEl.textContent = item.title || 'Product Photo';
    }
    if (counterEl) {
        counterEl.textContent = `${lightboxState.currentIndex + 1} / ${lightboxState.images.length}`;
    }

    if (prevBtn) {
        prevBtn.style.display = lightboxState.images.length > 1 ? 'flex' : 'none';
    }
    if (nextBtn) {
        nextBtn.style.display = lightboxState.images.length > 1 ? 'flex' : 'none';
    }

    lightboxState.currentScale = 1;
    lightboxState.panX = 0;
    lightboxState.panY = 0;
    updateTransform();
}

function updateTransform() {
    const wrapper = document.getElementById('zoom-image-wrapper');
    const indicator = document.getElementById('zoom-level-indicator');
    const stage = document.getElementById('zoom-modal-stage');

    if (wrapper) {
        wrapper.style.transform = `translate3d(${lightboxState.panX}px, ${lightboxState.panY}px, 0) scale(${lightboxState.currentScale})`;
    }
    if (indicator) {
        indicator.textContent = `${Math.round(lightboxState.currentScale * 100)}%`;
    }
    if (stage) {
        if (lightboxState.currentScale > 1) {
            stage.classList.add('is-zoomed');
        } else {
            stage.classList.remove('is-zoomed', 'is-dragging');
        }
    }
}

function zoomIn() {
    lightboxState.currentScale = Math.min(5, Math.round((lightboxState.currentScale + 0.5) * 10) / 10);
    updateTransform();
}

function zoomOut() {
    lightboxState.currentScale = Math.max(1, Math.round((lightboxState.currentScale - 0.5) * 10) / 10);
    if (lightboxState.currentScale === 1) {
        lightboxState.panX = 0;
        lightboxState.panY = 0;
    }
    updateTransform();
}

function resetZoom() {
    lightboxState.currentScale = 1;
    lightboxState.panX = 0;
    lightboxState.panY = 0;
    updateTransform();
}

function prevPhoto() {
    if (lightboxState.images.length <= 1) return;
    lightboxState.currentIndex = (lightboxState.currentIndex - 1 + lightboxState.images.length) % lightboxState.images.length;
    updateLightboxView();
}

function nextPhoto() {
    if (lightboxState.images.length <= 1) return;
    lightboxState.currentIndex = (lightboxState.currentIndex + 1) % lightboxState.images.length;
    updateLightboxView();
}

function initZoomLightbox() {
    const modal = document.getElementById('product-zoom-modal');
    if (!modal) return;

    const btnIn = document.getElementById('zoom-btn-in');
    const btnOut = document.getElementById('zoom-btn-out');
    const btnReset = document.getElementById('zoom-btn-reset');
    const btnClose = document.getElementById('zoom-btn-close');
    const prevBtn = document.getElementById('zoom-nav-prev');
    const nextBtn = document.getElementById('zoom-nav-next');
    const stage = document.getElementById('zoom-modal-stage');
    const backdrop = modal.querySelector('.zoom-modal-backdrop');

    if (btnIn) btnIn.addEventListener('click', (e) => { e.stopPropagation(); zoomIn(); });
    if (btnOut) btnOut.addEventListener('click', (e) => { e.stopPropagation(); zoomOut(); });
    if (btnReset) btnReset.addEventListener('click', (e) => { e.stopPropagation(); resetZoom(); });
    if (btnClose) btnClose.addEventListener('click', (e) => { e.stopPropagation(); closeZoomLightbox(); });
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevPhoto(); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextPhoto(); });
    if (backdrop) backdrop.addEventListener('click', closeZoomLightbox);

    // Mouse wheel zoom
    stage.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            lightboxState.currentScale = Math.min(5, Math.round((lightboxState.currentScale + 0.25) * 100) / 100);
        } else {
            lightboxState.currentScale = Math.max(1, Math.round((lightboxState.currentScale - 0.25) * 100) / 100);
            if (lightboxState.currentScale === 1) {
                lightboxState.panX = 0;
                lightboxState.panY = 0;
            }
        }
        updateTransform();
    }, { passive: false });

    // Double click to toggle 2.5x zoom
    stage.addEventListener('dblclick', (e) => {
        e.preventDefault();
        if (lightboxState.currentScale > 1) {
            resetZoom();
        } else {
            lightboxState.currentScale = 2.5;
            updateTransform();
        }
    });

    // Pan / Drag handlers (Mouse)
    stage.addEventListener('mousedown', (e) => {
        if (lightboxState.currentScale <= 1) return;
        if (e.target.closest('.zoom-modal-header') || e.target.closest('.zoom-nav-btn')) return;

        lightboxState.isDragging = true;
        lightboxState.startX = e.clientX - lightboxState.panX;
        lightboxState.startY = e.clientY - lightboxState.panY;
        stage.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
        if (!lightboxState.isDragging || lightboxState.currentScale <= 1) return;
        lightboxState.panX = e.clientX - lightboxState.startX;
        lightboxState.panY = e.clientY - lightboxState.startY;
        updateTransform();
    });

    window.addEventListener('mouseup', () => {
        if (lightboxState.isDragging) {
            lightboxState.isDragging = false;
            stage.classList.remove('is-dragging');
        }
    });

    // Touch support (mobile pan)
    stage.addEventListener('touchstart', (e) => {
        if (lightboxState.currentScale <= 1 || e.touches.length !== 1) return;
        lightboxState.isDragging = true;
        lightboxState.startX = e.touches[0].clientX - lightboxState.panX;
        lightboxState.startY = e.touches[0].clientY - lightboxState.panY;
    }, { passive: true });

    stage.addEventListener('touchmove', (e) => {
        if (!lightboxState.isDragging || lightboxState.currentScale <= 1 || e.touches.length !== 1) return;
        lightboxState.panX = e.touches[0].clientX - lightboxState.startX;
        lightboxState.panY = e.touches[0].clientY - lightboxState.startY;
        updateTransform();
    }, { passive: true });

    stage.addEventListener('touchend', () => {
        lightboxState.isDragging = false;
    });

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeZoomLightbox();
        } else if (e.key === 'ArrowLeft') {
            prevPhoto();
        } else if (e.key === 'ArrowRight') {
            nextPhoto();
        } else if (e.key === '+' || e.key === '=') {
            zoomIn();
        } else if (e.key === '-' || e.key === '_') {
            zoomOut();
        } else if (e.key === '0' || e.key === 'r') {
            resetZoom();
        }
    });

    // Expose globally
    window.openZoomLightbox = openZoomLightbox;
    window.closeZoomLightbox = closeZoomLightbox;
    window.openZoomModal = (productKey, index = 0) => {
        if (productKey === 'printed-plastic-wrapping-ribbon') {
            const ribbonImages = [
                { src: 'public/products/printed-plastic-wrapping-ribbon/design_1.png', title: 'Printed Plastic Wrapping Ribbon — Design #01' },
                { src: 'public/products/printed-plastic-wrapping-ribbon/design_2.png', title: 'Printed Plastic Wrapping Ribbon — Design #02' },
                { src: 'public/products/printed-plastic-wrapping-ribbon/design_3.png', title: 'Printed Plastic Wrapping Ribbon — Design #03' },
                { src: 'public/products/printed-plastic-wrapping-ribbon/design_4.png', title: 'Printed Plastic Wrapping Ribbon — Design #04' },
                { src: 'public/products/printed-plastic-wrapping-ribbon/design_5.png', title: 'Printed Plastic Wrapping Ribbon — Design #05' },
                { src: 'public/products/printed-plastic-wrapping-ribbon/design_6.png', title: 'Printed Plastic Wrapping Ribbon — Design #06' },
                { src: 'public/products/printed-plastic-wrapping-ribbon/design_7.png', title: 'Printed Plastic Wrapping Ribbon — Design #07' }
            ];
            openZoomLightbox(ribbonImages, index);
        }
    };
}

function initProductViewButtons() {
    document.querySelectorAll('.product-view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const href = btn.getAttribute('href');
            if (href && window.location.hash === href) {
                handleRoute();
            }
        });
    });
}

function setProductTab(targetKey, shouldScroll = false) {
    if (!targetKey || targetKey === 'bopp-pearlized-film') targetKey = 'plastic-printed-film';

    const tabs = document.querySelectorAll('.product-nav-tab');
    const items = document.querySelectorAll('.product-item-view');
    
    tabs.forEach(tab => {
        const tabProduct = tab.getAttribute('data-tab-product');
        if (tabProduct === targetKey) {
            tab.classList.add('active', 'bg-dark', 'text-white', 'border-dark');
            tab.classList.remove('bg-white/90', 'text-gray-700', 'border-gray-200/90');
        } else {
            tab.classList.remove('active', 'bg-dark', 'text-white', 'border-dark');
            tab.classList.add('bg-white/90', 'text-gray-700', 'border-gray-200/90');
        }
    });

    items.forEach(item => {
        const itemName = item.getAttribute('data-product-name');
        if (targetKey === 'all' || itemName === targetKey) {
            item.style.display = 'block';
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(item, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
            } else {
                item.style.opacity = '1';
            }
        } else {
            item.style.display = 'none';
        }
    });

    if (shouldScroll) {
        const wrapper = document.getElementById('products-display-wrapper');
        if (wrapper) {
            const navHeight = 130;
            const topPos = wrapper.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top: topPos, behavior: 'smooth' });
        }
    }
}

function initProductNavTabs() {
    document.querySelectorAll('.product-nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const productKey = tab.getAttribute('data-tab-product');
            setProductTab(productKey, true);
            const newHash = `#/products-and-services?product=${productKey}`;
            history.replaceState(null, null, newHash);
        });
    });
}

window.setProductTab = setProductTab;

// 13. Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // Initialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Initialize all modules
    initRouter();
    initNavbar();
    initMobileNav();
    initForm();
    initCopyAddress();
    initServiceTabs();
    initProductAutoImages();
    initProductGalleries();
    initZoomLightbox();
    initProductNavTabs();
    initProductViewButtons();
    initBackToTop();
    initSmoothScroll();
});
