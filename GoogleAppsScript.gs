/**
 * Google Apps Script - TimePro HRM Backend V7 (BỔ SUNG HỆ SỐ HS, PL, KL, TĂNG CA TC, DEDUPLICATION)
 * - Tự động bổ sung chi tiết Hệ số (HS), Phép có lương (PL), Nghỉ không lương (KL), Tăng ca (TC) vào Sheet BangChamCong.
 * - Tự động lọc sạch trùng lặp trùng ID nhân viên (Mỗi Mã NV chỉ tồn tại duy nhất 1 dòng).
 * - Xóa sạch bảng cũ trước khi ghi đè bản mới.
 */

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var action = contents.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'syncAll') {
      saveAllDataToSheets(ss, contents.data);
      return createJsonResponse({ status: 'success', message: 'Đồng bộ V7 (HS, PL, KL, TC & Lọc trùng ID) thành công!' });
    } 
    else if (action === 'addAttendance') {
      saveAttendanceRecord(ss, contents.record);
      return createJsonResponse({ status: 'success', message: 'Đã lưu bản ghi chấm công!' });
    }

    return createJsonResponse({ status: 'error', message: 'Hành động không hợp lệ' });
  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

function doGet(e) {
  try {
    var action = e.parameter.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'getAll') {
      var data = getAllDataFromSheets(ss);
      return createJsonResponse({ status: 'success', data: data });
    }

    return createJsonResponse({ status: 'success', message: 'Google Sheets API TimePro HRM V7 đang hoạt động!' });
  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

// ------------------- HÀM XỬ LÝ QUẢN LÝ BẢNG TÍNH LỌC TRÙNG -------------------

function prepareCleanSheet(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear(); // XÓA SẠCH DỮ LIỆU CŨ VÀ ĐỊNH DẠNG CŨ
  }
  if (headers && headers.length > 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#1976d2").setFontColor("#ffffff");
  }
  return sheet;
}

