/* ══════════════════════════════════════════════
   AI INSPIRE GENERATOR — script.js
   Author: Valli | Portfolio Project 2025
   
   How this file works:
   1. On page load → fetch a default quote
   2. "New Quote" button → fetch from Quotable API using async/await
   3. "Copy" button  → copy text to clipboard
   4. "Listen" button → use Web Speech API (SpeechSynthesis)
   5. "Save" button  → save to localStorage, re-render favorites
   6. "Share" button → open WhatsApp with pre-filled message
   7. Search input   → live filter favorites
   8. Theme toggle   → switch dark/light, save preference
══════════════════════════════════════════════ */

// ── 1. DOM REFERENCES ───────────────────────────────────────────────────
const quoteText     = document.getElementById('quoteText');
const quoteAuthor   = document.getElementById('quoteAuthor');
const charCounter   = document.getElementById('charCounter');
const quoteCard     = document.getElementById('quoteCard');
const quoteContent  = document.getElementById('quoteContent');
const loader        = document.getElementById('loader');
const toast         = document.getElementById('toast');

const newQuoteBtn   = document.getElementById('newQuoteBtn');
const copyBtn       = document.getElementById('copyBtn');
const speakBtn      = document.getElementById('speakBtn');
const saveBtn       = document.getElementById('saveBtn');
const whatsappBtn   = document.getElementById('whatsappBtn');

const categorySelect= document.getElementById('categorySelect');
const themeToggle   = document.getElementById('themeToggle');

const favoritesGrid = document.getElementById('favoritesGrid');
const emptyState    = document.getElementById('emptyState');
const searchInput   = document.getElementById('searchInput');
const clearAllBtn   = document.getElementById('clearAllBtn');
const favCount      = document.getElementById('favCount');

// ── 2. STATE ────────────────────────────────────────────────────────────
let currentQuote = {
  text: "The best way to predict the future is to create it.",
  author: "Peter Drucker"
};

// Map our categories to Quotable API tags
const categoryTagMap = {
  motivational : "motivational",
  success      : "success",
  life         : "life",
  technology   : "technology",
  future       : "future",
  education    : "education"
};

// Gradient classes to rotate on new quote
const gradients = ['gradient-1', 'gradient-2', 'gradient-3', 'gradient-4'];
let gradientIndex = 0;

// Speech Synthesis
let isSpeaking = false;

// ── 3. API FUNCTION ─────────────────────────────────────────────────────
/**
 * fetchQuote()
 * Calls the free Quotable.io API to get a random quote.
 * Uses async/await for clean, readable asynchronous code.
 * 
 * @param {string} tag - optional category tag to filter quotes
 * @returns {Object} { text, author }
 */
async function fetchQuote(tag = '') {
  // Build the API URL
  // e.g. https://api.quotable.io/random?tags=motivational&maxLength=200
  let url = 'https://api.quotable.io/random?maxLength=220';
  if (tag) url += `&tags=${tag}`;

  const response = await fetch(url);

  // If the API returns a bad status, throw an error
  if (!response.ok) throw new Error(`API error: ${response.status}`);

  const data = await response.json();
  return { text: data.content, author: data.author };
}

// ── 4. DISPLAY QUOTE ────────────────────────────────────────────────────
/**
 * displayQuote(text, author)
 * Updates the DOM to show the new quote with a smooth fade effect.
 */
function displayQuote(text, author) {
  // Fade out
  quoteText.classList.add('fading');

  setTimeout(() => {
    // Update text
    quoteText.textContent = text;
    quoteAuthor.textContent = `— ${author}`;
    charCounter.textContent = `${text.length} characters`;

    // Rotate gradient background
    quoteCard.classList.remove(...gradients);
    gradientIndex = (gradientIndex + 1) % gradients.length;
    quoteCard.classList.add(gradients[gradientIndex]);

    // Fade back in
    quoteText.classList.remove('fading');
  }, 250);
}

// ── 5. LOAD NEW QUOTE ───────────────────────────────────────────────────
/**
 * loadNewQuote()
 * Called when user clicks "New Quote" button.
 * Shows loader, fetches, then displays.
 */
async function loadNewQuote() {
  const tag = categoryTagMap[categorySelect.value] || '';

  // Show loading spinner
  showLoader();

  try {
    // Await the API call
    const quote = await fetchQuote(tag);

    currentQuote = quote;         // Save globally for other buttons
    displayQuote(quote.text, quote.author);

    hideLoader();
  } catch (error) {
    // If API fails, show error message and fallback quote
    console.error('Failed to fetch quote:', error);
    hideLoader();
    showFallbackQuote();
    showToast('⚠️ API unavailable. Showing a saved quote!');
  }
}

