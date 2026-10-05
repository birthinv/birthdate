/* =====================================================================
   BIRTHDAY INVITATION — SCRIPT.JS
   Только Vanilla JS. Без сборки, без зависимостей.
   ===================================================================== */

/* ==========================================
   НАСТРОЙКИ ПРИГЛАШЕНИЯ — РЕДАКТИРОВАТЬ ЗДЕСЬ
   ==========================================
   Измени значения ниже, чтобы адаптировать приглашение под своё событие.
   Больше НИГДЕ в файлах менять данные не нужно — всё подтянется отсюда.
*/
const invitation = {
    // Имя именинника (в любом падеже, как удобно отображать)
    name: "Калинкина Ирина",

    // Возраст (число или строка — как удобно)
    age: "50",

    // Дата в человекочитаемом виде (для текста на странице)
    date: "10 Октября",

    // Короткая дата для мелких элементов дизайна (badge, footer)
    dateShort: "ЮБИЛЕЙ!",

    // Время начала (человекочитаемое, для текста на странице)
    time: "15:00",

    // Место проведения
    location: "La Primo",

    // Адрес (используется и в тексте, и для ссылки на Google Maps)
    address: "Актау, 7-й микрорайон, 45",

    // Дресс-код (строка "ДРЕСС-КОД" в блоке деталей)
    dressCode: "Чёрное, белое или их идеальное сочетание",

    // Пояснение под дресс-кодом (можно оставить пустым "")
    dressCodeNote: "а если такой возможности нет — любой цвет, в котором вам хорошо",

    // Короткие теги-подсказки о вечере (можно добавить/убрать/поменять сколько угодно)
    highlights: ["УЖИН", "ТОСТЫ", "ТАНЦЫ", "КАРАОКЕ"],

    // ТОЧНАЯ дата и время события в формате ISO — используется для countdown.
    // Формат: "ГГГГ-ММ-ДДTЧЧ:ММ:00". Часовой пояс — локальный пояс браузера гостя.
    // ВАЖНО: замени на реальную дату своего праздника.
    eventDateISO: "2026-10-10T15:00:00",

    // Текст приглашения (можно менять свободно)
    invitationText:
        "Будем рады разделить этот вечер вместе с вами и отпраздновать этот день в хорошей компании.",

    // Путь к фоновой музыке. Она пытается включиться АВТОМАТИЧЕСКИ сразу в момент
    // нажатия кнопки "ОТКРЫТЬ" (это разрешено браузерами, так как это реакция
    // на клик пользователя). Если браузер всё равно заблокирует автозапуск,
    // либо файла нет — сайт не сломается, просто нужно будет включить музыку
    // вручную кнопкой ♫ в углу экрана.
    music: "assets/music.mp3",
};
/* ========================================== */


document.addEventListener("DOMContentLoaded", () => {
    applyInvitationData();
    initPreloader();
    initCustomCursor();
    const music = initMusicToggle();
    initIntro(music);
    initScrollReveal();
    initParallax();
    initCountdown();
    initMapLink();
    initFloatingNav();
});

/* =====================================================================
   1. ПРИМЕНЕНИЕ ДАННЫХ ИЗ `invitation` КО ВСЕМ МЕСТАМ НА СТРАНИЦЕ
   ===================================================================== */
function applyInvitationData() {
    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    document.title = `Приглашение на День Рождения — ${invitation.name}`;

    // Intro
    setText("intro-date-badge", invitation.dateShort || "");

    // Hero
    setText("hero-date-code", invitation.dateShort || "");
    setText("hero-age", invitation.age);
    setText("hero-name-text", invitation.name);

    // Invite / info
    setText("invite-text", invitation.invitationText);
    setText("detail-name", invitation.name);
    setText("detail-date", invitation.date);
    setText("detail-time", invitation.time);
    setText("detail-location", invitation.location);
    setText("detail-address", invitation.address);
    setText("detail-dresscode", invitation.dressCode);
    setText("detail-dresscode-note", invitation.dressCodeNote || "");

    // Теги-подсказки о вечере
    const chipsWrap = document.getElementById("highlight-chips");
    if (chipsWrap && Array.isArray(invitation.highlights)) {
        chipsWrap.innerHTML = invitation.highlights
            .map((item) => `<span class="chip">${item}</span>`)
            .join("");
    }
}

/* =====================================================================
   2. PRELOADER — короткий, не блокирующий пользователя
   ===================================================================== */
function initPreloader() {
    const preloader = document.getElementById("preloader");
    if (!preloader) return;

    const MIN_TIME = 700; // мс — минимальное время показа, чтобы не мигал
    const start = Date.now();

    const hide = () => {
        const elapsed = Date.now() - start;
        const wait = Math.max(0, MIN_TIME - elapsed);
        setTimeout(() => {
            preloader.classList.add("is-hidden");
            setTimeout(() => preloader.remove(), 700);
        }, wait);
    };

    if (document.readyState === "complete") {
        hide();
    } else {
        window.addEventListener("load", hide, { once: true });
        // страховка: если по какой-то причине load не произойдёт быстро
        setTimeout(hide, 2200);
    }
}

