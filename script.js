/* =============================================================
   HAPPY BIRTHDAY ABHISHEK — script.js
   Premium Birthday Surprise Website
   ============================================================= */

'use strict';

/* ─────────────────────────────────────────────────────────────
   CONFIG — Customise these values
───────────────────────────────────────────────────────────── */
const CONFIG = {
  friendshipStartDate: '2020-06-11', // Change to real friendship start date
  totalPhotos: 20,                   // Number of photos (photo1.jpg … photo20.jpg)
  birthdayDate: '2026-06-11',        // Abhishek's birthday
  songs: [
    { title: 'Yaaron Dosti',          artist: 'K.K.' },
    { title: 'Tera Yaar Hoon Main',   artist: 'Arijit Singh' },
    { title: 'Dil Diyan Gallan',      artist: 'Instrumental' },
  ],
  starCount: 120,
  fireflyCount: 18,
  heartCount: 20,
  balloonColors: ['#FF4D8B','#FFD700','#7B2FBE','#00CFFF','#FF6B35','#4CAF50'],
};

/* ─────────────────────────────────────────────────────────────
   UTILITY
───────────────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max));
const delay = ms => new Promise(r => setTimeout(r, ms));

/* ─────────────────────────────────────────────────────────────
   1. STARS & FIREFLIES (Intro background)
───────────────────────────────────────────────────────────── */
function createStars() {
  const container = $('stars-container');
  for (let i = 0; i < CONFIG.starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = rand(1, 3.5);
    star.style.cssText = `
      width:${size}px; height:${size}px;
      left:${rand(0,100)}%;
      top:${rand(0,100)}%;
      --dur:${rand(2,5)}s;
      --delay:${rand(0,4)}s;
    `;
    container.appendChild(star);
  }
}

function createFireflies() {
  const container = $('fireflies-container');
  for (let i = 0; i < CONFIG.fireflyCount; i++) {
    const ff = document.createElement('div');
    ff.className = 'firefly';
    ff.style.cssText = `
      left:${rand(5,95)}%;
      top:${rand(20,90)}%;
      --dur:${rand(4,8)}s;
      --delay:${rand(0,5)}s;
      --tx:${rand(-60,60)}px;
      --ty:${rand(-80,-20)}px;
      --tx2:${rand(-100,100)}px;
      --ty2:${rand(-150,-60)}px;
    `;
    container.appendChild(ff);
  }
}

/* ─────────────────────────────────────────────────────────────
   2. TYPING ANIMATION (Intro)
───────────────────────────────────────────────────────────── */
async function typeText(el, text, speed = 55) {
  el.innerHTML = '';
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  el.appendChild(cursor);
  for (const ch of text) {
    const span = document.createElement('span');
    span.textContent = ch;
    el.insertBefore(span, cursor);
    await delay(speed);
  }
  return cursor;
}

async function runIntroTyping() {
  const l1 = $('line1'), l2 = $('line2'), l3 = $('line3');
  const btn = $('surprise-btn');

  l1.style.opacity = 0; l2.style.opacity = 0; l3.style.opacity = 0;

  await delay(600);
  l1.style.opacity = 1;
  const c1 = await typeText(l1, 'Someone very special has a birthday today...', 50);
  await delay(400);
  c1.remove();

  await delay(300);
  l2.style.opacity = 1;
  const c2 = await typeText(l2, 'My Brother, My Best Friend, My Jigri Yaar ❤️', 45);
  await delay(400);
  c2.remove();

  await delay(300);
  l3.style.opacity = 1;
  const c3 = await typeText(l3, 'Happy Birthday Abhishek 🎉', 60);
  await delay(400);
  c3.remove();

  await delay(500);
  btn.classList.remove('hidden');
  btn.classList.add('fade-in-up');
}

