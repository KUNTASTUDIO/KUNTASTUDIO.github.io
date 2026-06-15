function getBase() {
  const config = document.getElementById("__config");
  if (!config) return "./";
  try {
    return JSON.parse(config.textContent).base || "./";
  } catch {
    return "./";
  }
}

function joinBase(base, path) {
  if (path === "/" || path === "") {
    return base === "." ? "./" : base;
  }
  const clean = path.replace(/^\//, "");
  return base === "." ? clean : `${base.replace(/\/?$/, "/")}${clean}`;
}

function siteUrl(path) {
  const base = getBase();
  const isRoot = !path || path === "/";

  if (base === "." || base === "./") {
    if (isRoot) return "/";
    const segment = path.replace(/^\//, "").replace(/\/$/, "");
    return `/${segment}/`;
  }

  return joinBase(base, isRoot ? "/" : path);
}

function isNavActive(path) {
  const pathname = window.location.pathname.replace(/\/index\.html$/, "/");
  const segment = path.replace(/^\//, "").replace(/\/$/, "");

  if (!segment) {
    return !/(^|\/)organization(\/|$)/.test(pathname)
      && !/(^|\/)contents(\/|$)/.test(pathname)
      && !/(^|\/)information(\/|$)/.test(pathname);
  }

  return new RegExp(`(^|/)${segment}(/|$)`).test(pathname);
}

const NAV_ITEMS = [
  { label: "Main", path: "/" },
  { label: "Organization", path: "/organization/" },
  { label: "Contents", path: "/contents/" },
  { label: "Information", path: "/information/" },
];

function mountHeaderNav() {
  const headerInner = document.querySelector(".md-header__inner");
  if (!headerInner) return;

  let nav = headerInner.querySelector(".ks-nav");
  if (!nav) {
    nav = document.createElement("nav");
    nav.className = "ks-nav";
    nav.setAttribute("aria-label", "Primary navigation");

    const list = document.createElement("ul");
    list.className = "ks-nav__list";

    NAV_ITEMS.forEach(({ label, path }) => {
      const item = document.createElement("li");
      item.className = "ks-nav__item";

      const link = document.createElement("a");
      link.className = "ks-nav__link";
      link.textContent = label;
      link.href = siteUrl(path);

      item.appendChild(link);
      list.appendChild(item);
    });

    nav.appendChild(list);
    headerInner.appendChild(nav);
  }

  nav.querySelectorAll(".ks-nav__link").forEach((link, index) => {
    const { path } = NAV_ITEMS[index];
    link.href = siteUrl(path);
    link.classList.toggle("ks-nav__link--active", isNavActive(path));
    link.parentElement.classList.toggle("ks-nav__item--active", isNavActive(path));
  });

  const tabs = document.querySelector(".md-tabs");
  if (tabs) tabs.hidden = true;
}

function assetUrl(path) {
  const clean = path.replace(/^\//, "");
  const base = getBase();
  if (base === "." || base === "./") {
    return `/${clean}`;
  }
  return joinBase(base, clean);
}

function fixEpisodeMediaPaths(root) {
  root.querySelectorAll("[data-ks-asset]").forEach((el) => {
    const assetPath = el.getAttribute("data-ks-asset");
    if (!assetPath) return;

    el.src = assetUrl(assetPath);

    if (el.tagName === "VIDEO") {
      el.load();
    }
  });
}

function setEpisodeOpen(episode, open) {
  const head = episode.querySelector(".ks-episode__head");
  if (!head) return;

  episode.classList.toggle("is-open", open);
  head.setAttribute("aria-expanded", open ? "true" : "false");

  const video = episode.querySelector("video");
  if (!video) return;

  if (!open) {
    video.pause();
    video.currentTime = 0;
  }
}

function bindEpisodeVideos(root) {
  root.querySelectorAll("video").forEach((video) => {
    if (video.dataset.ksVideoBound === "1") return;
    video.dataset.ksVideoBound = "1";

    ["click", "pointerdown", "mousedown"].forEach((eventName) => {
      video.addEventListener(eventName, (event) => {
        event.stopPropagation();
      });
    });
  });
}

function initEpisodeAccordion() {
  const root = document.querySelector("[data-ks-episodes]");
  if (!root) return;

  fixEpisodeMediaPaths(root);
  bindEpisodeVideos(root);

  if (root.dataset.ksBound === "1") return;
  root.dataset.ksBound = "1";

  root.addEventListener("click", (event) => {
    const head = event.target.closest(".ks-episode__head");
    if (!head || !root.contains(head)) return;

    const episode = head.closest(".ks-episode");
    if (!episode) return;

    const willOpen = !episode.classList.contains("is-open");
    const episodes = root.querySelectorAll(".ks-episode");

    episodes.forEach((other) => {
      if (other !== episode) setEpisodeOpen(other, false);
    });

    setEpisodeOpen(episode, willOpen);
  });
}

function mountPageEnhancements() {
  mountHeaderNav();
  initEpisodeAccordion();
}

if (typeof document$ !== "undefined") {
  document$.subscribe(mountPageEnhancements);
} else {
  document.addEventListener("DOMContentLoaded", mountPageEnhancements);
}
