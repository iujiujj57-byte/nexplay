const sites = [
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
    name: "GitHub Games",
    url: "https://githubgames.gitlab.io/",
    category: "community",
    icon: "◉",
    description: "A collection of game links and projects."
  },
  {
    name: "GitLab Games",
    url: "https://gitlabgames.gitlab.io/",
    category: "community",
    icon: "🔺",
    description: "Browse game projects hosted on GitLab."
  },
  {
    name: "Velara",
    url: "http://velara.cc",
    category: "games",
    icon: "V",
    description: "An external gaming link from your collection."
  },
  {
    name: "DaydreamX",
    url: "https://daydreamx.pro/app/index.html",
    category: "games",
    icon: "🌙",
    description: "An external site to explore."
  },
  {
    name: "55Gms",
    url: "https://55gms.com/",
    category: "games",
    icon: "55",
    description: "A browser game link from your collection."
  },
  {
    name: "Orchid Idea",
    url: "https://ideas.orchid-idea.com/",
    category: "other",
    icon: "✿",
    description: "An external link to Orchid Idea."
  },
  {
    name: "Levitr",
    url: "https://f3a4e576.levitr.cfd/",
    category: "other",
    icon: "↗",
    description: "An external link; check the address before opening."
  },
  {
    name: "Patel Mortgage",
    url: "https://homerosin.patelmortgage.com/",
    category: "other",
    icon: "⌂",
    description: "An external link from your list."
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