/* ─────────────────────────────────────────────────────────────
   3. CONFETTI ENGINE
───────────────────────────────────────────────────────────── */
class ConfettiEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.running = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(x, y, count = 120) {
    const colors = ['#FFD700','#FF4D8B','#7B2FBE','#00CFFF','#FF6B35','#4CAF50','#fff'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x, y,
        vx: rand(-12, 12),
        vy: rand(-18, -4),
        gravity: 0.45,
        color: colors[randInt(0, colors.length)],
        size: rand(5, 12),
        rotation: rand(0, 360),
        rotSpeed: rand(-6, 6),
        alpha: 1,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
      });
    }
    if (!this.running) this._loop();
  }

  rainAll(duration = 4000) {
    const end = Date.now() + duration;
    const interval = setInterval(() => {
      if (Date.now() > end) { clearInterval(interval); return; }
      this.burst(rand(0, window.innerWidth), rand(-10, window.innerHeight * 0.3), 18);
    }, 140);
  }

  _loop() {
    this.running = true;
    const tick = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles = this.particles.filter(p => p.alpha > 0.02);
      for (const p of this.particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.99;
        p.rotation += p.rotSpeed;
        p.alpha -= 0.008;
        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.fillStyle = p.color;
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation * Math.PI / 180);
        if (p.shape === 'circle') {
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          this.ctx.fill();
        } else {
          this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }
        this.ctx.restore();
      }
      if (this.particles.length > 0) requestAnimationFrame(tick);
      else this.running = false;
    };
    requestAnimationFrame(tick);
  }
}

/* ─────────────────────────────────────────────────────────────
   4. FIREWORKS ENGINE
───────────────────────────────────────────────────────────── */
class FireworksEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.shells = [];
    this.sparks = [];
    this.running = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  launch(count = 6, duration = 5000) {
    const end = Date.now() + duration;
    const colors = ['#FFD700','#FF4D8B','#7B2FBE','#00CFFF','#FF6B35','#fff'];
    const shoot = () => {
      if (Date.now() > end) return;
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          const sx = rand(0.2, 0.8) * window.innerWidth;
          const sy = rand(0.1, 0.5) * window.innerHeight;
          const color = colors[randInt(0, colors.length)];
          for (let j = 0; j < 80; j++) {
            const angle = (j / 80) * Math.PI * 2;
            const speed = rand(2, 6);
            this.sparks.push({
              x: sx, y: sy,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              gravity: 0.08,
              alpha: 1,
              color,
              size: rand(2, 4),
            });
          }
        }, i * 150);
      }
      if (!this.running) this._loop();
      setTimeout(shoot, 900);
    };
    shoot();
  }

  _loop() {
    this.running = true;
    const tick = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.sparks = this.sparks.filter(s => s.alpha > 0.01);
      for (const s of this.sparks) {
        s.x += s.vx; s.y += s.vy;
        s.vy += s.gravity;
        s.vx *= 0.96; s.vy *= 0.96;
        s.alpha -= 0.016;
        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, s.alpha);
        this.ctx.fillStyle = s.color;
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = s.color;
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
      if (this.sparks.length > 0 || this.running) requestAnimationFrame(tick);
      else this.running = false;
    };
    requestAnimationFrame(tick);
  }

  stop() { this.running = false; }
}

/* ─────────────────────────────────────────────────────────────
   5. BALLOONS
───────────────────────────────────────────────────────────── */
function launchBalloons(count = 18) {
  const container = $('balloons-container');
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const b = document.createElement('div');
      b.className = 'balloon';
      b.style.cssText = `
        --left:${rand(0,95)}%;
        --color:${CONFIG.balloonColors[randInt(0, CONFIG.balloonColors.length)]};
        --dur:${rand(5,9)}s;
        --delay:0s;
        left:${rand(0,95)}%;
      `;
      container.appendChild(b);
      setTimeout(() => b.remove(), 10000);
    }, i * 200);
  }
}