function saveAllDataToSheets(ss, data) {
  if (!data) return;

  // LỌC TRÙNG LẶP NHÂN VIÊN THEO MÃ NV (ID DEDUP)
  var rawEmployees = data.employees || [];
  var uniqueEmpMap = {};
  rawEmployees.forEach(function(emp) {
    if (emp && (emp.id || emp.maNV)) {
      var id = String(emp.id || emp.maNV).trim();
      uniqueEmpMap[id] = emp;
    }
  });

  var employees = [];
  var empMap = {};
  Object.keys(uniqueEmpMap).forEach(function(id) {
    var emp = uniqueEmpMap[id];
    employees.push(emp);
    empMap[id] = emp.name || emp.tenNV || id;
  });

  // 1. BẢNG DANH SÁCH NHÂN VIÊN (LỌC TRÙNG ID)
  var empHeaders = ["Mã NV (ID)", "Họ và Tên", "Chức Vụ", "Cửa Hàng", "Hình Thức Trả Lương", "Lương Cơ Bản / Ngày (VND)", "Số Điện Thoại", "Trạng Thái"];
  var empSheet = prepareCleanSheet(ss, "DanhSachNhanVien", empHeaders);
  employees.forEach(function(emp) {
    var salaryTypeStr = (emp.salary_type === 'shift' || emp.salaryType === 'shift') ? 'Theo Ca' : 
                        ((emp.salary_type === 'hourly' || emp.salaryType === 'hourly') ? 'Theo Giờ' : 'Lương Tháng/Cơ Bản');
    var baseSalaryVal = emp.base_salary || emp.baseSalary || emp.salaryPerDay || emp.salary || 0;

    empSheet.appendRow([
      emp.id || '',
      emp.name || '',
      emp.role || 'Nhân viên',
      emp.store || data.storeName || '',
      salaryTypeStr,
      baseSalaryVal,
      emp.phone || '',
      emp.hidden ? 'Đã ẩn' : 'Hoạt động'
    ]);
  });

  // 2. BẢNG CHẤM CÔNG THÁNG (BAO GỒM ĐI LÀM, PL, KL, TĂNG CA TC, HỆ SỐ HS)
  var attData = data.attendanceByMonth || {};
  var plData = data.paidLeaveDaysByMonth || {};
  var klData = data.unpaidLeaveDaysByMonth || {};
  var tcData = data.overtimeByMonth || {};
  var factorData = data.workFactorByMonth || {};

  var allMonthsSet = {};
  [attData, plData, klData, tcData, factorData].forEach(function(obj) {
    if (obj) {
      Object.keys(obj).forEach(function(m) { allMonthsSet[m] = true; });
    }
  });
  var attMonths = Object.keys(allMonthsSet);

  var attHeaders = [
    "Tháng", "Mã NV", "Tên Nhân Viên", 
    "Số Ngày Đi Làm", "Số Ngày Phép Có Lương (PL)", "Số Ngày Nghỉ Không Lương (KL)", "Tổng Giờ Tăng Ca (TC)", "Chi Tiết Chấm Công (1-31)"
  ];
  var attSheet = prepareCleanSheet(ss, "BangChamCong", attHeaders);

  attMonths.forEach(function(month) {
    var mAtt = attData[month] || {};
    var mPl = plData[month] || {};
    var mKl = klData[month] || {};
    var mTc = tcData[month] || {};
    var mFactor = factorData[month] || {};

    var allEmpIdsInMonth = {};
    [mAtt, mPl, mKl, mTc, mFactor].forEach(function(obj) {
      if (obj) {
        Object.keys(obj).forEach(function(id) { if (empMap[id]) allEmpIdsInMonth[id] = true; });
      }
    });

    Object.keys(allEmpIdsInMonth).forEach(function(empId) {
      var daysObj = mAtt[empId] || {};
      var plArr = mPl[empId] || [];
      var klArr = mKl[empId] || [];
      var tcObj = mTc[empId] || {};
      var factorObj = mFactor[empId] || {};

      var daysWorkCount = 0;
      var totalTcHours = 0;
      var dayDetails = [];

      for (var d = 1; d <= 31; d++) {
        var dayStr = String(d);
        var notes = [];

        // Kiểm tra đi làm
        var val = daysObj[d] || daysObj[dayStr];
        if (val) {
          if (Array.isArray(val) && val.length > 0) {
            daysWorkCount += 1;
            notes.push("Đi làm (Ca: " + val.join(',') + ")");
          } else if (typeof val === 'string' || typeof val === 'number') {
            daysWorkCount += 1;
            notes.push("Đi làm");
          }
        }

        // Kiểm tra PL
        if (plArr.indexOf(d) !== -1 || plArr.indexOf(Number(d)) !== -1) {
          notes.push("Phép có lương (PL)");
        }
        // Kiểm tra KL
        if (klArr.indexOf(d) !== -1 || klArr.indexOf(Number(d)) !== -1) {
          notes.push("Nghỉ không lương (KL)");
        }
        // Kiểm tra Tăng ca TC
        var tcItem = tcObj[d] || tcObj[dayStr];
        if (tcItem && tcItem.checked && Number(tcItem.hours) > 0) {
          totalTcHours += Number(tcItem.hours);
          notes.push("Tăng ca " + tcItem.hours + "h");
        }
        // Kiểm tra Hệ số HS
        var fKey = d + "_0";
        if (factorObj[fKey] && Number(factorObj[fKey]) !== 1) {
          notes.push("HS:" + factorObj[fKey]);
        }

        if (notes.length > 0) {
          dayDetails.push("N" + d + ": " + notes.join(' + '));
        }
      }

      attSheet.appendRow([
        month,
        empId,
        empMap[empId] || empId,
        daysWorkCount,
        plArr.length,
        klArr.length,
        totalTcHours,
        dayDetails.join(' | ')
      ]);
    });
  });

  // 3. BẢNG LƯƠNG & TẠM ỨNG
  var payrollInputs = data.payrollInputs || {};
  var payrollData = data.payrollData || {};
  var payrollSheet = prepareCleanSheet(ss, "BangLuong", ["Tháng", "Mã NV", "Tên Nhân Viên", "Lương Cơ Bản/Ca", "Ngày Công Thực Tế", "Tạm Ứng", "Thưởng/Phụ Cấp", "Phạt", "Thực Lĩnh (VND)"]);

  var allEmpIds = Object.keys(empMap);
  allEmpIds.forEach(function(empId) {
    var empInputs = payrollInputs[empId] || {};
    var empSalary = payrollData[empId] || {};

    Object.keys(empInputs).forEach(function(month) {
      var inp = empInputs[month] || {};
      var sal = empSalary[month] || {};

      payrollSheet.appendRow([
        month,
        empId,
        empMap[empId] || empId,
        sal.baseSalary || 0,
        sal.workDays || inp.workDays || 0,
        inp.advance || 0,
        inp.bonus || sal.bonus || 0,
        inp.penalty || sal.penalty || 0,
        sal.netSalary || sal.totalSalary || 0
      ]);
    });
  });

  // Cập nhật lại data đã lọc trùng nhân viên vào SystemBackup
  data.employees = employees;

  // 4. SAO LƯU DỮ LIỆU GỐC (SystemBackup)
  var sysSheet = prepareCleanSheet(ss, "SystemBackup", ["Key", "Value", "Cập Nhật"]);
  sysSheet.appendRow(["RAW_FULL_JSON", JSON.stringify(data), new Date().toLocaleString('vi-VN')]);
  sysSheet.appendRow(["STORE_NAME", data.storeName || '', new Date().toLocaleString('vi-VN')]);
}

