const scheduleData = [
    { time: "7:00 AM", period: "morning", title: "Morning Flow", instructor: "Kajal Patel", spots: 6, capacity: 8 },
    { time: "9:30 AM", period: "morning", title: "Gentle Hatha", instructor: "Priyanka Sharma", spots: 2, capacity: 10 },
    { time: "1:00 PM", period: "afternoon", title: "Restorative Stretch", instructor: "Kunal Thakur", spots: 5, capacity: 8 },
    { time: "6:00 PM", period: "evening", title: "Power Yoga", instructor: "Shreya Singh ", spots: 1, capacity: 8 },
    { time: "8:00 PM", period: "evening", title: "Candlelight Yin", instructor: "Ananya Rao", spots: 4, capacity: 6 }
];

const memberData = [
    { name: "Riya Malhotra", status: "active", note: "Prefers a mat spot near the window." },
    { name: "Karan Mehta", status: "expiring", note: "Renewal due — mention the family plan discount." },
    { name: "Sanya Kapoor", status: "active", note: "No specific notes." },
    { name: "Arjun Verma", status: "expired", note: "Membership expired — ask to renew before next class." },
    { name: "Divya Iyer", status: "active", note: "Knee injury — avoid deep twists in Power Yoga." },
    { name: "Rohan Bhatt", status: "expiring", note: "Requests a reminder call before each session." }
];

function logAnalytics(action) {
    console.log(`[Analytics] User interacted with UI Scaffolding — action: ${action}`);
}

function getInitials(name) {
    return name.split(" ").map(part => part[0]).join("").toUpperCase();
}

// Uses textContent to escape any HTML before it gets inserted back into the page
function sanitizeText(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function simulateDelay(callback, ms = 700) {
    setTimeout(callback, ms);
}

function updateClock() {
    const clockEl = document.getElementById("liveClock");
    const now = new Date();
    clockEl.textContent = now.toLocaleString("en-IN", {
        weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
    });
    clockEl.setAttribute("datetime", now.toISOString());
}

function updateHero() {
    const hour = new Date().getHours();
    let greeting = "Good evening";
    if (hour < 12) greeting = "Good morning";
    else if (hour < 17) greeting = "Good afternoon";

    document.getElementById("heroGreeting").textContent = greeting;
    document.getElementById("heroDate").textContent = new Date().toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric", month: "long"
    });
}

function initHamburger() {
    const btn = document.getElementById("hamburgerBtn");
    const nav = document.getElementById("primaryNav");

    btn.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.querySelectorAll(".nav__link").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("is-open");
            btn.setAttribute("aria-expanded", "false");
        });
    });
}

function initThemeToggle() {
    const toggleBtn = document.getElementById("themeToggleBtn");
    const root = document.documentElement;

    toggleBtn.addEventListener("click", () => {
        const isDark = root.getAttribute("data-theme") === "dark";
        if (isDark) {
            root.removeAttribute("data-theme");
            toggleBtn.setAttribute("aria-pressed", "false");
            toggleBtn.setAttribute("aria-label", "Switch to dark theme");
        } else {
            root.setAttribute("data-theme", "dark");
            toggleBtn.setAttribute("aria-pressed", "true");
            toggleBtn.setAttribute("aria-label", "Switch to light theme");
        }
        logAnalytics("theme-toggle");
    });
}

function renderStats() {
    const totalClasses = scheduleData.length;
    const checkedIn = memberData.filter(m => m.status === "active").length;
    const pending = 3;

    document.getElementById("statClasses").textContent = totalClasses;
    document.getElementById("statCheckedIn").textContent = checkedIn;
    document.getElementById("statPending").textContent = pending;

    document.getElementById("daySummary").textContent =
        `Today: ${totalClasses} classes · ${checkedIn} checked in · ${pending} pending bookings`;
}

function renderRenewalAlert() {
    const alertEl = document.getElementById("renewalAlert");
    const expiringCount = memberData.filter(m => m.status === "expiring").length;

    if (expiringCount >= 2) {
        alertEl.textContent = `${expiringCount} memberships are expiring this week — follow up with them.`;
        alertEl.hidden = false;
    } else {
        alertEl.hidden = true;
    }
}

function renderScheduleCard(cls) {
    const li = document.createElement("li");
    li.className = "schedule-card";
    li.dataset.period = cls.period;

    const isLow = cls.spots <= 2;

    li.innerHTML = `
        <span class="schedule-card__time">${sanitizeText(cls.time)}</span>
        <h3 class="schedule-card__title">${sanitizeText(cls.title)}</h3>
        <div class="schedule-card__instructor">
            <span class="schedule-card__avatar" aria-hidden="true">${getInitials(cls.instructor)}</span>
            <span class="schedule-card__instructor-name">${sanitizeText(cls.instructor)}</span>
        </div>
        <span class="capacity-badge ${isLow ? "is-low" : ""}">${cls.spots}/${cls.capacity} spots left</span>
    `;
    return li;
}

function renderSchedule(filter = "all") {
    const listEl = document.getElementById("scheduleList");
    const loadingEl = document.getElementById("scheduleLoading");
    const emptyEl = document.getElementById("scheduleEmpty");

    listEl.innerHTML = "";
    emptyEl.hidden = true;
    loadingEl.hidden = false;

    simulateDelay(() => {
        loadingEl.hidden = true;
        const filtered = filter === "all" ? scheduleData : scheduleData.filter(cls => cls.period === filter);

        if (filtered.length === 0) {
            emptyEl.hidden = false;
            return;
        }
        filtered.forEach(cls => listEl.appendChild(renderScheduleCard(cls)));
    });
}

