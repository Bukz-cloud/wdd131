// Footer: Current year + Last Modified
const currentYear = new Date().getFullYear();
const yearElem = document.getElementById("currentyear");
if (yearElem) yearElem.textContent = currentYear;

const lastModElem = document.getElementById("lastModified");
if (lastModElem) lastModElem.textContent = `Last modified: ${document.lastModified}`;

// Product Array
const products = [
  { id: "fc-1888", name: "flux capacitor", averagerating: 4.5 },
  { id: "fc-2050", name: "power laces", averagerating: 4.7 },
  { id: "fs-1987", name: "time circuits", averagerating: 3.5 },
  { id: "ac-2000", name: "low voltage reactor", averagerating: 3.9 },
  { id: "jj-1969", name: "warp equalizer", averagerating: 5.0 }
];


// Run when DOM is ready
document.addEventListener("DOMContentLoaded", () => {

  // Populate Product Dropdown (index page)
  const select = document.getElementById("productSelect");

  if (select) {
    products.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.name;
      select.appendChild(option);
    });
  }

  // Review Summary Page Handling
  const params = new URLSearchParams(window.location.search);

  function writeValue(id, value) {
    const elem = document.getElementById(id);
    if (elem) elem.textContent = value || "None";
  }

  writeValue("summaryProduct", params.get("product"));
  writeValue("summaryRating", params.get("rating"));
  writeValue("summaryDate", params.get("date"));
  writeValue("summaryReview", params.get("review"));
  writeValue("summaryName", params.get("name") || "Anonymous");

  // Features (multiple values)
  const featuresElem = document.getElementById("summaryFeatures");
  if (featuresElem) {
    const features = params.getAll("features");
    featuresElem.textContent = features.length ? features.join(", ") : "None";
  }

  // LocalStorage Review Counter
  const counterElem = document.getElementById("reviewCounter");

  if (counterElem) {
    let count = localStorage.getItem("reviewCount");
    count = count ? parseInt(count) + 1 : 1;

    localStorage.setItem("reviewCount", count);
    counterElem.textContent = count;
  }

});

document.getElementById("clearCounterBtn").addEventListener("click", () => {
    localStorage.removeItem("reviewCount");
    document.getElementById("reviewCounter").textContent = 0;
});