// ── 6. FALLBACK QUOTES (if API fails) ───────────────────────────────────
const fallbackQuotes = [
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
];

function showFallbackQuote() {
  const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  currentQuote = random;
  displayQuote(random.text, random.author);
}

// ── 7. SHOW / HIDE LOADER ────────────────────────────────────────────────
function showLoader() {
  loader.classList.remove('hidden');
  quoteContent.style.opacity = '0';
  quoteContent.style.pointerEvents = 'none';
  newQuoteBtn.disabled = true;
  newQuoteBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
}

function hideLoader() {
  loader.classList.add('hidden');
  quoteContent.style.opacity = '1';
  quoteContent.style.pointerEvents = '';
  newQuoteBtn.disabled = false;
  newQuoteBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> New Quote';
}

// ── 8. COPY QUOTE ────────────────────────────────────────────────────────
/**
 * copyQuote()
 * Uses the modern Clipboard API to copy the current quote.
 */
async function copyQuote() {
  const textToCopy = `"${currentQuote.text}" — ${currentQuote.author}`;

  try {
    await navigator.clipboard.writeText(textToCopy);
    showToast('✅ Quote copied to clipboard!');

    // Visual feedback on button
    copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    setTimeout(() => {
      copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
    }, 2000);
  } catch {
    showToast('⚠️ Could not copy — try manually.');
  }
}

// ── 9. SPEECH SYNTHESIS (Voice Reading) ─────────────────────────────────
/**
 * speakQuote()
 * Uses the browser's built-in Web Speech API (SpeechSynthesis)
 * to read the current quote aloud. No external API needed!
 */
function speakQuote() {
  // Stop if already speaking
  if (isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    speakBtn.classList.remove('btn-speaking');
    speakBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
    return;
  }

  if (!window.speechSynthesis) {
    showToast('⚠️ Speech not supported in your browser.');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(
    `${currentQuote.text}. By ${currentQuote.author}.`
  );
  utterance.rate   = 0.88;   // Slightly slower for clarity
  utterance.pitch  = 1.05;
  utterance.volume = 1;

  // Update button state while speaking
  utterance.onstart = () => {
    isSpeaking = true;
    speakBtn.classList.add('btn-speaking');
    speakBtn.innerHTML = '<i class="fa-solid fa-stop"></i> Stop';
  };

  utterance.onend = () => {
    isSpeaking = false;
    speakBtn.classList.remove('btn-speaking');
    speakBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
  };

  window.speechSynthesis.speak(utterance);
}

// ── 10. SAVE TO FAVORITES ────────────────────────────────────────────────
/**
 * saveToFavorites()
 * Saves the current quote to localStorage and re-renders the grid.
 * Each quote gets a unique ID based on timestamp.
 */
function saveToFavorites() {
  const favorites = getFavorites();

  // Prevent duplicate saves
  const isDuplicate = favorites.some(f => f.text === currentQuote.text);
  if (isDuplicate) {
    showToast('✦ Already saved!');
    return;
  }

  const newFav = {
    id     : Date.now(),           // Unique ID
    text   : currentQuote.text,
    author : currentQuote.author,
    date   : new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
  };

  favorites.unshift(newFav);      // Add to front of array
  saveFavorites(favorites);
  renderFavorites();
  updateFavBadge();

  showToast('❤️ Saved to favorites!');
  saveBtn.innerHTML = '<i class="fa-solid fa-bookmark"></i> Saved!';
  setTimeout(() => {
    saveBtn.innerHTML = '<i class="fa-regular fa-bookmark"></i> Save';
  }, 2000);
}

// ── 11. LOCALSTORAGE HELPERS ─────────────────────────────────────────────
/** Get favorites array from localStorage */
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('ai_inspire_favorites')) || [];
  } catch {
    return [];
  }
}

/** Save favorites array to localStorage */
function saveFavorites(favorites) {
  localStorage.setItem('ai_inspire_favorites', JSON.stringify(favorites));
}

/** Delete a single favorite by ID */
function deleteFavorite(id) {
  const updated = getFavorites().filter(f => f.id !== id);
  saveFavorites(updated);
  renderFavorites();
  updateFavBadge();
  showToast('🗑️ Removed from favorites.');
}

/** Clear all favorites */
function clearAllFavorites() {
  if (!confirm('Clear all saved quotes? This cannot be undone.')) return;
  localStorage.removeItem('ai_inspire_favorites');
  renderFavorites();
  updateFavBadge();
  showToast('🗑️ All favorites cleared.');
}

// ── 12. RENDER FAVORITES ─────────────────────────────────────────────────
/**
 * renderFavorites(filter)
 * Reads from localStorage and builds the favorites grid.
 * Optionally filters by search keyword.
 */
