// Chỉ cần nhúng file này bằng <script src="ad_ai_image_tool.js"></script> là quảng cáo sẽ tự động hiển thị ở đầu trang.

// Quảng cáo công cụ AI tạo hình ảnh sáng tạo

function renderAICreativeImageAd(containerId) {
    // Nếu đã có quảng cáo thì không thêm nữa
    if (document.getElementById('ai-creative-image-ad-fixed')) return;

    // Kiểm tra nếu vừa đóng quảng cáo trong vòng 10s thì không hiển thị lại
    const lastClosed = localStorage.getItem('ai-creative-image-ad-closed');
    if (lastClosed && Date.now() - Number(lastClosed) < 10000) return;

    const adDiv = document.createElement('div');
    adDiv.id = 'ai-creative-image-ad-fixed';
    adDiv.style = `
        position: fixed;
        left: 32px;
        bottom: 32px;
        z-index: 9999;
        background: linear-gradient(90deg, #1976d2 0%, #43a047 100%);
        color: #fff;
        padding: 20px 28px 20px 20px;
        border-radius: 18px;
        margin: 0;
        max-width: 420px;
        min-width: 320px;
        box-shadow: 0 6px 32px #1976d230;
        display: flex;
        align-items: flex-start;
        gap: 18px;
        font-size: 17px;
        font-family: 'Segoe UI', Arial, sans-serif;
        border: 1.5px solid #e3e8f0;
        animation: ai-ad-fadein 0.7s cubic-bezier(.4,1.4,.6,1) both;
    `;
    adDiv.innerHTML = `
        <div style="position:relative;">
            <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="AI Art" style="width:54px;height:54px;border-radius:50%;box-shadow:0 2px 8px #1976d220;object-fit:cover;flex-shrink:0;z-index:1;position:relative;">
            <span style="position:absolute;right:-8px;bottom:-8px;background:#fff;border-radius:50%;box-shadow:0 2px 8px #1976d220;padding:4px;">
                <img src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png" alt="star" style="width:18px;height:18px;animation:ai-ad-star-bounce 1.2s infinite;">
            </span>
        </div>
        <div style="flex:1;min-width:0;">
            <div style="font-weight:600;font-size:18px;letter-spacing:0.2px;color:#fff;margin-bottom:2px;display:flex;align-items:center;gap:7px;">
                Công cụ AI tạo hình ảnh sáng tạo
                <img src="https://cdn-icons-png.flaticon.com/512/3523/3523887.png" alt="magic" style="width:20px;height:20px;filter:drop-shadow(0 0 4px #ffe082);">
            </div>
            <div style="font-size:15px;line-height:1.5;color:#f3f3f3;margin-bottom:10px;">
                <img src="https://cdn-icons-png.flaticon.com/512/1828/1828919.png" alt="idea" style="width:16px;height:16px;vertical-align:middle;margin-right:3px;">
                Tạo ảnh độc đáo, ý tưởng sáng tạo chỉ với vài cú click.<br>
                <span style="color:#ffe082;font-weight:500;">
                    <img src="https://cdn-icons-png.flaticon.com/512/545/545682.png" alt="flash" style="width:15px;height:15px;vertical-align:middle;margin-right:2px;">
                    Nhanh chóng, miễn phí, dễ dùng!
                </span>
            </div>
            <a href="https://www.xaydungmkhome.online/Web%20AI%20T%E1%BA%A1o%20%E1%BA%A2nh/aiminhkhoa.html" target="_blank"
                style="
                    display:inline-block;
                    background: linear-gradient(90deg,#ffe082 0%,#ffd54f 100%);
                    color:#1976d2;
                    font-weight:700;
                    padding:8px 18px;
                    border-radius:7px;
                    text-decoration:none;
                    font-size:15px;
                    box-shadow:0 2px 8px #1976d220;
                    transition: background 0.2s, box-shadow 0.2s, color 0.2s;
                    letter-spacing:0.2px;
                "
                onmouseover="this.style.background='linear-gradient(90deg,#fffde7 0%,#ffe082 100%)';this.style.boxShadow='0 4px 16px #1976d250';this.style.color='#43a047';"
                onmouseout="this.style.background='linear-gradient(90deg,#ffe082 0%,#ffd54f 100%)';this.style.boxShadow='0 2px 8px #1976d220';this.style.color='#1976d2';"
            >
                <img src="https://cdn-icons-png.flaticon.com/512/545/545682.png" alt="flash" style="width:15px;height:15px;vertical-align:middle;margin-right:4px;">
                Khám phá ngay &rarr;
            </a>
        </div>
        <button id="ai-ad-close-btn"
            style="
                background:rgba(255,255,255,0.18);
                border:none;
                color:#fff;
                font-size:22px;
                cursor:pointer;
                border-radius:50%;
                width:36px;
                height:36px;
                display:flex;
                align-items:center;
                justify-content:center;
                margin-left:10px;
                margin-top:2px;
                transition: background 0.2s;
            "
            title="Đóng quảng cáo"
            onmouseover="this.style.background='#fff';this.style.color='#1976d2';"
            onmouseout="this.style.background='rgba(255,255,255,0.18)';this.style.color='#fff';"
        >&times;</button>
    `;
    document.body.appendChild(adDiv);

    // Đóng quảng cáo khi bấm nút X
    document.getElementById('ai-ad-close-btn').onclick = function() {
        adDiv.remove();
        localStorage.setItem('ai-creative-image-ad-closed', Date.now().toString());
    };

    // Thêm hiệu ứng fadein nếu muốn
    if (!document.getElementById('ai-ad-fadein-style')) {
        const style = document.createElement('style');
        style.id = 'ai-ad-fadein-style';
        style.innerHTML = `
            @keyframes ai-ad-fadein {
                from { opacity: 0; transform: translateX(-120px) scale(0.95);}
                60% { opacity: 1; transform: translateX(12px) scale(1.03);}
                to { opacity: 1; transform: translateX(0) scale(1);}
            }
            @keyframes ai-ad-star-bounce {
                0%, 100% { transform: scale(1) rotate(-10deg);}
                50% { transform: scale(1.25) rotate(10deg);}
            }
        `;
        document.head.appendChild(style);
    }
}

// Tự động hiển thị quảng cáo khi file được nhúng
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function() {
        renderAICreativeImageAd();
    });
}