/* ─────────────────────────────────────────────────────────────
   6. FLOATING HEARTS
───────────────────────────────────────────────────────────── */
function startHearts() {
  const container = $('hearts-container');
  const emojis = ['❤️','💖','💝','💕','💗','✨','🌸'];
  setInterval(() => {
    const h = document.createElement('div');
    h.className = 'float-heart';
    h.textContent = emojis[randInt(0, emojis.length)];
    h.style.cssText = `
      --left:${rand(0,95)}%;
      --size:${rand(0.8,2)}rem;
      --dur:${rand(7,12)}s;
      --delay:0s;
      left:${rand(0,95)}%;
    `;
    container.appendChild(h);
    setTimeout(() => h.remove(), 13000);
  }, 600);
}

/* ─────────────────────────────────────────────────────────────
   7. GIFT BOXES
───────────────────────────────────────────────────────────── */
function dropGifts(count = 12) {
  const container = $('gifts-container');
  const gifts = ['🎁','🎀','🎊','🎉','🥳','🎈'];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const g = document.createElement('div');
      g.className = 'gift-box';
      g.textContent = gifts[randInt(0, gifts.length)];
      g.style.cssText = `
        left:${rand(0,95)}%;
        --dur:${rand(3,6)}s;
        --delay:0s;
      `;
      container.appendChild(g);
      setTimeout(() => g.remove(), 7000);
    }, i * 300);
  }
}

/* ─────────────────────────────────────────────────────────────
   8. FRIENDSHIP COUNTER
───────────────────────────────────────────────────────────── */
function updateFriendshipCounter() {
  const start = new Date(CONFIG.friendshipStartDate);
  const now   = new Date();
  const days  = Math.floor((now - start) / (1000 * 60 * 60 * 24));

  // Count-up animation
  const el = $('friendshipDays');
  let count = 0;
  const step = Math.ceil(days / 80);
  const timer = setInterval(() => {
    count = Math.min(count + step, days);
    el.textContent = count.toLocaleString();
    if (count >= days) clearInterval(timer);
  }, 20);
}

/* ─────────────────────────────────────────────────────────────
   9. PHOTO CAROUSEL (3D)
───────────────────────────────────────────────────────────── */
let carouselIndex = 0;
let autoSlideTimer = null;

function buildCarousel() {
  const carousel = $('photoCarousel');
  carousel.innerHTML = '';
  const n = CONFIG.totalPhotos;

  for (let i = 0; i < n; i++) {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.dataset.index = i;

    const img = document.createElement('img');
    img.src = `photos/photo${i + 1}.jpg`;
    img.alt = `Memory ${i + 1}`;
    img.loading = 'lazy';
    img.onerror = () => {
      img.src = `https://picsum.photos/seed/abhi${i+1}/300/380`;
    };

    const overlay = document.createElement('div');
    overlay.className = 'photo-card-overlay';
    overlay.innerHTML = `<span class="photo-num">Memory #${i + 1} 📸</span>`;

    card.appendChild(img);
    card.appendChild(overlay);
    card.addEventListener('click', () => openLightbox(img.src));
    carousel.appendChild(card);
  }

  positionCards();
}

function positionCards() {
  const cards = document.querySelectorAll('.photo-card');
  const total = cards.length;
  const visibleRange = 5; // cards shown on each side
  const cardW = window.innerWidth < 600 ? 180 : 260;
  const wrapperW = document.querySelector('.carousel-wrapper').offsetWidth;

  cards.forEach((card, i) => {
    const offset = i - carouselIndex;
    const absOffset = Math.abs(offset);

    if (absOffset > visibleRange) {
      card.style.opacity = '0';
      card.style.pointerEvents = 'none';
      card.style.zIndex = '0';
      return;
    }

    const tx = offset * (cardW * 0.55);
    const tz = -absOffset * 80;
    const scale = 1 - absOffset * 0.08;
    const ry = -offset * 10;

    card.style.cssText = `
      opacity:${absOffset === 0 ? 1 : Math.max(0.2, 1 - absOffset * 0.22)};
      z-index:${visibleRange - absOffset + 1};
      pointer-events:${absOffset === 0 ? 'auto' : 'none'};
      transform: translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale});
      top:50%; left:50%;
      transition: transform 0.7s cubic-bezier(0.23,1,0.32,1), opacity 0.7s ease;
    `;
  });
}

