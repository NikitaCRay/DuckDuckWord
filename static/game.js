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
        showMessage(`"${data.word.toUpperCase()}" is correct!`, "success");
        render();
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
            <!-- Tail feathers -->
            <path d="M25 68 Q8 45, 18 30 Q22 38, 28 50 Q14 35, 22 20 Q28 32, 32 48" fill="#B8860B" opacity="0.9"/>
            <path d="M22 65 Q5 50, 12 35 Q18 42, 25 52" fill="#A07608" opacity="0.7"/>
            <!-- Body -->
            <ellipse cx="95" cy="78" rx="72" ry="45" fill="url(#parentBody)"/>
            <!-- Wing -->
            <ellipse cx="80" cy="75" rx="40" ry="28" fill="#B8860B" opacity="0.6" transform="rotate(-8 80 75)"/>
            <path d="M55 72 Q70 58, 95 62 Q85 68, 75 72 Q90 64, 108 66 Q95 73, 80 76" fill="#A07608" opacity="0.3"/>
            <!-- Neck — short and thick -->
            <path d="M140 65 C142 52, 150 42, 148 32 C147 26, 168 26, 169 32 C167 42, 162 52, 164 65" fill="url(#parentNeck)" stroke="url(#parentNeck)" stroke-width="0.5"/>
            <!-- Head — slightly tilted, elegant -->
            <ellipse cx="158" cy="28" rx="24" ry="19" fill="url(#parentHead)" transform="rotate(-5 158 28)"/>
            <!-- Forehead highlight -->
            <ellipse cx="154" cy="22" rx="10" ry="6" fill="rgba(255,255,255,0.08)" transform="rotate(-10 154 22)"/>
            <!-- Beak — longer, sleeker -->
            <path d="M178 24 Q198 22, 202 27 Q198 32, 178 31 Z" fill="url(#parentBeak)"/>
            <path d="M178 27.5 Q192 27.5, 200 27.5" fill="none" stroke="#8B5A10" stroke-width="0.7" opacity="0.6"/>
            <!-- Nostril -->
            <ellipse cx="188" cy="26" rx="1.3" ry="0.9" fill="#8B5A10" opacity="0.7"/>
            <!-- Beak tip detail -->
            <ellipse cx="200" cy="27" rx="2" ry="2.5" fill="#A86A12" opacity="0.4"/>
            <!-- Eye — larger, expressive -->
            <circle cx="165" cy="24" r="4.5" fill="#1A1A1A"/>
            <circle cx="166.5" cy="22.5" r="1.8" fill="white" opacity="0.9"/>
            <circle cx="165.5" cy="23" r="0.6" fill="white" opacity="0.4"/>
            <!-- Eyelid -->
            <path d="M160 22.5 Q165 20, 170 22.5" fill="none" stroke="#9A7209" stroke-width="0.8" opacity="0.5"/>
            <!-- Crown — tiara style -->
            <path d="M142 14 Q144 6, 148 10 Q150 2, 154 11 Q157 -2, 161 11 Q164 2, 167 10 Q170 6, 172 14" fill="url(#crownGrad)" opacity="0.9"/>
            <path d="M142 14 Q157 10, 172 14" fill="none" stroke="#C9A84C" stroke-width="1.5"/>
            <!-- Crown jewels -->
            <circle cx="148" cy="9" r="1.8" fill="#E8D68A" opacity="0.9"/>
            <circle cx="154" cy="10" r="1.4" fill="#F0E4A8" opacity="0.8"/>
            <circle cx="157" cy="-1" r="2.5" fill="#E8D68A"/>
            <circle cx="157" cy="-1" r="1.2" fill="#FFF5CC" opacity="0.7"/>
            <circle cx="161" cy="10" r="1.4" fill="#F0E4A8" opacity="0.8"/>
            <circle cx="167" cy="9" r="1.8" fill="#E8D68A" opacity="0.9"/>
            <!-- Chin / throat line -->
            <path d="M148 38 Q155 42, 164 38" fill="none" stroke="#B8860B" stroke-width="0.5" opacity="0.3"/>
            <!-- Feather detail lines on body -->
            <path d="M50 85 Q65 78, 80 82" fill="none" stroke="#A07608" stroke-width="0.6" opacity="0.3"/>
            <path d="M55 92 Q72 85, 90 88" fill="none" stroke="#A07608" stroke-width="0.6" opacity="0.3"/>
            <path d="M65 98 Q80 92, 100 95" fill="none" stroke="#A07608" stroke-width="0.6" opacity="0.3"/>
            <!-- Water ripple -->
            <ellipse cx="95" cy="122" rx="80" ry="6" fill="rgba(255,255,255,0.08)"/>
            <ellipse cx="95" cy="128" rx="65" ry="4" fill="rgba(255,255,255,0.04)"/>
            <!-- Gradients -->
            <defs>
                <linearGradient id="parentBody" x1="0" y1="0" x2="0.3" y2="1">
                    <stop offset="0%" stop-color="#DAA520"/>
                    <stop offset="100%" stop-color="#B8860B"/>
                </linearGradient>
                <linearGradient id="parentNeck" x1="0" y1="1" x2="0.3" y2="0">
                    <stop offset="0%" stop-color="#C9981A"/>
                    <stop offset="40%" stop-color="#D4A520"/>
                    <stop offset="100%" stop-color="#DBAE30"/>
                </linearGradient>
                <linearGradient id="parentHead" x1="0" y1="0" x2="0.8" y2="1">
                    <stop offset="0%" stop-color="#E8C240"/>
                    <stop offset="50%" stop-color="#DAA520"/>
                    <stop offset="100%" stop-color="#C9981A"/>
                </linearGradient>
                <linearGradient id="parentBeak" x1="0" y1="0" x2="1" y2="0.5">
                    <stop offset="0%" stop-color="#D48E1A"/>
                    <stop offset="100%" stop-color="#B87010"/>
                </linearGradient>
                <linearGradient id="crownGrad" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stop-color="#C9A84C"/>
                    <stop offset="100%" stop-color="#A68932"/>
                </linearGradient>
            </defs>
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

function render() {
    // Pond with ducks: babies on left, mama center, babies on right
    const pond = document.getElementById("pond");
    const mid = Math.ceil(foundWords.length / 2);
    const leftBabies = foundWords.slice(0, mid);
    const rightBabies = foundWords.slice(mid);

    let html = '<div class="duck-group left">';
    for (const word of leftBabies) {
        html += createDuckHTML(word, false);
    }
    html += '</div>';
    html += '<div class="duck-group center">' + createDuckHTML(parentWord, true) + '</div>';
    html += '<div class="duck-group right">';
    for (const word of rightBabies) {
        html += createDuckHTML(word, false);
    }
    html += '</div>';
    pond.innerHTML = html;

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

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    startNewGame();

    document.getElementById("submit-btn").addEventListener("click", submitGuess);

    document.getElementById("guess-input").addEventListener("keydown", (e) => {
        if (e.key === "Enter") submitGuess();
    });
});
