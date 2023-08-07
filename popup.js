document.addEventListener("DOMContentLoaded", function () {
  displayData();
  document
    .getElementById("fetchMoreButton")
    .addEventListener("click", fetchMoreLinks);
});

async function fetchData() {
  try {
    const response = await fetch("http://127.0.0.1:5000/ai_post");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function displayData() {
  const data = await fetchData();

  const listContainer = document.getElementById("data-list");

  data.forEach((item) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = `${item.id}`; // Replace with your desired link format
    link.textContent = `No: ${item.pred}`;
    link.target = "_blank";

    listItem.appendChild(link);
    listContainer.appendChild(listItem);
  });
}

async function fetchMoreLinks() {
  const data = await fetchData();

  // clear the previous list
  const listContainer = document.getElementById("data-list");
  listContainer.innerHTML = "";

  data.forEach((item) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = `${item.id}`; // Replace with your desired link format
    link.textContent = `No: ${item.pred}`;
    link.target = "_blank";

    listItem.appendChild(link);
    listContainer.appendChild(listItem);
  });
}
