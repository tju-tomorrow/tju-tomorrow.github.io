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

// JavaScript 辅助函数
// 高级鼠标追踪特效
class AdvancedMouseTracker {
  constructor(selector) {
    this.elements = document.querySelectorAll(selector);
    this.init();
  }

  init() {
    this.elements.forEach(el => {
      el.addEventListener('mousemove', this.handleMouseMove.bind(this));
      el.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
      el.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    });
  }

  handleMouseMove(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();

    // 计算鼠标相对位置
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 计算元素中心点
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // 计算倾斜角度
    const rotateX = (y - centerY) / 20;
    const rotateY = -(x - centerX) / 20;

    // 计算光影位置
    const lightX = (x / rect.width * 100).toFixed(2);
    const lightY = (y / rect.height * 100).toFixed(2);

    // 应用高级效果
    requestAnimationFrame(() => {
      el.style.setProperty('--mouse-x', `${x}px`);
      el.style.setProperty('--mouse-y', `${y}px`);
      el.style.setProperty('--light-x', `${lightX}%`);
      el.style.setProperty('--light-y', `${lightY}%`);
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  }

  handleMouseEnter(e) {
    const el = e.currentTarget;
    el.classList.add('mouse-enter');
  }

  handleMouseLeave(e) {
    const el = e.currentTarget;
    el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    el.classList.remove('mouse-enter');
  }
}

// 对应的 CSS
const style = document.createElement('style');
style.textContent = `
.post-block .post-body.post-body-excerpt {
  position: relative;
  overflow: hidden;
  transition: all 0.8s ease;
  transform-style: preserve-3d;

  &::before, &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &::before {
    background: radial-gradient(
      circle at var(--light-x, 50%) var(--light-y, 50%),
      rgba(255,255,255,0.3),
      transparent 50%
    );
  }

  &::after {
    background: linear-gradient(
      135deg,
      rgba(0,255,255,0.2),
      rgba(255,0,255,0.2)
    );
    mix-blend-mode: color-dodge;
  }

  &.mouse-enter {
    &::before,
    &::after {
      opacity: 1;
    }
  }

  &:hover {
    transform: translateY(-5px) scale(1.03);
    box-shadow:
      0 10px 20px rgba(0,0,0,0.3),
      0 0 30px rgba(0,255,255,0.8);
  }
}`;

document.head.appendChild(style);

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  new AdvancedMouseTracker('.post-block .post-body.post-body-excerpt');
});
