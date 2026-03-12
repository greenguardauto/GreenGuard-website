/**
 * Interactive Hero Canvas Animation & Parallax
 * Precision Field Scanning - visualizing laser precision and detection
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('heroCanvas');
        const heroSection = document.getElementById('hero');
        if (!canvas || !heroSection) return;

        const ctx = canvas.getContext('2d');
        let width, height;
        let mouse = { x: null, y: null };
        let animationId;

        // Configuration
        const config = {
            gridSpacing: 40,
            gridColor: 'rgba(5, 150, 82, 0.15)', // GreenGuard Green
            activeGridColor: 'rgba(5, 150, 82, 0.4)',
            scanLineSpeed: 2,
            spotlightRadius: 300,
            parallaxStrength: 15
        };

        let scanLines = [];

        // Resize canvas to cover the full hero section
        function resizeCanvas() {
            width = heroSection.offsetWidth;
            height = heroSection.offsetHeight;
            canvas.width = width;
            canvas.height = height;
            initScanLines();
        }

        // Initialize scanning lines
        function initScanLines() {
            scanLines = [];
            // Create horizontal scan lines
            for (let y = 0; y < height; y += config.gridSpacing) {
                scanLines.push({
                    y: y,
                    speed: Math.random() * 0.5 + 0.2,
                    opacity: Math.random() * 0.3 + 0.1
                });
            }
        }

        // Draw the grid and effects
        function draw() {
            // Clear canvas
            ctx.clearRect(0, 0, width, height);

            // Draw subtle background grid
            ctx.lineWidth = 1;

            // Vertical lines
            for (let x = 0; x < width; x += config.gridSpacing) {
                const distToMouse = mouse.x ? Math.abs(x - mouse.x) : 1000;
                const opacity = Math.max(0.05, 1 - distToMouse / config.spotlightRadius) * 0.2;

                ctx.strokeStyle = `rgba(5, 150, 82, ${opacity})`;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            // Horizontal scanning lines
            scanLines.forEach(line => {
                line.y += line.speed;
                if (line.y > height) line.y = 0;

                const distToMouse = mouse.y ? Math.abs(line.y - mouse.y) : 1000;
                const proximityFactor = Math.max(0, 1 - distToMouse / config.spotlightRadius);

                ctx.strokeStyle = `rgba(5, 150, 82, ${line.opacity * 0.5 + proximityFactor * 0.5})`;
                ctx.beginPath();
                ctx.moveTo(0, line.y);
                ctx.lineTo(width, line.y);
                ctx.stroke();

                // Draw "detection points" at intersections near mouse
                if (proximityFactor > 0.1) {
                    for (let x = 0; x < width; x += config.gridSpacing) {
                        const distPoint = Math.sqrt(Math.pow(x - mouse.x, 2) + Math.pow(line.y - mouse.y, 2));
                        if (distPoint < config.spotlightRadius) {
                            const pointOpacity = (1 - distPoint / config.spotlightRadius) * 0.8;
                            ctx.fillStyle = `rgba(5, 150, 82, ${pointOpacity})`;
                            ctx.beginPath();
                            ctx.arc(x, line.y, 2, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
            });

            // Draw mouse spotlight (subtle glow)
            if (mouse.x && mouse.y) {
                const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, config.spotlightRadius);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
            }
        }

        // Animation loop
        function animate() {
            draw();
            animationId = requestAnimationFrame(animate);
        }

        // Parallax Effect for Text
        function updateParallax() {
            if (!mouse.x || !mouse.y) return;

            const centerX = width / 2;
            const centerY = height / 2;
            const moveX = (mouse.x - centerX) / centerX;
            const moveY = (mouse.y - centerY) / centerY;

            const parallaxElements = document.querySelectorAll('[data-parallax]');
            parallaxElements.forEach(el => {
                const factor = parseFloat(el.getAttribute('data-parallax')) || 0.05;
                const x = moveX * config.parallaxStrength * factor * 100;
                const y = moveY * config.parallaxStrength * factor * 100;
                el.style.transform = `translate(${x}px, ${y}px)`;
            });
        }

        // Event Listeners
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            updateParallax();
        });

        heroSection.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
            // Reset parallax
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            parallaxElements.forEach(el => {
                el.style.transform = 'translate(0, 0)';
            });
        });

        // Touch support
        heroSection.addEventListener('touchmove', (e) => {
            // e.preventDefault(); // Don't block scroll
            const rect = heroSection.getBoundingClientRect();
            const touch = e.touches[0];
            mouse.x = touch.clientX - rect.left;
            mouse.y = touch.clientY - rect.top;
        });

        window.addEventListener('resize', () => {
            resizeCanvas();
        });

        // Initialize
        resizeCanvas();
        animate();
    });

})();
