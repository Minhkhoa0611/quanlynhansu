// Tích hợp với att.html: tự động phát âm thanh khi nhân viên chấm công thành công qua QR

(function() {
    // Đọc số thành tiếng Việt đơn giản (1-99)
    function numToVietnamese(n) {
        const arr = ["không","một","hai","ba","bốn","năm","sáu","bảy","tám","chín"];
        if (n < 10) return arr[n];
        if (n < 20) return "mười" + (n%10 ? " " + arr[n%10] : "");
        let chuc = Math.floor(n/10), donvi = n%10;
        return arr[chuc] + " mươi" + (donvi ? " " + arr[donvi] : "");
    }

    // Phát âm thanh
    function speakAttendance(empName, order, hour, minute) {
        if (!window.speechSynthesis) return;
        // Lấy ngày/tháng/năm hiện tại
        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        let msg = `Nhân viên ${empName} . Chấm công vào lúc ${hour} giờ ${minute} phút, ngày ${day} tháng ${month} năm ${year}. Chúc bạn một ngày làm việc vui vẻ.`;
        let utter = new SpeechSynthesisUtterance(msg);
        utter.lang = 'vi-VN';

        let voices = window.speechSynthesis.getVoices();

        // Tìm voice tiếng Việt
        let viVoices = voices.filter(v =>
            (v.lang && v.lang.toLowerCase().startsWith('vi')) ||
            (v.name && v.name.toLowerCase().includes('viet'))
        );
        let viVoice = viVoices.find(v => v.name.toLowerCase().includes('google')) ||
                      viVoices.find(v => v.name.toLowerCase().includes('viet')) ||
                      viVoices[0];

        if (viVoice) {
            utter.voice = viVoice;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utter);
        } else {
            // Nếu không có tiếng Việt, dùng tiếng Anh giọng nữ
            let enVoices = voices.filter(v =>
                v.lang && v.lang.toLowerCase().startsWith('en') && v.gender === 'female'
            );
            // Nếu không có thuộc tính gender, chọn voice tiếng Anh có tên chứa "female" hoặc chọn voice nữ đầu tiên
            if (!enVoices.length) {
                enVoices = voices.filter(v =>
                    v.lang && v.lang.toLowerCase().startsWith('en') &&
                    (v.name && v.name.toLowerCase().includes('female'))
                );
            }
            let enVoice = enVoices[0] || voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en'));
            if (enVoice) {
                utter.voice = enVoice;
                utter.lang = enVoice.lang || 'en-US';
            } else {
                utter.lang = 'en-US';
            }
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utter);
        }
    }

    // Đếm số lần chấm công trong ngày cho nhân viên
    function getCheckinOrder(empId, month, day) {
        try {
            const att = JSON.parse(localStorage.getItem('attendanceByMonth') || '{}');
            if (!att[month] || !att[month][empId]) return 1;
            // Đếm tổng số nhân viên đã chấm công trong ngày này
            let count = 0;
            for (const eid in att[month]) {
                if (att[month][eid][day]) count++;
            }
            return count;
        } catch {
            return 1;
        }
    }

    // Phát âm thanh khi click vào checkbox chấm công
    function handleAttendanceCheckbox(e) {
        // Chỉ phát khi là checked (tích vào)
        if (!e.target.checked) return;
        // Tìm thông tin nhân viên
        let empId = document.getElementById('empSelect')?.value;
        if (!empId) return;
        // Lấy tên nhân viên
        let employees = [];
        try {
            employees = JSON.parse(localStorage.getItem('employees') || '[]');
        } catch {}
        let emp = employees.find(e => e.id == empId);
        let empName = emp ? emp.name : '';
        // Lấy ngày và tháng hiện tại
        let now = new Date();
        let month = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
        let day = now.getDate();
        let order = getCheckinOrder(empId, month, day);
        let hour = now.getHours();
        let minute = now.getMinutes();
        speakAttendance(empName, order, hour, minute);
    }

    // Gắn sự kiện cho các checkbox chấm công sau mỗi lần render
    function attachAttendanceCheckboxSpeech() {
        // Chỉ gắn cho các checkbox trong bảng chấm công
        let wrap = document.getElementById('attTableWrap');
        if (!wrap) return;
        let checkboxes = wrap.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            // Tránh gắn nhiều lần
            if (!cb._speechAttached) {
                cb.addEventListener('change', handleAttendanceCheckbox);
                cb._speechAttached = true;
            }
        });
    }

    // Hook lại renderAttendance để tự động gắn sự kiện
    (function() {
        const oldRenderAttendance = window.renderAttendance;
        window.renderAttendance = function() {
            if (typeof oldRenderAttendance === 'function') oldRenderAttendance.apply(this, arguments);
            setTimeout(attachAttendanceCheckboxSpeech, 0);
        };
    })();

    // ...giữ lại hook QR nếu muốn phát cả khi QR...
    (function() {
        const oldShowQRSuccessPopup = window.showQRSuccessPopup;
        window.showQRSuccessPopup = function(msg) {
            try {
                let match = msg.match(/<b>(.*?)<\/b>/);
                let empName = match ? match[1] : '';
                let empId = document.getElementById('empSelect').value;
                let now = new Date();
                let month = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
                let day = now.getDate();
                let order = getCheckinOrder(empId, month, day);
                let hour = now.getHours();
                let minute = now.getMinutes();
                speakAttendance(empName, order, hour, minute);
            } catch(e) {}
            if (typeof oldShowQRSuccessPopup === 'function') oldShowQRSuccessPopup.apply(this, arguments);
        };
    })();

    // Phát âm thử tiếng Việt hoặc tiếng Anh ngay khi load trang
    (function trySpeakWelcome() {
        let spoken = false;
        function speakWelcome() {
            if (spoken) return; // Đảm bảo chỉ đọc 1 lần
            spoken = true;
            let utter;
            let voices = window.speechSynthesis.getVoices();
            // Ưu tiên tiếng Việt
            let viVoices = voices.filter(v =>
                (v.lang && v.lang.toLowerCase().startsWith('vi')) ||
                (v.name && v.name.toLowerCase().includes('viet'))
            );
            let viVoice = viVoices.find(v => v.name.toLowerCase().includes('google')) ||
                          viVoices.find(v => v.name.toLowerCase().includes('viet')) ||
                          viVoices[0];
            let msgVi = "Xin chào. Bạn đang sử dụng hệ thống chấm công của Minh Khoa Đẹp Trai He He He He He Ha Ha Ha";
            let msgEn = "Welcome to the MK GROUP attendance system.";
            if (viVoice) {
                utter = new SpeechSynthesisUtterance(msgVi);
                utter.lang = 'vi-VN';
                utter.voice = viVoice;
            } else {
                // Không có tiếng Việt, dùng tiếng Anh nữ
                let enVoices = voices.filter(v =>
                    v.lang && v.lang.toLowerCase().startsWith('en') && v.gender === 'female'
                );
                if (!enVoices.length) {
                    enVoices = voices.filter(v =>
                        v.lang && v.lang.toLowerCase().startsWith('en') &&
                        (v.name && v.name.toLowerCase().includes('female'))
                    );
                }
                let enVoice = enVoices[0] || voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en'));
                utter = new SpeechSynthesisUtterance(msgEn);
                utter.lang = enVoice?.lang || 'en-US';
                if (enVoice) utter.voice = enVoice;
            }
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utter);
        }

        // Đảm bảo voice đã load xong mới đọc
        function trySpeak() {
            if (window.speechSynthesis.getVoices().length) {
                setTimeout(speakWelcome, 300);
            }
        }
        // Luôn kích hoạt load voice
        window.speechSynthesis.getVoices();
        // Nếu đã có voice thì đọc luôn, nếu chưa thì chờ event
        if (window.speechSynthesis.getVoices().length) {
            setTimeout(speakWelcome, 300);
        } else {
            window.speechSynthesis.onvoiceschanged = function() {
                window.speechSynthesis.onvoiceschanged = null;
                setTimeout(speakWelcome, 100);
            };
        }
    })();

})();
