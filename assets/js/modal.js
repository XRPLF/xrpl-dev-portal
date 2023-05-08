$(document).ready(() => {
  // Add two new variables for arrow buttons
  var leftArrow = document.getElementById("leftArrow");
  var rightArrow = document.getElementById("rightArrow");
  // Handle arrow button clicks
  function handleArrowClick(direction) {
    // Get the current data index
    var currentIndex = parseInt(modal.getAttribute("data-index"));

    // Calculate the new index based on the direction
    var newIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;

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
  var modal = document.getElementById("myModal");
  var openModalBtns = document.querySelectorAll("li.open-modal");
  var useCaseData = [];

  // Populate the useCaseData array with data from the li elements
  openModalBtns.forEach(function (btn) {
    var id = btn.getAttribute("data-id");
    var title = btn.getAttribute("data-title");
    var number = btn.getAttribute("data-number");
    var src = btn.getAttribute("data-src");

    useCaseData.push({ id, title, number, src });
  });

  // Get the elements in the modal that will be updated
  var modalImage = document.querySelector(".modal .section-image");
  var modalTextDescription = document.querySelector(
    ".modal .section-text-description"
  );
  var modalTextTitle = document.querySelector(".modal .section-text-title");
  var modalLogos = document.querySelector(".modal .section-logos");
  // Add a function to update the modal content
  function updateModalContent({id, title, number, src }) {
    modalImage.src = src;
    modalImage.alt = title + " logo";
    modalTextDescription.textContent = title;
    modalTextTitle.textContent = title;
    modalLogos.textContent = "Group of logos for " + title + " here...";
  }
  openModalBtns.forEach(function (btn, index) {
    btn.onclick = function () {
      // Read the data-* attributes from the clicked li
      var id = btn.getAttribute("data-id");
      var title = btn.getAttribute("data-title");
      var number = btn.getAttribute("data-number");
      var src = btn.getAttribute("data-src");
      // Update the modal content with the data from the clicked li
      modalImage.src = src;
      modalImage.alt = title + " logo";
      modalTextDescription.textContent = title;
      modalTextTitle.textContent = title;
      modalLogos.textContent = "Group of logos for " + title + " here...";

      // Set the data index on the modal
      modal.setAttribute("data-index", index);

      // Update the modal content with the data from the clicked li
      updateModalContent({ id, title, number, src });

      // Show or hide the arrow buttons based on the index
      leftArrow.style.display = index === 0 ? "none" : "block";
      rightArrow.style.display =
        index === useCaseData.length - 1 ? "none" : "block";

      modal.style.display = "block";
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
