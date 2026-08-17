/* global NexT */
(function () {
  var root = document.documentElement;
  var shyEmojis = ['🙈', '😳', '🥺', '😊', '🫣', '💕'];

  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('claude-theme', theme); } catch (e) {}
    var btn = document.getElementById('claude-theme-toggle');
    if (btn) {
      var icon = btn.querySelector('i');
      var label = btn.querySelector('span');
      if (icon) icon.className = theme === 'dark' ? 'fa fa-sun' : 'fa fa-moon';
      if (label) label.textContent = theme === 'dark' ? '浅色' : '深色';
    }
  }

  function setSidebarCollapsed(collapsed) {
    root.classList.toggle('sidebar-collapsed', collapsed);
    try { localStorage.setItem('claude-sidebar', collapsed ? 'collapsed' : 'open'); } catch (e) {}
  }

  function spawnShyFloat(x, y) {
    var el = document.createElement('div');
    el.className = 'claude-shy-float';
    el.textContent = shyEmojis[Math.floor(Math.random() * shyEmojis.length)] + ' 害羞~';
    var dx = (Math.random() * 80) - 20;
    var dy = -80 - Math.random() * 60;
    el.style.left = (x || window.innerWidth / 2) + 'px';
    el.style.top = (y || window.innerHeight / 2) + 'px';
    el.style.setProperty('--shy-dx', dx + 'px');
    el.style.setProperty('--shy-dy', dy + 'px');
    document.body.appendChild(el);
    window.setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1600);
  }

  function ensureLightbox() {
    var box = document.getElementById('claude-avatar-lightbox');
    if (box) return box;

    box = document.createElement('div');
    box.id = 'claude-avatar-lightbox';
    box.className = 'claude-lightbox';
    box.hidden = true;
    box.innerHTML =
      '<div class="claude-lightbox-backdrop" data-close="1"></div>' +
      '<figure class="claude-lightbox-dialog" role="dialog" aria-modal="true" aria-label="头像预览">' +
      '  <img class="claude-lightbox-image" alt="Avatar">' +
      '  <button type="button" class="claude-lightbox-close" data-close="1" aria-label="关闭">×</button>' +
      '</figure>';
    document.body.appendChild(box);

    box.addEventListener('click', function (e) {
      if (e.target && e.target.getAttribute('data-close') === '1') {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !box.hidden) closeLightbox();
    });

    return box;
  }

  function openLightbox(src, clientX, clientY) {
    if (!src) return;
    var box = ensureLightbox();
    var img = box.querySelector('.claude-lightbox-image');
    img.src = src;
    box.hidden = false;
    document.body.classList.add('claude-lightbox-open');
    spawnShyFloat(clientX, clientY);
  }

  function closeLightbox() {
    var box = document.getElementById('claude-avatar-lightbox');
    if (!box) return;
    box.hidden = true;
    document.body.classList.remove('claude-lightbox-open');
  }

  function bindAvatarLightbox() {
    var trigger = document.getElementById('claude-avatar-lightbox-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', function (e) {
      var img = trigger.querySelector('img');
      var src = (img && (img.getAttribute('data-lightbox-src') || img.src)) || '';
      openLightbox(src, e.clientX, e.clientY);
    });
  }

  function bind() {
    var toggle = document.getElementById('claude-sidebar-toggle');
    var reopen = document.getElementById('claude-sidebar-reopen');
    var themeBtn = document.getElementById('claude-theme-toggle');

    if (toggle) {
      toggle.addEventListener('click', function () {
        setSidebarCollapsed(true);
      });
    }
    if (reopen) {
      reopen.addEventListener('click', function () {
        setSidebarCollapsed(false);
      });
    }
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
      });
      setTheme(currentTheme());
    }

    bindAvatarLightbox();

    // Mobile: tap dimmer / reopen
    if (window.matchMedia('(max-width: 991px)').matches) {
      setSidebarCollapsed(true);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
