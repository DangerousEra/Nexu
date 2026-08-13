chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  try {
    await chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_PANEL" });
  } catch (e) {
    console.warn("Nexu cannot run on this page:", e);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "OPEN_OPTIONS") {
    chrome.runtime.openOptionsPage();
    return;
  }

  if (message.type !== "SOLVE_SCREEN") return;

  (async () => {
    try {
      const windowId = sender.tab?.windowId;
      if (typeof windowId !== "number") throw new Error("No active browser window.");

      const settings = await chrome.storage.local.get({
        apiKey: "",
        model: "gemini-3-flash-preview"
      });

      if (!settings.apiKey) {
        throw new Error("Gemini API key is not saved. Open Nexu settings first.");
      }

      const screenshot = await chrome.tabs.captureVisibleTab(windowId, {
        format: "jpeg",
        quality: 82
      });
      const base64 = screenshot.split(",")[1];

      const prompt =
        "Read this browser screenshot and identify the clearest visible quiz or exam question. " +
        "Return ONLY the final answer. If it is multiple choice, return only the option letter " +
        "and the exact option text, for example: B. Photosynthesis. Do not include explanation, " +
        "steps, reasoning, notes, markdown, or extra sentences. Do not click or submit anything. " +
        "If no clear question is visible, return exactly: No clear question found.";

      // Try the selected model first. If Google returns a temporary high-demand/
      // resource-exhausted response, automatically try the fallback model.
      const models = [settings.model];
      if (!models.includes("gemini-3-flash-preview")) models.push("gemini-3-flash-preview");
      if (!models.includes("gemini-3.1-flash-lite")) models.push("gemini-3.1-flash-lite");

      let lastError = "";

      for (const model of models) {
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/interactions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": settings.apiKey
            },
            body: JSON.stringify({
              model,
              input: [
                { type: "text", text: prompt },
                { type: "image", mime_type: "image/jpeg", data: base64 }
              ]
            })
          }
        );

        const body = await response.json();

        if (!response.ok) {
          lastError = body?.error?.message || `Gemini API error ${response.status}`;

          const temporary =
            response.status === 429 ||
            response.status === 503 ||
            /high demand|resource.?exhausted|temporar|try again/i.test(lastError);

          if (temporary) continue;
          throw new Error(lastError);
        }

        let answer = body?.output_text || "";

        if (!answer && Array.isArray(body?.outputs)) {
          answer = body.outputs
            .flatMap(item => item?.content || [])
            .filter(item => item?.type === "text")
            .map(item => item.text || "")
            .join("\n")
            .trim();
        }

        if (!answer && Array.isArray(body?.steps)) {
          answer = body.steps
            .flatMap(step => step?.content || [])
            .filter(item => item?.type === "text")
            .map(item => item.text || "")
            .join("\n")
            .trim();
        }

        answer = cleanAnswer(answer);

        if (answer) {
          sendResponse({ ok: true, answer, modelUsed: model });
          return;
        }

        lastError = "Gemini returned no text.";
      }

      throw new Error(
        "All available Gemini models are temporarily busy or unavailable. " +
        "Please try again in a minute. Last error: " + lastError
      );
    } catch (error) {
      sendResponse({ ok: false, error: error.message || String(error) });
    }
  })();

  return true;
});

function cleanAnswer(answer) {
  const text = String(answer || "").trim();
  if (!text) return "";
  if (/^no clear question found\.?$/i.test(text)) return "No clear question found.";

  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  const optionLine = lines.find(line =>
    /^(\(?[A-H]\)?[\s.):-]|option\s+[A-H]\b)/i.test(line)
  );

  const first = optionLine || lines[0] || text;
  return first
    .replace(/^(answer|best answer|correct answer)\s*[:=-]\s*/i, "")
    .replace(/\s*(because|explanation|reason|rationale)\s*[:,-].*$/i, "")
    .trim();
}
