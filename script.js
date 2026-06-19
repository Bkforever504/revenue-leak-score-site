const form = document.querySelector("#scan-form");
const message = document.querySelector("#form-message");

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const business  = data.get("business") || "";
  const name      = data.get("name") || "";
  const url       = data.get("url") || "";
  const city      = data.get("city") || "";
  const category  = data.get("category") || "";
  const email     = data.get("email") || "";
  const gbp       = data.get("gbp") || "";

  const subject = encodeURIComponent(`Free Revenue Leak Scan request - ${business}`);
  const body = encodeURIComponent(
    [
      "New Revenue Leak Score free scan request:",
      "",
      `Business:  ${business}`,
      `Name:      ${name}`,
      `Website:   ${url}`,
      `City:      ${city}`,
      `Category:  ${category}`,
      `Email:     ${email}`,
      `GBP URL:   ${gbp || "Not provided"}`,
    ].join("\n")
  );

  message.textContent = "Opening your email app - your scan request is ready to send.";
  window.location.href = `mailto:kennethanthonymeyers@yahoo.com?subject=${subject}&body=${body}`;
});
