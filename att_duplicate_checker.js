(function() {
    // Lấy dữ liệu từ localStorage
    const employees = JSON.parse(localStorage.getItem('employees') || '[]').filter(e => !e.hidden);
    const attendanceByMonth = JSON.parse(localStorage.getItem('attendanceByMonth') || '{}');
    const shiftsByEmpByMonth = JSON.parse(localStorage.getItem('shiftsByEmpByMonth') || '{}');

    // Lấy danh sách cửa hàng duy nhất
    function getStoreList() {
        const stores = {};
        for (const e of employees) {
            if (e.store && e.store.trim()) stores[e.store.trim()] = true;
        }
        return Object.keys(stores);
    }

    // Hàm kiểm tra công trùng giữa các nhân viên trong tháng hiện tại, theo cửa hàng
    function checkDuplicateAttendance(storeFilter) {
        // Lấy tháng hiện tại từ input hoặc theo ngày hệ thống
        let month = document.getElementById('attMonth')?.value;
        if (!month) {
            const now = new Date();
            month = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
        }
        let [year, monthNum] = month.split('-').map(Number);
        const days = new Date(year, monthNum, 0).getDate();

        // Lọc nhân viên theo cửa hàng nếu có filter
        let filteredEmps = employees;
        if (storeFilter && storeFilter !== '__ALL__') {
            filteredEmps = employees.filter(e => (e.store || '') === storeFilter);
        }

        // Map: { 'day_shift': [empId, ...] }
        const map = {};
        for (const emp of filteredEmps) {
            const empId = emp.id;
            const att = attendanceByMonth[month]?.[empId] || {};
            for (let d = 1; d <= days; ++d) {
                const shifts = att[d];
                if (Array.isArray(shifts)) {
                    for (const s of shifts) {
                        const key = `${d}_${s}`;
                        if (!map[key]) map[key] = [];
                        map[key].push(empId);
                    }
                }
            }
        }

        // Tìm các trường hợp trùng (cùng ca, cùng ngày, nhiều nhân viên)
        let result = [];
        for (const key in map) {
            if (map[key].length > 1) {
                const [day, shiftIdx] = key.split('_').map(Number);
                const empNames = map[key].map(id => {
                    const emp = employees.find(e => e.id == id);
                    return emp ? emp.name : id;
                });
                // Lấy tên ca và khung giờ
                let shiftName = '', shiftTime = '';
                for (const id of map[key]) {
                    const shifts = shiftsByEmpByMonth[month]?.[id] || [];
                    if (shifts[shiftIdx]) {
                        shiftName = shifts[shiftIdx].name || `Ca ${shiftIdx+1}`;
                        let start = shifts[shiftIdx].start || '--:--';
                        let end = shifts[shiftIdx].end || '--:--';
                        shiftTime = `${start} - ${end}`;
                        break;
                    }
                }
                // Ghi rõ ngày/tháng/năm, ca, khung giờ
                result.push(
                    `Ngày ${String(day).padStart(2, '0')}/${String(monthNum).padStart(2, '0')}/${year}, ` +
                    `Ca "${shiftName}" (${shiftTime}): ${empNames.join(', ')}`
                );
            }
        }

        // Hiển thị kết quả
        showDuplicateAttendanceResult(result, storeFilter);
    }

    // Hàm hiển thị popup kết quả, thêm dropdown chọn cửa hàng và hỗ trợ kéo thả
    function showDuplicateAttendanceResult(list, storeFilter) {
        let modal = document.getElementById('attDupCheckerModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'attDupCheckerModal';
            modal.style = 'position:fixed;z-index:99999;left:0;top:0;width:100vw;height:100vh;background:#0005;';
            modal.innerHTML = `
                <div id="attDupCheckerDialog" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#fff;padding:24px 20px 16px 20px;border-radius:10px;max-width:540px;box-shadow:0 4px 24px #8e24aa40;min-width:340px;min-height:120px;cursor:move;">
                    <div id="attDupCheckerHeader" style="cursor:move;-webkit-user-select:none;user-select:none;">
                        <h3 style="margin:0 0 8px 0;color:#8e24aa;font-size:20px;">Kết quả kiểm tra công trùng</h3>
                    </div>
                    <div style="margin-bottom:10px;">
                        <label style="font-weight:600;color:#1976d2;">Chọn cửa hàng: </label>
                        <select id="attDupCheckerStoreSel" style="font-size:15px;padding:4px 12px;border-radius:6px;border:1.5px solid #b3d1f7;">
                            <option value="__ALL__">--Tất cả--</option>
                        </select>
                    </div>
                    <div id="attDupCheckerResult" style="max-height:320px;overflow:auto;font-size:15px;color:#d32f2f;"></div>
                    <div style="margin-top:14px;text-align:right;">
                        <button style="background:#8e24aa;color:#fff;border:none;padding:8px 24px;border-radius:6px;font-size:1rem;font-weight:500;cursor:pointer;" onclick="document.getElementById('attDupCheckerModal').remove()">Đóng</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Thêm sự kiện đổi cửa hàng
            setTimeout(() => {
                const sel = document.getElementById('attDupCheckerStoreSel');
                const stores = getStoreList();
                for (const s of stores) {
                    const opt = document.createElement('option');
                    opt.value = s;
                    opt.textContent = s;
                    sel.appendChild(opt);
                }
                sel.value = storeFilter || '__ALL__';
                sel.onchange = function() {
                    checkDuplicateAttendance(this.value);
                };
            }, 0);

            // Kéo thả cửa sổ
            makeDialogDraggable(document.getElementById('attDupCheckerDialog'), document.getElementById('attDupCheckerHeader'));
        } else {
            // Nếu đã có modal, chỉ cập nhật dropdown và kết quả
            const sel = document.getElementById('attDupCheckerStoreSel');
            if (sel) sel.value = storeFilter || '__ALL__';
        }
        const resultDiv = document.getElementById('attDupCheckerResult');
        if (list.length === 0) {
            resultDiv.innerHTML = '<div style="color:#388e3c;">Không phát hiện công trùng giữa các nhân viên trong tháng này.</div>';
        } else {
            resultDiv.innerHTML = list.map(x => `<div style="margin-bottom:8px;">${x}</div>`).join('');
        }
        modal.style.display = '';
    }

    // Hàm hỗ trợ kéo thả dialog
    function makeDialogDraggable(dialog, handle) {
        let isDragging = false, startX = 0, startY = 0, origX = 0, origY = 0;
        handle = handle || dialog;
        handle.onmousedown = function(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            // Lấy vị trí hiện tại của dialog
            const rect = dialog.getBoundingClientRect();
            origX = rect.left;
            origY = rect.top;
            dialog.style.transition = 'none';
            document.onmousemove = function(ev) {
                if (!isDragging) return;
                let dx = ev.clientX - startX;
                let dy = ev.clientY - startY;
                dialog.style.left = (origX + dx) + 'px';
                dialog.style.top = (origY + dy) + 'px';
                dialog.style.transform = 'none';
                dialog.style.right = '';
                dialog.style.bottom = '';
                dialog.style.margin = '0';
                dialog.style.position = 'absolute';
            };
            document.onmouseup = function() {
                isDragging = false;
                document.onmousemove = null;
                document.onmouseup = null;
            };
            e.preventDefault();
        };
    }

    // Thêm nút tiện ích vào trang (chỉ thêm nếu chưa có)
    function addCheckerButton() {
        if (document.getElementById('attDupCheckerBtn')) return;
        const btn = document.createElement('button');
        btn.id = 'attDupCheckerBtn';
        btn.textContent = 'Kiểm Tra Công';
        btn.style = 'position:fixed;bottom:24px;left:24px;z-index:99999;background:#8e24aa;color:#fff;padding:12px 22px;border:none;border-radius:8px;font-size:16px;font-weight:600;box-shadow:0 2px 12px #8e24aa40;cursor:pointer;';
        btn.onclick = function() { checkDuplicateAttendance('__ALL__'); };
        document.body.appendChild(btn);
    }

    // Tự động thêm nút khi trang sẵn sàng
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        addCheckerButton();
    } else {
        window.addEventListener('DOMContentLoaded', addCheckerButton);
    }

    // Expose cho console nếu cần
    window.checkDuplicateAttendance = function() { checkDuplicateAttendance('__ALL__'); };
})();