function prevSlide() {
  carouselIndex = (carouselIndex - 1 + CONFIG.totalPhotos) % CONFIG.totalPhotos;
  positionCards();
}
function nextSlide() {
  carouselIndex = (carouselIndex + 1) % CONFIG.totalPhotos;
  positionCards();
}

function startAutoSlide() {
  autoSlideTimer = setInterval(() => {
    nextSlide();
  }, 3200);
}

function openLightbox(src) {
  const lb = $('lightbox');
  $('lightboxImg').src = src;
  lb.classList.remove('hidden');
}

function setupGallery() {
  buildCarousel();
  $('prevBtn').addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
  $('nextBtn').addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
  $('closeLightbox').addEventListener('click', () => $('lightbox').classList.add('hidden'));
  $('lightbox').addEventListener('click', (e) => {
    if (e.target === $('lightbox')) $('lightbox').classList.add('hidden');
  });
  startAutoSlide();
  window.addEventListener('resize', positionCards);
}

function resetAutoSlide() {
  clearInterval(autoSlideTimer);
  startAutoSlide();
}

/* Floating hearts around gallery */
function startGalleryHearts() {
  const c = $('galleryHearts');
  setInterval(() => {
    const h = document.createElement('span');
    h.textContent = ['❤️','💖','✨'][randInt(0,3)];
    h.style.cssText = `
      position:absolute;
      font-size:${rand(0.8,1.8)}rem;
      left:${rand(0,100)}%;
      bottom:0;
      animation:floatHeart ${rand(4,8)}s ease-in forwards;
    `;
    c.appendChild(h);
    setTimeout(() => h.remove(), 9000);
  }, 700);
}

/* ─────────────────────────────────────────────────────────────
   10. ENVELOPE / LETTER
───────────────────────────────────────────────────────────── */
function openEnvelope() {
  const env = $('envelope');
  const letter = $('letterPaper');
  if (env.classList.contains('opened')) return;

  env.classList.add('opened');
  // Lift & slide envelope up
  env.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
  env.style.transform  = 'translateY(-20px) scale(0.9)';
  env.style.opacity    = '0';

  setTimeout(() => {
    env.style.display = 'none';
    letter.classList.remove('hidden');
  }, 800);
}

