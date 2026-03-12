/**
 * GreenGuard Automation - Neural Network Hero Visualization
 * Refined Round 2: Click interaction, Blended Logo, Detailed Structure.
 */

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    mult(n) {
        this.x *= n;
        this.y *= n;
        return this;
    }

    div(n) {
        this.x /= n;
        this.y /= n;
        return this;
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const m = this.mag();
        if (m !== 0) {
            this.div(m);
        }
        return this;
    }

    limit(max) {
        if (this.mag() > max) {
            this.normalize();
            this.mult(max);
        }
        return this;
    }

    static dist(v1, v2) {
        const dx = v1.x - v2.x;
        const dy = v1.y - v2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    clone() {
        return new Vector(this.x, this.y);
    }
}

class Node {
    constructor(x, y, isFixed = false) {
        this.pos = new Vector(x, y);
        this.basePos = new Vector(x, y);
        this.isFixed = isFixed;
        this.radius = isFixed ? 2.0 : 1.5; // Slightly smaller fixed nodes to blend in
        this.connections = [];
        this.pulseIntensity = 0;
        this.phase = Math.random() * Math.PI * 2;
    }

    update(mousePos, width, height) {
        // Subtle breathing
        const vibration = 0.5;
        this.pos.x = this.basePos.x + Math.sin(Date.now() * 0.001 + this.phase) * vibration;
        this.pos.y = this.basePos.y + Math.cos(Date.now() * 0.001 + this.phase) * vibration;

        // Mouse interaction
        if (mousePos) {
            const d = Vector.dist(this.pos, mousePos);
            const range = 120;
            if (d < range) {
                const force = new Vector(this.pos.x, this.pos.y);
                force.sub(mousePos);
                force.normalize();
                const strength = (range - d) / range;
                force.mult(strength * 10);
                this.pos.add(force);
            }
        }

        // Elastic return
        const force = this.basePos.clone().sub(this.pos);
        force.mult(0.1);
        this.pos.add(force);

        // Decay pulse
        if (this.pulseIntensity > 0) {
            this.pulseIntensity -= 0.02;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);

        // Unified Colors: All nodes look similar
        // Fixed nodes slightly darker but not black
        const baseAlpha = this.isFixed ? 0.6 : 0.4;
        const alpha = Math.min(1, baseAlpha + this.pulseIntensity);

        // Using a dark grey for everything to blend
        ctx.fillStyle = `rgba(80, 80, 80, ${alpha})`;

        ctx.fill();
    }
}

class Pulse {
    constructor(startNode, endNode) {
        this.startNode = startNode;
        this.endNode = endNode;
        this.progress = 0;
        this.speed = 0.015 + Math.random() * 0.01;
        this.dead = false;
    }

    update() {
        this.progress += this.speed;
        if (this.progress >= 1) {
            this.progress = 1;
            this.dead = true;
            this.endNode.pulseIntensity = 0.8;
        }
    }

    draw(ctx) {
        const x = this.startNode.pos.x + (this.endNode.pos.x - this.startNode.pos.x) * this.progress;
        const y = this.startNode.pos.y + (this.endNode.pos.y - this.startNode.pos.y) * this.progress;

        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#a0a0a0';
        ctx.fill();
    }
}

