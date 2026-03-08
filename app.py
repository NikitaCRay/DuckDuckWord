import random
from collections import Counter
from pathlib import Path

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

WORDS_FILE = Path(__file__).parent / "words.txt"


def load_words():
    """Load word list from file, returning a set of lowercase words."""
    with open(WORDS_FILE, encoding="utf-8") as f:
        return {line.strip().lower() for line in f if line.strip().isalpha()}


ALL_WORDS = load_words()


def get_parent_words():
    """Return all 7-letter words with at least 5 unique letters for variety."""
    return [w for w in ALL_WORDS if len(w) == 7 and len(set(w)) >= 5]


PARENT_WORDS = get_parent_words()


def can_make_word(sub_word, parent_word):
    """Check if sub_word can be spelled using only letters from parent_word."""
    parent_counts = Counter(parent_word)
    sub_counts = Counter(sub_word)
    return all(sub_counts[ch] <= parent_counts.get(ch, 0) for ch in sub_counts)


def find_valid_sub_words(parent_word, min_length=4):
    """Find all valid English words that can be made from parent_word's letters."""
    return sorted(
        w for w in ALL_WORDS
        if len(w) >= min_length and len(w) <= len(parent_word) and w != parent_word and can_make_word(w, parent_word)
    )


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/new-game")
def new_game():
    """Pick a random 7-letter word and return it with the count of valid sub-words."""
    # Keep picking until we find a word with enough valid sub-words to be fun
    for _ in range(200):
        word = random.choice(PARENT_WORDS)
        valid_words = find_valid_sub_words(word)
        if len(valid_words) >= 15:
            return jsonify({
                "parent_word": word,
                "total_words": len(valid_words),
            })
    # Fallback
    word = random.choice(PARENT_WORDS)
    valid_words = find_valid_sub_words(word)
    return jsonify({
        "parent_word": word,
        "total_words": len(valid_words),
    })


@app.route("/api/answers/<parent_word>")
def get_answers(parent_word):
    """Return all valid sub-words for a given parent word (testing endpoint)."""
    parent_word = parent_word.lower().strip()
    words = find_valid_sub_words(parent_word)
    return jsonify({"parent_word": parent_word, "total": len(words), "words": words})


@app.route("/api/check-word", methods=["POST"])
def check_word():
    """Check if a submitted word is valid for the current parent word."""
    data = request.get_json()
    parent_word = data.get("parent_word", "").lower().strip()
    guess = data.get("guess", "").lower().strip()

    if guess == parent_word:
        return jsonify({"valid": False, "reason": "That's the mama duck word!"})

    if len(guess) < 4:
        return jsonify({"valid": False, "reason": "Word must be at least 4 letters."})

    if not can_make_word(guess, parent_word):
        parent_counts = Counter(parent_word)
        guess_counts = Counter(guess)
        bad_letters = [ch for ch in guess_counts if ch not in parent_counts]
        overused = [ch for ch in guess_counts if ch in parent_counts and guess_counts[ch] > parent_counts[ch]]
        if bad_letters:
            formatted = ", ".join(f'"{ch.upper()}"' for ch in sorted(bad_letters))
            return jsonify({"valid": False, "reason": f"Letter {formatted} is not in the word."})
        if overused:
            formatted = ", ".join(f'"{ch.upper()}"' for ch in sorted(overused))
            return jsonify({"valid": False, "reason": f"Too many {formatted} — not enough in the word."})
        return jsonify({"valid": False, "reason": "Can't make that word from the given letters."})

    if guess not in ALL_WORDS:
        return jsonify({"valid": False, "reason": "Not a recognized English word."})

    return jsonify({"valid": True, "word": guess})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
