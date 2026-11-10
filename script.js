const sites = [
  {
    name: "Games Unblocked",
    url: "https://games-unblocked.org/",
    category: "games",
    icon: "🎮",
    description: "A big portal of free browser games by genre."
  },
  {
    name: "Radon Games",
    url: "https://mathclass.vercel.app/",
    category: "games",
    icon: "☢️",
    description: "An open-source unblocked games site."
  },
  {
    name: "Equinox",
    url: "https://searchequinox.com/",
    category: "games",
    icon: "🌗",
    description: "Games and apps portal. Free to use; skip the paid tier."
  },
  {
    name: "Classic HTML5 Games",
    url: "https://tommalbran.github.io/games/",
    category: "community",
    icon: "🕹️",
    description: "Snake, Tetris, Pacman and other classic arcade games."
  },
  {
    name: "GitHub Classic Games",
    url: "https://dasper.github.io/github-games",
    category: "community",
    icon: "👾",
    description: "A collection of classic open source games."
  },
  {
    name: "Unblocked Gaming",
    url: "https://bio.link/unblockedgaming",
    category: "community",
    icon: "🔗",
    description: "A link page of games and mirror sites."
  },
  {
    name: "PeteZah",
    url: "https://999hourly.cfd/",
    category: "other",
    icon: "🎯",
    description: "A games page behind a quick verify screen."
  },
  {
    name: "Soupcan Games",
    url: "https://soupcan.pages.dev/g",
    category: "games",
    icon: "🥫",
    description: "A collection of browser games to explore."
  },
  {
    name: "Kylebob",
    url: "https://kylebob.com/",
    category: "games",
    icon: "🅺",
    description: "A browser game site with a simple, fun vibe."
  },
  {
    name: "Chicken Kings Vault",
    url: "https://wanocapy.github.io/ChickenKingsVault/",
    category: "games",
    icon: "🐔",
    description: "Explore the Chicken Kings Vault and more."
  },
  {
    name: "Coolmath Games",
    url: "https://www.coolmathgames.com/",
    category: "games",
    icon: "🌐",
    description: "Puzzles, strategy and casual games."
  },
  {
    name: "Velara",
    url: "http://velara.cc",
    category: "games",
    icon: "V",
    description: "An external gaming link from your collection."
  },
  {
    name: "Levitr",
    url: "https://f3a4e576.levitr.cfd/",
    category: "other",
    icon: "↗",
    description: "An external link; check the address before opening."
  },
  {
    name: "Fern",
    url: "https://s3.amazonaws.com/frnbk/index.html",
    category: "other",
    icon: "🌿",
    description: "An external link hosted on Amazon S3."
  },
  {
    name: "Azure Link",
    url: "https://wzf9.z19.web.core.windows.net/",
    category: "other",
    icon: "☁️",
    description: "An external link hosted on Microsoft Azure."
  },
  {
    name: "EduSecurify",
    url: "https://blog.free-dyndns.org/",
    category: "other",
    icon: "🎓",
    description: "An external link; opens a study-themed landing page."
  },
  {
    name: "SVG File",
    url: "https://cdn.jsdelivr.net/gh/homeworkpractive/svg@main/index.svg",
    category: "other",
    icon: "SVG",
    description: "An SVG file link, not a standard game page."
  }
];

const grid = document.querySelector("#siteGrid");
const search = document.querySelector("#search");
const emptyState = document.querySelector("#emptyState");
const resultCount = document.querySelector("#resultCount");
const filterButtons = [...document.querySelectorAll("[data-filter]")];

let activeFilter = "all";

const categoryNames = {
  games: "Game Hub",
  community: "Community",
  other: "Other"
};

function safeHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function renderSites() {
  const query = search.value.trim().toLowerCase();

  const filtered = sites.filter(site => {
    const matchesCategory = activeFilter === "all" || site.category === activeFilter;
    const searchable = `${site.name} ${site.description} ${safeHost(site.url)} ${categoryNames[site.category]}`.toLowerCase();
    return matchesCategory && searchable.includes(query);
  });

  grid.replaceChildren();

  for (const site of filtered) {
    const card = document.createElement("article");
    card.className = "site-card";

    const top = document.createElement("div");
    top.className = "card-top";

    const icon = document.createElement("div");
    icon.className = "site-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = site.icon;

    const external = document.createElement("span");
    external.className = "external-mark";
    external.setAttribute("aria-hidden", "true");
    external.textContent = "↗";

    top.append(icon, external);

    const title = document.createElement("h3");
    title.textContent = site.name;

    const tag = document.createElement("span");
    tag.className = "category-tag";
    tag.textContent = categoryNames[site.category];

    const description = document.createElement("p");
    description.textContent = site.description;

    const link = document.createElement("a");
    link.className = "open-link";
    link.href = site.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.append(document.createTextNode("Open Website "), Object.assign(document.createElement("span"), { textContent: "→", "aria-hidden": "true" }));
    link.setAttribute("aria-label", `Open ${site.name} in a new tab`);

    card.append(top, title, tag, description, link);
    grid.append(card);
  }

  emptyState.hidden = filtered.length !== 0;
  grid.hidden = filtered.length === 0;
  resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "site" : "sites"}`;
}

function setFilter(filter) {
  activeFilter = filter;
  filterButtons.forEach(button => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("active", isActive);
    if (button.classList.contains("filter-chip")) {
      button.setAttribute("aria-pressed", String(isActive));
    }
  });
  renderSites();
}

const counts = {
  all: sites.length,
  games: sites.filter(site => site.category === "games").length,
  community: sites.filter(site => site.category === "community").length,
  other: sites.filter(site => site.category === "other").length
};

document.querySelector("#allCount").textContent = counts.all;
document.querySelector("#gamesCount").textContent = counts.games;
document.querySelector("#communityCount").textContent = counts.community;
document.querySelector("#otherCount").textContent = counts.other;
document.querySelector("#chipAll").textContent = counts.all;
document.querySelector("#chipGames").textContent = counts.games;
document.querySelector("#chipCommunity").textContent = counts.community;
document.querySelector("#chipOther").textContent = counts.other;
document.querySelector("#heroCount").textContent = `${counts.all} Links`;
document.querySelector("#year").textContent = new Date().getFullYear();

filterButtons.forEach(button => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});
search.addEventListener("input", renderSites);
document.querySelector("#resetFilters").addEventListener("click", () => {
  search.value = "";
  setFilter("all");
});
document.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    search.focus();
  }
  if (event.key === "Escape" && document.activeElement === search) {
    search.value = "";
    renderSites();
    search.blur();
  }
});

renderSites();


// ---- Chat ----
// Paste these two values from your Firebase project (see the setup steps).
const CHAT_DB = "";      // Realtime Database URL, e.g. "https://your-project-default-rtdb.firebaseio.com"
const CHAT_API_KEY = ""; // Web API key from Firebase Project settings
(function () {
  const $ = s => document.querySelector(s);
  const navChat = $("#navChat"), list = $("#chatList"), note = $("#chatNote");
  const authForm = $("#chatAuth"), authNote = $("#authNote"), main = $("#chatMain"), who = $("#chatWho");
  const form = $("#chatForm"), msgIn = $("#chatMsg");
  const home = document.querySelector('.side-nav a[href="#home"]');
  const db = CHAT_DB.replace(/\/$/, "");
  const ready = !!(db && CHAT_API_KEY);
  let timer = null, lastSent = 0, session = null;

  function store(k, v) {
    try {
      if (v === undefined) return localStorage.getItem(k);
      if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v);
    } catch (e) { return null; }
  }
  function showNote(el, t) { el.textContent = t; el.hidden = !t; }
  function saveSession() { store("np_session", JSON.stringify({ r: session.refreshToken, u: session.uid, n: session.name })); }

  async function authCall(path, body) {
    const r = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:" + path + "?key=" + CHAT_API_KEY, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
    });
    const d = await r.json();
    if (!r.ok) throw new Error((d.error && d.error.message) || "ERROR");
    return d;
  }
  async function refresh() {
    const r = await fetch("https://securetoken.googleapis.com/v1/token?key=" + CHAT_API_KEY, {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=refresh_token&refresh_token=" + encodeURIComponent(session.refreshToken)
    });
    const d = await r.json();
    if (!r.ok) throw new Error("expired");
    session.idToken = d.id_token;
    session.refreshToken = d.refresh_token;
    session.exp = Date.now() + (Number(d.expires_in) - 60) * 1000;
    saveSession();
  }
  async function token() {
    if (Date.now() >= session.exp) await refresh();
    return session.idToken;
  }
  function friendly(m) {
    if (/EMAIL_EXISTS/.test(m)) return "That username is taken.";
    if (/INVALID_LOGIN|EMAIL_NOT_FOUND|INVALID_PASSWORD/.test(m)) return "Wrong username or password.";
    if (/WEAK_PASSWORD/.test(m)) return "Password needs 6 or more characters.";
    if (/TOO_MANY/.test(m)) return "Too many tries. Wait a bit.";
    if (/OPERATION_NOT_ALLOWED/.test(m)) return "Email/password sign-in isn’t turned on in Firebase.";
    return "Couldn’t sign in. Try again.";
  }

  function updateView() {
    authForm.hidden = !!session;
    main.hidden = !session;
    who.textContent = session ? "Signed in as " + session.name : "Sign in to chat";
  }
  function render(msgs) {
    const stick = list.scrollTop + list.clientHeight >= list.scrollHeight - 30;
    list.replaceChildren();
    for (const m of msgs) {
      const row = document.createElement("div");
      row.className = "chat-msg";
      const name = document.createElement("b");
      name.textContent = String(m.n || "?").slice(0, 20);
      row.append(name, document.createTextNode(String(m.m || "").slice(0, 200)));
      list.append(row);
    }
    if (stick) list.scrollTop = list.scrollHeight;
  }
  function signOut() {
    session = null;
    store("np_session", null);
    clearInterval(timer);
    list.replaceChildren();
    showNote(note, "");
    updateView();
  }
  async function load() {
    if (!session) return;
    try {
      const r = await fetch(db + '/messages.json?orderBy="t"&limitToLast=100&auth=' + encodeURIComponent(await token()));
      if (!r.ok) throw new Error("bad");
      const d = (await r.json()) || {};
      render(Object.values(d).sort((a, b) => a.t - b.t));
      showNote(note, "");
    } catch (e) {
      if (e.message === "expired") signOut(); else showNote(note, "Chat is offline right now.");
    }
  }
  function poll() {
    clearInterval(timer);
    if (session && document.body.classList.contains("show-chat")) {
      load();
      timer = setInterval(() => { if (!document.hidden) load(); }, 4000);
    }
  }
  function setOpen(open) {
    document.body.classList.toggle("show-chat", open);
    navChat.classList.toggle("selected", open);
    if (open) home.classList.remove("selected");
    else if (!document.querySelector(".side-nav .selected")) home.classList.add("selected");
    if (open && !ready) { authForm.hidden = false; main.hidden = true; showNote(authNote, "Chat isn’t set up yet."); }
    poll();
    if (open) (session ? msgIn : $("#authUser")).focus();
  }

  async function enter(kind) {
    showNote(authNote, "");
    if (!ready) { showNote(authNote, "Chat isn’t set up yet."); return; }
    const name = $("#authUser").value.trim().toLowerCase(), pass = $("#authPass").value;
    if (!/^[a-z0-9_]{3,20}$/.test(name)) { showNote(authNote, "Username: 3 to 20 letters, numbers or _."); return; }
    if (pass.length < 6) { showNote(authNote, "Password needs 6 or more characters."); return; }
    try {
      const d = await authCall(kind === "up" ? "signUp" : "signInWithPassword", { email: name + "@nexplay.chat", password: pass, returnSecureToken: true });
      session = { uid: d.localId, name: name, idToken: d.idToken, refreshToken: d.refreshToken, exp: Date.now() + (Number(d.expiresIn) - 60) * 1000 };
      saveSession();
      if (kind === "up") {
        const r = await fetch(db + "/users/" + session.uid + ".json?auth=" + encodeURIComponent(session.idToken), { method: "PUT", body: JSON.stringify({ name: name }) });
        if (!r.ok) throw new Error("db");
      }
      $("#authPass").value = "";
      updateView();
      poll();
    } catch (e) {
      if (e.message === "db") { session = null; store("np_session", null); showNote(authNote, "Account made, but the database rules block it. Check the setup steps."); }
      else showNote(authNote, friendly(e.message));
    }
  }

  navChat.addEventListener("click", () => setOpen(true));
  document.querySelectorAll(".side-nav .nav-link:not(#navChat)").forEach(el => el.addEventListener("click", () => setOpen(false)));
  authForm.addEventListener("submit", e => { e.preventDefault(); enter("in"); });
  $("#authUp").addEventListener("click", () => enter("up"));
  $("#chatOut").addEventListener("click", signOut);
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const m = msgIn.value.trim().slice(0, 200);
    if (!m || !session) return;
    if (Date.now() - lastSent < 3000) { showNote(note, "Slow down a little."); return; }
    lastSent = Date.now();
    try {
      const r = await fetch(db + "/messages.json?auth=" + encodeURIComponent(await token()), {
        method: "POST", body: JSON.stringify({ n: session.name, u: session.uid, m: m, t: { ".sv": "timestamp" } })
      });
      if (!r.ok) throw new Error("bad");
      msgIn.value = "";
      load();
    } catch (err) { showNote(note, "Couldn’t send. Try again."); }
  });

  (async function init() {
    updateView();
    if (!ready) return;
    let s = null;
    try { s = JSON.parse(store("np_session") || "null"); } catch (e) {}
    if (!s) return;
    session = { uid: s.u, name: s.n, refreshToken: s.r, idToken: "", exp: 0 };
    try { await refresh(); } catch (e) { session = null; store("np_session", null); }
    updateView();
    poll();
  })();
})();
