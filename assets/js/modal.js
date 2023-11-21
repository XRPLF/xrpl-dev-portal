$(document).ready(() => {
  // Note: Use lowercase filenames here to avoid case inconsistency between
  // dev environments like macOS and Windows which are not case-sensitive,
  // and production Linux servers which use case-sensitive file systems.
  const logos = {
    infrastructure: [
      "xrp-ledger",
      "gatehub",
      "towolabs",
      "xrpscan",
      "xrp-toolkit",
      "bithomp",
      "onthedex",
    ],
    developer_tooling: [
      "cryptum",
      "evernode",
      "threezy",
      "tokenize",
    ],
    interoperability: ["multichain"],
    wallet: [
      "bitfrost",
      "crossmark",
      "edge",
      "gem-wallet",
      "xumm",
    ],
    nfts: [
      "aesthetes",
      "audiotarky",
      "nftmaster",
      "peerkat",
      "sologenic_dex",
      "xrp-cafe",
      "xrp-oval",
    ],
    exchanges: ["sologenic_dex", "xpmarket"],
    gaming: [
      "forte",
      "ledger-city",
    ],
    security: ["anchain"],
    payments: ["ripple", "supermojo"],
    cbdc: ["ripple"],
    sustainability: ["carbonland-trust"],
    custody: ["gatehub", "bitgo"],
  };
  // Helper function to create a logo element
  function createLogoElement(logoSrc, title, id) {
    const logoElem = document.createElement("div");
    logoElem.alt = `${title} logo`;
    logoElem.classList.add(`logo-item`);
    logoElem.classList.add(`${logoSrc}`);
    return logoElem;
  }
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
    // Reset styles and classes for modalLogos
    modalLogos.removeAttribute("style");
    modalLogos.className = "";

    if (logoArray.length > 0) {
      const topRowDiv = document.createElement("div");
      topRowDiv.className = "top-row";
      const bottomRowDiv = document.createElement("div");
      bottomRowDiv.className = "bottom-row";

      if (logoArray.length === 7) {
        // 4 on top, 3 on bottom
        for (let i = 0; i < 4; i++) {
          const logoElem = createLogoElement(logoArray[i], title, id);
          topRowDiv.appendChild(logoElem);
        }
        for (let i = 4; i < 7; i++) {
          const logoElem = createLogoElement(logoArray[i], title, id);
          bottomRowDiv.appendChild(logoElem);
        }
      }else if (logoArray.length === 8) {
        // 4 on top, 4 on bottom
        for (let i = 0; i < 4; i++) {
          const logoElem = createLogoElement(logoArray[i], title, id);
          topRowDiv.appendChild(logoElem);
        }
        for (let i = 4; i < 8; i++) {
          const logoElem = createLogoElement(logoArray[i], title, id);
          bottomRowDiv.appendChild(logoElem);
        }
      } else if (logoArray.length === 6) {
        // Special case: 3 on top, 3 on bottom
        for (let i = 0; i < 3; i++) {
          const logoElem = createLogoElement(logoArray[i], title, id);
          topRowDiv.appendChild(logoElem);
        }
        for (let i = 3; i < 6; i++) {
          const logoElem = createLogoElement(logoArray[i], title, id);
          bottomRowDiv.appendChild(logoElem);
        }
      } else if (logoArray.length === 5) {
        // Special case: 3 on top, 2 on bottom
        for (let i = 0; i < 3; i++) {
          const logoElem = createLogoElement(logoArray[i], title, id);
          topRowDiv.appendChild(logoElem);
        }
        for (let i = 3; i < 5; i++) {
          const logoElem = createLogoElement(logoArray[i], title, id);
          bottomRowDiv.appendChild(logoElem);
        }
        bottomRowDiv.style.justifyContent = "center"; // Center the logos
      } else if (logoArray.length === 4) {
        // Special case: 2 on top, 2 on bottom
        for (let i = 0; i < 2; i++) {
          const logoElem = createLogoElement(logoArray[i], title, id);
          topRowDiv.appendChild(logoElem);
        }
        for (let i = 2; i < 4; i++) {
          const logoElem = createLogoElement(logoArray[i], title, id);
          bottomRowDiv.appendChild(logoElem);
        }
        bottomRowDiv.style.justifyContent = "center"; // Center the logos
      } else {
        // Default case
        logoArray.forEach((logoSrc) => {
          const logoElem = createLogoElement(logoSrc, title, id);
          topRowDiv.appendChild(logoElem);
        });
      }

      modalLogos.appendChild(topRowDiv);
      if (bottomRowDiv.hasChildNodes()) {
        modalLogos.appendChild(bottomRowDiv);
      }
    } else {
      modalLogos.className = "flex-center";
    }
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
