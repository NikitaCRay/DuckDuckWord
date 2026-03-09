let parentWord = "";
let totalWords = 0;
let foundWords = [];

async function startNewGame() {
    const res = await fetch("/api/new-game");
    const data = await res.json();
    parentWord = data.parent_word;
    totalWords = data.total_words;
    foundWords = [];
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
                <!-- Body: warm brown, lighter breast, darker back -->
                <radialGradient id="parentBody" cx="0.5" cy="0.4" r="0.55">
                    <stop offset="0%" stop-color="#BFA06A"/>
                    <stop offset="45%" stop-color="#9C7E4E"/>
                    <stop offset="75%" stop-color="#7A6038"/>
                    <stop offset="100%" stop-color="#5C4528"/>
                </radialGradient>
                <!-- Breast: lighter warm buff -->
                <radialGradient id="parentBreast" cx="0.6" cy="0.55" r="0.5">
                    <stop offset="0%" stop-color="#D4B882"/>
                    <stop offset="100%" stop-color="#BFA06A"/>
                </radialGradient>
                <!-- Wing coverts -->
                <linearGradient id="parentWing" x1="0" y1="0" x2="0.4" y2="1">
                    <stop offset="0%" stop-color="#6B4E30"/>
                    <stop offset="50%" stop-color="#503820"/>
                    <stop offset="100%" stop-color="#3D2A18"/>
                </linearGradient>
                <!-- Speculum iridescence -->
                <linearGradient id="speculum" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#1E3D5C"/>
                    <stop offset="25%" stop-color="#2B5C8A"/>
                    <stop offset="50%" stop-color="#4A3D8A"/>
                    <stop offset="75%" stop-color="#2B5C8A"/>
                    <stop offset="100%" stop-color="#1E3D5C"/>
                </linearGradient>
                <!-- Neck -->
                <linearGradient id="parentNeck" x1="0.3" y1="1" x2="0.5" y2="0">
                    <stop offset="0%" stop-color="#8A6D42"/>
                    <stop offset="40%" stop-color="#9C7E4E"/>
                    <stop offset="100%" stop-color="#B09060"/>
                </linearGradient>
                <!-- Head -->
                <radialGradient id="parentHead" cx="0.45" cy="0.4" r="0.55">
                    <stop offset="0%" stop-color="#C4A270"/>
                    <stop offset="50%" stop-color="#9C7E4E"/>
                    <stop offset="100%" stop-color="#7A6038"/>
                </radialGradient>
                <!-- Beak: warm orange -->
                <linearGradient id="parentBeak" x1="0" y1="0" x2="1" y2="0.3">
                    <stop offset="0%" stop-color="#E8952A"/>
                    <stop offset="40%" stop-color="#E0881E"/>
                    <stop offset="100%" stop-color="#C87018"/>
                </linearGradient>
                <!-- Tail -->
                <linearGradient id="parentTail" x1="0.8" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#5C4528"/>
                    <stop offset="100%" stop-color="#3D2A18"/>
                </linearGradient>
            </defs>

            <!-- Tail feathers — layered, fan shape -->
            <path d="M30 65 Q12 48, 16 32 Q20 40, 26 52" fill="url(#parentTail)" opacity="0.85"/>
            <path d="M26 62 Q6 42, 14 25 Q18 36, 24 48" fill="#4A3520" opacity="0.7"/>
            <path d="M33 60 Q18 50, 22 38 Q26 44, 32 52" fill="#5C4528" opacity="0.6"/>
            <!-- Tail barring -->
            <path d="M20 42 Q24 40, 28 44" fill="none" stroke="#C4A265" stroke-width="0.6" opacity="0.3"/>
            <path d="M18 48 Q23 46, 28 50" fill="none" stroke="#C4A265" stroke-width="0.5" opacity="0.25"/>

            <!-- Body — organic shape instead of perfect ellipse -->
            <path d="M28 78 Q28 42, 70 38 Q110 34, 150 45 Q172 55, 168 78 Q165 108, 120 118 Q70 122, 38 105 Q28 98, 28 78 Z" fill="url(#parentBody)"/>
            <!-- Lighter breast area -->
            <path d="M130 70 Q165 75, 162 95 Q155 112, 120 115 Q140 100, 140 85 Q140 72, 130 70 Z" fill="url(#parentBreast)" opacity="0.6"/>

            <!-- Scalloped feather rows across body -->
            <path d="M42 72 Q48 68, 54 72 Q60 68, 66 72 Q72 68, 78 72" fill="none" stroke="#5C4020" stroke-width="0.8" opacity="0.3"/>
            <path d="M38 80 Q45 76, 52 80 Q59 76, 66 80 Q73 76, 80 80 Q87 76, 94 80" fill="none" stroke="#5C4020" stroke-width="0.8" opacity="0.28"/>
            <path d="M40 88 Q48 84, 56 88 Q64 84, 72 88 Q80 84, 88 88 Q96 84, 104 88" fill="none" stroke="#5C4020" stroke-width="0.7" opacity="0.25"/>
            <path d="M45 96 Q53 92, 61 96 Q69 92, 77 96 Q85 92, 93 96 Q101 92, 109 96" fill="none" stroke="#5C4020" stroke-width="0.7" opacity="0.22"/>
            <path d="M52 104 Q60 100, 68 104 Q76 100, 84 104 Q92 100, 100 104" fill="none" stroke="#5C4020" stroke-width="0.6" opacity="0.18"/>
            <!-- V-shaped feather centers -->
            <path d="M50 75 l3 -2 l3 2" fill="none" stroke="#3D2A18" stroke-width="0.5" opacity="0.2"/>
            <path d="M66 75 l3 -2 l3 2" fill="none" stroke="#3D2A18" stroke-width="0.5" opacity="0.2"/>
            <path d="M56 83 l3 -2 l3 2" fill="none" stroke="#3D2A18" stroke-width="0.5" opacity="0.18"/>
            <path d="M72 83 l3 -2 l3 2" fill="none" stroke="#3D2A18" stroke-width="0.5" opacity="0.18"/>
            <path d="M88 83 l3 -2 l3 2" fill="none" stroke="#3D2A18" stroke-width="0.5" opacity="0.15"/>
            <path d="M62 91 l3 -2 l3 2" fill="none" stroke="#3D2A18" stroke-width="0.5" opacity="0.15"/>
            <path d="M78 91 l3 -2 l3 2" fill="none" stroke="#3D2A18" stroke-width="0.5" opacity="0.15"/>

            <!-- Wing — folded, with visible tertials and coverts -->
            <path d="M45 62 Q55 50, 85 52 Q110 54, 115 68 Q112 80, 90 84 Q65 86, 48 76 Q42 72, 45 62 Z" fill="url(#parentWing)" opacity="0.75"/>
            <!-- Greater coverts row -->
            <path d="M50 68 Q62 62, 78 64 Q90 63, 105 66" fill="none" stroke="#3D2A18" stroke-width="0.8" opacity="0.3"/>
            <!-- Median coverts -->
            <path d="M52 63 Q65 58, 82 59 Q95 58, 108 62" fill="none" stroke="#3D2A18" stroke-width="0.6" opacity="0.25"/>
            <!-- Tertial feathers -->
            <path d="M48 72 Q60 65, 80 68 Q70 73, 55 75" fill="#5C4020" opacity="0.2"/>
            <path d="M55 75 Q68 69, 90 71 Q78 76, 62 78" fill="#5C4020" opacity="0.15"/>
            <!-- Speculum — iridescent blue bar with white borders -->
            <rect x="56" y="69" width="38" height="5" rx="2" fill="url(#speculum)" opacity="0.55" transform="rotate(-6 75 71)"/>
            <rect x="56" y="67.5" width="38" height="1.8" rx="1" fill="rgba(255,255,255,0.35)" transform="rotate(-6 75 68)"/>
            <rect x="56" y="74.5" width="38" height="1.8" rx="1" fill="rgba(255,255,255,0.3)" transform="rotate(-6 75 76)"/>
            <!-- Primary feather tips -->
            <path d="M42 74 L38 78 L44 76" fill="#3D2A18" opacity="0.3"/>
            <path d="M44 76 L40 80 L46 78" fill="#3D2A18" opacity="0.25"/>

            <!-- Neck — smooth S-curve, streaked -->
            <path d="M142 62 C144 50, 150 42, 148 30 C147 24, 166 24, 167 30 C165 42, 160 50, 162 62" fill="url(#parentNeck)"/>
            <!-- Neck streaking -->
            <path d="M148 55 Q152 45, 150 35" fill="none" stroke="#5C4020" stroke-width="0.6" opacity="0.2"/>
            <path d="M156 58 Q158 48, 157 38" fill="none" stroke="#5C4020" stroke-width="0.6" opacity="0.18"/>
            <path d="M162 56 Q163 46, 161 36" fill="none" stroke="#5C4020" stroke-width="0.5" opacity="0.15"/>

            <!-- Head — rounded, warm brown -->
            <ellipse cx="157" cy="26" rx="24" ry="18" fill="url(#parentHead)" transform="rotate(-5 157 26)"/>
            <!-- Crown — darker cap -->
            <path d="M138 22 Q148 12, 160 14 Q170 12, 178 20" fill="#5C4020" opacity="0.25"/>
            <!-- Eye stripe — dark line through eye -->
            <path d="M142 25 Q152 22, 165 24 Q172 25, 178 27" fill="none" stroke="#2E1F0A" stroke-width="2.8" opacity="0.45" stroke-linecap="round"/>
            <!-- Supercilium — pale buff eyebrow -->
            <path d="M142 21 Q152 16, 165 18 Q172 18, 177 21" fill="none" stroke="#D4B882" stroke-width="1.8" opacity="0.45" stroke-linecap="round"/>
            <!-- Malar stripe — thin dark line below eye -->
            <path d="M155 30 Q162 32, 175 30" fill="none" stroke="#3D2A18" stroke-width="1" opacity="0.25" stroke-linecap="round"/>
            <!-- Pale cheek/throat -->
            <path d="M145 32 Q155 38, 168 34" fill="#D4B882" opacity="0.15"/>

            <!-- Beak — orange with dark saddle and nail -->
            <path d="M177 22 Q198 20, 204 26 Q198 32, 177 30 Z" fill="url(#parentBeak)"/>
            <!-- Dark saddle on upper mandible -->
            <path d="M177 22 Q190 20, 200 22 Q192 25, 177 25.5" fill="#3D2A18" opacity="0.3"/>
            <!-- Bill line -->
            <path d="M177 26 Q192 26, 202 26" fill="none" stroke="#7A5010" stroke-width="0.7" opacity="0.45"/>
            <!-- Nostril -->
            <ellipse cx="188" cy="24.5" rx="1.5" ry="1" fill="#6B4010" opacity="0.5"/>
            <!-- Nail (dark tip) -->
            <path d="M201 23 Q206 26, 201 29" fill="#2E1F0A" opacity="0.35"/>

            <!-- Eye — dark brown iris, catchlight -->
            <circle cx="164" cy="23" r="5" fill="none" stroke="#8A6D42" stroke-width="1.2" opacity="0.3"/>
            <circle cx="164" cy="23" r="3.8" fill="#1A0E05"/>
            <circle cx="164" cy="23" r="2.5" fill="#3D1F0A"/>
            <circle cx="165.5" cy="21.5" r="1.5" fill="white" opacity="0.85"/>
            <circle cx="163" cy="22.2" r="0.5" fill="white" opacity="0.3"/>

            <!-- Water line / ripple -->
            <ellipse cx="95" cy="120" rx="82" ry="5" fill="rgba(255,255,255,0.07)"/>
            <ellipse cx="95" cy="126" rx="68" ry="3.5" fill="rgba(255,255,255,0.04)"/>
            <ellipse cx="95" cy="130" rx="55" ry="2.5" fill="rgba(255,255,255,0.02)"/>
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
            <span class="duck-word">${word.toUpperCase()}</span>
        </div>
    `;
}

function seededRandom(seed) {
    let s = seed;
    return function() {
        s = (s * 16807 + 0) % 2147483647;
        return s / 2147483647;
    };
}

// Assign each duck index a fixed spot (percentage of pond).
// Positions never change — only duck size scales.
function getFixedSpot(index) {
    // Arrange in rings around center. Each ring holds more ducks.
    // Ring 1: 6 ducks, Ring 2: 10, Ring 3: 14, etc.
    const perRing = i => 6 + i * 4;
    let ring = 0, slot = index;
    while (slot >= perRing(ring)) {
        slot -= perRing(ring);
        ring++;
    }

    const count = perRing(ring);
    const baseAngle = (slot / count) * Math.PI * 2 - Math.PI / 2;
    // Offset odd rings so ducks stagger
    const angleOffset = ring % 2 === 1 ? (Math.PI / count) : 0;
    const angle = baseAngle + angleOffset;

    // Distance from center: inner rings closer, grows outward
    // (as fraction of half-pond, starting past mama)
    const minR = 0.38; // clear mama
    const ringStep = 0.18;
    const dist = minR + ring * ringStep;

    // Per-duck jitter so it doesn't look mechanical
    const rand = seededRandom((index + 1) * 7919);
    const jitterAngle = (rand() - 0.5) * 0.3;
    const jitterDist = (rand() - 0.5) * 0.06;

    const finalAngle = angle + jitterAngle;
    const finalDist = dist + jitterDist;

    // Convert to percentage (50% = center)
    const left = 50 + Math.cos(finalAngle) * finalDist * 100;
    const top  = 50 + Math.sin(finalAngle) * finalDist * 100;

    return { left, top };
}

function layoutBabies(count, pondW, pondH) {
    if (count === 0) return { positions: [], scale: 1 };

    const babyBaseW = 110, babyBaseH = 82;
    const positions = [];
    for (let i = 0; i < count; i++) {
        positions.push(getFixedSpot(i));
    }

    // Find the scale where no ducks overlap each other
    // Convert percentage positions to pixel coords and check collisions
    for (let scale = 1.0; scale >= 0.3; scale -= 0.05) {
        const bw = babyBaseW * scale;
        const bh = babyBaseH * scale;
        const gap = 4;
        let fits = true;

        const rects = positions.map(p => ({
            x: (p.left / 100) * pondW - bw / 2,
            y: (p.top / 100) * pondH - bh / 2,
        }));

        // Check all pairs
        for (let i = 0; i < rects.length && fits; i++) {
            const a = rects[i];
            // Out of bounds?
            if (a.x < 0 || a.y < 0 || a.x + bw > pondW || a.y + bh > pondH) {
                fits = false; break;
            }
            // Overlap mama? (elliptical)
            const dx = (a.x + bw/2 - pondW/2) / (100 + bw/2 + 10);
            const dy = (a.y + bh/2 - pondH/2) / (70 + bh/2 + 10);
            if (dx*dx + dy*dy < 1) { fits = false; break; }

            for (let j = i + 1; j < rects.length; j++) {
                const b = rects[j];
                if (!(a.x + bw + gap <= b.x || b.x + bw + gap <= a.x ||
                      a.y + bh + gap <= b.y || b.y + bh + gap <= a.y)) {
                    fits = false; break;
                }
            }
        }

        if (fits) return { positions, scale };
    }

    return { positions, scale: 0.3 };
}

function rectsOverlap(a, b, pad) {
    return !(a.x + a.w + pad <= b.x || b.x + b.w + pad <= a.x ||
             a.y + a.h + pad <= b.y || b.y + b.h + pad <= a.y);
}

function render() {
    const pond = document.getElementById("pond");

    // Build the pond inner container first so we can measure it
    pond.innerHTML = '<div class="pond-inner"></div>';
    const inner = pond.querySelector(".pond-inner");
    const pondW = inner.offsetWidth;
    const pondH = inner.offsetHeight;

    const { positions, scale } = layoutBabies(foundWords.length, pondW, pondH);

    let html = createDuckHTML(parentWord, true);
    foundWords.forEach((word, i) => {
        const pos = positions[i];
        html += `<div class="duck baby" style="left:${pos.left}%;top:${pos.top}%;transform:scale(${scale})">
            ${createDuckSVG(false)}
            <span class="duck-word">${word.toUpperCase()}</span>
        </div>`;
    });
    inner.innerHTML = html;

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
