(function(){
  "use strict";

  /* ---------- NAVBAR scroll state ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---------- mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- active link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');
  const setActive = () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if(window.scrollY >= top) current = sec.id;
    });
    navItems.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#'+current));
  };
  document.addEventListener('scroll', setActive, {passive:true});
  setActive();

  /* ---------- typing effect ---------- */
  const typedEl = document.getElementById('typedSubtitle');
  const phrases = ['Mahasiswa Teknik Informatika', 'Pengajar Anak-Anak'];
  let pIndex = 0, cIndex = 0, deleting = false;

  function typeLoop(){
    const current = phrases[pIndex];
    if(!deleting){
      cIndex++;
      if(cIndex > current.length){
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      cIndex--;
      if(cIndex < 0){
        deleting = false;
        pIndex = (pIndex + 1) % phrases.length;
        cIndex = 0;
      }
    }
    typedEl.innerHTML = current.substring(0, cIndex) + '<span class="cursor"></span>';
    setTimeout(typeLoop, deleting ? 45 : 95);
  }
  typeLoop();

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        if(entry.target.classList.contains('reveal-stagger')){
          entry.target.querySelectorAll(':scope > *').forEach((child,i)=> child.style.setProperty('--i', i));
        }
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.15});
  revealEls.forEach(el => io.observe(el));

  /* ---------- timeline line draw ---------- */
  const timeline = document.querySelector('.timeline');
  if(timeline){
    const tio = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in-view'); tio.unobserve(e.target);} });
    }, {threshold:0.3});
    tio.observe(timeline);
  }

  /* ---------- skills: circular progress ---------- */
  const skillsData = [
    {label:'HTML & CSS', pct:88},
    {label:'JavaScript', pct:78},
    {label:'Web Development', pct:80},
    {label:'UI/UX Design', pct:75},
    {label:'Microsoft Office', pct:90},
    {label:'Problem Solving', pct:85},
    {label:'Communication', pct:88},
    {label:'Teaching', pct:92},
  ];
  const grid = document.getElementById('skillsGrid');
  const R = 42, C = 2 * Math.PI * R;
  skillsData.forEach((s, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'skill';
    wrap.style.setProperty('--i', i);
    wrap.innerHTML = `
      <svg viewBox="0 0 100 100">
        <circle class="ring-bg" cx="50" cy="50" r="${R}"></circle>
        <circle class="ring-fg" data-pct="${s.pct}" cx="50" cy="50" r="${R}" transform="rotate(-90 50 50)"></circle>
        <text x="50" y="55" text-anchor="middle" class="pct">${s.pct}%</text>
      </svg>
      <span class="label">${s.label}</span>
    `;
    grid.appendChild(wrap);
  });

  const rings = document.querySelectorAll('.ring-fg');
  rings.forEach(r => { r.style.strokeDasharray = C; r.style.strokeDashoffset = C; });
  const rio = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const pct = parseFloat(e.target.dataset.pct);
        const offset = C - (pct/100) * C;
        requestAnimationFrame(()=>{ e.target.style.strokeDashoffset = offset; });
        rio.unobserve(e.target);
      }
    });
  }, {threshold:0.4});
  rings.forEach(r => rio.observe(r));

  /* ---------- experience card light 3D tilt ---------- */
  const tiltCard = document.getElementById('tiltCard');
  if(tiltCard && matchMedia('(pointer:fine)').matches){
    tiltCard.addEventListener('mousemove', (e)=>{
      const rect = tiltCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      tiltCard.style.transform = `rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    });
    tiltCard.addEventListener('mouseleave', ()=>{
      tiltCard.style.transform = 'rotateY(0) rotateX(0)';
    });
  }

  /* ---------- contact form (front-end only) ---------- */
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    formMsg.textContent = 'Terima kasih! Pesan Anda telah diterima.';
    form.reset();
    setTimeout(()=>{ formMsg.textContent = ''; }, 5000);
  });

  /* ---------- hero particle network ---------- */
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const hero = document.querySelector('.hero');

  function resizeCanvas(){
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    const count = Math.min(70, Math.floor((canvas.width * canvas.height) / 18000));
    particles = Array.from({length:count}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random()-0.5) * 0.25,
      vy: (Math.random()-0.5) * 0.25,
      r: Math.random() * 1.6 + 0.6
    }));
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function drawParticles(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a = particles[i], b = particles[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 130){
          ctx.strokeStyle = `rgba(95,212,168,${0.14 * (1 - dist/130)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(230,199,102,0.55)';
      ctx.fill();
    });
    if(!reduceMotion) requestAnimationFrame(drawParticles);
  }
  drawParticles();

  /* ---------- floating particles for values section ---------- */
  const fcanvas = document.getElementById('float-canvas');
  const fctx = fcanvas.getContext('2d');
  const valuesSection = document.querySelector('.values');
  let floaters = [];

  function resizeFloat(){
    fcanvas.width = valuesSection.offsetWidth;
    fcanvas.height = valuesSection.offsetHeight;
    floaters = Array.from({length:26}, () => ({
      x: Math.random() * fcanvas.width,
      y: Math.random() * fcanvas.height,
      r: Math.random() * 2 + 0.8,
      speed: Math.random() * 0.3 + 0.1,
      drift: Math.random() * 0.4 - 0.2,
      alpha: Math.random() * 0.35 + 0.15
    }));
  }
  window.addEventListener('resize', resizeFloat);
  resizeFloat();

  function drawFloat(){
    fctx.clearRect(0,0,fcanvas.width, fcanvas.height);
    floaters.forEach(f => {
      f.y -= f.speed;
      f.x += f.drift * 0.2;
      if(f.y < -10) f.y = fcanvas.height + 10;
      if(f.x < -10) f.x = fcanvas.width + 10;
      if(f.x > fcanvas.width + 10) f.x = -10;
      fctx.beginPath();
      fctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
      fctx.fillStyle = `rgba(201,162,39,${f.alpha})`;
      fctx.fill();
    });
    if(!reduceMotion) requestAnimationFrame(drawFloat);
  }
  drawFloat();

})();
