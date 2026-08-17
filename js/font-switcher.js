/* global BLOG_FONTS */
(function () {
  var catalog = (window.BLOG_FONTS && window.BLOG_FONTS.fonts) || [];
  var loaded = {};
  var root = document.documentElement;
  var FOLLOW = '__follow__';

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

  function publishedFont() {
    return root.getAttribute('data-post-font') || root.getAttribute('data-default-font') || 'ibm-plex';
  }

  function storedChoice() {
    try {
      return localStorage.getItem('blog-font');
    } catch (e) {
      return null;
    }
  }

  function currentChoice() {
    var stored = storedChoice();
    if (stored && stored !== FOLLOW) return stored;
    return publishedFont();
  }

  function applyFont(id, persist) {
    var font = findFont(id) || findFont('ibm-plex') || catalog[0];
    if (!font) return;
    loadCss(font);
    root.setAttribute('data-font', font.id);
    root.style.setProperty('--claude-font-body', font.family);
    root.style.setProperty('--claude-font-display', font.family);
    if (persist === true) {
      try { localStorage.setItem('blog-font', font.id); } catch (e) {}
    } else if (persist === FOLLOW) {
      try { localStorage.removeItem('blog-font'); } catch (e) {}
    }
    var sel = document.getElementById('blog-font-select');
    if (sel) {
      var want = persist === FOLLOW ? FOLLOW : font.id;
      if (sel.value !== want) sel.value = want;
    }
    var sample = document.getElementById('blog-font-sample');
    if (sample) {
      sample.style.fontFamily = font.family;
      sample.textContent = font.sample || ((font.zh || font.name) + ' 预览');
    }
  }

  function renderSwitcher() {
    var host = document.getElementById('blog-font-switcher');
    if (!host || !catalog.length) return;
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
    var html = '<label class="blog-font-label" for="blog-font-select">阅读字体</label>';
    html += '<select id="blog-font-select" aria-label="选择阅读字体">';
    html += '<option value="' + FOLLOW + '">跟随文章 / 站点默认</option>';
    groups.forEach(function (g) {
      html += '<optgroup label="' + g + '">';
      map[g].forEach(function (f) {
        html += '<option value="' + f.id + '">' + (f.zh || f.name) + '</option>';
      });
      html += '</optgroup>';
    });
    html += '</select>';
    html += '<div class="blog-font-sample" id="blog-font-sample"></div>';
    host.innerHTML = html;
    var sel = document.getElementById('blog-font-select');
    var stored = storedChoice();
    sel.value = stored && stored !== FOLLOW ? stored : FOLLOW;
    sel.addEventListener('change', function () {
      if (sel.value === FOLLOW) {
        applyFont(publishedFont(), FOLLOW);
      } else {
        applyFont(sel.value, true);
      }
    });
    applyFont(currentChoice(), false);
  }

  applyFont(currentChoice(), false);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSwitcher);
  } else {
    renderSwitcher();
  }
})();
