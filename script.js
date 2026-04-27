// ── EMAILJS INIT ──
emailjs.init("QcZT8jumDnqdWdCs5");

// ── CURSOR ──
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});
document.querySelectorAll('a,button,.project-card,.flip-card,.bento-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('big'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
});

// ── AUDIO CONTEXT ──
let _actx = null;
function getAudioContext() {
  if (!_actx) _actx = new (window.AudioContext || window.webkitAudioContext)();
  return _actx;
}

// ── POP SOUND ──
function popSound() {
  try {
    const ctx = getAudioContext();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.setValueAtTime(800, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
    g.gain.setValueAtTime(0.12, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    o.start(); o.stop(ctx.currentTime + 0.1);
  } catch(e){}
}

// ── WHOOSH SOUND ──
function whooshSound() {
  try {
    const ctx = getAudioContext();
    const bufSize = ctx.sampleRate * 0.35;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }
    const source = ctx.createBufferSource();
    source.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.35);
    filter.Q.value = 0.8;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    source.stop(ctx.currentTime + 0.35);
  } catch(e){}
}

// ── POP RIPPLE ──
document.addEventListener('click', e => {
  popSound();
  const r = document.createElement('div');
  r.className = 'pop-ripple';
  r.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:30px;height:30px;margin-left:-15px;margin-top:-15px;`;
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 600);
});

// ══ NAV CURTAIN + WHOOSH ══
const curtain = document.getElementById('nav-curtain');
const curtainLabel = document.getElementById('curtain-label');
let _transitioning = false;

function navTo(e, id, label) {
  if (e) e.preventDefault();
  if (_transitioning) return;
  _transitioning = true;

  whooshSound();

  curtainLabel.textContent = label;
  curtain.style.clipPath = 'inset(100% 0 0 0)';
  curtain.style.transition = 'clip-path 0.52s cubic-bezier(0.76,0,0.24,1)';
  curtain.style.pointerEvents = 'none';
  curtainLabel.style.opacity = '0';
  curtainLabel.style.transition = 'opacity 0.3s ease';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      curtain.style.clipPath = 'inset(0% 0 0 0)';
      curtain.style.pointerEvents = 'all';
      setTimeout(() => { curtainLabel.style.opacity = '1'; }, 150);
    });
  });

  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'instant' });

    setTimeout(() => {
      curtainLabel.style.opacity = '0';
      curtain.style.transition = 'clip-path 0.5s cubic-bezier(0.76,0,0.24,1)';
      curtain.style.clipPath = 'inset(0 0 100% 0)';
      curtain.style.pointerEvents = 'none';
      setTimeout(() => {
        curtain.style.clipPath = 'inset(100% 0 0 0)';
        _transitioning = false;
      }, 520);
    }, 480);
  }, 540);

  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
}

// ── CLOCK ──
function updateClock() {
  const now = new Date(), h = now.getHours(), m = now.getMinutes();
  const ampm = h >= 12 ? 'pm' : 'am', hh = h % 12 || 12;
  document.getElementById('clock-time').innerHTML = `${hh}:${String(m).padStart(2,'0')} <sup>${ampm}</sup>`;
  const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  document.getElementById('clock-date').textContent = `${mo[now.getMonth()]} ${now.getDate()}`;
}
updateClock();
setInterval(updateClock, 1000);

// ── HERO NAME LETTERS ──
'AASHISH'.split('').forEach(ch => {
  const s = document.createElement('span');
  s.className = 'name-letter';
  s.textContent = ch;
  document.getElementById('nameLetters').appendChild(s);
});

// ── SUBNAME CYCLE ──
const subs = ['पाण्डेय','PANDEY','パンデイ','판데이','潘德伊','ПАНДЕЙ','باندي'];
let si = 0;
const heroSub = document.getElementById('heroSub');
setInterval(() => {
  heroSub.style.opacity = '0';
  heroSub.style.transform = 'translateY(20px)';
  setTimeout(() => {
    si = (si + 1) % subs.length;
    heroSub.textContent = subs[si];
    heroSub.style.opacity = '1';
    heroSub.style.transform = 'translateY(0)';
  }, 400);
}, 2200);

// ── SPEAK NAME ──
function speakName() {
  const btn = document.getElementById('speakerBtn');
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    btn.classList.remove('speaking');
    return;
  }
  btn.classList.add('speaking');
  const u = new SpeechSynthesisUtterance('Aashish Pandey');
  u.lang = 'en-IN'; u.rate = 0.85; u.pitch = 1.1;
  u.onend = () => btn.classList.remove('speaking');
  speechSynthesis.speak(u);
}

// ── CONTACT ──
function openContact() {
  document.getElementById('contactSlide').classList.add('open');
  document.getElementById('contactOverlay').classList.add('show');
  genCaptcha();
}
function closeContact() {
  document.getElementById('contactSlide').classList.remove('open');
  document.getElementById('contactOverlay').classList.remove('show');
}

let _ca = 0, _cb = 0;
function genCaptcha() {
  _ca = Math.floor(Math.random() * 12) + 1;
  _cb = Math.floor(Math.random() * 12) + 1;
  const ops = ['+', '×'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  document.getElementById('captchaQ').textContent = `${_ca} ${op} ${_cb} = ?`;
  document.getElementById('captchaAns').value = '';
  document.getElementById('cfError').style.display = 'none';
  window._captchaAnswer = op === '+' ? _ca + _cb : _ca * _cb;
}

function sendContact() {
  const name  = document.getElementById('cf-name').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  const topic = document.getElementById('cf-topic').value;
  const msg   = document.getElementById('cf-msg').value.trim();
  const ans   = parseInt(document.getElementById('captchaAns').value);
  const errEl = document.getElementById('cfError');

  if (!name || !email || !msg) { alert('Please fill in name, email, and message!'); return; }
  if (isNaN(ans) || ans !== window._captchaAnswer) {
    errEl.style.display = 'block';
    errEl.textContent = `❌ Wrong answer! The correct answer was ${window._captchaAnswer}. New question generated.`;
    genCaptcha();
    return;
  }

  const btn = document.getElementById('cfSubmitBtn');
  btn.disabled = true;
  btn.textContent = 'Sending...';

  emailjs.send("service_ki1ac6n", "template_9at3buf", {
    from_name: name,
    from_email: email,
    message: `Topic: ${topic || 'Not specified'}\n\n${msg}`
  }).then(() => {
    document.getElementById('cfSuccess').style.display = 'block';
    ['cf-name','cf-email','cf-msg'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('cf-topic').value = '';
    genCaptcha();
    btn.disabled = false;
    btn.textContent = 'Send Message →';
    setTimeout(() => document.getElementById('cfSuccess').style.display = 'none', 5000);
  }).catch(err => {
    console.error(err);
    alert('Mail bhejne me error aa gaya 😓');
    btn.disabled = false;
    btn.textContent = 'Send Message →';
  });
}

// ── LOAD MORE PROJECTS ──
function loadMore() {
  document.querySelectorAll('.project-card.extra').forEach(el => el.style.display = 'flex');
  document.querySelector('.load-more-btn').style.display = 'none';
}

// ── TESTIMONIALS ──
const testis = [
  {text:'"Working with Aashish was a pleasure — delivered on time, clean code, and exceeded expectations every step of the way."', author:'Rahul K — CTO, TechStartup'},
  {text:'"Exceptional frontend skills. The UI Aashish built exceeded all expectations — our users love it and conversion went up."', author:'Priya S — Product Lead, DesignCo'},
  {text:'"One of the most reliable developers I\'ve collaborated with. Fast execution, pixel-perfect output every single time."', author:'Dev A — Founder, BuildLabs'},
];
let ti = 0;
function showTesti(i) {
  const t = document.getElementById('testiText'), a = document.getElementById('testiAuthor');
  t.style.opacity = '0';
  setTimeout(() => {
    t.textContent = testis[i].text;
    a.textContent = testis[i].author;
    t.style.opacity = '1';
  }, 200);
}
function nextTesti() { ti = (ti + 1) % testis.length; showTesti(ti); }
function prevTesti() { ti = (ti - 1 + testis.length) % testis.length; showTesti(ti); }

// ── SUPPORTERS ──
const supporters = [
  {name:'Rahul K',  count:3, msg:'Keep building bro! 🔥',     time:'5m ago',  color:'#f59e0b'},
  {name:'Priya S',  count:5, msg:'Amazing hackathon project!', time:'12m ago', color:'#10b981'},
  {name:'Dev A',    count:2, msg:'Love the AI work 🤖',        time:'1h ago',  color:'#8b5cf6'},
  {name:'Someone',  count:1, msg:'',                           time:'2h ago',  color:'#94a3b8'},
];
document.getElementById('supportersFeed').innerHTML = supporters.map(s => `
  <div class="supporter-item">
    <div class="supporter-avatar" style="background:${s.color}">${s.name.substring(0,2).toUpperCase()}</div>
    <div>
      <div class="supporter-name">${s.name} bought ${s.count} coffee${s.count > 1 ? 's' : ''} <span class="supporter-time">· ${s.time}</span></div>
      ${s.msg ? `<div class="supporter-msg">${s.msg}</div>` : ''}
    </div>
  </div>
`).join('');

// ── FADE IN ON SCROLL ──
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

// ── FLOATING DOTS (Projects Section) ──
(function initDots() {
  const canvas = document.getElementById('dotCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const section = document.getElementById('projects');
  function resize() {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  const COLORS = ['#f5a623','#9b59b6','#2ecc71','#3b82f6','#e91e8c','#0a0a0a'];
  const dots = Array.from({length: 55}, () => ({
    x: Math.random() * (canvas.width || 800),
    y: Math.random() * (canvas.height || 600),
    r: Math.random() * 3.5 + 1.2,
    speed: Math.random() * 0.7 + 0.2,
    opacity: Math.random() * 0.5 + 0.15,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: (Math.random() - 0.5) * 0.02,
  }));
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(d => {
      d.y -= d.speed;
      d.wobble += d.wobbleSpeed;
      d.x += Math.sin(d.wobble) * 0.4;
      if (d.y < -10) {
        d.y = canvas.height + 10;
        d.x = Math.random() * canvas.width;
      }
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = d.color;
      ctx.globalAlpha = d.opacity;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  animate();
})();
