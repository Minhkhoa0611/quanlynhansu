(function() {
    let idleTimeout = null;
    let isBlurred = false;

    // Tạo overlay nếu chưa có
    function ensureOverlay() {
        if (document.getElementById('idle-blur-overlay')) return;
        const overlay = document.createElement('div');
        overlay.id = 'idle-blur-overlay';
        overlay.style = `
            display:none;position:fixed;z-index:99999;left:0;top:0;width:100vw;height:100vh;
            background:transparent;
            pointer-events:auto;
            align-items:center;justify-content:center;flex-direction:column;
        `;
        overlay.innerHTML = `
            <div id="idle-blur-message" style="
                background:linear-gradient(120deg,#e3f0ff 60%,#f7f7f7 100%);
                border-radius:16px;
                box-shadow:0 8px 32px #1976d250,0 2px 8px #0001;
                padding:38px 44px 28px 44px;
                max-width:92vw;
                text-align:center;
                position:relative;
                z-index:100002;
                opacity:1;
                filter:none !important;
                border:3px solid #1976d2;
                font-family:'Segoe UI',Arial,sans-serif;
            ">
                <div style="font-size:2.1rem;margin-bottom:10px;color:#1976d2;">
                    <span style="font-size:2.5rem;vertical-align:middle;">⏸️</span>
                </div>
                <div style="font-size:1.35rem;font-weight:700;color:#1976d2;margin-bottom:10px;">
                    Ứng dụng đang tạm dừng do không phát hiện thao tác
                </div>
                <div style="color:#333;font-size:1.08rem;margin-bottom:18px;">
                    Vì lý do bảo mật và tiết kiệm tài nguyên, hệ thống đã tự động làm mờ giao diện.<br>
                    Vui lòng nhấn nút bên dưới để tiếp tục sử dụng phần mềm.
                </div>
                <button id="idle-blur-activate-btn" style="background:linear-gradient(90deg,#1976d2 60%,#43a047 100%);color:#fff;border:none;border-radius:8px;padding:13px 38px;font-size:1.18rem;font-weight:700;cursor:pointer;box-shadow:0 2px 8px #1976d220;transition:background 0.2s;">
                    Tiếp tục sử dụng
                </button>
                <div style="margin-top:18px;font-size:0.98rem;color:#888;">
                    <span style="font-size:1.15rem;">💡</span> Hệ thống sẽ tự động làm mờ nếu không có thao tác trong 10 giây.
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        document.getElementById('idle-blur-activate-btn').onclick = deactivateBlur;
    }

    function activateBlur() {
        if (isBlurred) return;
        isBlurred = true;
        ensureOverlay();
        document.getElementById('idle-blur-overlay').style.display = 'flex';
        // Làm mờ tất cả trừ overlay
        Array.from(document.body.children).forEach(el => {
            if (el.id !== 'idle-blur-overlay') {
                el.style.filter = 'blur(3px)';
                el.style.pointerEvents = 'none';
            }
        });
        // Đảm bảo overlay và message không bị mờ
        document.getElementById('idle-blur-overlay').style.pointerEvents = 'auto';
        document.getElementById('idle-blur-message').style.filter = 'none';
    }

    function deactivateBlur() {
        if (!isBlurred) return;
        isBlurred = false;
        document.getElementById('idle-blur-overlay').style.display = 'none';
        Array.from(document.body.children).forEach(el => {
            el.style.filter = '';
            el.style.pointerEvents = '';
        });
        resetIdleTimer();
    }

    function resetIdleTimer() {
        clearTimeout(idleTimeout);
        idleTimeout = setTimeout(activateBlur, 10000);
    }

    // Khi đã bị blur, chỉ cho phép bấm nút mới kích hoạt lại, các sự kiện khác bị bỏ qua
    function activityListener() {
        if (!isBlurred) resetIdleTimer();
        // Nếu đang blur thì không làm gì
    }
    ['mousemove','keydown','mousedown','touchstart','scroll'].forEach(evt => {
        window.addEventListener(evt, activityListener, true);
    });

    // Khởi tạo overlay và timer khi DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            ensureOverlay();
            resetIdleTimer();
        });
    } else {
        ensureOverlay();
        resetIdleTimer();
    }
})();
