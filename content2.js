function createDropdown(data) {
  const container = document.querySelector(
    ".feed-shared-update-v2__comments-container"
  );
  if (!container) {
    return;
  }

  const dropdown = document.createElement("select");
  data.comments.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.text = item;
    dropdown.appendChild(option);
  });

  dropdown.addEventListener("change", function () {
    const targetForm = document.querySelector(
      ".comments-comment-box__form-container"
    );
    const inputField = targetForm.querySelector(".ql-editor > p");
    const selectedOption = this.value;

    if (targetForm && inputField) {
      inputField.innerHTML = selectedOption;
      console.log("Selected option set as input value in the form.");
    } else {
      console.log("Target form or input field not found.");
    }
  });

  container.insertBefore(dropdown, container.firstChild);
}

// Send a message to the background script to get tab information
chrome.runtime.sendMessage({ action: "getTabInfo" }, async function (response) {
  // comments = ["c1", "c2", "c3"]
  console.log("comments:  ", response);

  createDropdown(response);
});
