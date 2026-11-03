// Theme Switcher (Dark / Light)
const themeToggleBtn = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

// Check saved theme or system preference
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlEl.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggleBtn.querySelector('i');
    if (theme === 'light') {
        icon.className = 'fa-solid fa-sun';
    } else {
        icon.className = 'fa-solid fa-moon';
    }
}

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
});

function initImageZoom() {
    const images = Array.from(document.querySelectorAll('img:not([data-no-zoom])'));
    if (images.length === 0) return;

    const dialog = document.createElement('dialog');
    dialog.className = 'image-zoom-dialog';
    dialog.setAttribute('aria-label', 'Ảnh phóng to');

    const closeButton = document.createElement('button');
    closeButton.className = 'image-zoom-close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Đóng ảnh phóng to');
    closeButton.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';

    const zoomedImage = document.createElement('img');
    zoomedImage.className = 'image-zoom-content';
    zoomedImage.alt = '';

    const caption = document.createElement('p');
    caption.className = 'image-zoom-caption';

    dialog.append(closeButton, zoomedImage, caption);
    document.body.append(dialog);

    function openImage(image) {
        zoomedImage.src = image.currentSrc || image.src;
        zoomedImage.alt = image.alt;
        const figureCaption = image.closest('figure')?.querySelector('figcaption')?.textContent?.trim();
        caption.textContent = figureCaption || image.alt;
        dialog.showModal();
        closeButton.focus();
    }

    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            event.preventDefault();
            dialog.close();
        }
    });
    dialog.addEventListener('click', event => {
        if (event.target === dialog) dialog.close();
    });

    images.forEach(image => {
        image.classList.add('zoomable-image');
        image.tabIndex = 0;
        image.setAttribute('aria-label', `Phóng to hình ảnh: ${image.alt || 'hình ảnh dự án'}`);

        image.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            openImage(image);
        });

        image.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            event.stopPropagation();
            openImage(image);
        });
    });
}

initImageZoom();

// Hash-based views keep navigation shareable without reloading the page.
const pageViews = Array.from(document.querySelectorAll('[data-view]'));
const pageNavLinks = Array.from(document.querySelectorAll('.nav-item'));
const heroIntro = document.getElementById('heroIntro');
const namePrefix = document.getElementById('namePrefix');
const nameHighlight = document.getElementById('nameHighlight');
const heroName = document.getElementById('userName');
const heroRole = document.getElementById('heroRole');
let heroSequenceStarted = false;

function playHeroSequence() {
    if (heroSequenceStarted || !heroIntro || !namePrefix || !nameHighlight || !heroName || !heroRole) return;
    heroSequenceStarted = true;

    const greeting = 'Xin chào, mình là...';
    const prefix = 'NGUYỄN ĐÌNH';
    const highlight = 'HUY';
    const role = 'Kỹ Sư Cơ Điện Tử & Robotics';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
        heroIntro.textContent = greeting;
        namePrefix.textContent = prefix;
        nameHighlight.textContent = highlight;
        heroRole.textContent = role;
        return;
    }

    document.body.classList.add('typewriter-ready');
    heroIntro.textContent = '';
    namePrefix.textContent = '';
    nameHighlight.textContent = '';
    heroRole.textContent = '';
    heroIntro.classList.add('is-typing');

    const typeText = async (target, text, delay) => {
        for (const character of Array.from(text)) {
            target.textContent += character;
            await new Promise(resolve => window.setTimeout(resolve, delay));
        }
    };

    void (async () => {
        await typeText(heroIntro, greeting, 52);
        heroIntro.classList.remove('is-typing');
        await new Promise(resolve => window.setTimeout(resolve, 220));

        heroName.classList.add('is-typing');
        await typeText(namePrefix, prefix, 72);
        await new Promise(resolve => window.setTimeout(resolve, 90));
        await typeText(nameHighlight, highlight, 72);
        heroName.classList.remove('is-typing');
        heroName.classList.add('name-reveal');

        await new Promise(resolve => window.setTimeout(resolve, 620));
        heroRole.classList.add('is-typing');
        await typeText(heroRole, role, 48);
        heroRole.classList.remove('is-typing');
    })();
}

