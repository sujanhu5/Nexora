import React, { useEffect, useRef } from 'react';

export interface GalaxyProps {
  starSpeed?: number;
  density?: number;
  hueShift?: number;
  speed?: number;
  glowIntensity?: number;
  saturation?: number;
  mouseRepulsion?: boolean;
  repulsionStrength?: number;
  twinkleIntensity?: number;
  rotationSpeed?: number;
  transparent?: boolean;
  enableMeteors?: boolean;
  enableAsteroids?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface Star {
  // Spatial coordinates relative to galaxy center
  r: number;             // Distance from center
  theta: number;         // Orbital angle in radians
  z: number;             // Vertical depth offset for 3D tilt
  orbitSpeed: number;    // Intrinsic orbital speed

  // Repulsion physics displacement
  dispX: number;
  dispY: number;
  velX: number;
  velY: number;

  // Visual attributes
  size: number;
  baseAlpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
  color: string;
  hasSpike: boolean;
}

// Falling Meteor / Shooting Star with trail & sparks
interface MeteorSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  thickness: number;
  headRadius: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  color: string;
  sparks: MeteorSpark[];
}

// Falling Asteroid / Space Rock with rotation, shockwave glow & particle wake
interface AsteroidDustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

interface Asteroid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  shapeOffsets: number[]; // Radii multipliers for jagged polygonal rock
  alpha: number;
  life: number;
  maxLife: number;
  dust: AsteroidDustParticle[];
}

