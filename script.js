/* ══════════════════════════════════════════════
   AI INSPIRE GENERATOR — script.js
   Author: Valli | Portfolio Project 2025
   
   How this file works:
   1. On page load → show default quote from local bank
   2. "New Quote" button → pick random quote from local quotes
   3. "Copy" button  → copy text to clipboard
   4. "Listen" button → use Web Speech API (SpeechSynthesis)
   5. "Save" button  → save to localStorage, re-render favorites
   6. "Share" button → open WhatsApp with pre-filled message
   7. Search input   → live filter favorites
   8. Theme toggle   → switch dark/light, save preference
   NOTE: Using local quotes bank (no API) — works everywhere!
══════════════════════════════════════════════ */

// ── 1. DOM REFERENCES ──────────────────────────────────────────────────-
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

// Gradient classes to rotate on new quote
const gradients = ['gradient-1', 'gradient-2', 'gradient-3', 'gradient-4'];
let gradientIndex = 0;

// Speech Synthesis state
let isSpeaking = false;

// ── 3. LOCAL QUOTES BANK (60 quotes — 10 per category) ──────────────────
/*
  WHY LOCAL QUOTES?
  Free APIs like Quotable.io and ZenQuotes have CORS issues
  and sometimes go offline. Local quotes work 100% everywhere —
  localhost, Netlify, GitHub Pages, offline — with zero errors!
*/
const categoryQuotes = {

  // 🔥 MOTIVATION — 10 quotes
  motivational: [
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "You are never too old to set another goal or dream a new dream.", author: "C.S. Lewis" },
    { text: "Act as if what you do makes a difference. It does.", author: "William James" },
    { text: "With the new day comes new strength and new thoughts.", author: "Eleanor Roosevelt" },
    { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
    { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  ],

  // 🏆 SUCCESS — 10 quotes
  success: [
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
    { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
    { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "If you really look closely, most overnight successes took a long time.", author: "Steve Jobs" },
    { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
    { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
    { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
    { text: "There are no secrets to success. It is the result of preparation and hard work.", author: "Colin Powell" },
  ],

  // 🌿 LIFE — 10 quotes
  life: [
    { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa" },
    { text: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt" },
    { text: "Always remember that you are absolutely unique. Just like everyone else.", author: "Margaret Mead" },
    { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
    { text: "You will face many defeats in life, but never let yourself be defeated.", author: "Maya Angelou" },
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
    { text: "Life is not measured by the number of breaths we take, but by the moments that take our breath away.", author: "Maya Angelou" },
    { text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost" },
  ],

  // 💻 CODING & TECH — 10 quotes
  technology: [
    { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
    { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { text: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine" },
    { text: "The most disastrous thing that you can ever learn is your first programming language.", author: "Alan Kay" },
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
    { text: "Before software can be reusable it first has to be usable.", author: "Ralph Johnson" },
    { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  ],

  // 🤖 AI & FUTURE — 10 quotes
  future: [
    { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { text: "AI is the new electricity.", author: "Andrew Ng" },
    { text: "The science of today is the technology of tomorrow.", author: "Edward Teller" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "Artificial intelligence is growing up fast, as are robots whose facial expressions can elicit empathy and make your mirror neurons fire.", author: "Diane Ackerman" },
    { text: "The real question is, when will we draft an artificial intelligence bill of rights?", author: "Gray Scott" },
    { text: "Machine intelligence is the last invention that humanity will ever need to make.", author: "Nick Bostrom" },
    { text: "We are entering a new world that is being shaped by data and machine learning.", author: "Sundar Pichai" },
    { text: "The pace of progress in artificial intelligence is incredibly fast.", author: "Elon Musk" },
    { text: "Forget artificial intelligence — in the brave new world of big data, it's artificial idiocy we should be worried about.", author: "Tom Chatfield" },
  ],

  // 📚 EDUCATION — 10 quotes
  education: [
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
    { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
    { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
    { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
    { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
    { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
    { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
    { text: "The function of education is to teach one to think intensively and to think critically.", author: "Martin Luther King Jr." },
    { text: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.", author: "Abigail Adams" },
  ],

};

// All quotes combined for "All Topics" option
const allQuotes = Object.values(categoryQuotes).flat();

// ── 4. FETCH QUOTE (from local bank) ────────────────────────────────────
/**
 * fetchQuote(tag)
 * Picks a random quote from our local quotes bank.
 * No API call needed — works 100% offline and on any host!
 *
 * @param {string} tag - category key (e.g. 'motivational', 'success')
 * @returns {Object} { text, author }
 */
async function fetchQuote(tag = '') {
  // Small delay to show the loading spinner (better UX)
  await new Promise(resolve => setTimeout(resolve, 600));

  // Pick from selected category or all quotes
  const pool = categoryQuotes[tag] || allQuotes;

  // Get a random quote from the pool
  const random = pool[Math.floor(Math.random() * pool.length)];

  return { text: random.text, author: random.author };
}

// ── 5. DISPLAY QUOTE ────────────────────────────────────────────────────
/**
 * displayQuote(text, author)
 * Updates the DOM to show the new quote with a smooth fade effect.
 */
function displayQuote(text, author) {
  // Fade out first
  quoteText.classList.add('fading');

  setTimeout(() => {
    // Update the quote text and author
    quoteText.textContent = text;
    quoteAuthor.textContent = `— ${author}`;
    charCounter.textContent = `${text.length} characters`;

    // Rotate the card background gradient for visual variety
    quoteCard.classList.remove(...gradients);
    gradientIndex = (gradientIndex + 1) % gradients.length;
    quoteCard.classList.add(gradients[gradientIndex]);

    // Fade back in
    quoteText.classList.remove('fading');
  }, 250);
}

// ── 6. LOAD NEW QUOTE ───────────────────────────────────────────────────
/**
 * loadNewQuote()
 * Called when user clicks "New Quote" or changes category.
 * Shows loader, fetches from local bank, then displays.
 */
async function loadNewQuote() {
  const tag = categorySelect.value; // e.g. 'motivational', 'success', ''

  // Show loading spinner
  showLoader();

  try {
    const quote = await fetchQuote(tag);
    currentQuote = quote;           // Save globally for copy/speak/share
    displayQuote(quote.text, quote.author);
    hideLoader();
  } catch (error) {
    // Fallback — should rarely happen with local quotes
    console.error('Failed to load quote:', error);
    hideLoader();
    showFallbackQuote();
    showToast('⚠️ Something went wrong. Showing a backup quote!');
  }
}

// ── 7. FALLBACK QUOTES (emergency backup) ───────────────────────────────
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

// ── 8. SHOW / HIDE LOADER ────────────────────────────────────────────────
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

// ── 9. COPY QUOTE ────────────────────────────────────────────────────────
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

// ── 10. SPEECH SYNTHESIS (Voice Reading) ─────────────────────────────────
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
  utterance.rate   = 0.88;
  utterance.pitch  = 1.05;
  utterance.volume = 1;

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

// ── 11. SAVE TO FAVORITES ────────────────────────────────────────────────
function saveToFavorites() {
  const favorites = getFavorites();

  const isDuplicate = favorites.some(f => f.text === currentQuote.text);
  if (isDuplicate) {
    showToast('✦ Already saved!');
    return;
  }

  const newFav = {
    id     : Date.now(),
    text   : currentQuote.text,
    author : currentQuote.author,
    date   : new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
  };

  favorites.unshift(newFav);
  saveFavorites(favorites);
  renderFavorites();
  updateFavBadge();

  showToast('❤️ Saved to favorites!');
  saveBtn.innerHTML = '<i class="fa-solid fa-bookmark"></i> Saved!';
  setTimeout(() => {
    saveBtn.innerHTML = '<i class="fa-regular fa-bookmark"></i> Save';
  }, 2000);
}

// ── 12. LOCALSTORAGE HELPERS ─────────────────────────────────────────────
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('ai_inspire_favorites')) || [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites) {
  localStorage.setItem('ai_inspire_favorites', JSON.stringify(favorites));
}

function deleteFavorite(id) {
  const updated = getFavorites().filter(f => f.id !== id);
  saveFavorites(updated);
  renderFavorites();
  updateFavBadge();
  showToast('🗑️ Removed from favorites.');
}

function clearAllFavorites() {
  if (!confirm('Clear all saved quotes? This cannot be undone.')) return;
  localStorage.removeItem('ai_inspire_favorites');
  renderFavorites();
  updateFavBadge();
  showToast('🗑️ All favorites cleared.');
}

// ── 13. RENDER FAVORITES ─────────────────────────────────────────────────
function renderFavorites(filter = '') {
  const favorites = getFavorites();
  const query     = filter.toLowerCase().trim();

  const filtered = query
    ? favorites.filter(f =>
        f.text.toLowerCase().includes(query) ||
        f.author.toLowerCase().includes(query)
      )
    : favorites;

  emptyState.classList.toggle('hidden', filtered.length > 0);
  favoritesGrid.innerHTML = '';

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

function escapeAttr(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '&quot;');
}

async function copyFav(text, author) {
  try {
    await navigator.clipboard.writeText(`"${text}" — ${author}`);
    showToast('✅ Copied!');
  } catch {
    showToast('⚠️ Copy failed.');
  }
}

function updateFavBadge() {
  const count = getFavorites().length;
  if (count > 0) {
    favCount.textContent = count;
    favCount.classList.remove('hidden');
  } else {
    favCount.classList.add('hidden');
  }
}

// ── 14. SHARE TO WHATSAPP ────────────────────────────────────────────────
function shareToWhatsApp(text = currentQuote.text, author = currentQuote.author) {
  const message = `✨ *AI Inspire* — Quote of the Day\n\n"${text}"\n— ${author}\n\n🔗 Get yours at: https://github.com/Nagavalli-76`;
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/?text=${encoded}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

// ── 15. TOAST NOTIFICATION ───────────────────────────────────────────────
let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.remove('hidden');
  void toast.offsetWidth;
  toast.classList.add('show');

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 400);
  }, 2800);
}

// ── 16. DARK / LIGHT THEME TOGGLE ────────────────────────────────────────
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';

  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeToggle.innerHTML = isDark
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';

  localStorage.setItem('ai_inspire_theme', isDark ? 'light' : 'dark');
}

function applyStoredTheme() {
  const saved = localStorage.getItem('ai_inspire_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  themeToggle.innerHTML = saved === 'dark'
    ? '<i class="fa-solid fa-moon"></i>'
    : '<i class="fa-solid fa-sun"></i>';
}

// ── 17. EVENT LISTENERS ──────────────────────────────────────────────────
newQuoteBtn.addEventListener('click', loadNewQuote);
copyBtn.addEventListener('click', copyQuote);
speakBtn.addEventListener('click', speakQuote);
saveBtn.addEventListener('click', saveToFavorites);
whatsappBtn.addEventListener('click', () => shareToWhatsApp());
themeToggle.addEventListener('click', toggleTheme);
clearAllBtn.addEventListener('click', clearAllFavorites);
categorySelect.addEventListener('change', loadNewQuote);
searchInput.addEventListener('input', () => renderFavorites(searchInput.value));

// ── 18. INITIALISE APP ───────────────────────────────────────────────────
function init() {
  applyStoredTheme();
  renderFavorites();
  updateFavBadge();
  charCounter.textContent = `${currentQuote.text.length} characters`;
}

document.addEventListener('DOMContentLoaded', init);
