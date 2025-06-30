// Chỉ cần nhúng file này bằng <script src="ad_ai_image_tool.js"></script> là quảng cáo sẽ tự động hiển thị ở đầu trang.

// Quảng cáo công cụ AI tạo hình ảnh sáng tạo

function renderAICreativeImageAd(containerId) {
    // Nếu đã có quảng cáo thì không thêm nữa
    if (document.getElementById('ai-creative-image-ad-fixed')) return;

    const adDiv = document.createElement('div');
    adDiv.id = 'ai-creative-image-ad-fixed';
    adDiv.style = `
        position: fixed;
        left: 24px;
        bottom: 24px;
        z-index: 9999;
        background: linear-gradient(90deg, #1976d2 0%, #43a047 100%);
        color: #fff;
        padding: 18px 24px;
        border-radius: 10px;
        margin: 0;
        max-width: 600px;
        box-shadow: 0 4px 16px #1976d250;
        display: flex;
        align-items: center;
        gap: 18px;
        font-size: 18px;
        animation: ai-ad-fadein 0.5s;
    `;
    adDiv.innerHTML = `
        <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="AI Art" style="width:56px;height:56px;border-radius:8px;box-shadow:0 2px 8px #0002;">
        <div style="flex:1;">
            <b>CÔNG CỤ AI TẠO HÌNH ẢNH SÁNG TẠO</b><br>
            Tạo ảnh độc đáo, ý tưởng sáng tạo chỉ với vài cú click!<br>
            <a href="https://www.xaydungmkhome.online/Web%20AI%20T%E1%BA%A1o%20%E1%BA%A2nh/aiminhkhoa.html" target="_blank" style="color:#fbc02d;font-weight:bold;text-decoration:underline;">Khám phá ngay &rarr;</a>
        </div>
        <button id="ai-ad-close-btn" style="background:none;border:none;color:#fff;font-size:22px;cursor:pointer;margin-left:8px;">&times;</button>
    `;
    document.body.appendChild(adDiv);

    // Đóng quảng cáo khi bấm nút X
    document.getElementById('ai-ad-close-btn').onclick = function() {
        adDiv.remove();
    };

    // Thêm hiệu ứng fadein nếu muốn
    if (!document.getElementById('ai-ad-fadein-style')) {
        const style = document.createElement('style');
        style.id = 'ai-ad-fadein-style';
        style.innerHTML = `
            @keyframes ai-ad-fadein {
                from { opacity: 0; transform: translateY(40px);}
                to { opacity: 1; transform: translateY(0);}
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