/* ─────────────────────────────────────────────────────────────
   11. SCROLL REVEAL (Timeline)
───────────────────────────────────────────────────────────── */
function setupScrollReveal() {
  const items = document.querySelectorAll('.timeline-item.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(i => observer.observe(i));
}

/* ─────────────────────────────────────────────────────────────
   12. CANDLE BLOW
───────────────────────────────────────────────────────────── */
let candlesBlown = 0;

function setupCandles() {
  const candles = document.querySelectorAll('.candle');
  candles.forEach(candle => {
    candle.addEventListener('click', () => {
      if (candle.dataset.blown === 'true') return;
      candle.dataset.blown = 'true';
      candle.querySelector('.flame').style.display = 'none';
      candle.querySelector('.smoke').classList.remove('hidden');
      candlesBlown++;

      const wishText = $('wishText');
      if (candlesBlown === candles.length) {
        wishText.textContent = '🌟 Wish Granted! Happy Birthday Abhishek! 🌟';
        wishText.style.background = 'linear-gradient(135deg, #FFD700, #FF4D8B)';
        wishText.style.webkitBackgroundClip = 'text';
        wishText.style.webkitTextFillColor = 'transparent';
        wishText.style.backgroundClip = 'text';
        wishText.style.fontSize = '1.1rem';
      } else {
        wishText.textContent = `Make A Wish Abhishek ✨ (${candles.length - candlesBlown} left)`;
      }
    });
  });
}

/* ───────────────────────────────────────────────────────────── 13. MUSIC PLAYER ───────────────────────────────────────────────────────────── 
*/ let currentSong = 0; let isPlaying = false; const audio = new Audio("song.mp3"); 
function setupMusicPlayer() { const playBtn = $('playPauseBtn'); const player = $('musicPlayer'); 
  playBtn.addEventListener('click', () => { if (isPlaying) { audio.pause();
     playBtn.textContent = '▶';
     } else { audio.play(); 
      playBtn.textContent = '⏸';
     } isPlaying = !isPlaying; player.classList.toggle('playing', isPlaying);
     });
      $('prevSong').addEventListener('click', () => { audio.currentTime = 0; audio.play();
         isPlaying = true; playBtn.textContent = '⏸';
         }); $('nextSong').addEventListener('click', () => { audio.currentTime = 0;
           audio.play(); isPlaying = true; playBtn.textContent = '⏸';
           });
           }

/* ─────────────────────────────────────────────────────────────
   14. FINAL SURPRISE OVERLAY
───────────────────────────────────────────────────────────── */
function setupFinalSurprise(confettiEngine, fireworksEngine) {
  $('finalSurpriseBtn').addEventListener('click', () => {
    const overlay = $('finalOverlay');
    overlay.classList.remove('hidden');

    // Re-run confetti + fireworks on final canvas
    const finalCanvas = $('finalCanvas');
    const fc = new ConfettiEngine(finalCanvas);
    const ff = new FireworksEngine(finalCanvas);
    fc.rainAll(8000);
    ff.launch(8, 8000);

    // Staggered message reveal
    const messages = ['fm1','fm2','fm3','fm4','fm5'];
    messages.forEach((id, i) => {
      setTimeout(() => {
        const el = $(id);
        el.classList.add('show');
      }, 800 + i * 1400);
    });
  });

  $('closeFinal').addEventListener('click', () => {
    $('finalOverlay').classList.add('hidden');
    // Reset messages
    ['fm1','fm2','fm3','fm4','fm5'].forEach(id => $(id).classList.remove('show'));
  });
}

/* ─────────────────────────────────────────────────────────────
   15. SURPRISE BUTTON → Launch Main Page
───────────────────────────────────────────────────────────── */
function setupSurpriseButton(confettiEngine, fireworksEngine) {
  $('surprise-btn').addEventListener('click', () => {
    // Screen explosion
    confettiEngine.rainAll(6000);
    fireworksEngine.launch(6, 5000);

    // Fade out intro
    const intro = $('intro-screen');
    intro.classList.add('fade-out');

    setTimeout(() => {
      intro.style.display = 'none';

      // Show main page
      const main = $('main-page');
      main.classList.remove('hidden');
      main.classList.add('show');
      main.style.animation = 'fadeInUp 0.8s ease forwards';

      // Trigger sub-animations
      launchBalloons(22);
      dropGifts(14);
      startHearts();
      updateFriendshipCounter();
      setupGallery();
      startGalleryHearts();
      setupScrollReveal();
      setupCandles();
      setupMusicPlayer();
      setupFinalSurprise(confettiEngine, fireworksEngine);
    }, 800);
  });
}

/* ─────────────────────────────────────────────────────────────
   INIT
───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Build background
  createStars();
  createFireflies();

  // Init engines (shared canvas for main; separate for final)
  const mainCanvas = $('fireworksCanvas');
  const confettiEngine = new ConfettiEngine(mainCanvas);
  const fireworksEngine = new FireworksEngine(mainCanvas);

  // Start typing
  runIntroTyping();

  // Wire up surprise button
  setupSurpriseButton(confettiEngine, fireworksEngine);

  // Keyboard support: Enter = click active button
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const btn = $('surprise-btn');
      if (btn && !btn.classList.contains('hidden')) btn.click();
    }
  });
});