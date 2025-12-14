(function () {
    // Định nghĩa các mốc thời gian
    const tetDates = {
        2024: "2024-02-10",
        2025: "2025-01-29",
        2026: "2026-02-17",
        2027: "2027-02-06",
        2028: "2028-01-26"
    };
    function getTetDate(year) {
        const d = tetDates[year] || tetDates[year + 1];
        if (!d) return new Date(year + 1, 1, 1, 0, 0, 0);
        const [y, m, day] = d.split('-').map(Number);
        return new Date(y, m - 1, day, 0, 0, 0);
    }
    function getNoelDate(year) {
        return new Date(year, 11, 25, 0, 0, 0);
    }
    function getTetTayDate(year) {
        return new Date(year + 1, 0, 1, 0, 0, 0);
    }
    function getNextTarget(now, getDateFunc) {
        let year = now.getFullYear();
        let target = getDateFunc(year);
        if (now >= target) target = getDateFunc(year + 1);
        return target;
    }
    function formatTime(ms) {
        if (ms < 0) ms = 0;
        let totalSeconds = Math.floor(ms / 1000);
        let days = Math.floor(totalSeconds / 86400);
        let hours = Math.floor((totalSeconds % 86400) / 3600);
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let seconds = totalSeconds % 60;
        return `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
    }

    // Hiệu ứng: Tuyết rơi cho Noel
    function showSnowEffect(parent) {
        let snowWrap = document.createElement('div');
        snowWrap.style.position = 'absolute';
        snowWrap.style.left = 0;
        snowWrap.style.top = 0;
        snowWrap.style.width = '100%';
        snowWrap.style.height = '100%';
        snowWrap.style.pointerEvents = 'none';
        snowWrap.style.zIndex = 10;
        snowWrap.className = 'countdown-snow-effect';
        for (let i = 0; i < 24; ++i) {
            let snow = document.createElement('div');
            let size = Math.random() * 8 + 8;
            snow.style.position = 'absolute';
            snow.style.left = Math.random() * 100 + '%';
            snow.style.top = '-16px';
            snow.style.width = size + 'px';
            snow.style.height = size + 'px';
            snow.style.background = 'white';
            snow.style.borderRadius = '50%';
            snow.style.opacity = Math.random() * 0.5 + 0.5;
            snow.style.boxShadow = '0 0 8px #fff';
            snow.style.animation = `countdownSnowFall ${1.8 + Math.random() * 1.2}s linear ${Math.random()}s forwards`;
            snowWrap.appendChild(snow);
        }
        parent.style.position = 'relative';
        parent.appendChild(snowWrap);
        setTimeout(() => { snowWrap.remove(); }, 2200);
    }

    // Hiệu ứng: Pháo hoa cho Tết Tây
    function showFireworkEffect(parent) {
        let fwWrap = document.createElement('div');
        fwWrap.style.position = 'absolute';
        fwWrap.style.left = 0;
        fwWrap.style.top = 0;
        fwWrap.style.width = '100%';
        fwWrap.style.height = '100%';
        fwWrap.style.pointerEvents = 'none';
        fwWrap.style.zIndex = 10;
        fwWrap.className = 'countdown-firework-effect';
        for (let i = 0; i < 3; ++i) {
            let fw = document.createElement('div');
            fw.className = 'countdown-firework';
            fw.style.position = 'absolute';
            fw.style.left = (20 + i * 30) + '%';
            fw.style.top = '60%';
            fw.style.width = '0';
            fw.style.height = '0';
            fw.style.pointerEvents = 'none';
            fw.innerHTML = Array.from({length: 16}).map((_, idx) => {
                let color = ['#fff','#ff0','#f00','#0ff','#0f0','#f0f','#ff9800','#2196f3'][idx%8];
                let rot = idx * 22.5;
                return `<div style="
                    position:absolute;
                    width:8px;height:28px;
                    left:-4px;top:-14px;
                    background:${color};
                    border-radius:4px;
                    opacity:0.8;
                    transform:rotate(${rot}deg) scaleY(0);
                    animation:countdownFireworkBurst 0.8s ${0.1+idx*0.03}s forwards;
                "></div>`;
            }).join('');
            fwWrap.appendChild(fw);
        }
        parent.style.position = 'relative';
        parent.appendChild(fwWrap);
        setTimeout(() => { fwWrap.remove(); }, 1800);
    }

    // Hiệu ứng: Pháo giấy đỏ vàng cho Tết Nguyên Đán
    function showConfettiEffect(parent) {
        let confettiWrap = document.createElement('div');
        confettiWrap.style.position = 'absolute';
        confettiWrap.style.left = 0;
        confettiWrap.style.top = 0;
        confettiWrap.style.width = '100%';
        confettiWrap.style.height = '100%';
        confettiWrap.style.pointerEvents = 'none';
        confettiWrap.style.zIndex = 10;
        confettiWrap.className = 'countdown-confetti-effect';
        let colors = ['#ff1744', '#ffd600', '#ff9800', '#d50000', '#fff176'];
        for (let i = 0; i < 24; ++i) {
            let conf = document.createElement('div');
            let size = Math.random() * 8 + 8;
            conf.style.position = 'absolute';
            conf.style.left = Math.random() * 100 + '%';
            conf.style.top = '-16px';
            conf.style.width = size + 'px';
            conf.style.height = size * 1.8 + 'px';
            conf.style.background = colors[Math.floor(Math.random() * colors.length)];
            conf.style.borderRadius = '4px';
            conf.style.opacity = Math.random() * 0.5 + 0.5;
            conf.style.transform = `rotate(${Math.random()*360}deg)`;
            conf.style.animation = `countdownConfettiFall ${1.6 + Math.random() * 1.2}s linear ${Math.random()}s forwards`;
            confettiWrap.appendChild(conf);
        }
        parent.style.position = 'relative';
        parent.appendChild(confettiWrap);
        setTimeout(() => { confettiWrap.remove(); }, 2200);
    }

    // Hiệu ứng: Tuyết rơi cho Noel (toàn màn hình ~20s)
    function showSnowEffectFullScreen() {
        if (document.getElementById('countdown-snow-fullscreen')) return;
        let snowWrap = document.createElement('div');
        snowWrap.id = 'countdown-snow-fullscreen';
        snowWrap.style.position = 'fixed';
        snowWrap.style.left = 0;
        snowWrap.style.top = 0;
        snowWrap.style.width = '100vw';
        snowWrap.style.height = '100vh';
        snowWrap.style.pointerEvents = 'none';
        snowWrap.style.zIndex = 9999;
        // Danh sách màu sắc nổi bật cho "tuyết"
        let colors = ['#fff', '#ffe066', '#90caf9', '#f48fb1', '#b39ddb', '#ffd54f', '#80cbc4', '#ffb74d', '#e1bee7', '#ff8a65'];
        for (let i = 0; i < 80; ++i) {
            let snow = document.createElement('div');
            let size = Math.random() * 12 + 8;
            snow.style.position = 'absolute';
            snow.style.left = Math.random() * 100 + 'vw';
            snow.style.top = Math.random() * -20 + 'vh';
            snow.style.width = size + 'px';
            snow.style.height = size + 'px';
            let color = colors[Math.floor(Math.random() * colors.length)];
            snow.style.background = color;
            snow.style.borderRadius = '50%';
            snow.style.opacity = Math.random() * 0.5 + 0.5;
            snow.style.boxShadow = `0 0 8px ${color}`;
            snow.style.animation = `countdownSnowFallFS ${20 + Math.random() * 6}s linear ${Math.random()*2}s forwards`;
            snowWrap.appendChild(snow);
        }
        document.body.appendChild(snowWrap);
        setTimeout(() => { snowWrap.remove(); }, 25000);
    }

    // Hiệu ứng: Pháo hoa toàn màn hình ~20s
    function showFireworkEffectFullScreen() {
        if (document.getElementById('countdown-firework-fullscreen')) return;
        let fwWrap = document.createElement('div');
        fwWrap.id = 'countdown-firework-fullscreen';
        fwWrap.style.position = 'fixed';
        fwWrap.style.left = 0;
        fwWrap.style.top = 0;
        fwWrap.style.width = '100vw';
        fwWrap.style.height = '100vh';
        fwWrap.style.pointerEvents = 'none';
        fwWrap.style.zIndex = 9999;
    let interval = setInterval(() => {
        // Nhiều điểm nổ, nhiều màu, hiệu ứng sáng và tỏa rộng hơn
        let colors = ['#fff', '#ff0', '#f00', '#0ff', '#0f0', '#f0f', '#ff9800', '#2196f3', '#ff3cac', '#42e695', '#ffe53b', '#fd6e6a', '#f9d423', '#e65c00', '#fc466b', '#3f5efb'];
            let fw = document.createElement('div');
            fw.className = 'countdown-firework';
            fw.style.position = 'absolute';
            fw.style.left = (10 + Math.random() * 80) + 'vw';
            fw.style.top = (30 + Math.random() * 40) + 'vh';
            fw.style.width = '0';
            fw.style.height = '0';
            fw.style.pointerEvents = 'none';
            fw.innerHTML = Array.from({length: 18}).map((_, idx) => {
                let color = ['#fff','#ff0','#f00','#0ff','#0f0','#f0f','#ff9800','#2196f3'][idx%8];
                let rot = idx * 20;
                return `<div style="
                    position:absolute;
                    width:10px;height:38px;
                    left:-5px;top:-19px;
                    background:${color};
                    border-radius:5px;
                    opacity:0.8;
                    transform:rotate(${rot}deg) scaleY(0);
                    animation:countdownFireworkBurstFS 1.2s ${0.1+idx*0.04}s forwards;
                "></div>`;
            }).join('');
            fwWrap.appendChild(fw);
            setTimeout(() => { fw.remove(); }, 1400);
        }, 600);
        document.body.appendChild(fwWrap);
        setTimeout(() => {
            clearInterval(interval);
            fwWrap.remove();
        }, 25000);
    }
        // Hiệu ứng rơi icon lá cờ các quốc gia cho Tết Dương Lịch
        function showFireworkEffectFullScreen() {
            if (document.getElementById('countdown-firework-fullscreen')) return;
            let flagWrap = document.createElement('div');
            flagWrap.id = 'countdown-firework-fullscreen';
            flagWrap.style.position = 'fixed';
            flagWrap.style.left = 0;
            flagWrap.style.top = 0;
            flagWrap.style.width = '100vw';
            flagWrap.style.height = '100vh';
            flagWrap.style.pointerEvents = 'none';
            flagWrap.style.zIndex = 9999;
            let flagUrls = [
                'https://flagcdn.com/w40/vn.png',
                'https://flagcdn.com/w40/us.png',
                'https://flagcdn.com/w40/fr.png',
                'https://flagcdn.com/w40/jp.png',
                'https://flagcdn.com/w40/cn.png',
                'https://flagcdn.com/w40/kr.png',
                'https://flagcdn.com/w40/gb.png',
                'https://flagcdn.com/w40/de.png',
                'https://flagcdn.com/w40/it.png',
                'https://flagcdn.com/w40/ru.png',
                'https://flagcdn.com/w40/au.png',
                'https://flagcdn.com/w40/ca.png',
                'https://flagcdn.com/w40/br.png',
                'https://flagcdn.com/w40/th.png',
                'https://flagcdn.com/w40/sg.png',
                'https://flagcdn.com/w40/my.png',
                'https://flagcdn.com/w40/id.png',
                'https://flagcdn.com/w40/es.png',
                'https://flagcdn.com/w40/nl.png',
                'https://flagcdn.com/w40/in.png',
                'https://flagcdn.com/w40/ph.png',
                'https://flagcdn.com/w40/se.png',
                'https://flagcdn.com/w40/no.png',
                'https://flagcdn.com/w40/fi.png',
                'https://flagcdn.com/w40/dk.png',
                'https://flagcdn.com/w40/ch.png',
                'https://flagcdn.com/w40/be.png',
                'https://flagcdn.com/w40/ar.png',
                'https://flagcdn.com/w40/mx.png',
                'https://flagcdn.com/w40/sa.png',
                'https://flagcdn.com/w40/tr.png'
            ];
            let interval = setInterval(() => {
                for (let i = 0; i < 7; ++i) { // thưa hơn
                    let flag = document.createElement('img');
                    flag.src = flagUrls[Math.floor(Math.random() * flagUrls.length)];
                    let w = Math.random() * 24 + 32;
                    let h = w * 0.6;
                    flag.style.width = w + 'px';
                    flag.style.height = h + 'px';
                    flag.style.position = 'absolute';
                    flag.style.left = Math.random() * 100 + 'vw';
                    flag.style.top = '-32px';
                    flag.style.opacity = (Math.random() * 0.5 + 0.5).toFixed(2);
                    flag.style.filter = 'drop-shadow(0 2px 6px #2228)';
                    flag.style.transform = `rotate(${Math.random()*60-30}deg)`;
                    flag.style.animation = `countdownFlagFallFS ${18 + Math.random() * 6}s linear ${Math.random()*2}s forwards`;
                    flagWrap.appendChild(flag);
                    setTimeout(() => { flag.remove(); }, 24000);
                }
            }, 600); // thưa hơn
            document.body.appendChild(flagWrap);
            setTimeout(() => {
                clearInterval(interval);
                flagWrap.remove();
            }, 25000);
        }

    // Hiệu ứng: Pháo giấy toàn màn hình ~20s
    function showConfettiEffectFullScreen() {
        if (document.getElementById('countdown-confetti-fullscreen')) return;
        let confettiWrap = document.createElement('div');
        confettiWrap.id = 'countdown-confetti-fullscreen';
        confettiWrap.style.position = 'fixed';
        confettiWrap.style.left = 0;
        confettiWrap.style.top = 0;
        confettiWrap.style.width = '100vw';
        confettiWrap.style.height = '100vh';
        confettiWrap.style.pointerEvents = 'none';
        confettiWrap.style.zIndex = 9999;
        let colors = ['#ff1744', '#ffd600', '#ff9800', '#d50000', '#fff176'];
        // SVG icon hoa mai, hoa đào
        function createSVGFlower(type, size) {
            if (type === 'mai') {
                // Hoa mai vàng 5 cánh
                return `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g>
                    <circle cx="20" cy="20" r="6" fill="#ffe066"/>
                    <g fill="#ffd600">
                        <ellipse cx="20" cy="8" rx="5" ry="8"/>
                        <ellipse cx="20" cy="32" rx="5" ry="8"/>
                        <ellipse cx="8" cy="20" rx="8" ry="5"/>
                        <ellipse cx="32" cy="20" rx="8" ry="5"/>
                        <ellipse cx="11" cy="11" rx="5" ry="8" transform="rotate(-45 11 11)"/>
                        <ellipse cx="29" cy="29" rx="5" ry="8" transform="rotate(-45 29 29)"/>
                        <ellipse cx="29" cy="11" rx="8" ry="5" transform="rotate(45 29 11)"/>
                        <ellipse cx="11" cy="29" rx="8" ry="5" transform="rotate(45 11 29)"/>
                    </g>
                    <circle cx="20" cy="20" r="2.5" fill="#ffb300"/>
                    </g>
                </svg>`;
            } else {
                // Hoa đào hồng 5 cánh
                return `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g>
                    <circle cx="20" cy="20" r="6" fill="#f8bbd0"/>
                    <g fill="#e573b7">
                        <ellipse cx="20" cy="8" rx="5" ry="8"/>
                        <ellipse cx="20" cy="32" rx="5" ry="8"/>
                        <ellipse cx="8" cy="20" rx="8" ry="5"/>
                        <ellipse cx="32" cy="20" rx="8" ry="5"/>
                        <ellipse cx="11" cy="11" rx="5" ry="8" transform="rotate(-45 11 11)"/>
                        <ellipse cx="29" cy="29" rx="5" ry="8" transform="rotate(-45 29 29)"/>
                        <ellipse cx="29" cy="11" rx="8" ry="5" transform="rotate(45 29 11)"/>
                        <ellipse cx="11" cy="29" rx="8" ry="5" transform="rotate(45 11 29)"/>
                    </g>
                    <circle cx="20" cy="20" r="2.5" fill="#ad1457"/>
                    </g>
                </svg>`;
            }
        }
        let interval = setInterval(() => {
            for (let i = 0; i < 7; ++i) { // thưa hơn
                // 50% pháo giấy, 50% hoa (SVG)
                if (Math.random() < 0.5) {
                    let conf = document.createElement('div');
                    let size = Math.random() * 12 + 10;
                    conf.style.position = 'absolute';
                    conf.style.left = Math.random() * 100 + 'vw';
                    conf.style.top = '-24px';
                    conf.style.width = size + 'px';
                    conf.style.height = size * 1.8 + 'px';
                    conf.style.background = colors[Math.floor(Math.random() * colors.length)];
                    conf.style.borderRadius = '4px';
                    conf.style.opacity = Math.random() * 0.5 + 0.5;
                    conf.style.transform = `rotate(${Math.random()*360}deg)`;
                    conf.style.animation = `countdownConfettiFallFS ${18 + Math.random() * 6}s linear ${Math.random()*2}s forwards`;
                    confettiWrap.appendChild(conf);
                    setTimeout(() => { conf.remove(); }, 24000);
                } else {
                    let flowerType = Math.random() < 0.5 ? 'mai' : 'dao';
                    let w = Math.random() * 18 + 24;
                    let flowerDiv = document.createElement('div');
                    flowerDiv.style.position = 'absolute';
                    flowerDiv.style.left = Math.random() * 100 + 'vw';
                    flowerDiv.style.top = '-32px';
                    flowerDiv.style.width = w + 'px';
                    flowerDiv.style.height = w + 'px';
                    flowerDiv.style.opacity = (Math.random() * 0.5 + 0.5).toFixed(2);
                    flowerDiv.style.transform = `rotate(${Math.random()*360}deg)`;
                    flowerDiv.style.animation = `countdownConfettiFallFS ${18 + Math.random() * 6}s linear ${Math.random()*2}s forwards`;
                    flowerDiv.innerHTML = createSVGFlower(flowerType, w);
                    confettiWrap.appendChild(flowerDiv);
                    setTimeout(() => { flowerDiv.remove(); }, 24000);
                }
            }
        }, 600); // thưa hơn
        document.body.appendChild(confettiWrap);
        setTimeout(() => {
            clearInterval(interval);
            confettiWrap.remove();
        }, 25000);
    }

    // Thêm CSS động cho hiệu ứng
    if (!document.getElementById('countdown-effect-style')) {
        const style = document.createElement('style');
        style.id = 'countdown-effect-style';
        style.innerHTML = `
        @keyframes countdownSnowFall {
            0% { transform: translateY(0); opacity:1; }
            90% { opacity:1; }
            100% { transform: translateY(120px); opacity:0; }
        }
        @keyframes countdownFireworkBurst {
            0% { transform: scaleY(0); opacity:0.8; }
            60% { transform: scaleY(1.1); opacity:1; }
            100% { transform: scaleY(0); opacity:0; }
        }
        @keyframes countdownConfettiFall {
            0% { transform: translateY(0) rotate(0deg); opacity:1; }
            80% { opacity:1; }
            100% { transform: translateY(120px) rotate(360deg); opacity:0; }
        }
        /* Toàn màn hình */
        @keyframes countdownSnowFallFS {
            0% { transform: translateY(0); opacity:1; }
            90% { opacity:1; }
            100% { transform: translateY(100vh); opacity:0; }
        }
        @keyframes countdownFlagFallFS {
            0% { transform: translateY(0) rotate(0deg); opacity:1; }
            80% { opacity:1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity:0; }
        }
        @keyframes countdownConfettiFallFS {
            0% { transform: translateY(0) rotate(0deg); opacity:1; }
            80% { opacity:1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity:0; }
        }
        `;
        document.head.appendChild(style);
    }

    function renderCountdowns() {
        let now = new Date();
        // Noel
        let noelTarget = getNextTarget(now, getNoelDate);
        let noelDiff = noelTarget - now;
        // Tết Tây
        let tetTayTarget = getNextTarget(now, getTetTayDate);
        let tetTayDiff = tetTayTarget - now;
        // Tết Nguyên Đán
        let tetTarget = getNextTarget(now, getTetDate);
        let tetDiff = tetTarget - now;
        let html = `
            <div style="display:flex;flex-wrap:wrap;gap:18px;justify-content:center;margin:18px 0;">
                <div class="countdown-box" data-effect="snow" style="
                    flex:1 1 260px;
                    min-width:220px;
                    max-width:340px;
                    background:linear-gradient(90deg,#1976d2 60%,#2196f3 100%);
                    color:#fff;
                    border-radius:12px;
                    padding:18px 0;
                    font-size:1.15rem;
                    font-weight:bold;
                    text-align:center;
                    box-shadow:0 4px 24px #1976d220;
                    letter-spacing:1px;
                    cursor:pointer;
                    position:relative;
                    overflow:hidden;
                ">
                    <div style="margin-bottom:8px;">🎄 Đếm ngược tới Noel</div>
                    <div style="font-size:1.3rem;">${formatTime(noelDiff)}</div>
                </div>
                <div class="countdown-box" data-effect="firework" style="
                    flex:1 1 260px;
                    min-width:220px;
                    max-width:340px;
                    background:linear-gradient(90deg,#43a047 60%,#66bb6a 100%);
                    color:#fff;
                    border-radius:12px;
                    padding:18px 0;
                    font-size:1.15rem;
                    font-weight:bold;
                    text-align:center;
                    box-shadow:0 4px 24px #43a04720;
                    letter-spacing:1px;
                    cursor:pointer;
                    position:relative;
                    overflow:hidden;
                ">
                    <div style="margin-bottom:8px;">🎉 Đếm ngược tới Tết Dương Lịch</div>
                    <div style="font-size:1.3rem;">${formatTime(tetTayDiff)}</div>
                </div>
                <div class="countdown-box" data-effect="confetti" style="
                    flex:1 1 260px;
                    min-width:220px;
                    max-width:340px;
                    background:linear-gradient(90deg,#ff9800 60%,#ffd54f 100%);
                    color:#fff;
                    border-radius:12px;
                    padding:18px 0;
                    font-size:1.15rem;
                    font-weight:bold;
                    text-align:center;
                    box-shadow:0 4px 24px #ff980020;
                    letter-spacing:1px;
                    cursor:pointer;
                    position:relative;
                    overflow:hidden;
                ">
                    <div style="margin-bottom:8px;">🧧 Đếm ngược tới Tết Nguyên Đán</div>
                    <div style="font-size:1.3rem;">${formatTime(tetDiff)}</div>
                </div>
            </div>
        `;
        let el = document.getElementById('holidayCountdown');
        if (!el) {
            el = document.createElement('div');
            el.id = 'holidayCountdown';
            // Tìm vị trí hợp lý: sau .container nếu có, nếu không thì prepend body
            let container = document.querySelector('.container');
            if (container && container.parentNode) {
                container.parentNode.insertBefore(el, container.nextSibling);
            } else {
                document.body.prepend(el);
            }
        }
        el.innerHTML = html;

        // Gắn sự kiện hiệu ứng toàn màn hình cho từng khung
        let boxes = el.querySelectorAll('.countdown-box');
        boxes.forEach(box => {
            if (!box._effectBound) {
                box.addEventListener('click', function () {
                    let eff = box.getAttribute('data-effect');
                    if (eff === 'snow') showSnowEffectFullScreen();
                    else if (eff === 'firework') showFireworkEffectFullScreen();
                    else if (eff === 'confetti') showConfettiEffectFullScreen();
                });
                box._effectBound = true;
            }
        });
    }
    renderCountdowns();
    setInterval(renderCountdowns, 1000);
})();
