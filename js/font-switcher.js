/* global BLOG_FONTS */
(function () {
  var catalog = (window.BLOG_FONTS && window.BLOG_FONTS.fonts) || [];
  var loaded = {};
  var root = document.documentElement;

  function findFont(id) {
    for (var i = 0; i < catalog.length; i++) {
      if (catalog[i].id === id) return catalog[i];
    }
    return null;
  }

  function loadCss(font) {
    if (!font || !font.css) return;
    (font.css || []).forEach(function (href) {
      if (loaded[href]) return;
      loaded[href] = true;
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    });
  }

  function host() {
    return document.getElementById('blog-font-switcher');
  }

  function postKey() {
    var el = host();
    var path = (el && el.getAttribute('data-post-path')) || location.pathname;
    return 'blog-font:' + path;
  }

  function publishedFont() {
    return root.getAttribute('data-post-font') || root.getAttribute('data-default-font') || 'ibm-plex';
  }

  function storedChoice() {
    try {
      return localStorage.getItem(postKey());
    } catch (e) {
      return null;
    }
  }

  function currentChoice() {
    return storedChoice() || publishedFont();
  }

  function scope() {
    return document.querySelector('.content.reading') || document.querySelector('.post-block');
  }

  function applyFont(id, persist) {
    var font = findFont(id) || findFont('ibm-plex') || catalog[0];
    if (!font) return;
    loadCss(font);
    var target = scope();
    if (!target) return;
    target.setAttribute('data-font', font.id);
    target.style.setProperty('--claude-font-body', font.family);
    target.style.setProperty('--claude-font-display', font.family);
    target.style.fontFamily = font.family;
    if (persist) {
      try { localStorage.setItem(postKey(), font.id); } catch (e) {}
    }
    var sel = document.getElementById('blog-font-select');
    if (sel && sel.value !== font.id) sel.value = font.id;
  }

  function renderSwitcher() {
    var el = host();
    if (!el || !catalog.length) return;
    var groups = [];
    var map = {};
    catalog.forEach(function (f) {
      var g = f.group || '其他';
      if (!map[g]) {
        map[g] = [];
        groups.push(g);
      }
      map[g].push(f);
    });
    var html = '<label class="blog-font-label" for="blog-font-select">字体</label>';
    html += '<select id="blog-font-select" aria-label="本篇文章字体">';
    groups.forEach(function (g) {
      html += '<optgroup label="' + g + '">';
      map[g].forEach(function (f) {
        html += '<option value="' + f.id + '">' + (f.zh || f.name) + '</option>';
      });
      html += '</optgroup>';
    });
    html += '</select>';
    el.innerHTML = html;
    var sel = document.getElementById('blog-font-select');
    sel.value = currentChoice();
    sel.addEventListener('change', function () {
      applyFont(sel.value, true);
    });
    applyFont(currentChoice(), false);
  }

  if (!host()) return;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSwitcher);
  } else {
    renderSwitcher();
  }
})();
