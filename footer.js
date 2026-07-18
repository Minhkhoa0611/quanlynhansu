function renderFooter() {
    const oldFooter = document.querySelector('footer#mk-footer');
    if (oldFooter) oldFooter.remove();

    const footer = document.createElement('footer');
    footer.id = 'mk-footer';
    footer.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #1976d2 100%)';
    footer.style.color = '#ffffff';
    footer.style.padding = '36px 20px 28px';
    footer.style.marginTop = '36px';
    footer.style.borderTopLeftRadius = '24px';
    footer.style.borderTopRightRadius = '24px';
    footer.style.boxShadow = '0 -8px 28px rgba(25, 118, 210, 0.25)';
    footer.style.fontFamily = 'Segoe UI, Arial, sans-serif';

    const wrap = document.createElement('div');
    wrap.style.maxWidth = '1100px';
    wrap.style.margin = '0 auto';
    wrap.style.display = 'grid';
    wrap.style.gridTemplateColumns = '1.15fr 0.85fr';
    wrap.style.gap = '24px';
    wrap.style.alignItems = 'start';

    const left = document.createElement('div');
    left.style.background = 'rgba(255,255,255,0.08)';
    left.style.border = '1px solid rgba(255,255,255,0.16)';
    left.style.borderRadius = '18px';
    left.style.padding = '18px 20px';
    left.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;flex-wrap:wrap;">
            <img src="timespro.png" alt="Hệ thống chấm công" style="width:58px;height:58px;border-radius:16px;background:#fff;padding:5px;box-shadow:0 3px 12px rgba(0,0,0,0.25);">
            <div>
                <div style="font-size:1.45rem;font-weight:800;letter-spacing:1.2px;color:#ffd600;">Hệ thống chấm công</div>
                <div style="font-size:0.95rem;font-weight:600;color:#e3f2fd;opacity:0.95;">Quản lý thời gian làm việc và lương</div>
            </div>
        </div>
        <div style="font-size:0.98rem;line-height:1.75;color:#eaf2ff;opacity:0.95;">
            Theo dõi công việc, chấm công, quản lý nghỉ phép và xem bảng lương nhanh chóng, rõ ràng và thuận tiện.
        </div>
    `;

    const right = document.createElement('div');
    right.style.background = 'rgba(255,255,255,0.08)';
    right.style.border = '1px solid rgba(255,255,255,0.16)';
    right.style.borderRadius = '18px';
    right.style.padding = '18px 20px';
    right.innerHTML = `
        <div style="font-size:1rem;font-weight:700;margin-bottom:8px;color:#ffd600;">Thông tin hệ thống</div>
        <div style="font-size:0.96rem;line-height:1.8;color:#f7fbff;">
            <div style="margin-bottom:6px;"><b>Trang chính:</b> Chấm công, bảng lương, báo cáo</div>
            <div style="margin-bottom:6px;"><b>Hỗ trợ:</b> Kiểm tra dữ liệu và cập nhật tháng</div>
            <div><b>Ghi chú:</b> Dùng cho quản lý cửa hàng và nhân viên</div>
        </div>
    `;

    wrap.appendChild(left);
    wrap.appendChild(right);
    footer.appendChild(wrap);

    const line = document.createElement('div');
    line.style.margin = '22px auto 12px';
    line.style.maxWidth = '1100px';
    line.style.height = '1px';
    line.style.background = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)';
    footer.appendChild(line);

    const bottom = document.createElement('div');
    bottom.style.maxWidth = '1100px';
    bottom.style.margin = '0 auto';
    bottom.style.textAlign = 'center';
    bottom.style.fontSize = '0.95rem';
    bottom.style.color = '#eaf2ff';
    bottom.style.opacity = '0.95';
    bottom.innerHTML = `
        <div style="margin-bottom:6px;">🔔 Dữ liệu được lưu theo tháng và cập nhật liên tục trong hệ thống.</div>
        <div>&copy; ${new Date().getFullYear()} Hệ thống chấm công.</div>
    `;
    footer.appendChild(bottom);

    document.body.appendChild(footer);
}
