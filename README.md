# ✨ AI Inspire Generator

> **Your daily dose of wisdom — generate, save, listen & share motivational quotes instantly.**

![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Netlify](https://img.shields.io/badge/Deployed_on-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

---

## 🔗 Live Demo

👉 **[View Live Project](https://ai-inspire.netlify.app/)**

---

## 📌 About the Project

**AI Inspire Generator** is a fully responsive web application that delivers motivational quotes across 6 curated categories. Built with pure HTML, CSS, and JavaScript — no frameworks, no dependencies, no API keys required.

The project features a premium dark-mode UI with glassmorphism design, smooth animations, voice reading via the Web Speech API, persistent favorites using localStorage, and direct WhatsApp sharing — making it portfolio-ready and production-level.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎲 Quote Generator | Instantly generate quotes from a bank of 60+ curated quotes |
| 🗂️ 6 Categories | Motivation · Success · Life · Coding & Tech · AI & Future · Education |
| 🔊 Voice Reading | Listen to quotes using the browser's built-in Web Speech API |
| 📋 Copy Quote | One-click copy to clipboard with visual confirmation |
| 💾 Save Favorites | Save unlimited quotes to localStorage — persists on refresh |
| 🔍 Search Favorites | Live search through all saved quotes by text or author |
| 📱 WhatsApp Share | Share any quote directly to WhatsApp with one click |
| 🌙 Dark / Light Mode | Theme toggle with preference saved across sessions |
| 📱 Fully Responsive | Optimized for mobile, tablet, and desktop |
| ⚡ Offline Ready | Works without internet — no external API dependency |

---

## 🗂️ Project Structure

```
AI-Inspire-Generator/
│
├── index.html       ← Page structure, sections & layout
├── style.css        ← All styling, animations, dark/light themes
├── script.js        ← App logic, quote bank, localStorage, events
└── README.md        ← Project documentation
```

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Page structure and semantic markup |
| CSS3 | Glassmorphism design, CSS variables, keyframe animations |
| JavaScript (ES6+) | Async/await, DOM manipulation, localStorage |
| Web Speech API | Built-in browser voice reading — no API key needed |
| Clipboard API | One-click quote copying |
| localStorage | Persistent favorites storage across sessions |
| Google Fonts | Playfair Display + DM Sans typography |
| Font Awesome 6 | Icons throughout the UI |

---

## 📂 File Descriptions

### `index.html`
Contains the complete page structure including:
- Fixed navbar with dark/light theme toggle and favorites badge counter
- Hero section with animated floating background orbs
- Category dropdown filter (6 categories)
- Quote display card with all action buttons
- Favorites grid section with live search and clear all functionality
- Footer with GitHub, LinkedIn, and Twitter social links

### `style.css`
Contains all styling with:
- CSS custom properties (variables) for scalable theming
- Dark and light theme definitions using `data-theme` attribute
- Glassmorphism card effects using `backdrop-filter: blur()`
- Smooth keyframe animations — `fadeDown`, `fadeUp`, `float`, `spin`, `pulse-gold`
- Fully responsive layout using Flexbox and CSS Grid
- Fixed dropdown option colors for consistent dark theme display

### `script.js`
Contains all application logic across 18 clearly commented sections:
- **60 built-in quotes** organized across 6 categories (10 per category)
- Quote display with smooth fade transition on every new quote
- Web Speech API integration for text-to-speech voice reading
- localStorage helpers for save, delete, and clear favorites
- Live search filtering for saved quotes by text or author name
- WhatsApp deep link generation with pre-filled message
- Toast notification system for all user actions
- Dark/light theme toggle with `localStorage` preference persistence

---

##  Getting Started

### Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/Nagavalli-76/AI-Inspire-Generator.git

# 2. Navigate into the project folder
cd AI-Inspire-Generator

# 3. Open with VS Code Live Server
# Right-click index.html → "Open with Live Server"

# OR use Python's built-in server
python -m http.server 8000
# Then visit: http://localhost:8000
```

> ⚠️ Do NOT open by double-clicking `index.html` directly — use Live Server or a local server to avoid browser security restrictions.

---

## ☁️ Deployment

### Netlify (Recommended — Free)

1. Go to [netlify.com](https://netlify.com) and sign in with GitHub
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag and drop your entire project folder
4. Your site goes live instantly with a free `https://` URL ✅

### GitHub Pages (Free)

1. Push your code to a public GitHub repository
2. Go to **Settings** → **Pages** (left sidebar)
3. Source: **Deploy from a branch** → Branch: `main` → Folder: `/ (root)`
4. Click **Save** — live at `https://Nagavalli-76.github.io/AI-Inspire-Generator` ✅

---

## 💡 Key Concepts Demonstrated

- **Async/Await** — Clean, readable asynchronous JavaScript patterns
- **DOM Manipulation** — Dynamic content rendering without any framework
- **localStorage API** — Persistent client-side data storage with JSON
- **Web Speech API** — Native browser text-to-speech, zero dependencies
- **Clipboard API** — Modern one-click clipboard interaction
- **CSS Custom Properties** — Scalable design token system for theming
- **Event Listeners** — Efficient and organized event handling
- **Responsive Design** — Mobile-first layout with CSS Flexbox and Grid
- **Error Handling** — try/catch blocks with graceful fallback quotes

---

## 📄 Resume Description

> **AI Inspire Generator** | HTML5 · CSS3 · JavaScript · Web Speech API · localStorage
>
> Developed a fully responsive motivational quote web app featuring 60+ curated quotes across 6 categories, voice reading via SpeechSynthesis API, localStorage-based favorites with live search, WhatsApp sharing, and dark/light theme persistence. Implemented glassmorphism UI with smooth CSS animations and deployed on Netlify.

---

## 🔮 Future Improvements

- [ ] Add user-submitted custom quotes
- [ ] Export saved favorites as a downloadable PDF
- [ ] Daily quote push notifications (PWA + Service Worker)
- [ ] Twitter / Instagram share integration
- [ ] Quote of the Day auto-feature on page load

---

## 👩‍💻 Author

**Nagavalli**
B.Tech Artificial Intelligence & Machine Learning | ACETR23 | Batch 2023–2027

[![GitHub](https://img.shields.io/badge/GitHub-Nagavalli--76-181717?style=flat&logo=github)](https://github.com/Nagavalli-76)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/nagavalli-kodidasu-98384b340/)

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

*"The secret of getting ahead is getting started."* — Mark Twain

⭐ **If you found this project helpful, please give it a star!** ⭐

</div>
