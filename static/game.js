let parentWord = "";
let totalWords = 0;
let foundWords = [];

async function startNewGame() {
    const res = await fetch("/api/new-game");
    const data = await res.json();
    parentWord = data.parent_word;
    totalWords = data.total_words;
    foundWords = [];
    babyLayout = { positions: [], scale: 1 };
    renderedCount = 0;
    document.getElementById("pond").innerHTML = '';
    render();
    document.getElementById("guess-input").focus();
}

async function submitGuess() {
    const input = document.getElementById("guess-input");
    const guess = input.value.trim().toLowerCase();
    if (!guess) return;

    if (foundWords.includes(guess)) {
        showMessage("You already found that word!", "error");
        input.value = "";
        return;
    }

    const res = await fetch("/api/check-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parent_word: parentWord, guess }),
    });
    const data = await res.json();

    if (data.valid) {
        foundWords.push(data.word);
        if (foundWords.length === totalWords) {
            showMessage("You found them all!", "success");
            render();
            celebrate();
        } else {
            showMessage(`"${data.word.toUpperCase()}" is correct!`, "success");
            render();
        }
    } else {
        showMessage(data.reason, "error");
    }

    input.value = "";
    input.focus();
}

function showMessage(text, type) {
    const msg = document.getElementById("message");
    msg.textContent = text;
    msg.className = "message " + type;
    setTimeout(() => {
        if (msg.textContent === text) {
            msg.textContent = "";
            msg.className = "message";
        }
    }, 3000);
}

function createDuckSVG(isParent) {
    if (isParent) {
        return `<svg viewBox="0 -8 210 148" class="duck-svg" xmlns="http://www.w3.org/2000/svg">
            <!-- Tail -->
            <line x1="18" y1="84" x2="2" y2="76" stroke="#2E2924" stroke-width="3" stroke-linecap="round"/>
            <!-- Body (egg shape) -->
            <path d="M 85,44 C 130,44 155,72 155,90 C 155,108 125,120 85,120 C 45,120 15,108 15,90 C 15,72 40,44 85,44 Z" fill="#D4644A"/>
            <!-- Wing -->
            <ellipse cx="60" cy="80" rx="28" ry="14" fill="#B84E38" transform="rotate(-6 60 80)"/>
            <!-- Head -->
            <circle cx="152" cy="45" r="21.6" fill="#2E2924"/>
            <!-- Eye -->
            <circle cx="159" cy="41" r="6.3" fill="#FFFFF0"/>
            <circle cx="161" cy="40.5" r="3" fill="#2E2924"/>
            <!-- Beak -->
            <polygon points="172,40 186,47 172,54" fill="#D4952B"/>
        </svg>`;
    } else {
        return `<svg viewBox="0 0 120 90" class="duck-svg" xmlns="http://www.w3.org/2000/svg">
            <!-- Tail -->
            <line x1="10" y1="50" x2="2" y2="44" stroke="#2E2924" stroke-width="2" stroke-linecap="round"/>
            <!-- Body (egg shape) -->
            <path d="M 48,30 C 72,30 88,45 88,54 C 88,66 72,74 48,74 C 24,74 8,66 8,54 C 8,45 24,30 48,30 Z" fill="#6B8A5C"/>
            <!-- Wing -->
            <ellipse cx="34" cy="48" rx="16" ry="8" fill="#567248" transform="rotate(-6 34 48)"/>
            <!-- Head -->
            <circle cx="84" cy="33" r="12.6" fill="#2E2924"/>
            <!-- Eye -->
            <circle cx="88.5" cy="30.3" r="3.6" fill="#FFFFF0"/>
            <circle cx="89.4" cy="29.9" r="1.8" fill="#2E2924"/>
            <!-- Beak -->
            <polygon points="95,29 104,33 95,37" fill="#D4952B"/>
        </svg>`;
    }
}

function createDuckHTML(word, isParent) {
    const cls = isParent ? "parent" : "baby";
    return `
        <div class="duck ${cls}">
            ${createDuckSVG(isParent)}
            ${isParent ? `<span class="duck-word">${word.toUpperCase()}</span>` : ''}
        </div>
    `;
}

// Pre-computed layout for all baby duck slots
let babyLayout = { positions: [], scale: 1 };

function seededRandom(seed) {
    let s = seed;
    return function() {
        s = (s * 16807 + 0) % 2147483647;
        return s / 2147483647;
    };
}