function getAllDataFromSheets(ss) {
  var result = {};
  
  // 1. Đọc dữ liệu từ SystemBackup
  var sysSheet = ss.getSheetByName("SystemBackup");
  if (sysSheet) {
    var data = sysSheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === "RAW_FULL_JSON") {
        try {
          result = JSON.parse(data[i][1]);
        } catch (e) {}
      }
    }
  }

  // 2. Lọc trùng lặp ID nhân viên từ Sheet DanhSachNhanVien
  var empSheet = ss.getSheetByName("DanhSachNhanVien");
  if (empSheet && empSheet.getLastRow() > 1) {
    var empValues = empSheet.getDataRange().getValues();
    var empUniqueMap = {};
    for (var r = 1; r < empValues.length; r++) {
      var row = empValues[r];
      if (row[0] && row[1]) {
        var empId = String(row[0]).trim();
        var salTypeStr = String(row[4] || '').trim();
        var salType = salTypeStr.indexOf('Ca') !== -1 ? 'shift' : (salTypeStr.indexOf('Giờ') !== -1 ? 'hourly' : 'base');
        
        // CHỈ GIỮ 1 BẢN GHI DUY NHẤT CHO MỖI MÃ NV (ID)
        if (!empUniqueMap[empId]) {
          empUniqueMap[empId] = {
            id: empId,
            name: String(row[1]).trim(),
            role: String(row[2] || 'Nhân viên').trim(),
            store: String(row[3] || '').trim(),
            salary_type: salType,
            base_salary: Number(String(row[5]).replace(/[^\d]/g, '')) || 0,
            phone: String(row[6] || '').trim(),
            hidden: String(row[7]).trim() === 'Đã ẩn'
          };
        }
      }
    }
    result.employees = Object.values(empUniqueMap);
  }

  return result;
}

function saveAttendanceRecord(ss, record) {
  var sheet = ss.getSheetByName("NhatKyChamCong");
  if (!sheet) {
    sheet = ss.insertSheet("NhatKyChamCong");
    sheet.appendRow(["Thời Gian", "Ngày", "Giờ", "Mã NV", "Tên Nhân Viên", "Ca Làm", "Hình Thức", "Cửa Hàng"]);
    sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#1976d2").setFontColor("#ffffff");
  }
  sheet.appendRow([
    record.timestamp || '',
    record.date || '',
    record.time || '',
    record.empId || '',
    record.empName || '',
    record.shiftName || '',
    record.method || '',
    record.storeName || ''
  ]);
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
