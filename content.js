(() => {
  if (window.top !== window.self || document.getElementById("__qsa_root")) return;

  const mascotUrl = chrome.runtime.getURL("assets/nexu-mascot.png");
  const root = document.createElement("div");
  root.id = "__qsa_root";
  root.innerHTML = `
    <div id="qsa_panel" role="dialog" aria-label="Nexu">
      <div id="qsa_header">
        <div id="qsa_brand">
          <span class="qsa_mark" aria-hidden="true">
            <img src="${mascotUrl}" alt="">
          </span>
          <span>
            <strong>Nexu</strong>
            <small>Screen Sage</small>
          </span>
        </div>
        <div id="qsa_actions">
          <button id="qsa_settings" title="Settings" aria-label="Settings">
            <svg viewBox="0 0 24 24"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5z"/><path d="M19.4 15a7.8 7.8 0 0 0 .1-1l2-1.5-2-3.5-2.4 1a8 8 0 0 0-1.7-1L15 6.4h-4L10.6 9a8 8 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a7.8 7.8 0 0 0 .1 1l-2 1.5 2 3.5 2.4-1c.5.4 1.1.7 1.7 1l.3 2.6h4l.4-2.6c.6-.3 1.2-.6 1.7-1l2.4 1 2-3.5-2.1-1.5z"/></svg>
          </button>
          <button id="qsa_close" title="Close" aria-label="Close">
            <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
      <div id="qsa_hero">
        <img src="${mascotUrl}" alt="">
        <div>
          <span>Answer only</span>
          <p>Ready - click Solve.</p>
        </div>
      </div>
      <div id="qsa_body">Nexu is ready.</div>
      <button id="qsa_solve">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.7 4.6L18.4 9l-4.7 1.4L12 15l-1.7-4.6L5.6 9l4.7-1.4L12 3z"/><path d="M18.5 13l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z"/></svg>
        <span>Solve Screen</span>
      </button>
    </div>
    <button id="qsa_launcher" title="Nexu" aria-label="Open Nexu">
      <img src="${mascotUrl}" alt="">
    </button>
  `;

  const style = document.createElement("style");
  style.textContent = `
    #__qsa_root,#__qsa_root *{box-sizing:border-box;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    #qsa_launcher{position:fixed;right:22px;bottom:22px;z-index:2147483647;width:66px;height:66px;padding:0;border:1px solid rgba(107,212,255,.62);border-radius:50%;background:linear-gradient(145deg,#091226,#172a78 54%,#0bb9e8);color:#fff;cursor:pointer;box-shadow:0 0 0 4px rgba(18,26,70,.46),0 22px 55px rgba(0,184,255,.28),inset 0 1px 0 rgba(255,255,255,.34);display:grid;place-items:center;overflow:hidden}
    #qsa_launcher img{width:72px;height:72px;object-fit:cover;object-position:center top;filter:drop-shadow(0 5px 12px rgba(0,0,0,.34))}
    #qsa_panel{display:none;position:fixed;right:22px;bottom:102px;z-index:2147483647;width:min(390px,calc(100vw - 28px));overflow:hidden;color:#f8fafc;background:linear-gradient(150deg,rgba(8,12,31,.99),rgba(29,23,73,.99) 56%,rgba(4,47,61,.99));border:1px solid rgba(100,181,255,.24);border-radius:18px;box-shadow:0 26px 70px rgba(4,8,18,.54),0 0 42px rgba(0,178,255,.16),inset 0 1px 0 rgba(255,255,255,.12);backdrop-filter:blur(18px)}
    #qsa_panel:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 18% 0%,rgba(69,214,255,.22),transparent 30%),radial-gradient(circle at 100% 10%,rgba(130,88,255,.22),transparent 28%);pointer-events:none}
    #qsa_header,#qsa_hero,#qsa_body,#qsa_solve{position:relative}
    #qsa_header{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.1)}
    #qsa_brand{display:flex;align-items:center;gap:11px;min-width:0;flex:1}
    .qsa_mark{width:42px;height:42px;border-radius:14px;background:linear-gradient(145deg,#0d1e4e,#0dcaf2);display:grid;place-items:center;box-shadow:0 12px 30px rgba(0,200,255,.24);overflow:hidden}
    .qsa_mark img{width:47px;height:47px;object-fit:cover;object-position:center top}
    #qsa_brand strong{display:block;font-size:18px;font-weight:900;line-height:1;letter-spacing:0;color:#fff}
    #qsa_brand small{display:block;margin-top:4px;font-size:10px;font-weight:900;color:#8feeff;text-transform:uppercase;letter-spacing:0}
    #qsa_actions{display:flex;gap:7px}
    #qsa_actions button{width:34px;height:34px;border:1px solid rgba(255,255,255,.14);border-radius:10px;background:rgba(255,255,255,.08);color:#e5e7eb;cursor:pointer;display:grid;place-items:center}
    #qsa_actions button:hover{background:rgba(255,255,255,.15)}
    #qsa_actions svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
    #qsa_hero{display:flex;align-items:center;gap:13px;margin:15px 16px 0;padding:11px;border:1px solid rgba(89,199,255,.17);border-radius:15px;background:rgba(255,255,255,.06)}
    #qsa_hero img{width:58px;height:58px;border-radius:14px;object-fit:cover;object-position:center top;background:#071022;box-shadow:0 0 22px rgba(0,200,255,.22)}
    #qsa_hero span{display:inline-flex;padding:5px 9px;border-radius:999px;background:rgba(31,243,185,.14);color:#7fffdc;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:0}
    #qsa_hero p{margin:7px 0 0;color:#dbeafe;font-size:13px;font-weight:800;line-height:1.25}
    #qsa_body{margin:12px 16px 0;min-height:86px;max-height:40vh;overflow:auto;padding:16px;border:1px solid rgba(88,199,255,.18);border-radius:14px;background:rgba(6,12,31,.55);box-shadow:inset 0 1px 0 rgba(255,255,255,.08);white-space:pre-wrap;line-height:1.42;font-size:18px;font-weight:900;color:#fff}
    #qsa_solve{width:calc(100% - 32px);height:48px;margin:14px 16px 16px;border:0;border-radius:14px;background:linear-gradient(135deg,#f8fafc,#6ee7ff 48%,#7c3cff);color:#07111f;font-weight:900;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;box-shadow:0 15px 34px rgba(0,200,255,.22)}
    #qsa_solve:hover{filter:brightness(1.05)}
    #qsa_solve:disabled{opacity:.68;cursor:wait;filter:saturate(.75)}
    #qsa_solve svg{width:18px;height:18px;fill:currentColor}
  `;

  document.documentElement.appendChild(style);
  document.documentElement.appendChild(root);

  const panel = root.querySelector("#qsa_panel");
  const launcher = root.querySelector("#qsa_launcher");
  const body = root.querySelector("#qsa_body");
  const solve = root.querySelector("#qsa_solve");

  function toggle() {
    const open = panel.style.display === "block";
    panel.style.display = open ? "none" : "block";
    launcher.style.display = open ? "grid" : "none";
  }

  launcher.onclick = toggle;
  root.querySelector("#qsa_close").onclick = toggle;

  root.querySelector("#qsa_settings").onclick = () => {
    chrome.runtime.sendMessage({ type: "OPEN_OPTIONS" });
  };

  solve.onclick = () => {
    solve.disabled = true;
    body.textContent = "Scanning...";

    chrome.runtime.sendMessage({ type: "SOLVE_SCREEN" }, result => {
      solve.disabled = false;

      if (chrome.runtime.lastError) {
        body.textContent = "Error: " + chrome.runtime.lastError.message;
      } else if (!result?.ok) {
        body.textContent = "Error: " + (result?.error || "Unknown error");
      } else {
        body.textContent = result.answer;
      }
    });
  };

  chrome.runtime.onMessage.addListener(message => {
    if (message.type === "TOGGLE_PANEL") toggle();
  });
})();
