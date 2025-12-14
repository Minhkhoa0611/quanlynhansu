function renderFooter() {
    // Xóa footer cũ nếu có
    const oldFooter = document.querySelector('footer#mk-footer');
    if (oldFooter) oldFooter.remove();

    // Tạo phần tử footer
    const footer = document.createElement('footer');
    footer.id = 'mk-footer';
    footer.style.background = 'linear-gradient(90deg, #232526 0%, #414345 60%, #1976d2 100%)';
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
        <img src="iconlogo.png" alt="MK GROUP" style="width:62px;height:62px;border-radius:16px;box-shadow:0 2px 12px #0005;background:#fff;margin-bottom:10px;">
        <div style="font-size:2rem;font-weight:900;letter-spacing:2.5px;color:#ffd600;margin-bottom:2px;text-shadow:0 2px 12px #0008;">
            MK GROUP
        </div>
        <div style="font-size:1.13rem;font-weight:700;opacity:0.98;color:#fffde7;letter-spacing:1px;">
            Next-Gen Software & AI Solutions
        </div>
    `;
    footer.appendChild(logoDiv);

    // Thông tin liên hệ
    const contactDiv = document.createElement('div');
    contactDiv.style.margin = '18px 0 10px 0';
    contactDiv.style.fontSize = '1.08rem';
    contactDiv.style.fontWeight = '500';
    contactDiv.style.opacity = '0.92';
    contactDiv.innerHTML = `
        <span style="margin-right:18px;"><b>Hotline:</b> <a href="tel:0867544809" style="color:#ffd600;text-decoration:none;">0867 544 809</a></span>
        <span style="margin-right:18px;"><b>Email:</b> <a href="mailto:info.mksof@gmail.com" style="color:#ffd600;text-decoration:none;">info.mksof@gmail.com</a></span>
        <span><b>Địa chỉ:</b> Bình Trị, Tân Định, Khánh Hòa</span>
    `;
    footer.appendChild(contactDiv);

    // Dải phân cách
    const hr = document.createElement('hr');
    hr.style.border = 'none';
    hr.style.height = '1px';
    hr.style.background = 'linear-gradient(90deg, #fff0, #fff6 50%, #fff0)';
    hr.style.margin = '18px 0 14px 0';
    footer.appendChild(hr);

    // Slogan chuyên nghiệp
    const subSloganDiv = document.createElement('div');
    subSloganDiv.style.fontSize = '1.01rem';
    subSloganDiv.style.fontWeight = '500';
    subSloganDiv.style.opacity = '0.85';
    subSloganDiv.style.fontStyle = 'italic';
    subSloganDiv.style.color = '#fffde7';
    subSloganDiv.innerHTML = 'Chất lượng - Sáng tạo - Đồng hành phát triển bền vững';
    footer.appendChild(subSloganDiv);

    // Thông báo ngừng cập nhật
    const stopUpdateDiv = document.createElement('div');
    stopUpdateDiv.style.margin = '18px 0 0 0';
    stopUpdateDiv.style.fontSize = '1.01rem';
    stopUpdateDiv.style.fontWeight = '600';
    stopUpdateDiv.style.color = '#ffd600';
    stopUpdateDiv.style.background = 'rgba(25, 118, 210, 0.10)';
    stopUpdateDiv.style.borderRadius = '8px';
    stopUpdateDiv.style.padding = '7px 12px';
    stopUpdateDiv.innerHTML = '🔔 Từ ngày 01/01/2026: Ngừng cập nhật tính năng mới, chỉ duy trì cập nhật bản vá lỗi.';
    footer.appendChild(stopUpdateDiv);

    // Copyright
    const copyrightDiv = document.createElement('div');
    copyrightDiv.style.marginTop = '12px';
    copyrightDiv.style.fontSize = '0.98rem';
    copyrightDiv.style.opacity = '0.75';
    copyrightDiv.innerHTML = `&copy; ${new Date().getFullYear()} <b>MK GROUP</b>. All rights reserved.`;
    footer.appendChild(copyrightDiv);

    // Thêm vào cuối body
    document.body.appendChild(footer);
}
