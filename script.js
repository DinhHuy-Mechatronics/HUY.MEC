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
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

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

// Highlight active nav item on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

/* ============================================================
   ADVANCED CYBER CURSOR & INTERACTIVE ENERGY CANVAS
   Hệ thống con trỏ công nghệ cao, vệt sáng laser và tương tác hạt
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

    // Tăng mật độ hạt năng lượng khi di chuột (2-3 hạt đa sắc mỗi chuyển động)
    const spawnCount = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < spawnCount; i++) {
        sparks.push(new EnergySpark(mouseX, mouseY));
    }
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
    // Spawn click shockwave
    if (mouseX > 0 && mouseY > 0) {
        shockwaves.push(new Shockwave(mouseX, mouseY));
        for (let i = 0; i < 12; i++) {
            sparks.push(new EnergySpark(mouseX, mouseY, true));
        }
    }
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

// 2. Interactive Energy Canvas & Circuit Nodes
const canvas = document.getElementById('techCanvas');
let sparks = [];
let shockwaves = [];

if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initNodes();
    });

    // Photon Energy Spark (Vệt sáng laser phóng ra khi di chuột)
    class EnergySpark {
        constructor(x, y, isExplosion = false) {
            this.x = x + (Math.random() - 0.5) * 6;
            this.y = y + (Math.random() - 0.5) * 6;
            const speed = isExplosion ? (Math.random() * 4.5 + 2) : (Math.random() * 2.2 + 0.6);
            const angle = Math.random() * Math.PI * 2;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.size = Math.random() * 3.2 + 1.2;
            this.baseSize = this.size;
            this.life = 1;
            this.decay = Math.random() * 0.024 + 0.015; // Giữ hạt lâu hơn tạo vệt sáng huyền ảo
            this.wobble = Math.random() * Math.PI;
            this.wobbleSpeed = Math.random() * 0.12 + 0.06;

            // Bảng màu cyber neon đa sắc: Mint, Emerald, Cyan, Turquoise
            const colors = [
                '0, 245, 155',   // Cyber Mint
                '16, 185, 129',  // Emerald Green
                '56, 189, 248',  // Electric Cyan
                '52, 211, 153'   // Soft Jade
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.wobble += this.wobbleSpeed;
            this.x += this.vx + Math.sin(this.wobble) * 0.45;
            this.y += this.vy + Math.cos(this.wobble) * 0.45;
            this.vx *= 0.95;
            this.vy *= 0.95;
            this.life -= this.decay;
            this.size = this.baseSize * this.life;
        }

        draw(ctx) {
            if (this.life <= 0) return;
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.max(this.size, 0.4), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.life * 0.85})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgba(${this.color}, ${this.life * 0.9})`;
            ctx.fill();
            ctx.restore();
        }
    }

    // Shockwave EMP Ripple on Click
    class Shockwave {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = 5;
            this.maxRadius = 150;
            this.life = 1;
        }

        update() {
            this.radius += 5.5;
            this.life = 1 - (this.radius / this.maxRadius);
        }

        draw(ctx) {
            if (this.life <= 0) return;
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(52, 211, 153, ${this.life * 0.7})`;
            ctx.lineWidth = Math.max(2.5 * this.life, 0.5);
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#10b981';
            ctx.stroke();
            ctx.restore();
        }
    }

    // Circuit Energy Node (Không ô vuông - thuần điểm sáng tròn vi mạch)
    class CircuitNode {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2.2 + 1.2;
            this.baseRadius = this.radius;
            this.pulse = Math.random() * Math.PI * 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.pulse += 0.04;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Tương tác từ trường khi chuột tới gần
            if (isMouseActive && mouseX > 0 && mouseY > 0) {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.hypot(dx, dy);
                const mouseRadius = 180;

                if (dist < mouseRadius) {
                    const force = (mouseRadius - dist) / mouseRadius;
                    const angle = Math.atan2(dy, dx);
                    // Đẩy nhẹ tạo cảm giác từ trường cơ điện tử
                    this.x -= Math.cos(angle) * force * 1.8;
                    this.y -= Math.sin(angle) * force * 1.8;
                }
            }
        }

        draw() {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            const nodeColor = isLight ? '5, 150, 105' : '52, 211, 153';
            const currentRadius = this.baseRadius + Math.sin(this.pulse) * 0.6;

            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.max(currentRadius, 1), 0, Math.PI * 2);
            ctx.fillStyle = `rgb(${nodeColor})`;
            ctx.fill();
        }
    }

    let nodes = [];
    function initNodes() {
        nodes = [];
        const count = Math.floor((width * height) / 13000);
        const total = Math.min(Math.max(count, 45), 90);
        for (let i = 0; i < total; i++) {
            nodes.push(new CircuitNode());
        }
    }

    function renderConnections() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const strokeColor = isLight ? '5, 150, 105' : '16, 185, 129';
        const connectDist = 120;
        const mouseRadius = 180;

        for (let a = 0; a < nodes.length; a++) {
            for (let b = a + 1; b < nodes.length; b++) {
                const dx = nodes[a].x - nodes[b].x;
                const dy = nodes[a].y - nodes[b].y;
                const dist = Math.hypot(dx, dy);

                if (dist < connectDist) {
                    const alpha = (1 - dist / connectDist) * 0.2;
                    ctx.strokeStyle = `rgba(${strokeColor}, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(nodes[a].x, nodes[a].y);
                    ctx.lineTo(nodes[b].x, nodes[b].y);
                    ctx.stroke();
                }
            }

            // Tia năng lượng kết nối với con trỏ chuột
            if (isMouseActive && mouseX > 0 && mouseY > 0) {
                const dx = mouseX - nodes[a].x;
                const dy = mouseY - nodes[a].y;
                const dist = Math.hypot(dx, dy);

                if (dist < mouseRadius) {
                    const alpha = (1 - dist / mouseRadius) * 0.45;
                    ctx.strokeStyle = isLight 
                        ? `rgba(5, 150, 105, ${alpha})`
                        : `rgba(52, 211, 153, ${alpha})`;
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.moveTo(nodes[a].x, nodes[a].y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.stroke();
                }
            }
        }
    }

    // Main 60 FPS Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Smooth LERP cursor ring tracking
        if (cursorRing && isMouseActive && mouseX > 0) {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
        }

        // Draw and update circuit nodes
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].update();
            nodes[i].draw();
        }

        renderConnections();

        // Update & draw shockwaves
        for (let i = shockwaves.length - 1; i >= 0; i--) {
            shockwaves[i].update();
            shockwaves[i].draw(ctx);
            if (shockwaves[i].life <= 0) {
                shockwaves.splice(i, 1);
            }
        }

        // Update & draw energy sparks
        for (let i = sparks.length - 1; i >= 0; i--) {
            sparks[i].update();
            sparks[i].draw(ctx);
            if (sparks[i].life <= 0) {
                sparks.splice(i, 1);
            }
        }

        requestAnimationFrame(animate);
    }

    initNodes();
    animate();
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
