/* global NexT */
(function () {
  var root = document.documentElement;

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