class Network {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.pulses = [];
        this.mousePos = null;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.init();
        this.bindEvents();
        this.animate();
    }

    init() {
        this.resize();
        this.createNodes();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    createNodes() {
        this.nodes = [];

        // --- LOGO GENERATION ---
        const logoSize = Math.min(this.width, this.height) * 0.35;
        const cx = this.width * 0.75;
        const cy = this.height * 0.5;

        const addLogoNode = (rx, ry) => {
            const x = cx + rx * logoSize;
            const y = cy + ry * logoSize;
            const node = new Node(x, y, true);
            this.nodes.push(node);
            return node;
        };

        // 1. Shield Outline
        const shieldNodes = [];
        shieldNodes.push(addLogoNode(-0.4, -0.5)); // TL
        shieldNodes.push(addLogoNode(0.4, -0.5));  // TR
        shieldNodes.push(addLogoNode(0.4, 0.2));   // BR start curve
        shieldNodes.push(addLogoNode(0.0, 0.5));   // Bottom Tip
        shieldNodes.push(addLogoNode(-0.4, 0.2));  // BL start curve

        // 2. Dividers (Four Parts)
        // Vertical Center Line
        const topMid = addLogoNode(0.0, -0.5);
        const center = addLogoNode(0.0, 0.0); // Center point
        const bottomMid = shieldNodes[3]; // Bottom Tip

        // Horizontal/Angled Divider
        // Usually shields have a chevron or horizontal bar. 
        // Let's do a horizontal-ish line through the center
        const leftMid = addLogoNode(-0.4, 0.0);
        const rightMid = addLogoNode(0.4, 0.0);

        // 3. Top Right: Layered Neural Network
        // Input Layer (Left side of quadrant)
        const tr_inputs = [
            addLogoNode(0.1, -0.4),
            addLogoNode(0.1, -0.25),
            addLogoNode(0.1, -0.1)
        ];
        // Hidden Layer
        const tr_hidden = [
            addLogoNode(0.25, -0.45),
            addLogoNode(0.25, -0.25),
            addLogoNode(0.25, -0.05)
        ];
        // Output Layer (Right side)
        const tr_outputs = [
            addLogoNode(0.35, -0.35),
            addLogoNode(0.35, -0.15)
        ];

        // 4. Bottom Left: Plant
        // Stem
        const stemTop = addLogoNode(-0.2, 0.0); // Starts at center line
        const stemBot = addLogoNode(-0.2, 0.4);
        // Leaves
        const leaf1 = addLogoNode(-0.3, 0.15);
        const leaf2 = addLogoNode(-0.1, 0.25);


        // --- BACKGROUND NODES ---
        const gridSize = 130;
        const cols = Math.ceil(this.width / gridSize);
        const rows = Math.ceil(this.height / gridSize);

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = c * gridSize + Math.random() * gridSize;
                const y = r * gridSize + Math.random() * gridSize;

                // Keep logo area somewhat clear but allow overlap for blending
                const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
                if (d > logoSize * 0.5) {
                    this.nodes.push(new Node(x, y, false));
                }
            }
        }

        // --- CONNECTIONS ---
        this.updateConnections(shieldNodes, topMid, center, leftMid, rightMid, tr_inputs, tr_hidden, tr_outputs, stemTop, stemBot, leaf1, leaf2);
    }

    updateConnections(shieldNodes, topMid, center, leftMid, rightMid, tr_inputs, tr_hidden, tr_outputs, stemTop, stemBot, leaf1, leaf2) {
        this.nodes.forEach(n => n.connections = []);

        const connect = (n1, n2) => {
            if (n1 && n2) {
                n1.connections.push(n2);
                n2.connections.push(n1);
            }
        };

        // 1. Logo Structure
        // Shield Outline
        for (let i = 0; i < shieldNodes.length; i++) {
            connect(shieldNodes[i], shieldNodes[(i + 1) % shieldNodes.length]);
        }

        // Dividers
        connect(topMid, center);
        connect(center, shieldNodes[3]); // Vertical
        connect(leftMid, center);
        connect(center, rightMid); // Horizontal

        // Top Right: Neural Net Layers
        // Input -> Hidden
        tr_inputs.forEach(i => {
            tr_hidden.forEach(h => connect(i, h));
        });
        // Hidden -> Output
        tr_hidden.forEach(h => {
            tr_outputs.forEach(o => connect(h, o));
        });

        // Bottom Left: Plant
        connect(stemTop, stemBot);
        connect(stemTop, leaf1);
        connect(stemTop, leaf2);

        // 2. Global Network
        const connectDist = 180;

        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const n1 = this.nodes[i];
                const n2 = this.nodes[j];
                const bothFixed = n1.isFixed && n2.isFixed;

                const d = Vector.dist(n1.pos, n2.pos);

                if (d < connectDist) {
                    // Skip random connections between fixed nodes to preserve logo drawing
                    if (bothFixed) continue;

                    n1.connections.push(n2);
                    n2.connections.push(n1);
                }
            }
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createNodes();
        });

        window.addEventListener('mousemove', (e) => {
            this.mousePos = new Vector(e.clientX, e.clientY);
        });

        window.addEventListener('mouseleave', () => {
            this.mousePos = null;
        });

        // Click to spawn pulses
        window.addEventListener('click', (e) => {
            // Find nearest node to click
            const clickPos = new Vector(e.clientX, e.clientY);
            let nearest = null;
            let minD = Infinity;

            this.nodes.forEach(n => {
                const d = Vector.dist(n.pos, clickPos);
                if (d < minD) {
                    minD = d;
                    nearest = n;
                }
            });

            if (nearest && minD < 200) {
                // Spawn multiple pulses from this node
                nearest.connections.forEach(target => {
                    this.pulses.push(new Pulse(nearest, target));
                });
                // Flash the node
                nearest.pulseIntensity = 1.0;
            }
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.nodes.forEach(node => {
            node.update(this.mousePos, this.width, this.height);
        });

        this.ctx.lineWidth = 1;
        this.nodes.forEach(node => {
            node.connections.forEach(other => {
                if (node === other) return;

                const d = Vector.dist(node.pos, other.pos);
                const maxDist = 180;

                if (d < maxDist) {
                    const alpha = 1 - (d / maxDist);

                    // Unified Line Style (Logo blends in)
                    // Just one style for everything
                    this.ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.15})`;
                    this.ctx.lineWidth = 0.8;

                    this.ctx.beginPath();
                    this.ctx.moveTo(node.pos.x, node.pos.y);
                    this.ctx.lineTo(other.pos.x, other.pos.y);
                    this.ctx.stroke();
                }
            });
        });

        this.nodes.forEach(node => node.draw(this.ctx));

        // Rare random pulses
        if (Math.random() < 0.002) {
            const randomNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
            if (randomNode.connections.length > 0) {
                const target = randomNode.connections[Math.floor(Math.random() * randomNode.connections.length)];
                this.pulses.push(new Pulse(randomNode, target));
            }
        }

        for (let i = this.pulses.length - 1; i >= 0; i--) {
            const p = this.pulses[i];
            p.update();
            p.draw(this.ctx);
            if (p.dead) {
                if (Math.random() < 0.7 && p.endNode.connections.length > 0) {
                    const nextTarget = p.endNode.connections[Math.floor(Math.random() * p.endNode.connections.length)];
                    if (nextTarget !== p.startNode) {
                        this.pulses.push(new Pulse(p.endNode, nextTarget));
                    }
                }
                this.pulses.splice(i, 1);
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('hero-network')) {
        new Network('hero-network');
    }
});