export const Galaxy: React.FC<GalaxyProps> = ({
  starSpeed = 0.5,
  density = 0.5,
  hueShift = 140,
  speed = 1,
  glowIntensity = 0.3,
  saturation = 0,
  mouseRepulsion = true,
  repulsionStrength = 1.5,
  twinkleIntensity = 0.3,
  rotationSpeed = 0.1,
  transparent = true,
  enableMeteors = true,
  enableAsteroids = true,
  className = '',
  style = {}
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; isInside: boolean }>({
    x: -9999,
    y: -9999,
    isInside: false
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let asteroids: Asteroid[] = [];
    let galaxyRotation = 0;
    let lastTime = performance.now();

    // Timers for intermittent meteor and asteroid spawns
    let nextMeteorTime = performance.now() + 1500;
    let nextAsteroidTime = performance.now() + 3000;

    // Generate stars for spiral galaxy + background field
    const initStars = (w: number, h: number) => {
      const maxRadius = Math.hypot(w, h) * 0.48;
      const count = Math.max(300, Math.floor(900 * density));
      const newStars: Star[] = [];

      const numArms = 2;
      const armOffset = (Math.PI * 2) / numArms;
      const spiralWinding = 3.2;

      for (let i = 0; i < count; i++) {
        const isCore = Math.random() < 0.25;
        const isHalo = Math.random() < 0.2;
        let r: number;
        let theta: number;

        if (isCore) {
          // Clustered near galactic core
          r = Math.pow(Math.random(), 2.2) * (maxRadius * 0.22);
          theta = Math.random() * Math.PI * 2;
        } else if (isHalo) {
          // Distributed outer halo
          r = Math.sqrt(Math.random()) * maxRadius;
          theta = Math.random() * Math.PI * 2;
        } else {
          // Logarithmic spiral arms
          const armIndex = Math.floor(Math.random() * numArms);
          const t = Math.pow(Math.random(), 1.4);
          r = 20 + t * maxRadius;
          const spiralAngle = armIndex * armOffset + spiralWinding * Math.log(r / 20 + 1);
          // Scatter across arm width
          const armWidth = 0.28 * (r / maxRadius);
          const scatter = (Math.random() - 0.5) * armWidth * Math.PI * 2;
          theta = spiralAngle + scatter;
        }

        // Orbital angular velocity
        const orbitalSpeed = (0.2 + 0.8 / (Math.sqrt(r / 30 + 1))) * 0.003 * starSpeed;
        const z = (Math.random() - 0.5) * 40 * (1 - r / maxRadius);

        // Calculate star color based on hueShift, saturation, and radius
        const starHue = (hueShift + (r / maxRadius) * 60 + (Math.random() - 0.5) * 20) % 360;
        const satPercent = Math.max(0, Math.min(100, saturation * 100));
        const lightness = isCore 
          ? 85 + Math.random() * 15 
          : 70 + Math.random() * 25;
        
        const color = `hsl(${Math.round(starHue)}, ${Math.round(satPercent)}%, ${Math.round(lightness)}%)`;
        const size = isCore 
          ? Math.random() * 1.8 + 0.8
          : Math.random() * 1.6 + 0.5;

        newStars.push({
          r,
          theta,
          z,
          orbitSpeed: orbitalSpeed,
          dispX: 0,
          dispY: 0,
          velX: 0,
          velY: 0,
          size,
          baseAlpha: Math.random() * 0.5 + 0.5,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 2.5 + 1.2,
          color,
          hasSpike: Math.random() < 0.08 && size > 1.4
        });
      }

      stars = newStars;
    };

    // Spawn a rapid burning meteor across the void
    const spawnMeteor = () => {
      if (!enableMeteors) return;
      // Trajectory angle: diagonally downward (35° to 65° from horizontal)
      const angle = (Math.PI / 180) * (38 + Math.random() * 28);
      const velocityMag = 450 + Math.random() * 350; // px per second
      const vx = Math.cos(angle) * (Math.random() < 0.85 ? 1 : -1) * velocityMag;
      const vy = Math.sin(angle) * velocityMag;

      // Start position from top or upper side edges
      const startX = vx > 0 
        ? Math.random() * (width * 0.7) - 40 
        : width * 0.3 + Math.random() * (width * 0.7);
      const startY = -40 - Math.random() * 60;

      const duration = 1.2 + Math.random() * 0.8;

      meteors.push({
        x: startX,
        y: startY,
        vx,
        vy,
        length: 120 + Math.random() * 140,
        thickness: 1.6 + Math.random() * 1.6,
        headRadius: 2.2 + Math.random() * 1.5,
        alpha: 0,
        maxAlpha: 0.75 + Math.random() * 0.25,
        life: 0,
        maxLife: duration,
        color: Math.random() < 0.7 ? '#38bdf8' : '#e0f2fe',
        sparks: []
      });
    };

    // Spawn a tumbling, burning asteroid with glowing wake
    const spawnAsteroid = () => {
      if (!enableAsteroids) return;
      // Fall trajectory (steeper or wide descent)
      const angle = (Math.PI / 180) * (45 + Math.random() * 30);
      const velocityMag = 90 + Math.random() * 110; // heavier, slower than meteor
      const vx = Math.cos(angle) * (Math.random() < 0.7 ? 1 : -1) * velocityMag;
      const vy = Math.sin(angle) * velocityMag;

      const startX = vx > 0 
        ? Math.random() * (width * 0.6) - 50 
        : width * 0.4 + Math.random() * (width * 0.6);
      const startY = -60;

      // Jagged polygon offsets
      const numVertices = 7 + Math.floor(Math.random() * 3);
      const shapeOffsets: number[] = [];
      for (let i = 0; i < numVertices; i++) {
        shapeOffsets.push(0.75 + Math.random() * 0.5);
      }

      const duration = 5.5 + Math.random() * 3.5;

      asteroids.push({
        x: startX,
        y: startY,
        vx,
        vy,
        size: 7 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 1.8,
        shapeOffsets,
        alpha: 0,
        life: 0,
        maxLife: duration,
        dust: []
      });
    };

    // Resize handler
    const handleResize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      width = rect.width || window.innerWidth || 1080;
      height = rect.height || window.innerHeight || 1080;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);

      initStars(width, height);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);
    handleResize();

    // Global mouse tracking so mouseRepulsion works accurately in any screen or full screen mode
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      // Coordinate scaling factor between canvas coordinate space and viewport CSS box
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      mouseRef.current = {
        x,
        y,
        isInside: true
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.isInside = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0 && canvas) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const scaleX = width / rect.width;
        const scaleY = height / rect.height;
        mouseRef.current = {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY,
          isInside: true
        };
      }
    };

    const handleFullscreenChange = () => {
      setTimeout(handleResize, 60);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Main Animation Render Loop
    const render = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // 1. Clear Canvas (transparent or deep obsidian black)
      if (transparent) {
        ctx.clearRect(0, 0, width, height);
      } else {
        ctx.fillStyle = '#030712';
        ctx.fillRect(0, 0, width, height);
      }

      const centerX = width / 2;
      const centerY = height / 2;

      // 2. Global Galaxy Spiral Rotation
      galaxyRotation += rotationSpeed * speed * dt;

      // 3. Render Radiant Galactic Core Glow if glowIntensity > 0
      if (glowIntensity > 0) {
        const coreRadius = Math.min(width, height) * 0.32;
        const gradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, coreRadius
        );
        
        const coreSat = Math.round(Math.max(0, Math.min(100, saturation * 100)));
        const coreHue = Math.round(hueShift % 360);
        
        gradient.addColorStop(0, `hsla(${coreHue}, ${coreSat}%, 95%, ${0.25 * glowIntensity})`);
        gradient.addColorStop(0.2, `hsla(${coreHue}, ${coreSat}%, 75%, ${0.12 * glowIntensity})`);
        gradient.addColorStop(0.5, `hsla(${coreHue}, ${coreSat}%, 55%, ${0.04 * glowIntensity})`);
        gradient.addColorStop(1, 'transparent');

        ctx.save();
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 4. Update & Render Stars
      const mouse = mouseRef.current;
      const repulsionRadius = 140 * repulsionStrength;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Orbit progression
        star.theta += (star.orbitSpeed + rotationSpeed * 0.005) * speed * dt * 60;

        // Base 3D tilted galaxy coordinates
        const tiltFactor = 0.58;
        const totalAngle = star.theta + galaxyRotation;
        const baseX = centerX + Math.cos(totalAngle) * star.r;
        const baseY = centerY + Math.sin(totalAngle) * star.r * tiltFactor + star.z * 0.4;

        // Mouse repulsion physics
        if (mouseRepulsion && mouse.isInside) {
          const currentPosX = baseX + star.dispX;
          const currentPosY = baseY + star.dispY;
          const dx = currentPosX - mouse.x;
          const dy = currentPosY - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < repulsionRadius && dist > 0.5) {
            const force = (1 - dist / repulsionRadius) * repulsionStrength * 38;
            const nx = dx / dist;
            const ny = dy / dist;
            star.velX += nx * force * dt * 60;
            star.velY += ny * force * dt * 60;
          }
        }

        // Apply velocity & spring friction dampening back toward 0
        star.dispX += star.velX * dt * 60;
        star.dispY += star.velY * dt * 60;
        star.velX *= 0.88;
        star.velY *= 0.88;
        star.dispX *= 0.93;
        star.dispY *= 0.93;

        const screenX = baseX + star.dispX;
        const screenY = baseY + star.dispY;

        // Skip rendering if off screen
        if (screenX < -20 || screenX > width + 20 || screenY < -20 || screenY > height + 20) {
          continue;
        }

        // Twinkle luminance calculation with interactive hover illumination
        star.twinklePhase += star.twinkleSpeed * speed * dt;
        const twinkleFactor = 1 + Math.sin(star.twinklePhase) * twinkleIntensity;
        const distToMouse = (mouseRepulsion && mouse.isInside) ? Math.hypot(screenX - mouse.x, screenY - mouse.y) : 9999;
        const isHovered = distToMouse < repulsionRadius;
        const alpha = isHovered
          ? Math.min(1, (star.baseAlpha + 0.35) * (1 + (1 - distToMouse / repulsionRadius) * 0.6))
          : Math.max(0.1, Math.min(1, star.baseAlpha * twinkleFactor));

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = star.color;

        // Star disk
        ctx.beginPath();
        ctx.arc(screenX, screenY, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Optional 4-point stellar diffraction spike for prominent stars
        if (star.hasSpike && glowIntensity > 0.1) {
          const spikeLen = star.size * 3.5;
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(screenX - spikeLen, screenY);
          ctx.lineTo(screenX + spikeLen, screenY);
          ctx.moveTo(screenX, screenY - spikeLen);
          ctx.lineTo(screenX, screenY + spikeLen);
          ctx.stroke();
        }

        ctx.restore();
      }

      // 5. Intermittent Meteor & Asteroid Spawners
      if (enableMeteors && currentTime > nextMeteorTime) {
        spawnMeteor();
        nextMeteorTime = currentTime + 2200 + Math.random() * 3200; // Spawns every ~2.2 - 5.4 seconds
      }

      if (enableAsteroids && currentTime > nextAsteroidTime) {
        spawnAsteroid();
        nextAsteroidTime = currentTime + 5000 + Math.random() * 6000; // Spawns every ~5 - 11 seconds
      }

      // 6. Update & Render Falling Meteors
      for (let mIdx = meteors.length - 1; mIdx >= 0; mIdx--) {
        const m = meteors[mIdx];
        m.life += dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;

        // Fade in rapidly, sustain, then fade out
        const progress = m.life / m.maxLife;
        if (progress < 0.2) {
          m.alpha = (progress / 0.2) * m.maxAlpha;
        } else if (progress > 0.7) {
          m.alpha = (1 - (progress - 0.7) / 0.3) * m.maxAlpha;
        } else {
          m.alpha = m.maxAlpha;
        }

        // Spawn trailing sparks behind meteor head
        if (Math.random() < 0.45 && m.alpha > 0.2) {
          m.sparks.push({
            x: m.x - (m.vx / Math.hypot(m.vx, m.vy)) * (Math.random() * 20),
            y: m.y - (m.vy / Math.hypot(m.vx, m.vy)) * (Math.random() * 20),
            vx: (Math.random() - 0.5) * 40 - m.vx * 0.05,
            vy: (Math.random() - 0.5) * 40 - m.vy * 0.05,
            life: 0,
            maxLife: 0.3 + Math.random() * 0.4,
            size: 0.8 + Math.random() * 1.2,
            color: Math.random() < 0.6 ? '#67e8f9' : '#ffffff'
          });
        }

        // Render Meteor Trail (Ionization streak)
        const speedMag = Math.hypot(m.vx, m.vy);
        const normVx = m.vx / speedMag;
        const normVy = m.vy / speedMag;
        const tailX = m.x - normVx * m.length;
        const tailY = m.y - normVy * m.length;

        ctx.save();
        const trailGrad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        trailGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        trailGrad.addColorStop(0.6, `rgba(56, 189, 248, ${m.alpha * 0.4})`);
        trailGrad.addColorStop(0.9, `rgba(224, 242, 254, ${m.alpha * 0.85})`);
        trailGrad.addColorStop(1, `rgba(255, 255, 255, ${m.alpha})`);

        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = m.thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();

        // Glowing Meteor Head (Diamond Core)
        const headGlow = ctx.createRadialGradient(
          m.x, m.y, 0,
          m.x, m.y, m.headRadius * 4.5
        );
        headGlow.addColorStop(0, `rgba(255, 255, 255, ${m.alpha})`);
        headGlow.addColorStop(0.3, `rgba(56, 189, 248, ${m.alpha * 0.8})`);
        headGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.fillStyle = headGlow;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.headRadius * 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.headRadius, 0, Math.PI * 2);
        ctx.fill();

        // Update & Render Meteor Sparks
        for (let sIdx = m.sparks.length - 1; sIdx >= 0; sIdx--) {
          const sp = m.sparks[sIdx];
          sp.life += dt;
          sp.x += sp.vx * dt;
          sp.y += sp.vy * dt;

          const sparkAlpha = (1 - sp.life / sp.maxLife) * m.alpha;
          if (sparkAlpha <= 0 || sp.life >= sp.maxLife) {
            m.sparks.splice(sIdx, 1);
            continue;
          }

          ctx.fillStyle = sp.color;
          ctx.globalAlpha = sparkAlpha;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        // Clean up expired or offscreen meteors
        if (m.life >= m.maxLife || (m.y > height + 80 && m.x > width + 80)) {
          meteors.splice(mIdx, 1);
        }
      }

      // 7. Update & Render Falling Asteroids
      for (let aIdx = asteroids.length - 1; aIdx >= 0; aIdx--) {
        const ast = asteroids[aIdx];
        ast.life += dt;
        ast.x += ast.vx * dt;
        ast.y += ast.vy * dt;
        ast.rotation += ast.rotSpeed * dt;

        // Life fade calculation
        const prog = ast.life / ast.maxLife;
        if (prog < 0.15) {
          ast.alpha = (prog / 0.15) * 0.95;
        } else if (prog > 0.8) {
          ast.alpha = (1 - (prog - 0.8) / 0.2) * 0.95;
        } else {
          ast.alpha = 0.95;
        }

        // Spawn asteroid dust & glowing plasma embers
        if (Math.random() < 0.6 && ast.alpha > 0.15) {
          const astSpeed = Math.hypot(ast.vx, ast.vy);
          const backNormX = -ast.vx / astSpeed;
          const backNormY = -ast.vy / astSpeed;
          ast.dust.push({
            x: ast.x + backNormX * ast.size * 0.8 + (Math.random() - 0.5) * 6,
            y: ast.y + backNormY * ast.size * 0.8 + (Math.random() - 0.5) * 6,
            vx: backNormX * (20 + Math.random() * 25) + (Math.random() - 0.5) * 15,
            vy: backNormY * (20 + Math.random() * 25) + (Math.random() - 0.5) * 15,
            alpha: ast.alpha * 0.65,
            size: 1.2 + Math.random() * 2.2,
            color: Math.random() < 0.4 ? '#38bdf8' : '#94a3b8',
            life: 0,
            maxLife: 0.6 + Math.random() * 0.6
          });
        }

        ctx.save();

        // A. Render trailing dust wake
        for (let dIdx = ast.dust.length - 1; dIdx >= 0; dIdx--) {
          const d = ast.dust[dIdx];
          d.life += dt;
          d.x += d.vx * dt;
          d.y += d.vy * dt;

          const dustFade = (1 - d.life / d.maxLife) * d.alpha;
          if (dustFade <= 0 || d.life >= d.maxLife) {
            ast.dust.splice(dIdx, 1);
            continue;
          }

          ctx.fillStyle = d.color;
          ctx.globalAlpha = dustFade;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // B. Fiery Bow Shock Corona Glow
        const shockRadius = ast.size * 2.8;
        const shockGrad = ctx.createRadialGradient(
          ast.x, ast.y, 0,
          ast.x, ast.y, shockRadius
        );
        shockGrad.addColorStop(0, `rgba(56, 189, 248, ${ast.alpha * 0.65})`);
        shockGrad.addColorStop(0.4, `rgba(14, 165, 233, ${ast.alpha * 0.3})`);
        shockGrad.addColorStop(1, 'transparent');

        ctx.globalAlpha = ast.alpha;
        ctx.fillStyle = shockGrad;
        ctx.beginPath();
        ctx.arc(ast.x, ast.y, shockRadius, 0, Math.PI * 2);
        ctx.fill();

        // C. Tumbling Jagged Asteroid Body
        ctx.translate(ast.x, ast.y);
        ctx.rotate(ast.rotation);

        const vCount = ast.shapeOffsets.length;
        const angleStep = (Math.PI * 2) / vCount;

        ctx.beginPath();
        for (let v = 0; v < vCount; v++) {
          const vAngle = v * angleStep;
          const r = ast.size * ast.shapeOffsets[v];
          const vx = Math.cos(vAngle) * r;
          const vy = Math.sin(vAngle) * r;
          if (v === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        }
        ctx.closePath();

        // Shaded metallic/rocky surface
        const rockGrad = ctx.createLinearGradient(-ast.size, -ast.size, ast.size, ast.size);
        rockGrad.addColorStop(0, '#e2e8f0'); // Leading edge highlight
        rockGrad.addColorStop(0.35, '#64748b'); // Midtone slate
        rockGrad.addColorStop(0.8, '#1e293b'); // Dark shadow
        rockGrad.addColorStop(1, '#0f172a');

        ctx.fillStyle = rockGrad;
        ctx.fill();

        // Outer crisp rim
        ctx.strokeStyle = `rgba(56, 189, 248, ${ast.alpha * 0.7})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();

        // Clean up expired or offscreen asteroids
        if (ast.life >= ast.maxLife || (ast.y > height + 80 && ast.x > width + 80)) {
          asteroids.splice(aIdx, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [
    starSpeed,
    density,
    hueShift,
    speed,
    glowIntensity,
    saturation,
    mouseRepulsion,
    repulsionStrength,
    twinkleIntensity,
    rotationSpeed,
    transparent,
    enableMeteors,
    enableAsteroids
  ]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full relative overflow-hidden ${className}`}
      style={style}
    >
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full pointer-events-none"
      />
    </div>
  );
};
