const form = document.querySelector("#scan-form");
const message = document.querySelector("#form-message");

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const business = data.get("business") || "";
  const name = data.get("name") || "";
  const url = data.get("url") || "";
  const city = data.get("city") || "";
  const category = data.get("category") || "";
  const email = data.get("email") || "";
  const gbp = data.get("gbp") || "";

  const subject = encodeURIComponent(`Free Revenue Leak Scan request - ${business}`);
  const body = encodeURIComponent(
    [
      "New Revenue Leak Score free scan request:",
      "",
      `Business: ${business}`,
      `Name: ${name}`,
      `Website: ${url}`,
      `City/state: ${city}`,
      `Category: ${category}`,
      `Email: ${email}`,
      `Google Business Profile: ${gbp}`,
    ].join("\n")
  );

  message.textContent = "Opening your email app. Backend form connection comes next.";
  window.location.href = `mailto:hello@myailaunchkit.com?subject=${subject}&body=${body}`;
});