function renderPageView() {
    if (pageViews.length === 0) return;

    const requestedView = window.location.hash.slice(1);
    const activeView = pageViews.some(view => view.id === requestedView)
        ? requestedView
        : 'hero';

    pageViews.forEach(view => {
        const isActive = view.id === activeView;
        view.hidden = !isActive;
        view.setAttribute('aria-hidden', String(!isActive));
        view.classList.toggle('view-enter', isActive);
    });

    pageNavLinks.forEach(link => {
        const isActive = link.hash === `#${activeView}`;
        link.classList.toggle('active', isActive);
        if (isActive) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    if (activeView === 'hero') playHeroSequence();
    window.scrollTo(0, 0);
}

if (pageViews.length > 0) {
    window.addEventListener('hashchange', renderPageView);
    renderPageView();
}

// Set current year
document.getElementById('year').textContent = new Date().getFullYear();

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Copy to clipboard helper
function copyText(text, successMsg) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
    }).catch(() => {
        showToast('Sao chép: ' + text);
    });
}

// Contact form simulation
function handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    showToast(`Cảm ơn ${name}! Lời nhắn đã được gửi thành công.`);
    e.target.reset();
}

/* ============================================================
   CYBER CURSOR & INTERACTIVE PARTICLE CANVAS
   Hiệu ứng mạng hạt cơ khí tương tác chuột
   ============================================================ */

// 1. Futuristic Cyber Cursor with Smooth LERP
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = -100;
let mouseY = -100;
let ringX = -100;
let ringY = -100;
let isMouseActive = false;

window.addEventListener('mousemove', (e) => {
    isMouseActive = true;
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Direct snap for center dot
    if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    }

    // Background 3D Parallax & Spotlight updates
    const relX = (mouseX / window.innerWidth - 0.5) * 26;
    const relY = (mouseY / window.innerHeight - 0.5) * 26;
    document.documentElement.style.setProperty('--bg-x', `${-relX}px`);
    document.documentElement.style.setProperty('--bg-y', `${-relY}px`);
    document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);

});

// Cursor hover locks on interactive elements
function initCursorInteractions() {
    const targets = document.querySelectorAll('a, button, .project-card, .skill-card, .about-card, .contact-item, input, textarea, .avatar-wrapper, .social-icon');
    targets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            if (cursorRing) cursorRing.classList.add('hovering');
            if (cursorDot) cursorDot.classList.add('hovering');
        });
        target.addEventListener('mouseleave', () => {
            if (cursorRing) cursorRing.classList.remove('hovering');
            if (cursorDot) cursorDot.classList.remove('hovering');
        });
    });
}
initCursorInteractions();

window.addEventListener('mousedown', () => {
    if (cursorRing) cursorRing.classList.add('clicking');
});

window.addEventListener('mouseup', () => {
    if (cursorRing) cursorRing.classList.remove('clicking');
});

window.addEventListener('mouseleave', () => {
    isMouseActive = false;
    mouseX = -100;
    mouseY = -100;
    document.documentElement.style.setProperty('--mouse-x', `50%`);
    document.documentElement.style.setProperty('--mouse-y', `50%`);
});

// 2. Circuit connections with miniature mechanical gears
const canvas = document.getElementById('techCanvas');

