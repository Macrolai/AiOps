(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.getElementById('siteHeader');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobileNav');

  const setHeaderState = () => {
    header.classList.toggle('scrolled', window.scrollY > 18);
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  const closeMenu = () => {
    if (!menuToggle || !mobileNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', '打开导航菜单');
    mobileNav.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? '打开导航菜单' : '关闭导航菜单');
    mobileNav.classList.toggle('open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });

  mobileNav?.querySelectorAll('a, button').forEach((item) => {
    item.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1020) closeMenu();
  });

  document.addEventListener('click', (event) => {
    if (!mobileNav?.classList.contains('open')) return;
    if (!mobileNav.contains(event.target) && !menuToggle?.contains(event.target)) closeMenu();
  });

  // Reveal content as it enters the viewport.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px' });

    revealItems.forEach((item, index) => {
      if (item.closest('.bento-grid')) {
        item.style.transitionDelay = `${(index % 3) * 70}ms`;
      }
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Animate key dashboard numbers after first paint.
  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (element) => {
    const target = Number(element.dataset.count || 0);
    const decimals = Number(element.dataset.decimals || 0);
    const duration = reducedMotion ? 0 : 1350;
    const start = performance.now();

    const update = (now) => {
      const progress = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      element.textContent = decimals
        ? value.toFixed(decimals)
        : Math.round(value).toLocaleString('en-US');
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  setTimeout(() => counters.forEach(animateCounter), reducedMotion ? 0 : 450);

  // CMDB feature tabs.
  const tabs = [...document.querySelectorAll('.feature-tab')];
  const panels = [...document.querySelectorAll('.tab-panel')];
  const visuals = [...document.querySelectorAll('.demo-topology-view')];

  const activateTab = (name) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.tab === name;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    panels.forEach((panel) => {
      const active = panel.dataset.panel === name;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });

    visuals.forEach((visual) => {
      visual.classList.toggle('active', visual.dataset.visual === name);
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      tabs[nextIndex].focus();
      activateTab(tabs[nextIndex].dataset.tab);
    });
  });

  // Inspection simulation.
  const runInspection = document.getElementById('runInspection');
  const inspectProgress = document.getElementById('inspectProgress');
  const inspectPercent = document.getElementById('inspectPercent');
  const inspectStatus = document.getElementById('inspectStatus');
  let inspectionTimer = null;

  const startInspection = () => {
    if (inspectionTimer) return;
    let progress = 0;
    runInspection?.classList.add('running');
    if (runInspection) runInspection.querySelector('span').textContent = '巡检中';
    if (inspectStatus) inspectStatus.textContent = '正在扫描主机、K8s 与中间件…';
    if (inspectProgress) inspectProgress.style.width = '0%';
    if (inspectPercent) inspectPercent.textContent = '0%';

    inspectionTimer = window.setInterval(() => {
      progress = Math.min(progress + Math.random() * 11 + 4, 100);
      const rounded = Math.round(progress);
      if (inspectProgress) inspectProgress.style.width = `${rounded}%`;
      if (inspectPercent) inspectPercent.textContent = `${rounded}%`;

      if (progress >= 100) {
        window.clearInterval(inspectionTimer);
        inspectionTimer = null;
        window.setTimeout(() => {
          runInspection?.classList.remove('running');
          if (runInspection) runInspection.querySelector('span').textContent = '立即巡检';
          if (inspectStatus) inspectStatus.textContent = '巡检完成 · 刚刚';
          if (inspectProgress) inspectProgress.style.width = '100%';
          if (inspectPercent) inspectPercent.textContent = '100%';
        }, 350);
      }
    }, reducedMotion ? 25 : 190);
  };

  runInspection?.addEventListener('click', startInspection);

  // Auto remediation sequence.
  const consoleEl = document.getElementById('remediationConsole');
  const playButton = document.getElementById('playRemediation');
  const steps = [...document.querySelectorAll('.flow-step')];
  const flowProgress = document.getElementById('flowProgress');
  let remediationTimers = [];
  let hasAutoPlayed = false;

  const stopRemediationTimers = () => {
    remediationTimers.forEach((timer) => window.clearTimeout(timer));
    remediationTimers = [];
  };

  const setRemediationStep = (stepNumber) => {
    steps.forEach((step, index) => {
      const number = index + 1;
      step.classList.toggle('active', number === stepNumber);
      step.classList.toggle('completed', number < stepNumber);
    });
    if (flowProgress) {
      const progressMap = { 1: '0%', 2: '29%', 3: '58%', 4: '87%', 5: '100%' };
      flowProgress.style.height = progressMap[stepNumber] || '0%';
    }
    if (stepNumber === 5) {
      consoleEl?.classList.add('solved');
      if (playButton) playButton.querySelector('svg + span, span')?.replaceChildren(document.createTextNode('重新播放'));
      if (playButton) {
        const textNode = [...playButton.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
        if (textNode) textNode.textContent = ' 重新播放';
      }
    }
  };

  const playRemediation = () => {
    if (!consoleEl) return;
    stopRemediationTimers();
    consoleEl.classList.remove('solved');
    setRemediationStep(0);
    if (playButton) {
      const textNode = [...playButton.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      if (textNode) textNode.textContent = ' 播放处置流程';
    }

    const sequence = reducedMotion ? [0, 80, 160, 240, 320] : [0, 900, 1850, 2800, 3750];
    sequence.forEach((delay, index) => {
      remediationTimers.push(window.setTimeout(() => setRemediationStep(index + 1), delay));
    });
  };

  playButton?.addEventListener('click', playRemediation);

  if ('IntersectionObserver' in window && !reducedMotion) {
    const remediationObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || hasAutoPlayed) return;
        hasAutoPlayed = true;
        window.setTimeout(playRemediation, 500);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.45 });
    if (consoleEl) remediationObserver.observe(consoleEl);
  }

  // Demo request dialog.
  const dialog = document.getElementById('demoDialog');
  const demoForm = document.getElementById('demoForm');
  const formSuccess = document.getElementById('formSuccess');

  const openDialog = () => {
    if (!dialog) return;
    closeMenu();
    if (demoForm?.hidden) {
      demoForm.hidden = false;
      demoForm.reset();
      if (formSuccess) formSuccess.hidden = true;
    }
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => dialog.querySelector('input')?.focus(), 120);
  };

  const closeDialog = () => {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.js-open-demo').forEach((button) => {
    button.addEventListener('click', openDialog);
  });

  dialog?.querySelectorAll('.dialog-close, .dialog-close-success').forEach((button) => {
    button.addEventListener('click', closeDialog);
  });

  dialog?.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
    if (!inside) closeDialog();
  });

  dialog?.addEventListener('close', () => {
    document.body.style.overflow = '';
  });

  demoForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!demoForm.reportValidity()) return;
    demoForm.hidden = true;
    if (formSuccess) formSuccess.hidden = false;
  });

  // Re-open the initial form if the dialog is opened after a successful submit.
  window.addEventListener('beforeunload', stopRemediationTimers);
})();
