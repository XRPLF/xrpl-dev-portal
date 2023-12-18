let currentIndex = 1;

let isFirstLoad = true; // Add a flag to determine if it's the initial load

function updateCarousel() {
  const centerImage = document.getElementById("center-image");
  const leftImage = document.getElementById("left-image");
  const rightImage = document.getElementById("right-image");

  if (!isFirstLoad) {
    // Only run the exit animation if it's not the first load
    centerImage.classList.add("exit");
    leftImage.classList.add("exit");
    rightImage.classList.add("exit");
  }

  setTimeout(
    () => {
      if (events[currentIndex - 1]) {
        document.getElementById("prev-btn").style.opacity = 1;
        leftImage.style.visibility = "visible";
        leftImage.src = `assets/img/events/${events[currentIndex - 1].image}`;
      } else {
        document.getElementById("prev-btn").style.opacity = 0.5;
        leftImage.style.visibility = "hidden";
      }

      centerImage.src = `assets/img/events/${events[currentIndex].image}`;
      centerImage.onclick = function() { // Add an onclick event to the main image
        window.open(events[currentIndex].link, '_blank'); // Open a new tab with the event link
      };

      if (events[currentIndex + 1]) {
        document.getElementById("next-btn").style.opacity = 1;
        rightImage.style.visibility = "visible";
        rightImage.src = `assets/img/events/${events[currentIndex + 1].image}`;
      } else {
        document.getElementById("next-btn").style.opacity = 0.5;
        rightImage.style.visibility = "hidden";
      }

      document.getElementById("event-name").textContent =
        events[currentIndex].name;
      document.getElementById("event-location").textContent =
        events[currentIndex].location;
      document.getElementById("event-date").textContent =
        events[currentIndex].date;

      if (!isFirstLoad) {
        // Only run the enter animation if it's not the first load
        centerImage.classList.remove("exit");
        leftImage.classList.remove("exit");
        rightImage.classList.remove("exit");
      }
    },
    isFirstLoad ? 0 : 700
  ); // If it's the first load, update immediately; otherwise, wait for the transition

  // After the initial setup, set isFirstLoad to false
  isFirstLoad = false;
}

document.getElementById("prev-btn").addEventListener("click", function () {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
});

document.getElementById("next-btn").addEventListener("click", function () {
  if (currentIndex < events.length - 1) {
    currentIndex++;
    updateCarousel();
  }
});

// Initial setup
updateCarousel();
