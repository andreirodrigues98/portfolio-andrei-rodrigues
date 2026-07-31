const body = document.body;
const toggle = document.querySelector('.nav__toggle');
const menu = document.querySelector('.menu');

// abrir o menu
function openMenu() {
  menu.classList.add('is-open');
  toggle.classList.add('active');
  toggle.setAttribute('aria-expanded', 'true');
  menu.setAttribute('aria-hidden', 'false');
  body.classList.add('body-lock');
}

// fechar o menu
function closeMenu() {
  menu.classList.remove('is-open');
  toggle.classList.remove('active');
  toggle.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-hidden', 'true');
  body.classList.remove('body-lock');
}

// alternar com o mesmo botão (hambúrguer ↔ X)
toggle?.addEventListener('click', () => {
  const isActive = toggle.classList.contains('active');
  if (isActive) closeMenu();
  else openMenu();
});

// fechar ao clicar em qualquer link
menu?.querySelectorAll('[data-close]').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// fechar com ESC
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menu.classList.contains('is-open')) {
    closeMenu();
  }
});

// ===== HERO: movimento suave e seguro =====
(() => {
  const hero = document.querySelector(".hero");
  const topLine = document.querySelector(".line-left");
  const bottomLine = document.querySelector(".line-right");

  if (!hero || !topLine || !bottomLine) return;

  const clampValue = (value, minimum, maximum) =>
    Math.max(minimum, Math.min(maximum, value));

  function updateHeroText() {
    const heroPosition = hero.getBoundingClientRect();
    const scrollDistance = Math.max(0, -heroPosition.top);
    const animationDistance = Math.max(1, hero.offsetHeight * 0.55);
    const progress = clampValue(scrollDistance / animationDistance, 0, 1);

    const maximumMovement = window.innerWidth <= 600 ? 18 : 65;
    const movement = maximumMovement * progress;

    topLine.style.transform = `translateX(${movement}px)`;
    bottomLine.style.transform = `translateX(${-movement}px)`;

    const opacity = 1 - progress * 0.12;
    topLine.style.opacity = opacity.toFixed(2);
    bottomLine.style.opacity = opacity.toFixed(2);
  }

  window.addEventListener("scroll", updateHeroText, { passive: true });
  window.addEventListener("resize", updateHeroText);
  updateHeroText();
})();






// ===== Arcos que trocam de lugar conforme a direção do scroll =====
(function(){
  const section = document.querySelector('.manifesto');
  if(!section) return;

  let lastY = window.scrollY;
  let shift = 0;                // deslocamento acumulado (px)
  const LIMIT = 180;            // o quanto pode ir para cada lado
  const FOLLOW = 0.22;          // sensibilidade ao scroll (0.12 ~ 0.30)

  const root = document.documentElement;

  function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

  function tick(){
    const y = window.scrollY;
    const delta = y - lastY;    // >0 descendo, <0 subindo
    lastY = y;

    // acumula deslocamento, limitado
    shift = clamp(shift + delta * FOLLOW, -LIMIT, LIMIT);

    // arcos opostos (um vai +x, o outro -x)
    root.style.setProperty('--arcA', `${ shift }px`);
    root.style.setProperty('--arcB', `${-shift }px`);
  }

  tick();
  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', tick);
})();

// ===== Reveal suave ao entrar na viewport =====
(function(){
  const els = document.querySelectorAll('.manifesto .reveal');
  if(!els.length) return;

  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-in');
        // dispara uma vez
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  els.forEach(el=> io.observe(el));
})();



