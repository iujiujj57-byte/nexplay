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
