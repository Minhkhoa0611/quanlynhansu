(function() {
    // Lớp phủ trắng đục che toàn bộ trang
    var bgOverlay = document.createElement('div');
    bgOverlay.style.position = 'fixed';
    bgOverlay.style.top = '0';
    bgOverlay.style.left = '0';
    bgOverlay.style.width = '100vw';
    bgOverlay.style.height = '100vh';
    bgOverlay.style.background = '#fff';
    bgOverlay.style.opacity = '1';
    bgOverlay.style.zIndex = '9999';
    bgOverlay.style.transition = 'opacity 0.8s';

    document.body.appendChild(bgOverlay);

    // Tạo overlay intro
    var introOverlay = document.createElement('div');
    introOverlay.style.position = 'fixed';
    introOverlay.style.top = '0';
    introOverlay.style.left = '0';
    introOverlay.style.width = '100vw';
    introOverlay.style.height = '100vh';
    introOverlay.style.background = 'linear-gradient(135deg, #00c3ff 0%, #ffff1c 100%)';
    introOverlay.style.display = 'flex';
    introOverlay.style.flexDirection = 'column';
    introOverlay.style.justifyContent = 'center';
    introOverlay.style.alignItems = 'center';
    introOverlay.style.zIndex = '10000';
    introOverlay.style.transition = 'opacity 0.8s';
    introOverlay.style.opacity = '1';

    // Logo
    var introImg = document.createElement('img');
    introImg.src = 'https://www.xaydungmkhome.online/Logo.png';
    introImg.alt = 'Logo';
    introImg.style.width = '180px';
    introImg.style.height = 'auto';
    introImg.style.marginBottom = '18px';
    introImg.style.animation = 'intro-spin 2s cubic-bezier(.68,-0.55,.27,1.55)';

    // Text
    var introText = document.createElement('div');
    introText.textContent = 'Time Pro HRM';
    introText.style.fontSize = '2.5rem';
    introText.style.fontWeight = 'bold';
    introText.style.letterSpacing = '2px';
    introText.style.background = 'linear-gradient(90deg, #ff512f, #dd2476, #1fa2ff, #12d8fa, #a6ffcb)';
    introText.style.webkitBackgroundClip = 'text';
    introText.style.webkitTextFillColor = 'transparent';
    introText.style.backgroundClip = 'text';
    introText.style.textFillColor = 'transparent';
    introText.style.animation = 'intro-gradient 2s linear infinite';

    // Keyframes
    var style = document.createElement('style');
    style.innerHTML = `
    @keyframes intro-spin {
        0% { transform: rotate(-30deg) scale(0.7); opacity: 0; }
        60% { transform: rotate(10deg) scale(1.1); opacity: 1; }
        100% { transform: rotate(0deg) scale(1); opacity: 1; }
    }
    @keyframes intro-gradient {
        0% { filter: hue-rotate(0deg);}
        100% { filter: hue-rotate(360deg);}
    }
    `;
    document.head.appendChild(style);

    introOverlay.appendChild(introImg);
    introOverlay.appendChild(introText);
    document.body.appendChild(introOverlay);

    // Sau 5s, ẩn intro và lớp phủ trắng (không reload, không chuyển trang)
    setTimeout(function() {
        introOverlay.style.opacity = '0';
        bgOverlay.style.opacity = '0';
        setTimeout(function() {
            document.body.removeChild(introOverlay);
            document.body.removeChild(bgOverlay);
        }, 800);
    }, 5000);
})();