// util
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ====== Scale on scroll (0 → 1 progress dentro da seção) ====== */
(function(){
  const section = document.querySelector('.grow');
  const img = document.querySelector('.grow__img');
  if(!section || !img) return;

  // escala entre 0.92 e 1.12 (ajuste livre)
  const SCALE_MIN = 0.92;
  const SCALE_MAX = 1.16;

  function progressInSection(){
    const top = section.offsetTop;
    const h   = section.offsetHeight;
    const y   = window.scrollY;
    const vh  = window.innerHeight;

    // total “rolável” da seção (precisa ser >0 para ter progressão)
    const total = Math.max(1, h - vh);
    return clamp((y - top) / total, 0, 1);
  }

  function update(){
    const p = progressInSection();
    const s = SCALE_MIN + (SCALE_MAX - SCALE_MIN) * p;
    img.style.setProperty('--scale', s.toFixed(4));
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();

/* ====== Botão voltar ao topo ====== */
(function(){
  const btn = document.querySelector('.toTop');
  if(!btn) return;

  const SHOW_AT = 500; // px de rolagem para começar a mostrar

  function onScroll(){
    if(window.scrollY > SHOW_AT){
      btn.classList.add('is-visible');
    }else{
      btn.classList.remove('is-visible');
    }
  }

btn.addEventListener('click', () => {
  const start = window.scrollY;
  const duration = 1800; // milissegundos (1.8s)
  const startTime = performance.now();

  function easeOutQuad(t) {
    return t * (2 - t); // curva de desaceleração
  }

  function animate(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 6);
    const eased = easeOutQuad(progress);
    window.scrollTo(0, start * (1 - eased));

    if (progress < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});


  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();


// Acordeão + giro do arco vermelho (sem dependências)
(() => {
  const section = document.querySelector('.fullseven');
  if (!section) return;

  const acc  = section.querySelector('#fs-acc');
  const ring = section.querySelector('.ring');

  acc.addEventListener('click', (e) => {
    const btn = e.target.closest('.acc-item');
    if (!btn) return;

    // fecha todos
    acc.querySelectorAll('.acc-item').forEach(b => b.classList.remove('is-open'));
    acc.querySelectorAll('.acc-panel').forEach(p => p.style.height = '0');

    // abre o clicado
    btn.classList.add('is-open');
    const panel  = btn.nextElementSibling;
    const target = getComputedStyle(panel).getPropertyValue('--h').trim() || '140px';
    panel.style.height = target;

    // gira o arco conforme data-angle
    const angle = btn.dataset.angle || '0';
    ring.style.setProperty('--arc-angle', `${angle}deg`);
  });

  // estado inicial
  const open = acc.querySelector('.acc-item.is-open');
  if (open) open.click();
})();


(() => {
  const wrap = document.querySelector('.services__wrap');
  if (!wrap) return;

  const tip = wrap.querySelector('.svc-tip');
  const tipBox = tip?.querySelector('.svc-tip__inner');
  if (!tip || !tipBox) return;

  let currentBtn = null;

  function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

  function setTipContent(btn){
    const title = (btn.textContent || '').trim();
    const desc  = btn.dataset.desc || '';
    tipBox.innerHTML = `
      <div class="svc-tip__title">${title}</div>
      <div class="svc-tip__text">${desc}</div>
    `;
  }

  function positionTip(btn){
    // mede depois que o conteúdo foi inserido
    const rootR = wrap.getBoundingClientRect();
    const btnR  = btn.getBoundingClientRect();

    // mede largura real do tooltip
    tip.style.left = '-9999px';
    tip.style.top  = '-9999px';
    tip.classList.add('is-on'); // garantir que ele tenha dimensão pra medir
    const tipR = tip.getBoundingClientRect();
    const tipW = tipR.width;
    const tipH = tipR.height;

    // horizontal: centraliza no botão mas mantém dentro do wrap
    const centerX = btnR.left + btnR.width/2;
    let left = centerX - tipW/2 - rootR.left;
    left = clamp(left, 8, wrap.clientWidth - tipW - 8);

    // vertical: tenta acima; se não couber, vai abaixo
    const spaceAbove = btnR.top - rootR.top;                 // espaço dentro do container
    const spaceBelow = wrap.clientHeight - (btnR.bottom - rootR.top);
    const gap = 14;                                         // respiro
    let top, placeBelow = false;

    if (spaceAbove >= tipH + gap){
      top = btnR.top - rootR.top - tipH - gap;
      placeBelow = false;
    } else {
      top = btnR.bottom - rootR.top + gap;
      placeBelow = true;
    }

    tip.style.left = `${left}px`;
    tip.style.top  = `${top}px`;
    tip.classList.toggle('is-below', placeBelow);

    // opcional: alinhar a setinha com o centro do botão (se você tiver .svc-tip__arrow)
    const arrow = tip.querySelector('.svc-tip__arrow');
    if (arrow){
      const arrowCenter = clamp(centerX - rootR.left - left, 10, tipW - 10);
      arrow.style.left = `${arrowCenter - 6}px`; // -6 = metade da largura do diamond (12px)
    }
  }

  function clearActiveItems(){
    wrap.querySelectorAll('.svc-item.is-active').forEach(item => {
      item.classList.remove('is-active');
    });
  }

  function showTip(btn){
    clearActiveItems();
    btn.classList.add('is-active');
    currentBtn = btn;
    setTipContent(btn);
    positionTip(btn);
    tip.classList.add('is-on');
  }

  function hideTip(){
    clearActiveItems();
    currentBtn = null;
    tip.classList.remove('is-on', 'is-below');
  }

  // ---- Eventos de interação
  wrap.addEventListener('mouseover', e => {
    const btn = e.target.closest('.svc-item');
    if (!btn) return;
    showTip(btn);
  });

  wrap.addEventListener('mouseout', e => {
    const btn = e.target.closest('.svc-item');
    if (!btn) return;
    // se o mouse sair do item e não entrar no tooltip, fecha
    if (!tip.contains(e.relatedTarget)) hideTip();
  });

  // Mantém aberto se passar o mouse por cima do tooltip
  tip.addEventListener('mouseleave', () => hideTip());

  // Clique/Toque: abre o texto do item clicado sem atraso no mobile.
  // Se o usuário arrastar para o lado, não abre tooltip.
  let touchStartX = 0;
  let touchStartY = 0;

  wrap.addEventListener('touchstart', e => {
    const touch = e.touches && e.touches[0];
    if (!touch) return;
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });

  wrap.addEventListener('touchend', e => {
    const btn = e.target.closest('.svc-item');
    if (!btn) return;

    const touch = e.changedTouches && e.changedTouches[0];
    if (!touch) return;

    const movedX = Math.abs(touch.clientX - touchStartX);
    const movedY = Math.abs(touch.clientY - touchStartY);

    // Permite arrastar a faixa horizontal sem abrir o texto por acidente.
    if (movedX > 10 || movedY > 10) return;

    e.preventDefault();
    e.stopPropagation();

    if (currentBtn === btn && tip.classList.contains('is-on')) hideTip();
    else showTip(btn);
  }, { passive: false });

  wrap.addEventListener('click', e => {
    const btn = e.target.closest('.svc-item');
    if (!btn) return;
    e.stopPropagation();
    if (currentBtn === btn && tip.classList.contains('is-on')) hideTip();
    else showTip(btn);
  });

  tip.addEventListener('click', e => {
    e.stopPropagation();
  });

  document.addEventListener('click', e => {
    if (!tip.classList.contains('is-on')) return;
    if (e.target.closest('.svc-item')) return;
    if (tip.contains(e.target)) return;
    hideTip();
  });

  // Acessibilidade: foco via teclado
  wrap.addEventListener('focusin', e => {
    const btn = e.target.closest('.svc-item');
    if (btn) showTip(btn);
  });
  wrap.addEventListener('focusout', e => {
    const goingTo = e.relatedTarget;
    if (!wrap.contains(goingTo)) hideTip();
  });

  // Fecha em ESC
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') hideTip();
  });

  // Fecha em scroll/resize (ou reposiciona se quiser manter)
  window.addEventListener('scroll', () => hideTip(), { passive:true });
  window.addEventListener('resize', () => {
    if (currentBtn) positionTip(currentBtn);
  });
})();






(() => {
  const title = document.getElementById('deliverTitle'); // o único que vai mexer
  if (!title) return;

  const stage = title.parentElement; // deve ser o .deliver__stage
  const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));

  // limites (em px)
  let BASE = 0;   // início (direita, parte escondida)
  let MINX = 0;   // fim (esquerda, negativo)
  let RANGE = 0;  // distância total: BASE -> MINX

  // estado do movimento
  let lastY = window.scrollY;
  let acc   = 0;               // 0 => no BASE; RANGE => no MINX
  const FOLLOW = 0.54;         // sensibilidade (0.12 a 0.35)

  function computeBounds(){
    const w = (stage?.clientWidth || window.innerWidth);

    // ajuste fino: comece bem fora à direita e termine bem à esquerda
    BASE  =  w * 0.45;   // direita (positivo)
    MINX  = -w * 0.120;   // esquerda (negativo)
    RANGE = BASE - MINX;

    // mantém o acumulador dentro dos novos limites
    acc = clamp(acc, 0, RANGE);

    // posiciona imediatamente no ponto atual (sem “pulo”)
    const x = BASE - acc;
    title.style.transform = `translate3d(${x}px,0,0)`;
  }

  function tick(){
    const y = window.scrollY;
    const delta = y - lastY; // >0 descendo, <0 subindo
    lastY = y;

    // só acumula quando o título está visível na viewport
    const r = title.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const visible = r.bottom > 0 && r.top < vh;
    if (!visible) return;

    // acumula e limita
    acc = clamp(acc + delta * FOLLOW, 0, RANGE);

    // mapeia 0..RANGE => BASE..MINX (direita -> esquerda)
    const x = BASE - acc;
    title.style.transform = `translate3d(${x}px,0,0)`;
  }

  // inicializa
  computeBounds();
  // garante início fora à direita
  title.style.transform = `translate3d(${BASE}px,0,0)`;

  // listeners
  window.addEventListener('scroll', tick, { passive:true });
  window.addEventListener('resize', computeBounds);
})();





// === máscara do WhatsApp (apaga normalmente e formata só os números existentes) ===
const phoneInput = document.getElementById("q-whats");
if (phoneInput) {
  phoneInput.addEventListener("input", (e) => {
    let digits = e.target.value.replace(/\D/g, "").slice(0, 11);

    if (!digits) {
      e.target.value = "";
      return;
    }

    if (digits.length <= 2) {
      e.target.value = digits;
      return;
    }

    if (digits.length <= 7) {
      e.target.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      return;
    }

    e.target.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  });
}

// === opção "Outro" do formulário ===
const otherCheck = document.getElementById("q-other-check");
const otherWrap = document.getElementById("q-other-wrap");
const otherText = document.getElementById("q-other-text");

if (otherCheck && otherWrap && otherText) {
  otherCheck.addEventListener("change", () => {
    const active = otherCheck.checked;
    otherWrap.hidden = !active;
    otherText.required = active;

    if (active) {
      setTimeout(() => otherText.focus(), 80);
    } else {
      otherText.value = "";
    }
  });
}

const quoteForm = document.getElementById("quoteForm");
if (quoteForm) {
  quoteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name  = document.getElementById("q-name").value.trim();
    const email = document.getElementById("q-email").value.trim();
    const phoneFormatted = document.getElementById("q-whats").value.trim();
    const phoneDigits = phoneFormatted.replace(/\D/g, "");
    const checkedNeeds = Array.from(document.querySelectorAll('input[name="needs"]:checked'));
    const otherSelected = otherCheck?.checked;
    const otherValue = otherText?.value.trim() || "";

    const needsList = checkedNeeds.map(cb => {
      if (cb.value === "Outro" && otherValue) return `Outro: ${otherValue}`;
      return cb.value;
    });

    const needs = needsList.join(", ");

    if (!name || !email || !needs) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (phoneFormatted && phoneDigits.length !== 11) {
      alert("Informe um WhatsApp válido no formato (71) 9 8888-8888 ou deixe o campo vazio.");
      return;
    }

    if (otherSelected && !otherValue) {
      alert("Descreva o assunto em 'Outro' para enviar a mensagem completa.");
      otherText?.focus();
      return;
    }

    const dataCadastro = new Date().toLocaleString("pt-BR", { hour12: false });

    // URL do Web App do Apps Script
    const urlScript = "https://script.google.com/macros/s/AKfycbw3VZJhrkBE8-u1CWC8Xj2FYKij17KNiZ0nFNGa-Q1NWah4XQtur6MWR6cMI9zg7GU/exec";

    // Envia os dados preenchidos para a planilha
    const payload = new URLSearchParams({
      Sheet: 'teste2',
      Nome: name,
      Telefone: phoneFormatted,
      Email: email,
      Servico: needs,
      Outro: otherValue,
      Data: dataCadastro
    });

    fetch(urlScript, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload
    });

    // WhatsApp com todos os dados preenchidos no formulário
    const msg =
      `Olá, Andrei! Vim pelo seu portfólio e gostaria de conversar.\n\n` +
      `*Dados do contato*\n` +
      `Nome: ${name}\n` +
      `E-mail: ${email}\n` +
      `WhatsApp: ${phoneFormatted}\n\n` +
      `*Assunto*\n${needs}\n\n` +
      `Pode me retornar quando possível?`;

    const url = `https://wa.me/5571982564207?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  });
}



(function () {
  // --- CSS anti-overlay (iOS/Safari) para tablet/celular ---
  (function injectNoControlsCSS(){
    const id = 'no-controls-mobile-css';
    if (document.getElementById(id)) return;
    const css = `
      @media (max-width:1024px){
        video::-webkit-media-controls-start-playback-button{ display:none !important; }
        video::-webkit-media-controls-overlay-play-button{ display:none !important; }
        video::-webkit-media-controls { display:none !important; }
      }
    `;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
  })();

  const videos = Array.from(document.querySelectorAll('video'));
  if (!videos.length) return;

  // Ajusta atributos essenciais para mobile autoplay e remove controles
  const prep = v => {
    v.removeAttribute('controls');
    v.muted = true;
    v.setAttribute('muted', '');
    v.autoplay = true;
    v.setAttribute('autoplay', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.setAttribute('preload', v.getAttribute('preload') || 'auto');
  };

  const tryPlay = v => {
    if (!v || (!v.paused && !v.ended)) return;
    const p = v.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => { /* alguns navegadores só liberam após gesto do usuário */ });
    }
  };

  videos.forEach(v => {
    prep(v);

    // Tentar tocar no melhor timing possível
    const kick = () => requestAnimationFrame(() => tryPlay(v));

    if (v.readyState >= 2) {
      kick();
    } else {
      v.addEventListener('loadedmetadata', kick, { once: true });
      v.addEventListener('loadeddata',     kick, { once: true });
      v.addEventListener('canplay',        kick, { once: true });
      v.addEventListener('canplaythrough', kick, { once: true });
    }
  });

  // Pausa fora de vista e retoma quando volta (economia de bateria/dados)
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(({ isIntersecting, target }) => {
        if (isIntersecting) {
          tryPlay(target);
        } else if (!target.paused && !target.ended) {
          target.pause();
        }
      });
    }, { threshold: 0.25 });
    videos.forEach(v => io.observe(v));
  }

  // Fallback: primeiro toque/click tenta liberar autoplay nos que falharam
  const unlock = () => {
    videos.forEach(tryPlay);
    window.removeEventListener('touchstart', unlock);
    window.removeEventListener('click', unlock);
  };
  window.addEventListener('touchstart', unlock, { passive: true });
  window.addEventListener('click', unlock);

  // Se voltar para a aba/app, tenta tocar novamente
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) videos.forEach(tryPlay);
  });

  // Micro delay ajuda em alguns iPhones antigos
  setTimeout(() => videos.forEach(tryPlay), 120);
})();


// ===== IMAGEM DO LABORATÓRIO PYTHON =====
(() => {
  const preview = document.querySelector("[data-python-preview]");
  if (!preview) return;

  function useFallback() {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#090b10"/>
            <stop offset="1" stop-color="#111a2d"/>
          </linearGradient>
          <radialGradient id="glow" cx="78%" cy="18%" r="70%">
            <stop offset="0" stop-color="#0066ff" stop-opacity=".55"/>
            <stop offset="1" stop-color="#0066ff" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="1280" height="720" fill="url(#bg)"/>
        <rect width="1280" height="720" fill="url(#glow)"/>
        <g transform="translate(605 125)">
          <rect width="545" height="390" rx="28" fill="#080a0f" stroke="#394150" stroke-width="2"/>
          <rect width="545" height="58" rx="28" fill="#151923"/>
          <rect y="30" width="545" height="28" fill="#151923"/>
          <circle cx="31" cy="29" r="7" fill="#ff5f57"/>
          <circle cx="54" cy="29" r="7" fill="#febc2e"/>
          <circle cx="77" cy="29" r="7" fill="#28c840"/>
          <text x="108" y="35" fill="#8b949e" font-family="Consolas, monospace" font-size="16">python_portfolio</text>
          <text x="38" y="122" fill="#60a5fa" font-family="Consolas, monospace" font-size="25">class</text>
          <text x="115" y="122" fill="#facc15" font-family="Consolas, monospace" font-size="25">ProjetoPython</text>
          <text x="292" y="122" fill="#d8dee9" font-family="Consolas, monospace" font-size="25">:</text>
          <text x="66" y="172" fill="#60a5fa" font-family="Consolas, monospace" font-size="25">def</text>
          <text x="122" y="172" fill="#4ade80" font-family="Consolas, monospace" font-size="25">executar</text>
          <text x="232" y="172" fill="#d8dee9" font-family="Consolas, monospace" font-size="25">(self):</text>
          <text x="96" y="224" fill="#d8dee9" font-family="Consolas, monospace" font-size="25">lógica =</text>
          <text x="225" y="224" fill="#fb923c" font-family="Consolas, monospace" font-size="25">"prática"</text>
          <text x="96" y="276" fill="#d8dee9" font-family="Consolas, monospace" font-size="25">evolução =</text>
          <text x="278" y="276" fill="#60a5fa" font-family="Consolas, monospace" font-size="25">True</text>
          <text x="38" y="345" fill="#7d8590" font-family="Consolas, monospace" font-size="20">&gt; Projeto executado com sucesso.</text>
        </g>
        <text x="70" y="270" fill="#ffffff" font-family="Arial, sans-serif" font-size="58" font-weight="700">Laboratório</text>
        <text x="70" y="337" fill="#0066ff" font-family="Arial, sans-serif" font-size="58" font-weight="700">Python</text>
        <text x="74" y="392" fill="#bfbfc7" font-family="Arial, sans-serif" font-size="23">Lógica, automação, POO e sistemas</text>
      </svg>`;

    preview.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    preview.removeAttribute("data-python-preview");
  }

  preview.addEventListener("error", useFallback, { once: true });

  if (preview.complete && preview.naturalWidth === 0) {
    useFallback();
  }
})();


