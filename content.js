(() => {
  if (window.top !== window.self || document.getElementById("__qsa_root")) return;

  const asset = name => chrome.runtime.getURL(`assets/${name}`);
  const frames = {
    idle: asset("nexu-idle.png"),
    scan: asset("nexu-scan.png"),
    think: asset("nexu-think.png"),
    answer: asset("nexu-answer.png"),
    spark: asset("nexu-spark.png")
  };
  const idleFrames = [frames.idle, frames.think, frames.spark, frames.answer];

  const root = document.createElement("div");
  root.id = "__qsa_root";
  root.innerHTML = `
    <div id="qsa_panel" role="dialog" aria-label="Nexu">
      <div id="qsa_header">
        <div id="qsa_brand">
          <img id="qsa_logo" src="${asset("nexu-logo.svg")}" alt="Nexu">
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

      <div id="qsa_stage">
        <div id="qsa_avatar_shell">
          <img id="qsa_avatar" src="${frames.idle}" alt="">
          <span id="qsa_ping"></span>
        </div>
        <div id="qsa_status">
          <span id="qsa_badge">Answer only</span>
          <strong id="qsa_title">Nexu is ready</strong>
          <small id="qsa_subtitle">Click solve and Nexu will return just the option.</small>
        </div>
      </div>

      <div id="qsa_body">Ready.</div>
      <button id="qsa_solve">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.7 4.6L18.4 9l-4.7 1.4L12 15l-1.7-4.6L5.6 9l4.7-1.4L12 3z"/><path d="M18.5 13l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z"/></svg>
        <span>Solve Screen</span>
      </button>
    </div>

    <button id="qsa_launcher" title="Nexu" aria-label="Open Nexu">
      <img id="qsa_launcher_img" src="${frames.idle}" alt="">
    </button>
  `;

  const style = document.createElement("style");
  style.textContent = `
    #__qsa_root,#__qsa_root *{box-sizing:border-box;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    #qsa_launcher{position:fixed;right:22px;bottom:22px;z-index:2147483647;width:76px;height:76px;padding:0;border:1px solid rgba(111,231,255,.68);border-radius:24px;background:linear-gradient(145deg,#071225,#13318b 55%,#00c8ff);cursor:pointer;box-shadow:0 0 0 4px rgba(13,30,78,.42),0 22px 55px rgba(0,184,255,.3),inset 0 1px 0 rgba(255,255,255,.34);display:grid;place-items:center;overflow:hidden;animation:qsa-float 3.8s ease-in-out infinite}
    #qsa_launcher:after{content:"";position:absolute;inset:7px;border-radius:19px;border:1px solid rgba(255,255,255,.16);pointer-events:none}
    #qsa_launcher_img{width:82px;height:82px;object-fit:cover;object-position:center top;filter:drop-shadow(0 7px 14px rgba(0,0,0,.36))}
    #qsa_panel{display:none;position:fixed;right:22px;bottom:112px;z-index:2147483647;width:min(410px,calc(100vw - 32px));max-height:calc(100vh - 130px);overflow:hidden;color:#f8fafc;background:linear-gradient(150deg,rgba(6,10,26,.99),rgba(25,20,71,.99) 58%,rgba(3,49,65,.99));border:1px solid rgba(100,181,255,.28);border-radius:20px;box-shadow:0 26px 74px rgba(4,8,18,.56),0 0 44px rgba(0,178,255,.18),inset 0 1px 0 rgba(255,255,255,.12);backdrop-filter:blur(18px)}
    #qsa_panel:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 17% 0%,rgba(69,214,255,.23),transparent 31%),radial-gradient(circle at 100% 8%,rgba(130,88,255,.24),transparent 30%);pointer-events:none}
    #qsa_header,#qsa_stage,#qsa_body,#qsa_solve{position:relative}
    #qsa_header{display:flex;align-items:center;gap:12px;padding:14px 15px;border-bottom:1px solid rgba(255,255,255,.1)}
    #qsa_brand{min-width:0;flex:1;height:42px;display:flex;align-items:center}
    #qsa_logo{width:148px;height:auto;display:block;filter:drop-shadow(0 0 12px rgba(0,200,255,.24))}
    #qsa_actions{display:flex;gap:7px}
    #qsa_actions button{width:36px;height:36px;border:1px solid rgba(255,255,255,.14);border-radius:11px;background:rgba(255,255,255,.08);color:#e5e7eb;cursor:pointer;display:grid;place-items:center}
    #qsa_actions button:hover{background:rgba(255,255,255,.16)}
    #qsa_actions svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
    #qsa_stage{display:grid;grid-template-columns:104px minmax(0,1fr);gap:14px;align-items:center;margin:15px 16px 0;padding:13px;border:1px solid rgba(89,199,255,.18);border-radius:17px;background:rgba(255,255,255,.06)}
    #qsa_avatar_shell{position:relative;width:104px;height:104px;border-radius:24px;background:linear-gradient(145deg,#081127,#0b47a6 55%,#00c8ff);display:grid;place-items:end center;overflow:hidden;box-shadow:0 0 28px rgba(0,200,255,.22),inset 0 1px 0 rgba(255,255,255,.18)}
    #qsa_avatar{width:120px;height:120px;object-fit:cover;object-position:center top;animation:qsa-bob 2.8s ease-in-out infinite;filter:drop-shadow(0 8px 13px rgba(0,0,0,.42))}
    #qsa_ping{position:absolute;right:11px;top:11px;width:12px;height:12px;border-radius:999px;background:#30ffb7;box-shadow:0 0 0 6px rgba(48,255,183,.13),0 0 18px rgba(48,255,183,.8)}
    #qsa_status{min-width:0}
    #qsa_badge{display:inline-flex;padding:5px 9px;border-radius:999px;background:rgba(31,243,185,.14);color:#7fffdc;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0}
    #qsa_title{display:block;margin-top:9px;color:#fff;font-size:18px;line-height:1.15;font-weight:950;letter-spacing:0}
    #qsa_subtitle{display:block;margin-top:5px;color:#b9d9ff;font-size:12px;line-height:1.35;font-weight:700}
    #qsa_body{margin:12px 16px 0;min-height:82px;max-height:min(36vh,230px);overflow:auto;padding:16px;border:1px solid rgba(88,199,255,.2);border-radius:15px;background:rgba(6,12,31,.62);box-shadow:inset 0 1px 0 rgba(255,255,255,.08);white-space:pre-wrap;line-height:1.36;font-size:20px;font-weight:950;color:#fff}
    #qsa_solve{width:calc(100% - 32px);height:50px;margin:14px 16px 16px;border:0;border-radius:15px;background:linear-gradient(135deg,#f8fafc,#6ee7ff 48%,#7c3cff);color:#07111f;font-weight:950;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;box-shadow:0 15px 34px rgba(0,200,255,.23)}
    #qsa_solve:hover{filter:brightness(1.05)}
    #qsa_solve:disabled{opacity:.72;cursor:wait;filter:saturate(.8)}
    #qsa_solve svg{width:18px;height:18px;fill:currentColor}
    @keyframes qsa-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
    @keyframes qsa-bob{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-5px) scale(1.02)}}
    @media (max-width:520px){
      #qsa_launcher{right:14px;bottom:14px;width:68px;height:68px;border-radius:22px}
      #qsa_launcher_img{width:76px;height:76px}
      #qsa_panel{left:10px;right:10px;bottom:92px;width:auto;max-height:calc(100vh - 106px)}
      #qsa_stage{grid-template-columns:88px minmax(0,1fr);gap:11px;margin:12px 12px 0;padding:11px}
      #qsa_avatar_shell{width:88px;height:88px;border-radius:21px}
      #qsa_avatar{width:104px;height:104px}
      #qsa_body{margin:10px 12px 0;font-size:18px;max-height:34vh}
      #qsa_solve{width:calc(100% - 24px);margin:12px;height:48px}
    }
  `;

  document.documentElement.appendChild(style);
  document.documentElement.appendChild(root);

  const panel = root.querySelector("#qsa_panel");
  const launcher = root.querySelector("#qsa_launcher");
  const launcherImg = root.querySelector("#qsa_launcher_img");
  const avatar = root.querySelector("#qsa_avatar");
  const body = root.querySelector("#qsa_body");
  const solve = root.querySelector("#qsa_solve");
  const title = root.querySelector("#qsa_title");
  const subtitle = root.querySelector("#qsa_subtitle");
  let solving = false;
  let frameIndex = 0;

  setInterval(() => {
    if (solving) return;
    frameIndex = (frameIndex + 1) % idleFrames.length;
    avatar.src = idleFrames[frameIndex];
    launcherImg.src = idleFrames[frameIndex];
  }, 1300);

  function setState(state, message) {
    if (state === "scan") {
      avatar.src = frames.scan;
      launcherImg.src = frames.scan;
      title.textContent = "Scanning screen";
      subtitle.textContent = "Nexu is reading the visible question.";
    } else if (state === "answer") {
      avatar.src = frames.answer;
      launcherImg.src = frames.answer;
      title.textContent = "Answer found";
      subtitle.textContent = "Only the final option is shown.";
    } else if (state === "error") {
      avatar.src = frames.think;
      launcherImg.src = frames.think;
      title.textContent = "Needs attention";
      subtitle.textContent = "Check settings or page permission.";
    }
    body.textContent = message;
  }

  function toggle(forceOpen) {
    const open = forceOpen ?? panel.style.display !== "block";
    panel.style.display = open ? "block" : "none";
    launcher.style.display = open ? "none" : "grid";
  }

  launcher.onclick = () => toggle(true);
  root.querySelector("#qsa_close").onclick = () => toggle(false);

  root.querySelector("#qsa_settings").onclick = () => {
    chrome.runtime.sendMessage({ type: "OPEN_OPTIONS" });
  };

  solve.onclick = () => {
    solving = true;
    solve.disabled = true;
    setState("scan", "Scanning...");

    chrome.runtime.sendMessage({ type: "SOLVE_SCREEN" }, result => {
      solving = false;
      solve.disabled = false;

      if (chrome.runtime.lastError) {
        setState("error", "Error: " + chrome.runtime.lastError.message);
      } else if (!result?.ok) {
        setState("error", "Error: " + (result?.error || "Unknown error"));
      } else {
        setState("answer", result.answer);
      }
    });
  };

  chrome.runtime.onMessage.addListener(message => {
    if (message.type === "TOGGLE_PANEL") toggle();
  });
})();
