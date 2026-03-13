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
            <defs>
                <radialGradient id="mBody" cx="0.48" cy="0.38" r="0.58">
                    <stop offset="0%" stop-color="#D4B878"/>
                    <stop offset="50%" stop-color="#B8965A"/>
                    <stop offset="100%" stop-color="#8C6C3C"/>
                </radialGradient>
                <radialGradient id="mHead" cx="0.42" cy="0.32" r="0.6">
                    <stop offset="0%" stop-color="#DCBF80"/>
                    <stop offset="100%" stop-color="#A8864A"/>
                </radialGradient>
                <radialGradient id="mBelly" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stop-color="#EAD8A8"/>
                    <stop offset="100%" stop-color="#D4B87800"/>
                </radialGradient>
                <linearGradient id="mBeak" x1="0" y1="0" x2="1" y2="0.4">
                    <stop offset="0%" stop-color="#F0A030"/>
                    <stop offset="100%" stop-color="#D88820"/>
                </linearGradient>
                <linearGradient id="mWing" x1="0.1" y1="0" x2="0.4" y2="1">
                    <stop offset="0%" stop-color="#A8884C"/>
                    <stop offset="100%" stop-color="#785828"/>
                </linearGradient>
            </defs>

            <!-- Tail — perky fan -->
            <path d="M28 60 Q8 38, 10 14 Q16 32, 26 50" fill="#7A5C34" opacity="0.85"/>
            <path d="M32 56 Q16 32, 20 10 Q24 30, 32 48" fill="#6B4E2C" opacity="0.65"/>
            <path d="M35 58 Q24 42, 28 22 Q30 40, 36 52" fill="#8A6C3E" opacity="0.5"/>
            <!-- Tail feather midlines -->
            <path d="M18 30 Q22 40, 27 54" fill="none" stroke="#5C4424" stroke-width="0.6" opacity="0.3"/>
            <path d="M24 20 Q27 34, 33 50" fill="none" stroke="#5C4424" stroke-width="0.6" opacity="0.25"/>

            <!-- Body — plump rounded bean -->
            <path d="M30 76 C30 52, 56 40, 96 40 C136 40, 168 52, 168 76 C168 104, 140 118, 96 118 C52 118, 30 104, 30 76 Z" fill="url(#mBody)"/>
            <!-- Warm belly glow -->
            <ellipse cx="118" cy="90" rx="36" ry="22" fill="url(#mBelly)" opacity="0.4"/>

            <!-- Wing — soft folded shape with feather scallops -->
            <path d="M46 66 C60 50, 100 52, 116 60 C126 66, 122 82, 108 88 C88 94, 56 90, 44 78 Z" fill="url(#mWing)" opacity="0.5"/>
            <!-- Feather scallops along wing edge -->
            <path d="M46 78 Q54 72, 64 78 Q74 72, 84 78 Q94 72, 104 78" fill="none" stroke="#6B4C28" stroke-width="1" opacity="0.3" stroke-linecap="round"/>
            <!-- Wing highlight -->
            <path d="M56 66 Q80 58, 112 64" fill="none" stroke="#C4A868" stroke-width="1.2" opacity="0.25" stroke-linecap="round"/>

            <!-- Neck — short and cozy -->
            <path d="M142 68 C144 52, 148 42, 146 28 C145 20, 164 20, 165 28 C163 42, 160 52, 162 68" fill="#B89456"/>

            <!-- Head — big and round -->
            <circle cx="155" cy="24" r="21" fill="url(#mHead)"/>
            <!-- Crown shadow — very subtle -->
            <path d="M138 17 Q148 6, 158 8 Q168 6, 174 15" fill="#8A6838" opacity="0.15"/>

            <!-- Beak — slim and friendly -->
            <path d="M173 19 Q188 16, 194 22 Q188 27, 173 25 Z" fill="url(#mBeak)"/>
            <!-- Smile line -->
            <path d="M175 22 Q184 23, 192 22" fill="none" stroke="#B87018" stroke-width="0.6" opacity="0.45"/>
            <!-- Nostril dot -->
            <circle cx="181" cy="20.5" r="0.9" fill="#B07018" opacity="0.35"/>

            <!-- Eye — big, warm, expressive -->
            <circle cx="162" cy="20" r="5.5" fill="#120A02"/>
            <circle cx="162" cy="20" r="3.5" fill="#2A1408"/>
            <!-- Main catchlight -->
            <circle cx="164" cy="18" r="2.2" fill="white" opacity="0.92"/>
            <!-- Secondary catchlight -->
            <circle cx="160.5" cy="19.5" r="0.8" fill="white" opacity="0.35"/>
            <!-- Eyelid — gentle curve -->
            <path d="M156.5 16.5 Q162 14.5, 167.5 17" fill="none" stroke="#A8864A" stroke-width="1" opacity="0.5" stroke-linecap="round"/>

            <!-- Cheek blush -->
            <ellipse cx="155" cy="30" rx="8" ry="4" fill="#D49060" opacity="0.14"/>

            <!-- Water ripples -->
            <ellipse cx="96" cy="120" rx="78" ry="5" fill="rgba(255,255,255,0.08)"/>
            <ellipse cx="96" cy="126" rx="60" ry="3" fill="rgba(255,255,255,0.04)"/>
        </svg>`;
    } else {
        return `<svg viewBox="0 0 120 90" class="duck-svg" xmlns="http://www.w3.org/2000/svg">
            <!-- Tail -->
            <path d="M18 45 Q10 34, 15 26 Q17 32, 20 40" fill="#D4B44E" opacity="0.8"/>
            <!-- Body -->
            <ellipse cx="58" cy="50" rx="40" ry="26" fill="url(#babyBody)"/>
            <!-- Wing -->
            <ellipse cx="50" cy="48" rx="22" ry="15" fill="#D4B44E" opacity="0.5" transform="rotate(-5 50 48)"/>
            <path d="M38 46 Q48 40, 62 42 Q55 46, 48 48" fill="#C4A43E" opacity="0.25"/>
            <!-- Neck — short and thick -->
            <path d="M84 44 C86 36, 90 32, 89 24 C88 20, 100 20, 101 24 C100 32, 96 36, 98 44" fill="url(#babyNeck)" stroke="url(#babyNeck)" stroke-width="0.3"/>
            <!-- Head — round, slightly tilted -->
            <ellipse cx="94" cy="22" rx="15" ry="13" fill="url(#babyHead)" transform="rotate(-4 94 22)"/>
            <!-- Forehead highlight -->
            <ellipse cx="91" cy="17" rx="6" ry="4" fill="rgba(255,255,255,0.07)" transform="rotate(-6 91 17)"/>
            <!-- Beak — small, neat -->
            <path d="M107 19 Q118 17.5, 120 21 Q118 24, 107 23 Z" fill="url(#babyBeak)"/>
            <path d="M107 21 Q114 21, 119 21" fill="none" stroke="#8B5A10" stroke-width="0.5" opacity="0.5"/>
            <!-- Eye — bright, curious -->
            <circle cx="100" cy="19" r="2.8" fill="#1A1A1A"/>
            <circle cx="101" cy="18" r="1.1" fill="white" opacity="0.9"/>
            <circle cx="100.5" cy="18.5" r="0.4" fill="white" opacity="0.4"/>
            <!-- Eyelid hint -->
            <path d="M97 17.5 Q100 16.2, 103 17.5" fill="none" stroke="#C4A43E" stroke-width="0.5" opacity="0.4"/>
            <!-- Ripple -->
            <ellipse cx="58" cy="76" rx="44" ry="4" fill="rgba(255,255,255,0.06)"/>
            <!-- Gradients -->
            <defs>
                <linearGradient id="babyBody" x1="0" y1="0" x2="0.3" y2="1">
                    <stop offset="0%" stop-color="#E8C965"/>
                    <stop offset="100%" stop-color="#D4B44E"/>
                </linearGradient>
                <linearGradient id="babyNeck" x1="0" y1="1" x2="0.3" y2="0">
                    <stop offset="0%" stop-color="#DCC050"/>
                    <stop offset="100%" stop-color="#EFDA80"/>
                </linearGradient>
                <linearGradient id="babyHead" x1="0" y1="0" x2="0.8" y2="1">
                    <stop offset="0%" stop-color="#F5E690"/>
                    <stop offset="50%" stop-color="#EFDA80"/>
                    <stop offset="100%" stop-color="#DCC050"/>
                </linearGradient>
                <linearGradient id="babyBeak" x1="0" y1="0" x2="1" y2="0.5">
                    <stop offset="0%" stop-color="#D4941A"/>
                    <stop offset="100%" stop-color="#B87818"/>
                </linearGradient>
            </defs>
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
        slot.className = "duck-slot";
        slot.style.cssText = `position:absolute;left:${pos.left}%;top:${pos.top}%;transform:scale(${scale})`;
        slot.innerHTML = `<div class="duck baby">${createDuckSVG(false)}</div>`;
        inner.appendChild(slot);
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
    const colors = ["#E8C547", "#F5E690", "#DAA520", "#FFF5CC", "#C9A84C", "#FFFFFF"];
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