// ===== CARROSSÉIS DE PROJETOS =====
(() => {
  const carrosseis = document.querySelectorAll(".cases__carousel");

  if (!carrosseis.length) return;

  carrosseis.forEach(carrossel => {
    const track = carrossel.querySelector(".cases__track");
    const botaoAnterior = carrossel.querySelector(".cases__arrow--prev");
    const botaoProximo = carrossel.querySelector(".cases__arrow--next");

    if (!track) return;

    function calcularDistancia() {
      const card = track.querySelector(".case-card");

      if (!card) {
        return track.clientWidth;
      }

      const estilosTrack = window.getComputedStyle(track);

      const gap =
        parseFloat(estilosTrack.columnGap) ||
        parseFloat(estilosTrack.gap) ||
        0;

      return card.getBoundingClientRect().width + gap;
    }

    function atualizarBotoes() {
      const limiteMaximo = track.scrollWidth - track.clientWidth;
      const posicaoAtual = track.scrollLeft;

      if (botaoAnterior) {
        botaoAnterior.disabled = posicaoAtual <= 5;
      }

      if (botaoProximo) {
        botaoProximo.disabled =
          posicaoAtual >= limiteMaximo - 5;
      }
    }

    botaoAnterior?.addEventListener("click", () => {
      track.scrollBy({
        left: -calcularDistancia(),
        behavior: "smooth"
      });
    });

    botaoProximo?.addEventListener("click", () => {
      track.scrollBy({
        left: calcularDistancia(),
        behavior: "smooth"
      });
    });

    track.addEventListener(
      "scroll",
      () => {
        window.requestAnimationFrame(atualizarBotoes);
      },
      { passive: true }
    );

    track.addEventListener("keydown", event => {
      if (event.key === "ArrowRight") {
        event.preventDefault();

        track.scrollBy({
          left: calcularDistancia(),
          behavior: "smooth"
        });
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();

        track.scrollBy({
          left: -calcularDistancia(),
          behavior: "smooth"
        });
      }
    });

    window.addEventListener("resize", atualizarBotoes);

    atualizarBotoes();
  });
})();

// ===== FOOTER =====
(() => {
  const footerBack = document.querySelector(".hi-footer__back");
  footerBack?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();


