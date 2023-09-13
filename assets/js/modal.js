$(document).ready(() => {
  const logos = {
    infrastructure: [
      "XRP-Ledger.png",
      "towoLabs.png",
      "xrpscan.png",
      "xrp-toolkit.png",
      "bithomp.png",
      "onthedex.png",
    ],
    // "developer_tooling": ['logo3.png'],
  };
  // Add two new constiables for arrow buttons
  const leftArrow = document.getElementById("leftArrow");
  const rightArrow = document.getElementById("rightArrow");
  // Handle arrow button clicks
  function handleArrowClick(direction) {
    // Get the current data index
    const currentIndex = parseInt(modal.getAttribute("data-index"));

    // Calculate the new index based on the direction
    const newIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;

    // Update the modal content with the new data
    updateModalContent(useCaseData[newIndex]);

    // Update the modal's data-index attribute
    modal.setAttribute("data-index", newIndex);

    // Show or hide the arrow buttons based on the new index
    leftArrow.style.display = newIndex === 0 ? "none" : "block";
    rightArrow.style.display =
      newIndex === useCaseData.length - 1 ? "none" : "block";
  }

  // Add click event listeners for arrow buttons
  leftArrow.addEventListener("click", () => handleArrowClick("left"));
  rightArrow.addEventListener("click", () => handleArrowClick("right"));
  const modal = document.getElementById("myModal");
  const openModalBtns = document.querySelectorAll("li.open-modal");
  const useCaseData = [];

  // Populate the useCaseData array with data from the li elements
  openModalBtns.forEach(function (btn) {
    const id = btn.getAttribute("data-id");
    const title = btn.getAttribute("data-title");
    const description = btn.getAttribute("data-description");
    const number = btn.getAttribute("data-number");
    const src = btn.getAttribute("data-src");

    useCaseData.push({ id, title, number, src, description });
  });

  // Get the elements in the modal that will be updated
  const modalImage = document.querySelector(".modal .section-image");
  const modalTextDescription = document.querySelector(
    ".modal .section-text-description"
  );
  const modalTextTitle = document.querySelector(".modal .section-text-title");
  const modalLogos = document.querySelector(".modal .section-logos");
  // Add a function to update the modal content
  function updateModalContent({ id, title, number, src, description, index }) {
    const arrowContainer = document.getElementById("arrows-container");
    modalImage.src = src;
    modalImage.id = id;
    modalImage.alt = title + " logo";
    modalTextDescription.textContent = description;
    modalTextTitle.textContent = title;
    modalLogos.innerHTML = "";
    const logoArray = logos[id] || [];
    // Set grid layout based on the number of logos
    if (logoArray.length >= 3) {
      modalLogos.style.display = "grid";
      modalLogos.style.gridTemplateColumns = "repeat(2, 1fr)";
    } else {
      modalLogos.style.display = "flex";
      modalLogos.style.justifyContent = "center";
    }
    logoArray.forEach((logoSrc) => {
      const logoElem = document.createElement('img');
      logoElem.src = `assets/img/uses/infrastructure/${logoSrc}`;
      logoElem.alt = `${title} logo`;
      logoElem.classList.add('logo-item');
      modalLogos.appendChild(logoElem);
    });
    if (id === "infrastructure") {
      arrowContainer.style.justifyContent = "end";
    } else {
      arrowContainer.style.justifyContent = "space-between";
    }
  }
  openModalBtns.forEach(function (btn, index) {
    btn.onclick = function () {
      const arrowContainer = document.getElementById("arrows-container");
      // Read the data-* attributes from the clicked li
      const id = btn.getAttribute("data-id");
      const title = btn.getAttribute("data-title");
      const description = btn.getAttribute("data-description");
      const number = btn.getAttribute("data-number");
      const src = btn.getAttribute("data-src");
      // Update the modal content with the data from the clicked li
      modalImage.id = id;
      modalImage.alt = title + " logo";
      modalTextDescription.textContent = description;
      modalTextTitle.textContent = title;

      // Set the data index on the modal
      modal.setAttribute("data-index", index);

      // Update the modal content with the data from the clicked li
      updateModalContent({ id, title, number, src, description, index });

      // Show or hide the arrow buttons based on the index
      leftArrow.style.display = index === 0 ? "none" : "block";
      rightArrow.style.display =
        index === useCaseData.length - 1 ? "none" : "block";

      modal.style.display = "block";

      if (id === "infrastructure") {
        arrowContainer.style.justifyContent = "end";
      } else {
        arrowContainer.style.justifyContent = "space-between";
      }
    };
  });

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      modal.style.display = "none";
    }
  });
});
