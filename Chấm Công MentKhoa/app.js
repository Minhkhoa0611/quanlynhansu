const allCalendarsEl = document.getElementById('all-calendars');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('closeBtn');
const saveBtn = document.getElementById('saveBtn');
const modalDate = document.getElementById('modal-date');
const workShift = document.getElementById('workShift');
const overtime = document.getElementById('overtime');
const jumpMonth = document.getElementById('jumpMonth');
const jumpYear = document.getElementById('jumpYear');
const jumpBtn = document.getElementById('jumpBtn');

let selectedDate = null;
const STORAGE_KEY = 'attendanceData';

const MONTHS = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
];

function getAttendanceData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
}

function setAttendanceData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function fillJumpSelects(year) {
    jumpMonth.innerHTML = '';
    for (let i = 0; i < 12; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = MONTHS[i];
        jumpMonth.appendChild(opt);
    }
    jumpYear.innerHTML = '';
    for (let y = year - 5; y <= year + 5; y++) {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        if (y === year) opt.selected = true;
        jumpYear.appendChild(opt);
    }
}

function renderAllCalendars(year) {
    allCalendarsEl.innerHTML = '';

    // Thêm tháng 12 của năm trước
    const prevYear = year - 1;
    const calendarBoxPrev = document.createElement('div');
    calendarBoxPrev.className = 'calendar-box';
    calendarBoxPrev.id = `calendar-${prevYear}-11`;

    const titlePrev = document.createElement('div');
    titlePrev.className = 'calendar-title';
    titlePrev.textContent = `Tháng 12 / ${prevYear}`;
    calendarBoxPrev.appendChild(titlePrev);

    const calendarElPrev = document.createElement('div');
    calendarElPrev.className = 'calendar';
    renderCalendar(prevYear, 11, calendarElPrev);
    calendarBoxPrev.appendChild(calendarElPrev);

    allCalendarsEl.appendChild(calendarBoxPrev);

    // 12 tháng của năm hiện tại
    for (let month = 0; month < 12; month++) {
        const calendarBox = document.createElement('div');
        calendarBox.className = 'calendar-box';
        calendarBox.id = `calendar-${year}-${month}`;

        const title = document.createElement('div');
        title.className = 'calendar-title';
        title.textContent = `${MONTHS[month]} / ${year}`;
        calendarBox.appendChild(title);

        const calendarEl = document.createElement('div');
        calendarEl.className = 'calendar';
        renderCalendar(year, month, calendarEl);
        calendarBox.appendChild(calendarEl);

        allCalendarsEl.appendChild(calendarBox);
    }
}

function renderCalendar(year, month, calendarEl) {
    const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    daysOfWeek.forEach(d => {
        const header = document.createElement('div');
        header.className = 'day-header';
        header.textContent = d;
        calendarEl.appendChild(header);
    });

    let firstDay = new Date(year, month, 1).getDay();
    firstDay = (firstDay === 0) ? 6 : firstDay - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
    const data = getAttendanceData();

    // Ngày tháng trước (làm mờ)
    for (let i = firstDay - 1; i >= 0; i--) {
        const d = daysInPrevMonth - i;
        const dateStr = `${prevYear}-${String(prevMonth+1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day other-month';
        dayDiv.textContent = d;
        if (data[dateStr]?.workShift) dayDiv.classList.add('has-attendance');
        if (data[dateStr]?.overtime) dayDiv.classList.add('has-overtime');
        dayDiv.onclick = () => {
            renderAllCalendars(prevYear);
            openModal(dateStr, prevYear, prevMonth);
        };
        calendarEl.appendChild(dayDiv);
    }

    // Ngày tháng hiện tại
    const today = new Date();
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month+1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.textContent = d;

        if (data[dateStr]?.workShift) dayDiv.classList.add('has-attendance');
        if (data[dateStr]?.overtime) dayDiv.classList.add('has-overtime');
        if (
            d === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            dayDiv.classList.add('selected');
        }

        dayDiv.onclick = () => openModal(dateStr, year, month);
        calendarEl.appendChild(dayDiv);
    }
}

function openModal(dateStr, year, month) {
    selectedDate = dateStr;
    modalDate.textContent = `Ngày ${dateStr.split('-').reverse().join('/')}`;
    const data = getAttendanceData()[dateStr] || {};
    workShift.checked = !!data.workShift;
    overtime.checked = !!data.overtime;
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

closeBtn.onclick = closeModal;
window.onclick = function(event) {
    if (event.target == modal) closeModal();
};

saveBtn.onclick = function() {
    const data = getAttendanceData();
    data[selectedDate] = {
        workShift: workShift.checked,
        overtime: overtime.checked
    };
    setAttendanceData(data);
    closeModal();
    // render lại tất cả lịch để cập nhật trạng thái
    const year = Number(selectedDate.split('-')[0]);
    renderAllCalendars(year);
};

// Thêm sự kiện cho nút nhảy đến tháng
jumpBtn.onclick = function() {
    const y = Number(jumpYear.value);
    const m = Number(jumpMonth.value);
    // Nếu chọn tháng 12 của năm trước
    if (y === now.getFullYear() - 1 && m === 11) {
        document.getElementById(`calendar-${y}-11`).scrollIntoView({behavior: 'smooth', block: 'start'});
    } else {
        document.getElementById(`calendar-${y}-${m}`).scrollIntoView({behavior: 'smooth', block: 'start'});
    }
};

// Init: Hiển thị lịch của năm hiện tại và fill selects
const now = new Date();
fillJumpSelects(now.getFullYear());
renderAllCalendars(now.getFullYear());
jumpMonth.value = now.getMonth();
jumpYear.value = now.getFullYear();