// Compute layout once based on totalWords so duck size never changes.
// Scatters ducks randomly within the pond ellipse, avoiding mama.
function computeBabyLayout(total, pondW, pondH) {
    if (total === 0) return { positions: [], scale: 1 };

    const babyBaseW = 140, babyBaseH = 104;
    const mamaW = 200, mamaH = 140;
    const rand = seededRandom(total * 9973);

    // Mama exclusion: keep duckling centers away from mama center
    const exclX = (mamaW / 2 + 20) / pondW;
    const exclY = (mamaH / 2 + 20) / pondH;

    // Pond boundary padding
    const padX = 0.08;
    const padY = 0.08;

    const positions = [];

    for (let i = 0; i < total; i++) {
        let bestLeft = 50, bestTop = 50;
        for (let attempt = 0; attempt < 200; attempt++) {
            const nx = rand() * 2 - 1;
            const ny = rand() * 2 - 1;

            // Must be inside pond ellipse
            if (nx * nx + ny * ny > 0.85) continue;

            const left = 50 + nx * (50 - padX * 100);
            const top = 50 + ny * (50 - padY * 100);

            // Must be outside mama exclusion zone
            const mx = (left - 50) / 100 / exclX;
            const my = (top - 50) / 100 / exclY;
            if (mx * mx + my * my < 1) continue;

            bestLeft = left;
            bestTop = top;
            break;
        }
        positions.push({ left: bestLeft, top: bestTop });
    }

    // Shuffle so ducks appear in random spots as words are found
    for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    return { positions, scale: 1 };
}

// Track how many ducks are already rendered in the pond
let renderedCount = 0;

function render() {
    const pond = document.getElementById("pond");
    let inner = pond.querySelector(".pond-inner");

    // First render: build the pond structure with mama duck
    if (!inner) {
        pond.innerHTML = '<div class="pond-inner"></div>';
        inner = pond.querySelector(".pond-inner");
        inner.innerHTML = createDuckHTML(parentWord, true);
        renderedCount = 0;
    }

    const pondW = inner.offsetWidth;
    const pondH = inner.offsetHeight;

    // Compute layout once for all slots
    if (babyLayout.positions.length === 0 && totalWords > 0) {
        babyLayout = computeBabyLayout(totalWords, pondW, pondH);
    }

    const { positions, scale } = babyLayout;

    // Only append newly found ducks
    while (renderedCount < foundWords.length) {
        const pos = positions[renderedCount];
        const slot = document.createElement("div");
        slot.className = "duck-slot entering";
        slot.style.cssText = `position:absolute;left:${pos.left}%;top:${pos.top}%;transform:scale(${scale})`;
        slot.innerHTML = `<div class="duck baby">${createDuckSVG(false)}</div>`
            + '<div class="splash-ripple"></div><div class="splash-ripple"></div>';
        inner.appendChild(slot);

        // After entrance animation, switch to normal bob
        slot.addEventListener("animationend", function handler() {
            slot.removeEventListener("animationend", handler);
            slot.classList.remove("entering");
            slot.querySelectorAll(".splash-ripple").forEach(r => r.remove());
        });

        renderedCount++;
    }

    // Score
    document.getElementById("score").innerHTML =
        `Ducklings found: <span>${foundWords.length}</span> / <span>${totalWords}</span>`;

    // Found words list
    const listEl = document.getElementById("found-list");
    if (foundWords.length > 0) {
        listEl.innerHTML = foundWords
            .map(w => `<span class="word-tag">${w.toUpperCase()}</span>`)
            .join("");
    } else {
        listEl.innerHTML = "<em>No words found yet — start typing!</em>";
    }
}

function celebrate() {
    const pond = document.querySelector(".pond");
    pond.classList.add("celebrate");

    // Sparkles burst
    const colors = ["#D4644A", "#E8A880", "#48864A", "#F4F0E8", "#1A6080", "#FFFFFF"];
    for (let i = 0; i < 60; i++) {
        const spark = document.createElement("div");
        spark.className = "sparkle";
        spark.style.left = Math.random() * 100 + "%";
        spark.style.top = Math.random() * 100 + "%";
        spark.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        spark.style.animationDelay = Math.random() * 1.5 + "s";
        spark.style.animationDuration = (1.5 + Math.random() * 1.5) + "s";
        pond.appendChild(spark);
    }

    // Banner
    const banner = document.createElement("div");
    banner.className = "win-banner";
    banner.innerHTML = "<span>All ducklings found!</span>";
    pond.appendChild(banner);

    // Clean up sparkles after animation
    setTimeout(() => {
        pond.querySelectorAll(".sparkle").forEach(s => s.remove());
    }, 5000);
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    startNewGame();

    document.getElementById("submit-btn").addEventListener("click", submitGuess);

    document.getElementById("guess-input").addEventListener("keydown", (e) => {
        if (e.key === "Enter") submitGuess();
    });
});