function renderFavorites(filter = '') {
  const favorites = getFavorites();
  const query     = filter.toLowerCase().trim();

  // Apply search filter
  const filtered = query
    ? favorites.filter(f =>
        f.text.toLowerCase().includes(query) ||
        f.author.toLowerCase().includes(query)
      )
    : favorites;

  // Show or hide empty state
  emptyState.classList.toggle('hidden', filtered.length > 0);
  favoritesGrid.innerHTML = '';

  // Build a card for each saved quote
  filtered.forEach(fav => {
    const card = document.createElement('div');
    card.className = 'fav-card';
    card.innerHTML = `
      <p class="fav-quote">"${fav.text}"</p>
      <span class="fav-author">— ${fav.author}</span>
      <div class="fav-card-footer">
        <span class="fav-date">${fav.date}</span>
        <div class="fav-actions">
          <button class="fav-action-btn" title="Copy" onclick="copyFav('${escapeAttr(fav.text)}', '${escapeAttr(fav.author)}')">
            <i class="fa-regular fa-copy"></i>
          </button>
          <button class="fav-action-btn" title="Share on WhatsApp" onclick="shareToWhatsApp('${escapeAttr(fav.text)}', '${escapeAttr(fav.author)}')">
            <i class="fa-brands fa-whatsapp"></i>
          </button>
          <button class="fav-action-btn delete" title="Remove" onclick="deleteFavorite(${fav.id})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
    favoritesGrid.appendChild(card);
  });
}

/** Escape quotes/special chars for inline HTML attributes */
function escapeAttr(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '&quot;');
}

/** Copy a favorite quote to clipboard */
async function copyFav(text, author) {
  try {
    await navigator.clipboard.writeText(`"${text}" — ${author}`);
    showToast('✅ Copied!');
  } catch {
    showToast('⚠️ Copy failed.');
  }
}

/** Update the bookmark badge in navbar */
function updateFavBadge() {
  const count = getFavorites().length;
  if (count > 0) {
    favCount.textContent = count;
    favCount.classList.remove('hidden');
  } else {
    favCount.classList.add('hidden');
  }
}

// ── 13. SHARE TO WHATSAPP ────────────────────────────────────────────────
/**
 * shareToWhatsApp(text, author)
 * Opens WhatsApp with a pre-filled inspirational message.
 * Works on both mobile (app) and desktop (web.whatsapp.com).
 */
function shareToWhatsApp(text = currentQuote.text, author = currentQuote.author) {
  const message = `✨ *AI Inspire* — Quote of the Day\n\n"${text}"\n— ${author}\n\n🔗 Get yours at: https://github.com/Nagavalli-76`;
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/?text=${encoded}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

// ── 14. TOAST NOTIFICATION ───────────────────────────────────────────────
let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.remove('hidden');

  // Force reflow for animation to re-trigger
  void toast.offsetWidth;
  toast.classList.add('show');

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 400);
  }, 2800);
}

// ── 15. DARK / LIGHT THEME TOGGLE ────────────────────────────────────────
/**
 * Saves theme preference in localStorage so it persists on refresh.
 */
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';

  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeToggle.innerHTML = isDark
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';

  localStorage.setItem('ai_inspire_theme', isDark ? 'light' : 'dark');
}

/** Apply saved theme on page load */
function applyStoredTheme() {
  const saved = localStorage.getItem('ai_inspire_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  themeToggle.innerHTML = saved === 'dark'
    ? '<i class="fa-solid fa-moon"></i>'
    : '<i class="fa-solid fa-sun"></i>';
}

// ── 16. EVENT LISTENERS ──────────────────────────────────────────────────
newQuoteBtn.addEventListener('click', loadNewQuote);
copyBtn.addEventListener('click', copyQuote);
speakBtn.addEventListener('click', speakQuote);
saveBtn.addEventListener('click', saveToFavorites);
whatsappBtn.addEventListener('click', () => shareToWhatsApp());
themeToggle.addEventListener('click', toggleTheme);
clearAllBtn.addEventListener('click', clearAllFavorites);

// Category change → fetch new quote in that category
categorySelect.addEventListener('change', loadNewQuote);

// Live search in favorites
searchInput.addEventListener('input', () => {
  renderFavorites(searchInput.value);
});

// ── 17. INITIALISE APP ───────────────────────────────────────────────────
/**
 * init()
 * Called once when the page finishes loading.
 * Sets theme, renders saved favorites, and shows the initial char count.
 */
function init() {
  applyStoredTheme();
  renderFavorites();
  updateFavBadge();

  // Show char count for default quote
  charCounter.textContent = `${currentQuote.text.length} characters`;
}

// Run init when DOM is ready
document.addEventListener('DOMContentLoaded', init);
