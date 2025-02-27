/* global NexT, CONFIG */

// 添加博客展示图片
function addBlogShowImage() {
  const indexContent = document.querySelector('.content.index.posts-expand');

  if (indexContent) {
    const img = document.createElement('img');
    img.src = '/images/25.png';
    img.alt = 'Blog Show Image';
    img.style.cssText = `
      width: 100%;
      height: 300px;
      object-fit: cover;
      margin-bottom: 20px;
      border-radius: 8px;
      transition: transform 0.3s ease;
    `;

    // 添加hover效果
    img.addEventListener('mouseenter', () => {
      img.style.transform = 'scale(1.02)';
    });
    img.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
    });

    // 将图片插入到index content之前
    indexContent.parentNode.insertBefore(img, indexContent);
  }
}

var Affix = {
  init: function(element, options) {
    this.element = element;
    this.offset = options || 0;
    this.affixed = null;
    this.unpin = null;
    this.pinnedOffset = null;
    this.checkPosition();
    window.addEventListener('scroll', this.checkPosition.bind(this));
    window.addEventListener('click', this.checkPositionWithEventLoop.bind(this));
    window.matchMedia('(min-width: 992px)').addListener(event => {
      if (event.matches) {
        this.offset = NexT.utils.getAffixParam();
        this.checkPosition();
      }
    });
  },
  getState: function(scrollHeight, height, offsetTop, offsetBottom) {
    let scrollTop = window.scrollY;
    let targetHeight = window.innerHeight;
    if (offsetTop != null && this.affixed === 'top') {
      if (document.querySelector('.content-wrap').offsetHeight < offsetTop) return 'top';
      return scrollTop < offsetTop ? 'top' : false;
    }
    if (this.affixed === 'bottom') {
      if (offsetTop != null) return this.unpin <= this.element.getBoundingClientRect().top ? false : 'bottom';
      return scrollTop + targetHeight <= scrollHeight - offsetBottom ? false : 'bottom';
    }
    let initializing = this.affixed === null;
    let colliderTop = initializing ? scrollTop : this.element.getBoundingClientRect().top + scrollTop;
    let colliderHeight = initializing ? targetHeight : height;
    if (offsetTop != null && scrollTop <= offsetTop) return 'top';
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom';
    return false;
  },
  getPinnedOffset: function() {
    if (this.pinnedOffset) return this.pinnedOffset;
    this.element.classList.remove('affix-top', 'affix-bottom');
    this.element.classList.add('affix');
    return (this.pinnedOffset = this.element.getBoundingClientRect().top);
  },
  checkPositionWithEventLoop() {
    setTimeout(this.checkPosition.bind(this), 1);
  },
  checkPosition: function() {
    if (window.getComputedStyle(this.element).display === 'none') return;
    let height = this.element.offsetHeight;
    let { offset } = this;
    let offsetTop = offset.top;
    let offsetBottom = offset.bottom;
    let { scrollHeight } = document.body;
    let affix = this.getState(scrollHeight, height, offsetTop, offsetBottom);
    if (this.affixed !== affix) {
      if (this.unpin != null) this.element.style.top = '';
      let affixType = 'affix' + (affix ? '-' + affix : '');
      this.affixed = affix;
      this.unpin = affix === 'bottom' ? this.getPinnedOffset() : null;
      this.element.classList.remove('affix', 'affix-top', 'affix-bottom');
      this.element.classList.add(affixType);
    }
    if (affix === 'bottom') {
      this.element.style.top = scrollHeight - height - offsetBottom + 'px';
    }
  }
};

NexT.utils.getAffixParam = function() {
  const sidebarOffset = CONFIG.sidebar.offset || 12;

  let headerOffset = document.querySelector('.header-inner').offsetHeight;
  let footerOffset = document.querySelector('.footer').offsetHeight;

  document.querySelector('.sidebar').style.marginTop = headerOffset + sidebarOffset + 'px';

  return {
    top   : headerOffset,
    bottom: footerOffset
  };
};

document.addEventListener('DOMContentLoaded', () => {
  addBlogShowImage();
  Affix.init(document.querySelector('.sidebar-inner'), NexT.utils.getAffixParam());
});
