    const input = document.querySelector("#favchap");
    const addButton = document.querySelector("button");
    const closeButton = document.querySelector("#close-button");
    const list = document.querySelector("#list");

    addButton.addEventListener("click", function() {
      const chapterName = input.value.trim();

      if (chapterName === "") {
        alert("Please enter a chapter name!");
        input.focus();
        return;
      }

      const li = document.createElement("li");
      li.textContent = chapterName;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "❌";
      deleteButton.setAttribute("aria-label", `Remove ${chapterName}`);

      li.append(deleteButton);
      list.append(li);

      deleteButton.addEventListener("click", function() {
        list.removeChild(li);
        input.focus();
      });

      input.value = "";
      input.focus();
    });

    closeButton.addEventListener("click", function() {
      if (confirm("Are you sure you want to remove all chapters?")) {
        list.innerHTML = "";
        input.focus();
      }
    });