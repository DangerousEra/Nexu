const key = document.getElementById("apiKey");
const model = document.getElementById("model");
const saved = document.getElementById("saved");

chrome.storage.local.get(
  { apiKey: "", model: "gemini-3-flash-preview" },
  data => {
    key.value = data.apiKey;
    model.value = data.model;
  }
);

document.getElementById("save").onclick = async () => {
  await chrome.storage.local.set({
    apiKey: key.value.trim(),
    model: model.value.trim() || "gemini-3-flash-preview"
  });

  saved.textContent = "Saved";
  setTimeout(() => saved.textContent = "", 1600);
};
