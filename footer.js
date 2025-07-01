function renderFooter() {
    // Xóa footer cũ nếu có
    const oldFooter = document.querySelector('footer#mk-footer');
    if (oldFooter) oldFooter.remove();

    // Tạo phần tử footer
    const footer = document.createElement('footer');
    footer.id = 'mk-footer';
    footer.style.background = 'linear-gradient(90deg, #0f2027 0%, #1976d2 60%, #43a047 100%)';
    footer.style.color = '#fff';
    footer.style.textAlign = 'center';
    footer.style.padding = '38px 10px 26px 10px';
    footer.style.fontSize = '17px';
    footer.style.marginTop = '48px';
    footer.style.borderTopLeftRadius = '22px';
    footer.style.borderTopRightRadius = '22px';
    footer.style.boxShadow = '0 -4px 24px #1976d250';

    // Logo & tên tổ chức
    const logoDiv = document.createElement('div');
    logoDiv.innerHTML = `
        <img src="iconlogo.png" alt="MK SOF" style="width:62px;height:62px;border-radius:16px;box-shadow:0 2px 12px #0005;background:#fff;margin-bottom:10px;">
        <div style="font-size:2rem;font-weight:900;letter-spacing:2.5px;color:#ffd600;margin-bottom:2px;text-shadow:0 2px 12px #0008;">
            MK SOF TECH GROUP
        </div>
        <div style="font-size:1.13rem;font-weight:700;opacity:0.98;color:#fffde7;letter-spacing:1px;">
            Next-Gen Software & AI Solutions
        </div>
        <div style="font-size:1.08rem;font-weight:500;opacity:0.92;">
            Tập Đoàn Công Nghệ & Giải Pháp Phần Mềm MK SOF
        </div>
        <div style="font-size:1.02rem;font-weight:400;opacity:0.85;color:#b3e5fc;">
            MK SOF Tech Group - Software & AI Innovation
        </div>
    `;
    footer.appendChild(logoDiv);

    // Slogan
    const sloganDiv = document.createElement('div');
    sloganDiv.style.margin = '14px 0 10px 0';
    sloganDiv.style.fontSize = '1.13rem';
    sloganDiv.style.fontWeight = '700';
    sloganDiv.style.color = '#ffd600';
    sloganDiv.style.textShadow = '0 2px 8px #0005';
    sloganDiv.innerHTML = '🚀 Đồng hành chuyển đổi số & bứt phá cùng doanh nghiệp Việt!';
    footer.appendChild(sloganDiv);

    // Dải phân cách
    const hr = document.createElement('hr');
    hr.style.border = 'none';
    hr.style.height = '1px';
    hr.style.background = 'linear-gradient(90deg, #fff0, #fff6 50%, #fff0)';
    hr.style.margin = '18px 0 14px 0';
    footer.appendChild(hr);

    // Slogan phụ chuyên nghiệp
    const subSloganDiv = document.createElement('div');
    subSloganDiv.style.fontSize = '1.01rem';
    subSloganDiv.style.fontWeight = '500';
    subSloganDiv.style.opacity = '0.85';
    subSloganDiv.style.fontStyle = 'italic';
    subSloganDiv.style.color = '#fffde7';
    subSloganDiv.innerHTML = 'Chất lượng - Sáng tạo - Đồng hành phát triển bền vững';
    footer.appendChild(subSloganDiv);

    // Copyright
    const copyrightDiv = document.createElement('div');
    copyrightDiv.style.marginTop = '12px';
    copyrightDiv.style.fontSize = '0.98rem';
    copyrightDiv.style.opacity = '0.75';
    copyrightDiv.innerHTML = `&copy; ${new Date().getFullYear()} <b>MK SOF TECH GROUP</b>. All rights reserved.`;
    footer.appendChild(copyrightDiv);

    // Không còn thông tin liên hệ chi tiết
    // Thêm vào cuối body
    document.body.appendChild(footer);
}
