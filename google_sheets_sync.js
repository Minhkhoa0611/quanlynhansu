/**
 * google_sheets_sync.js - BỘ ĐỒNG BỘ CLOUD VỚI TIẾN TRÌNH HIỂN THỊ GÓC PHẢI MÀN HÌNH
 * - Tự động phát hiện thay đổi dữ liệu trên TẤT CẢ các trang.
 * - Hiển thị tiến trình trực quan dạng pill badge ở góc trên bên phải màn hình.
 * - Đồng bộ 2 chiều tự động với Google Sheets (0đ).
 */

(function (window) {
    'use strict';

    const GS_URL_KEY = 'googleScriptUrl';
    const DEFAULT_GS_URL = 'https://script.google.com/macros/s/AKfycbwMN7uNQhhPxv2LeRoyoHW5Sq_b39ObXxVNLK8enQeEZ31M1yKnZyesLNjuycWo2Cjk/exec';
    
    let syncDebounceTimer = null;
    let isInternalSyncing = false; // Cờ chặn vòng lặp

    function getScriptUrl() {
        return (localStorage.getItem(GS_URL_KEY) || DEFAULT_GS_URL).trim();
    }

    function setScriptUrl(url) {
        localStorage.setItem(GS_URL_KEY, (url || DEFAULT_GS_URL).trim());
        updateCloudMenuBadge('idle');
    }

    // Cập nhật Badge Trạng Thái & Tiến Trình ở Góc Trên Bên Phải Màn Hình
    function updateCloudMenuBadge(status) {
        let badge = document.getElementById('cloudSyncMenuBadge');
        if (!badge) {
            badge = document.createElement('div');
            badge.id = 'cloudSyncMenuBadge';
            badge.style.cssText = `
                position: fixed !important;
                top: 14px !important;
                right: 18px !important;
                z-index: 9999999 !important;
                font-family: 'Segoe UI', Arial, sans-serif !important;
                font-size: 13px !important;
                padding: 7px 16px !important;
                border-radius: 20px !important;
                background: rgba(255, 255, 255, 0.98) !important;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(25, 118, 210, 0.2) !important;
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                font-weight: 700 !important;
                cursor: pointer !important;
                backdrop-filter: blur(8px) !important;
                transition: all 0.3s ease !important;
                user-select: none !important;
            `;
            badge.onclick = function() {
                window.location.href = 'setup.html';
            };
            
            // Gắn badge vào DOM an toàn
            const target = document.body || document.documentElement;
            if (target) target.appendChild(badge);
        }

        const url = getScriptUrl();
        if (!url) {
            badge.style.background = '#ffebee';
            badge.style.color = '#c62828';
            badge.innerHTML = '⚠️ <span>Chưa kết nối máy chủ dữ liệu</span>';
            return;
        }

        if (status === 'syncing_push') {
            badge.style.background = 'linear-gradient(90deg, #fff3e0 0%, #ffe0b2 100%)';
            badge.style.color = '#e65100';
            badge.style.boxShadow = '0 4px 20px rgba(230, 81, 0, 0.35)';
            badge.innerHTML = `<span style="display:inline-block;animation:spin 1s linear infinite;">🔄</span> <span>Đang lưu dữ liệu...</span>`;
        } else if (status === 'syncing_pull') {
            badge.style.background = 'linear-gradient(90deg, #e1f5fe 0%, #b3e5fc 100%)';
            badge.style.color = '#0277bd';
            badge.style.boxShadow = '0 4px 20px rgba(2, 119, 189, 0.35)';
            badge.innerHTML = `<span style="display:inline-block;animation:spin 1s linear infinite;">🔄</span> <span>Đang cập nhật dữ liệu...</span>`;
        } else if (status === 'success') {
            const timeStr = new Date().toLocaleTimeString('vi-VN');
            badge.style.background = 'linear-gradient(90deg, #e8f5e9 0%, #c8e6c9 100%)';
            badge.style.color = '#2e7d32';
            badge.style.boxShadow = '0 4px 20px rgba(46, 125, 50, 0.35)';
            badge.innerHTML = `✅ <span>Đã lưu thành công (${timeStr})</span>`;
            setTimeout(() => updateCloudMenuBadge('idle'), 4000);
        } else if (status === 'error') {
            badge.style.background = '#ffebee';
            badge.style.color = '#c62828';
            badge.style.boxShadow = '0 4px 20px rgba(198, 40, 40, 0.35)';
            badge.innerHTML = `⚠️ <span>Ngoại tuyến / Gián đoạn máy chủ</span>`;
        } else {
            const lastSync = localStorage.getItem('lastGoogleSheetsSync');
            badge.style.background = 'rgba(255, 255, 255, 0.98)';
            badge.style.color = '#1976d2';
            badge.style.boxShadow = '0 4px 14px rgba(25, 118, 210, 0.2)';
            badge.innerHTML = `🟢 <span>Tự động đồng bộ</span>`;
            badge.title = lastSync ? `Lần cập nhật gần nhất: ${lastSync}` : 'Tự động đồng bộ realtime';
        }
    }

    // Thêm animation xoay xoay cho spinner
    if (!document.getElementById('cloudSyncAnimationStyles')) {
        const style = document.createElement('style');
        style.id = 'cloudSyncAnimationStyles';
        style.innerHTML = `
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `;
        (document.head || document.documentElement).appendChild(style);
    }

    let lastLocalEditTime = 0; // Mốc thời gian khi người dùng thao tác xóa/sửa trên Web
    let lastCloudSyncTime = 0; // Mốc thời gian Cloud được cập nhật thành công

    /**
     * 1. TỰ ĐỘNG ĐẨY DỮ LIỆU LÊN GOOGLE SHEETS (GHI ĐÈ DỮ LIỆU MỚI NHẤT/XÓA LÊN CLOUD)
     */
    async function pushAllToGoogleSheets(isSilent = true) {
        if (isInternalSyncing) return false;
        const url = getScriptUrl();
        if (!url) return false;

        updateCloudMenuBadge('syncing_push');

        try {
            const dataPayload = (typeof getExportData === 'function') ? getExportData() : {};
            const payload = {
                action: 'syncAll',
                storeName: localStorage.getItem('storeName') || 'TimePro HRM Store',
                updatedAt: new Date().toISOString(),
                data: dataPayload
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result && result.status === 'success') {
                lastCloudSyncTime = Date.now();
                localStorage.setItem('lastGoogleSheetsSync', new Date().toLocaleString('vi-VN'));
                updateCloudMenuBadge('success');
                return true;
            } else {
                updateCloudMenuBadge('error');
                return false;
            }
        } catch (err) {
            console.warn('Lỗi tự động lưu Google Sheets:', err);
            updateCloudMenuBadge('error');
            return false;
        }
    }

    /**
     * 2. TỰ ĐỘNG TẢI DỮ LIỆU VỀ (CHỈ TẢI KHI KHÔNG CÓ THAO TÁC XÓA/SỬA ĐANG ĐỜI ĐẨY)
     */
    async function pullAllFromGoogleSheets(isSilent = true) {
        const url = getScriptUrl();
        if (!url) return false;

        // NẾU WEB VỪA CÓ THAO TÁC XÓA/SỬA CHƯA ĐẨY XONG ➔ ƯU TIÊN ĐẨY LÊN TRƯỚC, KHÔNG TẢI ĐÈ VỀ
        if (lastLocalEditTime > lastCloudSyncTime) {
            await pushAllToGoogleSheets(true);
            return true;
        }

        updateCloudMenuBadge('syncing_pull');

        try {
            isInternalSyncing = true;
            const fetchUrl = `${url}?action=getAll&t=${Date.now()}`;
            const response = await fetch(fetchUrl);
            const result = await response.json();

            if (result && result.status === 'success' && result.data) {
                const incomingData = result.data;
                let hasChanges = false;

                if (incomingData.employees && Array.isArray(incomingData.employees)) {
                    // 1. TRƯNG DỤNG BẢO TỒN DỮ LIỆU LOCAL SẴN CÓ TRÊN TRANG (DANH SÁCH NHÂN VIÊN)
                    const uniqueEmpMap = {};

                    let existingLocalEmps = [];
                    try {
                        const rawEmp = localStorage.getItem('employees') || localStorage.getItem('nhanvien') || localStorage.getItem('employees_backup') || localStorage.getItem('employees_permanent_backup');
                        existingLocalEmps = JSON.parse(rawEmp || '[]');
                    } catch (e) {}

                    if (Array.isArray(existingLocalEmps)) {
                        existingLocalEmps.forEach(e => {
                            if (e && (e.id || e.maNV)) {
                                uniqueEmpMap[String(e.id || e.maNV).trim()] = e;
                            }
                        });
                    }

                    const localEmpCount = Object.keys(uniqueEmpMap).length;

                    // Nếu Cloud trả về mảng rỗng mà Local đang có dữ liệu nhân viên cũ -> ĐẨY DỮ LIỆU LOCAL CŨ LÊN CLOUD
                    if (incomingData.employees.length === 0 && localEmpCount > 0) {
                        isInternalSyncing = false;
                        pushAllToGoogleSheets(true);
                        return true;
                    }

                    // 2. HỢP NHẤT DỮ LIỆU TỪ CLOUD VÀO LOCAL (Giữ lại tất cả nhân viên local hiện có)
                    incomingData.employees.forEach(e => {
                        if (e && (e.id || e.maNV)) {
                            const id = String(e.id || e.maNV).trim();
                            if (uniqueEmpMap[id]) {
                                // Hợp nhất thuộc tính: giữ lại thông tin local nếu Cloud bị thiếu
                                uniqueEmpMap[id] = Object.assign({}, uniqueEmpMap[id], e);
                            } else {
                                uniqueEmpMap[id] = e;
                            }
                        }
                    });

                    const cleanedEmps = Object.values(uniqueEmpMap);
                    const cleanedStr = JSON.stringify(cleanedEmps);
                    if (cleanedStr !== localStorage.getItem('employees')) {
                        originalSetItem.call(localStorage, 'employees', cleanedStr);
                        originalSetItem.call(localStorage, 'nhanvien', cleanedStr);
                        hasChanges = true;
                    }

                    // Nếu số lượng nhân viên sau khi hợp nhất nhiều hơn trên Cloud (do có NV cũ từ Local) -> Tự động đẩy lên Cloud
                    if (cleanedEmps.length > incomingData.employees.length) {
                        pushAllToGoogleSheets(true);
                    }
                }
                const syncKeysToPull = [
                    'attendanceByMonth', 'payrollInputs', 'payrollData', 'workSchedules',
                    'shiftsByEmp', 'shiftsByEmpByMonth', 'workFactorByMonth', 'holidayDaysByMonth',
                    'overtimeByMonth', 'paidLeaveDaysByMonth', 'unpaidLeaveDaysByMonth',
                    'leaveNotesByMonth', 'salaryExtrasByEmpMonth', 'tcByEmpMonth',
                    'revenueByEmpByMonth', 'manualSalaryEdits', 'scheduleShiftsByMonth',
                    'workScheduleWeekTemplate'
                ];
                syncKeysToPull.forEach(k => {
                    if (incomingData[k]) {
                        let localVal = {};
                        try {
                            localVal = JSON.parse(localStorage.getItem(k) || '{}');
                        } catch (e) {}
                        
                        let mergedVal;
                        if (Array.isArray(incomingData[k]) && Array.isArray(localVal)) {
                            mergedVal = incomingData[k].length > 0 ? incomingData[k] : localVal;
                        } else if (typeof incomingData[k] === 'object' && incomingData[k] !== null && typeof localVal === 'object' && localVal !== null) {
                            mergedVal = Object.assign({}, localVal, incomingData[k]);
                        } else {
                            mergedVal = incomingData[k];
                        }
                        
                        const mergedStr = JSON.stringify(mergedVal);
                        if (mergedStr !== localStorage.getItem(k)) {
                            originalSetItem.call(localStorage, k, mergedStr);
                            hasChanges = true;
                        }
                    }
                });

                lastCloudSyncTime = Date.now();
                localStorage.setItem('lastGoogleSheetsSync', new Date().toLocaleString('vi-VN'));
                updateCloudMenuBadge('success');
                
                isInternalSyncing = false;

                if (hasChanges) {
                    window.dispatchEvent(new CustomEvent('cloudDataPulled', { detail: incomingData }));
                    const isTyping = document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
                    if (!isTyping && (window.location.pathname.includes('emp.html') || window.location.pathname.includes('att.html') || window.location.pathname.includes('bangluong.html'))) {
                        // Gọi hàm render của trang nếu có, tránh reload full trang gây lag
                        if (typeof renderAttendance === 'function') {
                            try { renderAttendance(); } catch (e) {}
                        } else if (typeof renderEmpTable === 'function') {
                            try { renderEmpTable(); } catch (e) {}
                        } else {
                            location.reload();
                        }
                    }
                }

                return true;
            } else {
                isInternalSyncing = false;
                updateCloudMenuBadge('error');
                return false;
            }
        } catch (err) {
            isInternalSyncing = false;
            console.warn('Lỗi tự động tải từ Cloud:', err);
            updateCloudMenuBadge('error');
            return false;
        }
    }

    /**
     * Tự động đẩy lên tức thì (Debounced 300ms)
     */
    function triggerAutoSync() {
        if (isInternalSyncing || !getScriptUrl()) return;
        lastLocalEditTime = Date.now(); // Ghi nhận mốc thời gian vừa có thao tác xóa/sửa trên Web
        clearTimeout(syncDebounceTimer);
        updateCloudMenuBadge('syncing_push');
        syncDebounceTimer = setTimeout(() => {
            pushAllToGoogleSheets(true);
        }, 300);
    }

    /**
     * Ghi đè localStorage.setItem
     */
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
        originalSetItem.apply(this, arguments);
        if (isInternalSyncing) return;
        const autoSyncKeys = [
            'employees', 
            'attendanceByMonth', 
            'payrollInputs', 
            'payrollData', 
            'workSchedules', 
            'shiftsByEmp', 
            'shiftsByEmpByMonth',
            'workDaysStd', 
            'salaryPerDay',
            'salaryExtrasByEmpMonth', 
            'tcByEmpMonth', 
            'revenueByEmpByMonth', 
            'manualSalaryEdits',
            'scheduleShiftsByMonth',
            'workScheduleWeekTemplate',
            'workFactorByMonth',
            'holidayDaysByMonth',
            'overtimeByMonth',
            'paidLeaveDaysByMonth',
            'unpaidLeaveDaysByMonth',
            'leaveNotesByMonth'
        ];
        if (autoSyncKeys.includes(key) || key.startsWith('workDaysStd_') || key.startsWith('salaryPerDay_') || key.startsWith('note_')) {
            triggerAutoSync();
        }
    };

    window.addEventListener('beforeunload', () => {
        if (syncDebounceTimer) {
            clearTimeout(syncDebounceTimer);
            pushAllToGoogleSheets(true);
        }
    });

    document.addEventListener('change', (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT')) {
            triggerAutoSync();
        }
    });

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('service-worker.js').catch(() => {});
        });
    }

    /**
     * CHẾ ĐỘ 100% CLOUD DATA MODE - GOOGLE SHEETS LÀ NGUỒN DỮ LIỆU CHÍNH
     */
    async function initSyncSystem() {
        updateCloudMenuBadge('idle');

        // Tự động sao lưu dữ liệu local cũ sẵn có trước khi thực hiện kéo/đẩy cloud
        try {
            const rawEmp = localStorage.getItem('employees') || localStorage.getItem('nhanvien') || localStorage.getItem('employees_backup');
            if (rawEmp) {
                const parsed = JSON.parse(rawEmp);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    originalSetItem.call(localStorage, 'employees_permanent_backup', JSON.stringify(parsed));
                }
            }
        } catch(e) {}

        // Tự động dọn dẹp danh sách trùng lặp ID đang có trên máy
        try {
            const rawLocal = JSON.parse(localStorage.getItem('employees') || '[]');
            if (Array.isArray(rawLocal) && rawLocal.length > 0) {
                const map = {};
                rawLocal.forEach(e => {
                    if (e && (e.id || e.maNV)) map[String(e.id || e.maNV).trim()] = e;
                });
                const cleaned = Object.values(map);
                if (cleaned.length !== rawLocal.length) {
                    originalSetItem.call(localStorage, 'employees', JSON.stringify(cleaned));
                }
            }
        } catch (err) {}

        if (!document.querySelector('link[rel="manifest"]')) {
            const manifestLink = document.createElement('link');
            manifestLink.rel = 'manifest';
            manifestLink.href = 'manifest.json';
            (document.head || document.documentElement).appendChild(manifestLink);
        }

        // 1. LUÔN LUÔN KÉO DỮ LIỆU MỚI NHẤT TỪ CLOUD TRƯỚC TIÊN KHI VỪA MỞ TRANG
        setTimeout(async () => {
            await pullAllFromGoogleSheets(true);
        }, 200);

        // 2. Tự động kiểm tra và làm mới dữ liệu từ Cloud mỗi 15 giây (Realtime Polling)
        setInterval(() => {
            if (!document.hidden) {
                pullAllFromGoogleSheets(true);
            }
        }, 15000);

        // 3. Tự động tải mới từ Cloud ngay khi quay lại Tab ứng dụng
        window.addEventListener('focus', () => {
            pullAllFromGoogleSheets(true);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSyncSystem);
    } else {
        initSyncSystem();
    }

    window.GoogleSheetsSync = {
        getScriptUrl,
        setScriptUrl,
        pushAllToGoogleSheets,
        pullAllFromGoogleSheets,
        triggerAutoSync
    };

})(window);
