
(function() {
  // Tạo style cho hiệu ứng rung và giao diện hotline
  const style = document.createElement('style');
  style.textContent = `
    .hotline-floating-btn {
      position: fixed;
      right: 24px;
      bottom: 24px;
      background: #e53935;
      color: #fff;
      padding: 14px 22px 14px 18px;
      border-radius: 32px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.18);
      font-weight: bold;
      font-size: 18px;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      animation: hotline-shake 1.2s infinite;
      transition: background 0.2s;
    }
    .hotline-floating-btn:hover {
      background: #b71c1c;
    }
    @keyframes hotline-shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
      20%, 40%, 60%, 80% { transform: translateX(3px); }
    }
    .hotline-phone-icon {
      width: 24px;
      height: 24px;
      display: inline-block;
    }
  `;
  document.head.appendChild(style);

  // Tạo phần tử hotline
  const hotlineDiv = document.createElement('div');
  hotlineDiv.className = 'hotline-floating-btn';
  hotlineDiv.innerHTML = `
    <span class="hotline-phone-icon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#fff" fill-opacity="0.12"/>
        <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1v3.5a1 1 0 01-1 1C7.61 22 2 16.39 2 9.5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" fill="#fff"/>
        <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1v3.5a1 1 0 01-1 1C7.61 22 2 16.39 2 9.5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" fill="#43e97b" fill-opacity="0.8"/>
      </svg>
    </span>
    <span>0867544809</span>
  `;
  hotlineDiv.onclick = function() {
    window.location.href = 'tel:0867544809';
  };
  document.body.appendChild(hotlineDiv);
})();