/* =====================================================================
   3. КАСТОМНЫЙ КУРСОР (только desktop, с hover)
   ===================================================================== */
function initCustomCursor() {
    const isFinePointer =
        window.matchMedia && window.matchMedia("(pointer: fine)").matches;
    const isWide = window.innerWidth > 860;
    if (!isFinePointer || !isWide) return;

    const dot = document.getElementById("cursor-dot");
    if (!dot) return;

    document.body.classList.add("has-custom-cursor");

    let mouseX = 0,
        mouseY = 0;
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        dot.classList.add("is-visible");
    });

    const hoverSelectors = "button, a, .nav-btn, .btn-open, .btn-map, [tabindex]";
    document.addEventListener("mouseover", (e) => {
        if (e.target.closest && e.target.closest(hoverSelectors)) {
            dot.classList.add("is-hover");
        }
    });
    document.addEventListener("mouseout", (e) => {
        if (e.target.closest && e.target.closest(hoverSelectors)) {
            dot.classList.remove("is-hover");
        }
    });
}

/* =====================================================================
   4. INTRO SCREEN — анимация открытия приглашения
   ===================================================================== */
function initIntro(music) {
    const intro = document.getElementById("intro");
    const btnOpen = document.getElementById("btn-open");
    const content = document.getElementById("content");
    const musicToggle = document.getElementById("music-toggle");
    const floatNav = document.getElementById("float-nav");

    if (!intro || !btnOpen || !content) return;

    document.body.classList.add("no-scroll");

    const openInvitation = () => {
        // Пытаемся включить музыку СРАЗУ здесь, синхронно внутри обработчика клика —
        // это и есть тот самый "жест пользователя", который браузеры требуют для
        // автозапуска звука. Если сделать это позже (например, в setTimeout),
        // часть браузеров (особенно Safari/iOS) может заблокировать автовоспроизведение.
        if (music) music.attemptAutoplay();

        intro.classList.add("is-opening");
        // Скролл остаётся заблокированным до полного закрытия intro — иначе
        // на некоторых мобильных браузерах страница может "уехать" вниз
        // ещё до того, как основной контент станет видимым.

        setTimeout(() => {
            intro.classList.add("is-closed");
            document.body.classList.remove("no-scroll");

            // Принудительно и мгновенно (без smooth-анимации) ставим страницу
            // на самый верх — именно тут должен начинаться просмотр приглашения.
            const previousScrollBehavior = document.documentElement.style.scrollBehavior;
            document.documentElement.style.scrollBehavior = "auto";
            window.scrollTo(0, 0);
            document.documentElement.style.scrollBehavior = previousScrollBehavior;

            content.classList.add("is-visible");
            if (musicToggle) musicToggle.classList.add("is-visible");
            if (floatNav) floatNav.classList.add("is-visible");
            // запускаем повторную проверку reveal-элементов, видимых сразу (hero)
            window.dispatchEvent(new Event("scroll"));
        }, 1050);
    };

    btnOpen.addEventListener("click", openInvitation);
    btnOpen.addEventListener(
        "keydown",
        (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openInvitation();
            }
        },
        { passive: false }
    );
}

/* =====================================================================
   5. SCROLL REVEAL — через IntersectionObserver
   ===================================================================== */
