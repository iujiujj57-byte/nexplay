
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";

import {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  serverTimestamp,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";

// YOUR NEXPLAY FIREBASE PROJECT
const firebaseConfig = {
  apiKey: "AIzaSyCz7gweuP0E9-jO-uXjbyXMOlWeIHT4Bn8",
  authDomain: "nexplay-1029b.firebaseapp.com",
  projectId: "nexplay-1029b",
  storageBucket: "nexplay-1029b.firebasestorage.app",
  messagingSenderId: "288990411835",
  appId: "1:288990411835:web:f1a0697b6c4042fd3eb01e",
  measurementId: "G-7DKFNYY8L9"
};

const ADMIN_EMAIL = "arehq@schools.vic.edu.au";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// -----------------------------
// GAME LINKS
// -----------------------------

const sites = [
  {
    name: "Radon Games",
    url: "https://mathclass.vercel.app/",
    category: "games",
    icon: "☢️",
    description: "An open-source browser games site."
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

// -----------------------------
// PAGE ELEMENTS
// -----------------------------

const grid = document.querySelector("#siteGrid");
const search = document.querySelector("#search");
const emptyState = document.querySelector("#emptyState");
const resultCount = document.querySelector("#resultCount");
const filterButtons = [...document.querySelectorAll("[data-filter]")];

const accessGate = document.querySelector("#accessGate");
const usernameForm = document.querySelector("#usernameForm");
const usernameInput = document.querySelector("#usernameInput");
const gateMessage = document.querySelector("#gateMessage");

const adminModal = document.querySelector("#adminModal");
const adminOpen = document.querySelector("#adminOpen");
const adminClose = document.querySelector("#adminClose");
const adminLoginForm = document.querySelector("#adminLoginForm");
const adminDashboard = document.querySelector("#adminDashboard");
const adminMessage = document.querySelector("#adminMessage");
const visitorList = document.querySelector("#visitorList");

let activeFilter = "all";
let currentUser = null;
let currentUsername = "";
let isAdmin = false;
let banListener = null;

const categoryNames = {
  games: "Game Hub",
  community: "Community",
  other: "Other"
};

// -----------------------------
// GAME DIRECTORY
// -----------------------------

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
    const matchesCategory =
      activeFilter === "all" || site.category === activeFilter;

    const searchable =
      `${site.name} ${site.description} ${safeHost(site.url)} ${categoryNames[site.category]}`.toLowerCase();

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
    icon.textContent = site.icon;

    const external = document.createElement("span");
    external.className = "external-mark";
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
    link.textContent = "Open Website →";

    card.append(top, title, tag, description, link);
    grid.append(card);
  }

  emptyState.hidden = filtered.length !== 0;
  grid.hidden = filtered.length === 0;

  resultCount.textContent =
    `${filtered.length} ${filtered.length === 1 ? "site" : "sites"}`;
}

function setFilter(filter) {
  activeFilter = filter;

  filterButtons.forEach(button => {
    const selected = button.dataset.filter === filter;
    button.classList.toggle("active", selected);

    if (button.classList.contains("filter-chip")) {
      button.setAttribute("aria-pressed", String(selected));
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
  button.addEventListener("click", () => {
    setFilter(button.dataset.filter);
  });
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

// -----------------------------
// VISITOR ACCESS
// -----------------------------

function hideGate() {
  accessGate.hidden = true;
  document.body.classList.remove("auth-loading");
}

function showGate(message) {
  accessGate.hidden = false;
  document.body.classList.add("auth-loading");

  if (message) {
    gateMessage.textContent = message;
  }
}

function stopBanListener() {
  if (banListener) {
    banListener();
    banListener = null;
  }
}

function redirectToBanPage() {
  window.location.replace("banned.html");
}

async function checkVisitor(user) {
  currentUser = user;

  const banRef = doc(db, "bannedUsers", user.uid);
  const banSnapshot = await getDoc(banRef);

  if (banSnapshot.exists()) {
    redirectToBanPage();
    return;
  }

  stopBanListener();

  banListener = onSnapshot(banRef, snapshot => {
    if (snapshot.exists()) {
      redirectToBanPage();
    }
  });

  const profileRef = doc(db, "profiles", user.uid);
  const profileSnapshot = await getDoc(profileRef);

  if (!profileSnapshot.exists()) {
    showGate("Choose a display name to continue.");
    return;
  }

  currentUsername = profileSnapshot.data().username || "Visitor";
  hideGate();
}

usernameForm.addEventListener("submit", async event => {
  event.preventDefault();

  if (!currentUser || isAdmin) return;

  const username = usernameInput.value.trim();

  if (username.length < 2 || username.length > 20) {
    gateMessage.textContent = "Your name must be between 2 and 20 characters.";
    return;
  }

  try {
    gateMessage.textContent = "Saving your name...";

    await setDoc(doc(db, "profiles", currentUser.uid), {
      username,
      createdAt: serverTimestamp()
    });

    currentUsername = username;
    hideGate();
  } catch (error) {
    console.error(error);
    gateMessage.textContent =
      "Couldn't save your name. Please try again.";
  }
});

// -----------------------------
// FIREBASE AUTHENTICATION
// -----------------------------

onAuthStateChanged(auth, async user => {
  try {
    if (!user) {
      isAdmin = false;
      stopBanListener();

      await signInAnonymously(auth);
      return;
    }

    if (user.email) {
      if (
        user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
        user.emailVerified
      ) {
        stopBanListener();
        isAdmin = true;
        currentUser = user;

        hideGate();
        adminLoginForm.hidden = true;
        adminDashboard.hidden = false;

        await loadVisitors();
        return;
      }

      // Only the designated administrator email is accepted here.
      isAdmin = false;
      await signOut(auth);
      return;
    }

    isAdmin = false;
    await checkVisitor(user);

  } catch (error) {
    console.error("Authentication error:", error);
    showGate("Couldn't connect to NexPlay. Check your internet and reload.");
  }
});

// -----------------------------
// ADMIN PANEL
// -----------------------------

function openAdmin() {
  adminModal.hidden = false;

  if (isAdmin) {
    adminLoginForm.hidden = true;
    adminDashboard.hidden = false;
    loadVisitors();
  } else {
    adminLoginForm.hidden = false;
    adminDashboard.hidden = true;
  }
}

function closeAdmin() {
  adminModal.hidden = true;
}

adminOpen.addEventListener("click", openAdmin);
adminClose.addEventListener("click", closeAdmin);

adminModal.addEventListener("click", event => {
  if (event.target === adminModal) closeAdmin();
});

adminLoginForm.addEventListener("submit", async event => {
  event.preventDefault();

  const email = document.querySelector("#adminEmail").value.trim();
  const password = document.querySelector("#adminPassword").value;

  if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    adminMessage.textContent = "That email is not the administrator email.";
    return;
  }

  try {
    adminMessage.textContent = "Signing in...";

    const credential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (!credential.user.emailVerified) {
      await sendEmailVerification(credential.user);
      await signOut(auth);

      adminMessage.textContent =
        "Your email isn't verified. We've sent a verification email. Verify it, then sign in again.";

      return;
    }

    adminMessage.textContent = "Signed in successfully.";

  } catch (error) {
    console.error(error);
    adminMessage.textContent =
      "Sign-in failed. Check your email and password.";
  }
});

// -----------------------------
// LOAD VISITORS
// -----------------------------

async function loadVisitors() {
  if (!isAdmin) return;

  visitorList.textContent = "Loading visitors...";

  try {
    const [profilesSnapshot, bannedSnapshot] = await Promise.all([
      getDocs(collection(db, "profiles")),
      getDocs(collection(db, "bannedUsers"))
    ]);

    const bannedIds = new Set(
      bannedSnapshot.docs.map(item => item.id)
    );

    visitorList.replaceChildren();

    document.querySelector("#visitorCount").textContent =
      profilesSnapshot.size;

    if (profilesSnapshot.empty) {
      visitorList.textContent = "No visitors have registered yet.";
      return;
    }

    profilesSnapshot.forEach(profileDoc => {
      const uid = profileDoc.id;
      const profile = profileDoc.data();
      const banned = bannedIds.has(uid);

      const card = document.createElement("div");
      card.className = "visitor-card";

      const details = document.createElement("div");
      details.className = "visitor-details";

      const name = document.createElement("strong");
      name.textContent = profile.username || "Unnamed visitor";

      const id = document.createElement("small");
      id.textContent = `ID: ${uid}`;

      const status = document.createElement("span");
      status.className = banned ? "visitor-status banned" : "visitor-status";
      status.textContent = banned ? "BANNED" : "ACTIVE";

      details.append(name, id, status);

      const action = document.createElement("button");
      action.className = banned ? "unban-button" : "ban-button";
      action.textContent = banned ? "Unban" : "Ban";

      action.addEventListener("click", async () => {
        if (!isAdmin) return;

        action.disabled = true;

        try {
          const banRef = doc(db, "bannedUsers", uid);

          if (banned) {
            await deleteDoc(banRef);
          } else {
            const reason =
              document.querySelector("#banReason").value.trim() ||
              "Violation of rules";

            await setDoc(banRef, {
              uid,
              username: profile.username || "Unnamed visitor",
              reason,
              bannedAt: serverTimestamp()
            });
          }

          await loadVisitors();

        } catch (error) {
          console.error(error);
          alert("Couldn't update this ban. Check your admin permissions.");
          action.disabled = false;
        }
      });

      card.append(details, action);
      visitorList.append(card);
    });

  } catch (error) {
    console.error(error);
    visitorList.textContent =
      "Couldn't load visitors. Check that your administrator email is verified and your Firestore rules are published.";
  }
}

document.querySelector("#adminRefresh").addEventListener("click", loadVisitors);

document.querySelector("#adminSignOut").addEventListener("click", async () => {
  try {
    await signOut(auth);
    isAdmin = false;
    adminModal.hidden = true;
  } catch (error) {
    console.error(error);
    adminMessage.textContent = "Couldn't sign out.";
  }
});