if (canvas) {
    const ctx = canvas.getContext('2d', { alpha: true });
    let width = 0;
    let height = 0;
    let canvasLeft = 0;
    let canvasTop = 0;
    let pixelRatio = 1;
    let gears = [];
    let animationFrame = 0;
    let previousFrameTime = 0;

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        width = Math.max(rect.width, 1);
        height = Math.max(rect.height, 1);
        canvasLeft = rect.left;
        canvasTop = rect.top;
        pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        initGears();
    }

    window.addEventListener('resize', resizeCanvas);

    class CircuitGear {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() + 4.5;
            this.teeth = Math.floor(Math.random() * 3) + 6;
            this.rotation = Math.random() * Math.PI * 2;
            this.angularVelocity = (Math.random() - 0.5) * 0.018;
            this.pulse = Math.random() * Math.PI * 2;
        }

        update(frameScale, pointerX, pointerY, pointerActive) {
            this.x += this.vx * frameScale;
            this.y += this.vy * frameScale;
            this.rotation += this.angularVelocity * frameScale;
            this.pulse += 0.04 * frameScale;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            if (pointerActive) {
                const dx = pointerX - this.x;
                const dy = pointerY - this.y;
                const distance = Math.hypot(dx, dy);
                const interactionRadius = 180;

                if (distance > 0 && distance < interactionRadius) {
                    const force = (interactionRadius - distance) / interactionRadius;
                    this.x -= (dx / distance) * force * 1.8 * frameScale;
                    this.y -= (dy / distance) * force * 1.8 * frameScale;
                }
            }
        }

        draw(isLight) {
            const accent = isLight ? '5, 150, 105' : '0, 255, 136';
            const rootRadius = this.radius * 0.7;
            const toothAngle = (Math.PI * 2) / this.teeth;
            const pulse = (Math.sin(this.pulse) + 1) / 2;
            const pulseScale = 0.92 + pulse * 0.14;
            const brightness = 0.2 + pulse * 0.15;

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.scale(pulseScale, pulseScale);
            ctx.globalAlpha = brightness;
            ctx.beginPath();
            for (let tooth = 0; tooth < this.teeth; tooth++) {
                const startAngle = tooth * toothAngle;
                const points = [
                    [0.08, rootRadius],
                    [0.2, this.radius],
                    [0.58, this.radius],
                    [0.7, rootRadius],
                    [0.92, rootRadius]
                ];

                points.forEach(([offset, radius], index) => {
                    const angle = startAngle + offset * toothAngle;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    if (tooth === 0 && index === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                });
            }
            ctx.closePath();
            ctx.fillStyle = `rgba(${accent}, 0.1)`;
            ctx.strokeStyle = `rgba(${accent}, 0.68)`;
            ctx.lineWidth = 0.7;
            ctx.shadowColor = `rgba(${accent}, 0.45)`;
            ctx.shadowBlur = 0.5 + pulse * 0.7;
            ctx.fill();
            ctx.stroke();

            ctx.shadowBlur = 0;
            ctx.lineWidth = 0.65;
            ctx.strokeStyle = `rgba(${accent}, 0.56)`;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * 0.36, 0, Math.PI * 2);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, Math.max(this.radius * 0.16, 0.55), 0, Math.PI * 2);
            ctx.fillStyle = isLight ? 'rgba(241, 248, 244, 0.9)' : 'rgba(6, 13, 9, 0.9)';
            ctx.fill();
            ctx.strokeStyle = `rgba(${accent}, 0.65)`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.restore();
        }
    }

    function initGears() {
        const count = Math.floor((width * height) / 22000);
        const total = Math.min(Math.max(count, 24), 55);
        gears = Array.from({ length: total }, () => new CircuitGear());
    }

    function renderFrame(timestamp) {
        if (document.hidden) return;

        const deltaSeconds = previousFrameTime
            ? Math.min((timestamp - previousFrameTime) / 1000, 0.05)
            : 1 / 60;
        const frameScale = deltaSeconds * 60;
        previousFrameTime = timestamp;
        ctx.clearRect(0, 0, width, height);

        const pointerX = mouseX - canvasLeft;
        const pointerY = mouseY - canvasTop;
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const strokeColor = isLight ? '5, 150, 105' : '16, 185, 129';
        const connectDistance = 120;
        const mouseRadius = 180;

        if (cursorRing && isMouseActive) {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
        }

        for (const gear of gears) {
            gear.update(frameScale, pointerX, pointerY, isMouseActive);
        }

        for (let first = 0; first < gears.length; first++) {
            const gear = gears[first];
            for (let second = first + 1; second < gears.length; second++) {
                const other = gears[second];
                const distance = Math.hypot(gear.x - other.x, gear.y - other.y);

                if (distance < connectDistance) {
                    const alpha = (1 - distance / connectDistance) * 0.1;
                    ctx.strokeStyle = `rgba(${strokeColor}, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(gear.x, gear.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.stroke();
                }
            }

            if (isMouseActive && mouseX > 0 && mouseY > 0) {
                const distance = Math.hypot(pointerX - gear.x, pointerY - gear.y);
                if (distance < mouseRadius) {
                    const alpha = (1 - distance / mouseRadius) * 0.25;
                    ctx.strokeStyle = isLight
                        ? `rgba(5, 150, 105, ${alpha})`
                        : `rgba(52, 211, 153, ${alpha})`;
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.moveTo(gear.x, gear.y);
                    ctx.lineTo(pointerX, pointerY);
                    ctx.stroke();
                }
            }
        }

        for (const gear of gears) {
            gear.draw(isLight);
        }

        animationFrame = window.requestAnimationFrame(renderFrame);
    }

    resizeCanvas();
    animationFrame = window.requestAnimationFrame(renderFrame);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            window.cancelAnimationFrame(animationFrame);
            previousFrameTime = 0;
            return;
        }
        previousFrameTime = 0;
        animationFrame = window.requestAnimationFrame(renderFrame);
    });
}

// 3. 3D Tilt Effect on Cards for Realistic Physical Touch
const tiltCards = document.querySelectorAll('.project-card, .skill-card, .about-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
});