function initScrollReveal() {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
        items.forEach((el) => el.classList.add("is-in"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-in");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((el) => observer.observe(el));
}

/* =====================================================================
   6. PARALLAX — лёгкий, только для декоративных элементов
   ===================================================================== */
function initParallax() {
    const targets = document.querySelectorAll(".hero-sparkle, .countdown-star");
    if (!targets.length) return;

    const prefersReduced =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let ticking = false;

    const update = () => {
        const scrollY = window.scrollY;
        targets.forEach((el, i) => {
            const speed = 0.03 + (i % 3) * 0.015; // subtle
            const offset = scrollY * speed;
            el.style.transform = `translateY(${offset}px)`;
        });
        ticking = false;
    };

    window.addEventListener(
        "scroll",
        () => {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        },
        { passive: true }
    );
}

/* =====================================================================
   7. COUNTDOWN
   ===================================================================== */
function initCountdown() {
    const timerEl = document.getElementById("countdown-timer");
    const messageEl = document.getElementById("countdown-message");
    const daysEl = document.getElementById("cd-days");
    const hoursEl = document.getElementById("cd-hours");
    const minutesEl = document.getElementById("cd-minutes");
    const secondsEl = document.getElementById("cd-seconds");

    if (!timerEl || !daysEl) return;

    const eventDate = new Date(invitation.eventDateISO);
    const GRACE_MS = 1000 * 60 * 60 * 6; // 6 часов после начала — ещё "сегодня"

    const pad = (n) => String(n).padStart(2, "0");
    const prev = { d: null, h: null, m: null, s: null };

    const setNum = (el, value, prevKey) => {
        const v = pad(value);
        if (prev[prevKey] !== v) {
            el.textContent = v;
            el.classList.remove("is-flip");
            // перезапуск анимации
            void el.offsetWidth;
            el.classList.add("is-flip");
            prev[prevKey] = v;
        }
    };

    const showFinalMessage = (text) => {
        timerEl.hidden = true;
        messageEl.hidden = false;
        messageEl.textContent = text;
    };

    function tick() {
        const now = new Date();
        const diff = eventDate.getTime() - now.getTime();

        if (isNaN(eventDate.getTime())) {
            showFinalMessage("СКОРО");
            return;
        }

        if (diff <= 0) {
            if (Math.abs(diff) <= GRACE_MS) {
                showFinalMessage("СЕГОДНЯ");
            } else {
                showFinalMessage("СПАСИБО, ЧТО ОТМЕТИЛИ С НАМИ");
            }
            clearInterval(intervalId);
            return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setNum(daysEl, days, "d");
        setNum(hoursEl, hours, "h");
        setNum(minutesEl, minutes, "m");
        setNum(secondsEl, seconds, "s");
    }

    tick();
    const intervalId = setInterval(tick, 1000);
}

/* =====================================================================
   8. ССЫЛКА НА GOOGLE MAPS — строится из invitation.address
   ===================================================================== */
function initMapLink() {
    const mapLink = document.getElementById("map-link");
    if (!mapLink) return;
    const query = encodeURIComponent(invitation.address || invitation.location || "");
    mapLink.href = `https://2gis.kz/aktau/firm/70000001077187532?m=51.154168%2C43.642625%2F16`;
}

/* =====================================================================
   9. МУЗЫКА — пытается включиться автоматически в момент открытия
   приглашения (см. initIntro), пользователь может выключить/включить
   вручную кнопкой ♫ в любой момент.
   ===================================================================== */
function initMusicToggle() {
    const btn = document.getElementById("music-toggle");
    const label = document.getElementById("music-label");
    const audio = document.getElementById("bg-music");
    if (!btn || !audio) return null;

    let isPlaying = false;
    let hasErrored = false;

    const setPlayingUI = (playing) => {
        isPlaying = playing;
        btn.classList.toggle("is-playing", playing);
        label.textContent = playing ? "ВКЛ" : "ВЫКЛ";
    };

    const markUnavailable = () => {
        hasErrored = true;
        setPlayingUI(false);
        // Кнопка прячется — значит, файла нет или он битый. Сайт при этом
        // продолжает работать как обычно, ничего не ломается.
        btn.classList.add("is-unavailable");
    };

    // Событие "error" срабатывает, если файл музыки отсутствует или битый.
    audio.addEventListener("error", markUnavailable);

    // Общая функция запуска воспроизведения — используется и автозапуском
    // при открытии приглашения, и ручным нажатием на кнопку.
    const startPlaying = () => {
        if (hasErrored || isPlaying) return;

        let settled = false;
        const playPromise = audio.play();

        // Защита от редкого случая, когда play() не резолвится и не реджектится
        // (некоторые окружения без источника звука) — не даём кнопке "зависнуть".
        const timeoutId = setTimeout(() => {
            if (!settled) {
                settled = true;
                audio.pause();
                markUnavailable();
            }
        }, 1800);

        if (playPromise && typeof playPromise.then === "function") {
            playPromise
                .then(() => {
                    if (settled) return;
                    settled = true;
                    clearTimeout(timeoutId);
                    setPlayingUI(true);
                })
                .catch(() => {
                    // Файл отсутствует, битый, либо браузер заблокировал автозапуск —
                    // не ломаем сайт. Кнопка просто останется в состоянии "ВЫКЛ",
                    // и пользователь сможет включить музыку вручную нажатием.
                    if (settled) return;
                    settled = true;
                    clearTimeout(timeoutId);
                    setPlayingUI(false);
                });
        } else {
            clearTimeout(timeoutId);
            setPlayingUI(true);
        }
    };

    const stopPlaying = () => {
        audio.pause();
        setPlayingUI(false);
    };

    btn.addEventListener("click", () => {
        if (hasErrored) return;
        if (isPlaying) {
            stopPlaying();
        } else {
            startPlaying();
        }
    });

    // Вызывается извне (из initIntro) ровно в момент клика по кнопке
    // "ОТКРЫТЬ" — это и есть разрешённый браузером "жест пользователя"
    // для автозапуска звука.
    return {
        attemptAutoplay: startPlaying,
    };
}

/* =====================================================================
   10. ПЛАВАЮЩАЯ НАВИГАЦИЯ
   ===================================================================== */
function initFloatingNav() {
    const buttons = document.querySelectorAll(".nav-btn");
    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });
}
