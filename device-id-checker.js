// device-id-checker.js
// Kiểm tra deviceId trong localStorage, nếu đúng sẽ cảnh báo

// Kiểm tra fixedDeviceID (từ getFixedDeviceID trong data_io.js), nếu nằm trong danh sách id.txt sẽ cảnh báo
(function() {
    if (typeof getFixedDeviceID !== 'function') {
        console.error('Thiếu hàm getFixedDeviceID. Hãy đảm bảo đã nhúng data_io.js trước!');
        return;
    }
    getFixedDeviceID().then(function(deviceId) {
        if (!deviceId) return;
        fetch("id.txt")
            .then(function(response) {
                if (!response.ok) throw new Error("Không thể đọc file id.txt");
                return response.text();
            })
            .then(function(text) {
                var idList = text.split(/\r?\n/).map(function(id) { return id.trim(); }).filter(Boolean);
                if (idList.includes(deviceId)) {
                    // Tạo hộp thoại cảnh báo chuyên nghiệp
                    if (!document.getElementById('device-id-warning-modal')) {
                        var modal = document.createElement('div');
                        modal.id = 'device-id-warning-modal';
                        modal.innerHTML = `
                            <div style="position:fixed;z-index:9999;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;">
                                <div style="background:#fff;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.18);padding:32px 28px 24px 28px;max-width:90vw;width:400px;text-align:center;position:relative;">
                                        <div style="font-size:3rem;color:#e53935;margin-bottom:10px;line-height:1;">&#9888;</div>
                                        <div style="font-size:1.3rem;font-weight:700;margin-bottom:8px;color:#d32f2f;letter-spacing:0.5px;">CẢNH BÁO NGUY HIỂM HỆ THỐNG</div>
                                        <div style="font-size:1.08rem;color:#b71c1c;margin-bottom:18px;line-height:1.6;">
                                            <span style="display:inline-block;background:#ffebee;color:#c62828;padding:2px 10px;border-radius:5px;font-size:0.98em;margin-bottom:6px;">Phát hiện truy cập bất thường</span><br>
                                            Hệ thống đã ghi nhận <b>lưu lượng truy cập bất thường</b> từ thiết bị này.<br>
                                            <span style="color:#c62828;font-weight:600;">Mã thiết bị: <span style="font-family:monospace;">${deviceId}</span></span><br>
                                            <span style="color:#b71c1c;font-size:0.97em;">Mã lỗi: <span style="font-family:monospace;">ERR-SEC-403</span></span>
                                        </div>
                                        <div style="background:#ffebee;border-radius:7px;padding:10px 14px;margin-bottom:18px;font-size:0.98rem;color:#b71c1c;text-align:left;">
                                            <ul style="margin:0 0 0 18px;padding:0;text-align:left;">
                                                <li><b>Thiết bị này có thể gây nguy hiểm nghiêm trọng cho hệ thống hoặc dữ liệu.</b></li>
                                                <li>Chúng tôi đã ghi nhận và lưu lại toàn bộ hoạt động truy cập bất thường để phục vụ kiểm tra bảo mật.</li>
                                                <li>Vui lòng dừng sử dụng ngay và liên hệ quản trị viên để xác minh an toàn.</li>
                                            </ul>
                                        </div>
                                        <button id="close-device-id-warning" style="background:#d32f2f;color:#fff;border:none;border-radius:6px;padding:10px 28px;font-size:1.08rem;cursor:pointer;font-weight:600;box-shadow:0 2px 8px rgba(211,47,47,0.08);transition:background 0.2s;">Tôi đã hiểu</button>
                                </div>
                            </div>
                        `;
                        document.body.appendChild(modal);
                        document.getElementById('close-device-id-warning').onclick = function() {
                            document.getElementById('device-id-warning-modal').remove();
                        };
                    }
                }
            })
            .catch(function(err) {
                // Có thể log lỗi nếu cần
                // console.error(err);
            });
    });
})();
