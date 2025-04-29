// 自定义搜索功能 - 增强现有搜索并添加右上角搜索按钮
document.addEventListener('DOMContentLoaded', function() {
  // 等待页面完全加载
  setTimeout(function() {
    // 创建新的搜索按钮在页面右上角
    var topSearchButton = document.createElement('div');
    topSearchButton.className = 'top-search-button';
    topSearchButton.innerHTML = '<i class="fa fa-search"></i>';
    document.body.appendChild(topSearchButton);
    
    // 添加自定义样式
    var style = document.createElement('style');
    style.textContent = `
      /* 顶部搜索按钮样式 */
      .top-search-button {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        z-index: 999;
        transition: all 0.3s ease;
      }
      
      .top-search-button:hover {
        background: #fff;
        transform: scale(1.1);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
      }
      
      .top-search-button i {
        font-size: 18px;
        color: #555;
      }
      
      /* 改进搜索弹出窗口样式 */
      .search-pop-overlay {
        background-color: rgba(0, 0, 0, 0.5) !important;
        opacity: 0;
        transition: opacity 0.3s ease !important;
      }
      
      .search-pop-overlay.search-active {
        opacity: 1 !important;
      }
      
      .search-popup {
        width: 80% !important;
        height: 80% !important;
        left: 10% !important;
        top: 10% !important;
        max-width: 1000px !important;
        background: white !important;
        border-radius: 8px !important;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.4) !important;
        transform: scale(0.9) !important;
        opacity: 0 !important;
        transition: transform 0.3s ease, opacity 0.3s ease !important;
      }
      
      .search-active .search-popup {
        transform: scale(1) !important;
        opacity: 1 !important;
      }
      
      .search-header {
        padding: 15px !important;
        background: #f8f8f8 !important;
        border-bottom: 1px solid #e8e8e8 !important;
      }
      
      input.search-input {
        padding: 10px 15px !important;
        font-size: 16px !important;
        border: 1px solid #ddd !important;
        border-radius: 4px !important;
        width: 100% !important;
      }
      
      #search-result {
        height: calc(100% - 60px) !important;
        padding: 20px !important;
        overflow-y: auto !important;
      }
      
      .search-result-list {
        max-width: 900px !important;
        margin: 0 auto !important;
      }
      
      li.search-result-item {
        margin-bottom: 25px !important;
        padding-bottom: 20px !important;
        border-bottom: 1px dashed #e8e8e8 !important;
      }
      
      a.search-result-title {
        font-size: 20px !important;
        font-weight: bold !important;
        color: #4183c4 !important;
        margin-bottom: 10px !important;
        display: block !important;
      }
      
      p.search-result {
        font-size: 16px !important;
        line-height: 1.6 !important;
        color: #555 !important;
      }
      
      .search-keyword {
        color: #e83e8c !important;
        font-weight: bold !important;
        background: rgba(232, 62, 140, 0.1) !important;
      }
    `;
    document.head.appendChild(style);
    
    // 获取原来的搜索按钮和关闭按钮
    var originalSearchButton = document.querySelector('.popup-trigger');
    
    // 添加搜索状态标记
    var searchIsOpen = false;
    
    // 给新的搜索按钮添加点击事件
    topSearchButton.addEventListener('click', function() {
      if (!searchIsOpen) {
        // 打开搜索
        if (originalSearchButton) {
          originalSearchButton.click();
          searchIsOpen = true;
        }
      } else {
        // 关闭搜索
        var closeButton = document.querySelector('.popup-btn-close');
        if (closeButton) {
          closeButton.click();
          searchIsOpen = false;
        }
      }
    });
    
    // 监听关闭按钮事件以更新状态
    document.addEventListener('click', function(event) {
      if (event.target.matches('.popup-btn-close') || 
          (event.target.matches('.search-pop-overlay') && !event.target.matches('.search-popup'))) {
        searchIsOpen = false;
      }
    }, true);
  }, 500); // 等待页面完全加载
});