function initScheduleFilters() {
    const chips = document.querySelectorAll(".chip");
    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            chips.forEach(c => c.classList.remove("is-active"));
            chip.classList.add("is-active");
            renderSchedule(chip.dataset.filter);
            logAnalytics("schedule-filter");
        });
    });
}

function initScheduleRefresh() {
    document.getElementById("refreshScheduleBtn").addEventListener("click", () => {
        const activeChip = document.querySelector(".chip.is-active");
        renderSchedule(activeChip ? activeChip.dataset.filter : "all");
        logAnalytics("schedule-refresh");
    });
}

function initPrintButton() {
    document.getElementById("printScheduleBtn").addEventListener("click", () => {
        logAnalytics("schedule-print");
        window.print();
    });
}

function statusLabel(status) {
    if (status === "active") return { text: "Active", cls: "status-badge--active" };
    if (status === "expiring") return { text: "Expiring Soon", cls: "status-badge--expiring" };
    return { text: "Expired", cls: "status-badge--expired" };
}

function renderMemberItem(member) {
    const li = document.createElement("li");
    li.className = "member-item";
    const badge = statusLabel(member.status);

    li.innerHTML = `
        <button type="button" class="member-item__row" aria-expanded="false">
            <span>${sanitizeText(member.name)}</span>
            <span class="member-item__right">
                <span class="status-badge ${badge.cls}">${badge.text}</span>
            </span>
        </button>
        <p class="member-note" hidden>${sanitizeText(member.note)}</p>
    `;

    const rowBtn = li.querySelector(".member-item__row");
    const noteEl = li.querySelector(".member-note");

    rowBtn.addEventListener("click", () => {
        const isOpen = noteEl.hidden === false;
        noteEl.hidden = isOpen;
        rowBtn.setAttribute("aria-expanded", isOpen ? "false" : "true");
    });

    return li;
}

function renderMembers(query) {
    const listEl = document.getElementById("memberList");
    const loadingEl = document.getElementById("membersLoading");
    const emptyEl = document.getElementById("membersEmpty");

    listEl.innerHTML = "";
    emptyEl.hidden = true;

    if (query.trim().length < 2) return;

    loadingEl.hidden = false;

    simulateDelay(() => {
        loadingEl.hidden = true;
        const results = memberData.filter(m => m.name.toLowerCase().includes(query.trim().toLowerCase()));

        if (results.length === 0) {
            emptyEl.hidden = false;
            return;
        }
        results.forEach(member => listEl.appendChild(renderMemberItem(member)));
    }, 500);
}

function initMemberSearch() {
    const input = document.getElementById("memberSearchInput");
    let debounceTimer;

    input.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        const value = e.target.value;
        debounceTimer = setTimeout(() => renderMembers(value), 300);
    });
}

function showFieldError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(errorId);
    field.closest(".form-field").classList.add("is-invalid");
    errorEl.textContent = message;
}

function clearFieldError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(errorId);
    field.closest(".form-field").classList.remove("is-invalid");
    errorEl.textContent = "";
}

function validatePhone(value) {
    const digitsOnly = value.replace(/[\s-]/g, "");
    return /^\d{10}$/.test(digitsOnly);
}

function initBookingForm() {
    const form = document.getElementById("bookingForm");
    const successEl = document.getElementById("bookingSuccess");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let isValid = true;

        const nameInput = document.getElementById("clientName");
        const classInput = document.getElementById("classSelect");
        const phoneInput = document.getElementById("clientPhone");

        clearFieldError("clientName", "clientNameError");
        clearFieldError("classSelect", "classSelectError");
        clearFieldError("clientPhone", "clientPhoneError");
        successEl.hidden = true;

        if (nameInput.value.trim().length === 0) {
            showFieldError("clientName", "clientNameError", "Please enter the client's name.");
            isValid = false;
        }

        if (classInput.value === "") {
            showFieldError("classSelect", "classSelectError", "Please select a class.");
            isValid = false;
        }

        if (phoneInput.value.trim().length === 0) {
            showFieldError("clientPhone", "clientPhoneError", "Please enter a phone number.");
            isValid = false;
        } else if (!validatePhone(phoneInput.value)) {
            showFieldError("clientPhone", "clientPhoneError", "Enter a valid 10-digit phone number.");
            isValid = false;
        }

        if (!isValid) {
            const firstInvalid = form.querySelector(".is-invalid input, .is-invalid select");
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        const bookingRecord = {
            name: sanitizeText(nameInput.value.trim()),
            classType: classInput.value,
            phone: sanitizeText(phoneInput.value.trim())
        };

        console.log("New booking recorded:", bookingRecord);
        logAnalytics("booking-submit");

        form.reset();
        successEl.hidden = false;
        successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    updateClock();
    updateHero();
    setInterval(updateClock, 60000);

    initHamburger();
    initThemeToggle();
    renderStats();
    renderRenewalAlert();
    renderSchedule("all");
    initScheduleFilters();
    initScheduleRefresh();
    initPrintButton();
    initMemberSearch();
    initBookingForm();
});
