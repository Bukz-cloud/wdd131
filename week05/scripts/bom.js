const input = document.querySelector("#favchap");
const addButton = document.querySelector("button");
const closeButton = document.querySelector("#close-button");
const list = document.querySelector("#list");

// Load saved list from localStorage
let chaptersArray = getChapterList() || [];

// Display existing chapters from localStorage
chaptersArray.forEach(chapter => {
  displayList(chapter);
});

// Add Button
addButton.addEventListener("click", function () {
  const chapterName = input.value.trim();

  // Prevent empty submissions
  if (chapterName === "") {
    alert("Please enter a chapter name!");
    input.focus();
    return;
  }

  // Add to page
  displayList(chapterName);

  // Add to array + save
  chaptersArray.push(chapterName);
  setChapterList();

  input.value = "";
  input.focus();
});

// Delete All Button
closeButton.addEventListener("click", function () {
  if (confirm("Are you sure you want to remove all chapters?")) {
    list.innerHTML = "";
    chaptersArray = [];
    setChapterList();
  }
  input.focus();
});

// Display One Item in List
function displayList(chapter) {
  const li = document.createElement("li");
  li.textContent = chapter;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "❌";
  deleteButton.setAttribute("aria-label", `Remove ${chapter}`);

  li.append(deleteButton);
  list.append(li);

  // Delete single chapter
  deleteButton.addEventListener("click", function () {
    deleteChapter(chapter);
    list.removeChild(li);
    input.focus();
  });
}

// Local Storage Handlers
function setChapterList() {
  localStorage.setItem("myFavBOMList", JSON.stringify(chaptersArray));
}

function getChapterList() {
  return JSON.parse(localStorage.getItem("myFavBOMList"));
}

// Delete One Chapter
function deleteChapter(chapter) {
  chaptersArray = chaptersArray.filter(item => item !== chapter);
  setChapterList();
}
