javascript:(() => {
  const N = "🛰 JS Endpoints",
    B = document,
    O = location,
    U = O.origin;
  let stealth = false;

  const excol = {
    js: "#ffd54f",
    json: "#81c784",
    php: "#ce93d8",
    txt: "#90caf9",
    css: "#f48fb1",
    map: "#b39ddb",
    svg: "#ffab91",
    dir: "#64b5f6",
    other: "#e0e0e0"
  };

  const style = `
    #nx-wrap{position:fixed;inset:auto 5% 5% 5%;top:5%;z-index:99999999;
      background:#121212;color:#eee;font:14px/1.4 system-ui,Segoe UI,Roboto,Arial;
      border:1px solid #2b2b2b;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.6);
      display:flex;flex-direction:column;max-height:90vh}
    #nx-head{display:flex;gap:10px;align-items:center;justify-content:space-between;
      padding:10px 14px;border-bottom:1px solid #2b2b2b}
    #nx-title{margin:0;font-size:16px;color:#ffa500}
    #nx-tools{display:flex;flex-wrap:wrap;gap:8px}
    .nx-btn{background:#1e1e1e;border:1px solid #333;border-radius:8px;padding:6px 10px;
      color:#eee;cursor:pointer}
    .nx-btn:hover{background:#2a2a2a}
    #nx-body{display:grid;grid-template-columns:260px 1fr;gap:10px;padding:12px 14px;
      min-height:300px;overflow:hidden}
    #nx-left{display:flex;flex-direction:column;gap:10px}
    #nx-search,#nx-regex{width:100%;padding:8px 10px;border-radius:8px;
      border:1px solid #2d2d2d;background:#0f0f0f;color:#fff;outline:none}
    #nx-filters{display:flex;flex-wrap:wrap;gap:6px}
    .nx-chip{padding:4px 10px;border:1px solid #333;border-radius:999px;cursor:pointer;
      background:#181818;color:#bbb;user-select:none}
    .nx-chip.sel{border-color:#ffa500;background:#2a2209;color:#ffa500;font-weight:600}
    #nx-right{overflow:auto;border:1px solid #242424;border-radius:10px}
    .nx-group{border-bottom:1px dashed #2a2a2a}
    .nx-ghead{position:sticky;top:0;background:#151515;padding:6px 10px;font-weight:700;
      border-bottom:1px solid #202020;display:flex;align-items:center;gap:8px;cursor:pointer}
    .nx-ul{list-style:none;margin:0;padding:0}
    .nx-li{display:flex;align-items:center;gap:10px;justify-content:space-between;
      padding:6px 10px;transition:background .15s;border-bottom:1px solid #1b1b1b}
    .nx-li:hover{background:#222}
    .nx-url{flex:1 1 auto;min-width:0;color:#64b5f6;text-decoration:none;word-break:break-word}
    .nx-badge{font-size:12px;padding:2px 6px;border-radius:6px;background:#1e1e1e;
      border:1px solid #333;min-width:38px;text-align:center}
    .nx-ext{border-radius:6px;padding:2px 6px;border:1px solid #333}
    .nx-hidden{display:none}
    .nx-flex{display:flex;gap:6px;align-items:center}
    .nx-head-internal{background:#102d10!important;color:#7ddc7d}
    .nx-head-external{background:#2d1010!important;color:#ff6e6e;border-top:2px solid #ff6e6e}
  `;

  const addCSS = () => {
    const s = B.createElement("style");
    s.textContent = style;
    B.head.appendChild(s);
  };

  const el = (t, p = {}, ...ch) => {
    const x = B.createElement(t);
    for (const k in p) {
      if (k === "style" && typeof p[k] === "object") Object.assign(x.style, p[k]);
      else if (k.startsWith("on")) x.addEventListener(k.slice(2), p[k]);
      else if (p[k] != null) x.setAttribute(k, p[k]);
    }
    ch.forEach(c => x.append(c));
    return x;
  };

  // Main containers
  const wrap = el("div", { id: "nx-wrap" }),
    head = el("div", { id: "nx-head" }),
    title = el("h3", { id: "nx-title" }, N),
    tools = el("div", { id: "nx-tools" }),
    close = el("button", { class: "nx-btn", onclick: () => wrap.remove() }, "✖"),
    body = el("div", { id: "nx-body" }),
    left = el("div", { id: "nx-left" }),
    right = el("div", { id: "nx-right" });

  const search = el("input", { id: "nx-search", placeholder: "Search paths…" }),
    reInput = el("input", { id: "nx-regex", placeholder: "Custom regex (re-extract)..." }),
    chips = el("div", { id: "nx-filters" });

  const chip = (lbl, key, sel = false) => {
    const c = el("span", {
      class: "nx-chip" + (sel ? " sel" : ""),
      "data-key": key,
      "data-label": lbl,
      onclick: () => {
        c.classList.toggle("sel");
        updChipLabels();
        applyFilters();
      }
    }, (sel ? "✓ " : "• ") + lbl);
    chips.append(c);
  };

  ["2xx", "3xx", "4xx", "5xx", "ERR"].forEach(k => chip(k, k, false));

  const updChipLabels = () => {
    chips.querySelectorAll(".nx-chip").forEach(ch => {
      const on = ch.classList.contains("sel");
      ch.textContent = (on ? "✓ " : "• ") + ch.getAttribute("data-label");
    });
  };

  const stealthBtn = el("button", {
    class: "nx-btn",
    onclick: () => {
      stealth = !stealth;
      stealthBtn.textContent = stealth ? "🕵️ Stealth ON" : "🛰 Active";
    }
  }, "🛰 Active");

  const expandAllBtn = el("button", {
    class: "nx-btn",
    onclick: () => {
      const groups = right.querySelectorAll(".nx-ul");
      const anyClosed = [...groups].some(g => g.classList.contains("nx-hidden"));
      groups.forEach(g => {
        g.classList.toggle("nx-hidden", !anyClosed);
        g.previousSibling.firstChild.textContent = g.classList.contains("nx-hidden") ? "▸ " : "▾ ";
      });
      applyFilters();
      expandAllBtn.textContent = anyClosed ? "Collapse All" : "Expand All";
    }
  }, "Expand All");

  const exportTXT = el("button", { class: "nx-btn", onclick: () => download("txt") }, "Export TXT"),
    exportCSV = el("button", { class: "nx-btn", onclick: () => download("csv") }, "Export CSV"),
    exportJSON = el("button", { class: "nx-btn", onclick: () => download("json") }, "Export JSON");

  tools.append(stealthBtn, expandAllBtn, exportTXT, exportCSV, exportJSON, close);
  head.append(title, tools);
  left.append(search, reInput, chips);
  body.append(left, right);
  addCSS();
  B.body.appendChild(wrap);
  wrap.append(head, body);

  // Regex to find paths/URLs
  const rxDefault = /(?:(?<=["'`])|^)(https?:\/\/[^\s"'`<>]+|\/[A-Za-z0-9_?&=\/\-#\.]+)(?=["'`]|$)/g;
  let RX = rxDefault;
  const unique = new Set();

  const push = u => { if (u) unique.add(u.trim()); };

  const ext = p => {
    if (p.endsWith("/")) return "dir";
    const m = p.match(/\.([a-z0-9]+)(?:\?|#|$)/i);
    return m ? m[1].toLowerCase() : "other";
  };

  const colorFor = e => excol[e] || excol.other;

  const norm = p =>
    /^https?:\/\//i.test(p) ? p : p.startsWith("/") ? U + p : new URL(p, O.href).href;

  const short = u => {
    try {
      const url = new URL(u);
      return url.origin === U ? url.pathname + url.search : url.href;
    } catch { return u; }
  };

  const collect = async () => {
    const scripts = [...B.getElementsByTagName("script")];
    const html = B.documentElement.outerHTML || "";
    for (const m of html.matchAll(RX)) push(m[1] || m[0]);
    for (const s of scripts) {
      const src = s.getAttribute("src");
      if (src) {
        try {
          const r = await fetch(src);
          const c = await r.text();
          for (const m of c.matchAll(RX)) push(m[1] || m[0]);
        } catch { }
      }
    }
  };

  const statusCache = new Map();
  const headCheck = async u => {
    if (stealth) return null;
    if (statusCache.has(u)) return statusCache.get(u);
    try {
      const r = await fetch(u, { method: "HEAD" });
      const info = { code: r.status, ok: r.status >= 200 && r.status < 400 };
      statusCache.set(u, info);
      return info;
    } catch {
      return { code: "ERR", ok: false };
    }
  };

  const groupByDir = arr => {
    const map = new Map([["Internal", new Map()], ["External", new Map()]]);
    for (const raw of arr) {
      const abs = norm(raw);
      let url;
      try { url = new URL(abs); } catch { continue; }
      if (url.origin === U) {
        const seg = "/" + (url.pathname.split("/")[1] || "");
        const sub = map.get("Internal");
        if (!sub.has(seg)) sub.set(seg, []);
        sub.get(seg).push({ raw, abs });
      } else {
        const host = url.origin;
        const sub = map.get("External");
        if (!sub.has(host)) sub.set(host, []);
        sub.get(host).push({ raw, abs });
      }
    }
    return map;
  };

  const itemRow = o => {
    const e = ext(o.raw), u = o.abs, li = el("li", { class: "nx-li" });
    const a = el("a", { href: u, target: "_blank", class: "nx-url" }, short(u));
    const ex = el("span", { class: "nx-ext", style: { color: colorFor(e) } }, e);
    const st = el("span", { class: "nx-badge nx-status" }, "…");
    const copy = el("button", {
      class: "nx-btn", style: "padding:3px 6px",
      onclick: () => navigator.clipboard.writeText(o.raw).then(() => {
        copy.textContent = "✓";
        setTimeout(() => copy.textContent = "📋", 700);
      })
    }, "📋");
    li.append(el("span", { class: "nx-flex" }, a),
      el("span", { class: "nx-flex" }, ex, st, copy));
    headCheck(u).then(info => {
      if (info) {
        st.textContent = info.code;
        st.style.color = info.ok ? "#7ddc7d" : "#ff6e6e";
      }
    });
    return li;
  };

  const render = () => {
    right.innerHTML = "";
    const groups = groupByDir([...unique]);
    for (const [topName, submap] of groups) {
      if (!submap.size) continue;
      const cls = topName === "Internal" ? "nx-head-internal" : "nx-head-external";
      const topWrap = el("div", { class: "nx-group" });
      const collapsed = (topName === "External");
      const topHead = el("div", { class: `nx-ghead ${cls}` },
        "▾ ", el("span", {}, topName),
        el("span", { style: { opacity: .7 } },
          ` (${[...submap.values()].reduce((a, b) => a + b.length, 0)})`)
      );
      const topList = el("div", { class: collapsed ? "nx-hidden" : "" });
      topHead.firstChild.textContent = collapsed ? "▸ " : "▾ ";
      topHead.onclick = () => {
        topList.classList.toggle("nx-hidden");
        topHead.firstChild.textContent =
          topList.classList.contains("nx-hidden") ? "▸ " : "▾ ";
      };
      topWrap.append(topHead, topList);
      right.append(topWrap);

      for (const [g, items] of submap) {
        const gwrap = el("div", { class: "nx-group" });
        const ghead = el("div", { class: "nx-ghead" },
          "▸ ", el("span", {}, g),
          el("span", { style: { opacity: .7 } }, ` (${items.length})`));
        const list = el("ul", { class: "nx-ul nx-hidden" });
        ghead.onclick = () => {
          list.classList.toggle("nx-hidden");
          ghead.firstChild.textContent = list.classList.contains("nx-hidden") ? "▸ " : "▾ ";
          if (!list.classList.contains("nx-hidden")) applyFilters();
        };
        items.forEach(o => list.append(itemRow(o)));
        gwrap.append(ghead, list);
        topList.append(gwrap);
      }
    }
    updChipLabels();
    applyFilters();
  };

  const codeBucket = txt => txt === "ERR" ? "ERR" : /^[2-5]/.test(txt) ? `${txt[0]}xx` : "UNK";

  const getWanted = () =>
    new Set([...chips.querySelectorAll(".nx-chip.sel")]
      .map(c => c.getAttribute("data-key")));

  const applyFilters = () => {
    const q = (search.value || "").toLowerCase();
    const wanted = getWanted();
    const groups = right.querySelectorAll(".nx-ul");
    if (q) {
      groups.forEach(g => {
        g.classList.remove("nx-hidden");
        g.previousSibling.firstChild.textContent = "▾ ";
      });
    }
    right.querySelectorAll(".nx-li").forEach(li => {
      const txt = (li.textContent || "").toLowerCase();
      let show = (!q || txt.includes(q));
      if (show && wanted.size) {
        const code = li.querySelector(".nx-status").textContent || "UNK";
        const buck = codeBucket(code);
        if (buck !== "UNK") show = wanted.has(buck);
      }
      li.style.display = show ? "" : "none";
    });
  };

  const download = fmt => {
    const rows = [...unique].map(p => ({
      path: p,
      absolute: norm(p),
      ext: ext(p),
      status: (statusCache.get(norm(p)) || {}).code || null
    }));
    let blob;
    let fn = `endpoints_${O.hostname}.${fmt}`;
    if (fmt === "txt")
      blob = new Blob([rows.map(r => r.path).join("\n")], { type: "text/plain" });
    if (fmt === "csv") {
      const csv = ["path,absolute,ext,status"]
        .concat(rows.map(r => [r.path, r.absolute, r.ext, r.status ?? ""]
          .map(x => `"${String(x).replace(/"/g, '""')}"`).join(","))).join("\n");
      blob = new Blob([csv], { type: "text/csv" });
    }
    if (fmt === "json")
      blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
    const a = el("a", { href: URL.createObjectURL(blob), download: fn });
    B.body.appendChild(a);
    a.click();
    a.remove();
  };

  search.oninput = () => applyFilters();
  reInput.oninput = () => {
    RX = reInput.value.trim() ? new RegExp(reInput.value.trim(), "g") : rxDefault;
    unique.clear();
    statusCache.clear();
    (async () => { await collect(); render(); })();
  };

  (async () => {
    await collect();
    render();
  })();
})();
