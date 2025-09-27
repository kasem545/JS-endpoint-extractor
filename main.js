javascript:(() => {
  const N = "🛠 JS Endpoints",
        B = document,
        O = location,
        U = O.origin;
  let stealth = false;

  // Extension colors
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

  // Injected CSS (with RTL fix)
  const style = `
#nx-wrap {
  position: fixed;
  inset: auto 5% 5% 5%;
  top: 5%;
  z-index: 99999999;
  background: #121212;
  color: #eee;
  font: 14px/1.4 system-ui, Segoe UI, Roboto, Arial;
  border: 1px solid #2b2b2b;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,.6);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}
#nx-head {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid #2b2b2b;
}
#nx-title {
  margin: 0;
  font-size: 16px;
  color: #ffa500;
}
#nx-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.nx-btn {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 6px 10px;
  color: #eee;
  cursor: pointer;
}
.nx-btn:hover {
  background: #2a2a2a;
}
#nx-body {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 10px;
  padding: 12px 14px;
  min-height: 300px;
  overflow: hidden;

  /* Force layout to stay LTR */
  direction: ltr;
  text-align: left;
}
#nx-left {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
#nx-search,
#nx-regex {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #2d2d2d;
  background: #0f0f0f;
  color: #fff;
  outline: none;

  /* Input respects typing language */
  direction: auto;
  text-align: start;
}
#nx-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.nx-chip {
  padding: 4px 10px;
  border: 1px solid #333;
  border-radius: 999px;
  cursor: pointer;
  background: #181818;
  color: #bbb;
  user-select: none;
}
.nx-chip.sel {
  border-color: #ffa500;
  background: #2a2209;
  color: #ffa500;
  font-weight: 600;
}
#nx-right {
  overflow: auto;
  border: 1px solid #242424;
  border-radius: 10px;
}
.nx-group {
  border-bottom: 1px dashed #2a2a2a;
}
.nx-ghead {
  position: sticky;
  top: 0;
  background: #151515;
  padding: 6px 10px;
  font-weight: 700;
  border-bottom: 1px solid #202020;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.nx-ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.nx-li {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
  padding: 6px 10px;
  transition: background .15s;
  border-bottom: 1px solid #1b1b1b;
}
.nx-li:hover {
  background: #222;
}
.nx-url {
  flex: 1 1 auto;
  min-width: 0;
  color: #64b5f6;
  text-decoration: none;
  word-break: break-word;
}
.nx-badge {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 6px;
  background: #1e1e1e;
  border: 1px solid #333;
  min-width: 38px;
  text-align: center;
}
.nx-ext {
  border-radius: 6px;
  padding: 2px 6px;
  border: 1px solid #333;
}
.nx-hidden {
  display: none;
}
.nx-flex {
  display: flex;
  gap: 6px;
  align-items: center;
}
.nx-head-internal {
  background: #102d10 !important;
  color: #7ddc7d;
}
.nx-head-external {
  background: #2d1010 !important;
  color: #ff6e6e;
  border-top: 2px solid #ff6e6e;
}
`;

  const addCSS = () => {
    const s = B.createElement("style");
    s.textContent = style;
    B.head.appendChild(s);
  };

  // Element factory
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

  // Build UI
  const wrap = el("div", { id: "nx-wrap" }),
        head = el("div", { id: "nx-head" }),
        title = el("h3", { id: "nx-title" }, N),
        tools = el("div", { id: "nx-tools" }),
        close = el("button", { class: "nx-btn", onclick: () => wrap.remove() }, "✖"),
        body = el("div", { id: "nx-body" }),
        left = el("div", { id: "nx-left" }),
        right = el("div", { id: "nx-right" });

  const search = el("input", { id: "nx-search", placeholder: "Search paths…" }),
        reInput = el("input", { id: "nx-regex", placeholder: "Custom regex (re-extract)…" }),
        chips = el("div", { id: "nx-filters" });

  // ... [rest of your JS logic remains unchanged: chips, filters, collect, render, download, etc.]

  // Mount
  addCSS();
  B.body.appendChild(wrap);
  wrap.append(head, body);
  head.append(title, tools);
  left.append(search, reInput, chips);
  body.append(left, right);

  // Continue with collect(), render(), filtering logic...
})();
