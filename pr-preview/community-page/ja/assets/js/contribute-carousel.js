const events = [
  {
    name: "XRPL Grants Info Session: Decentralized Exchange (DEX) Focused",
    description:
      "Watch the recorded information session and Q&A on applying to XRPL Grants Wave 7. This session will provide a general overview of the XRPL Grants application for Wave 7, with a focus on Decentralized Exchange (DEX) projects.",
    type: "info-session",
    link: "https://www.youtube.com/watch?v=BbGu0QC5WEE",
    location: "Virtual - Zoom",
    date: "September 06, 2023",
    image: "InfoSessions.png",
    end_date: "September 06, 2023",
  },
  {
    name: "APEX 2024: The XRPL Developer Summit",
    description:
      "Apex XRPL Developer Summit is the annual event where developers, contributors, and thought leaders come together to learn, build, share, network, and celebrate all things XRP Ledger.",
    type: "conference",
    link: "http://apexdevsummit.com",
    location: "Amsterdam",
    date: "June 11 - 13, 2024",
    image: "Conference.png",
    end_date: "June 13, 2024",
  },
  {
    name: "XRPL Developers Reddit AMA: Real World Assets",
    description:
      "Join us for a live chat on Reddit and learn more about how developers are building real world assets with confidence on the XRP Ledger.",
    type: "ama",
    link: "https://xrplresources.org/rwa-ama?utm_source=web&utm_medium=web&utm_campaign=bwc",
    location: "Virtual - Reddit",
    date: "October 17, 2023",
    image: "AMAs.png",
    end_date: "October 17, 2023",
  },
  {
    name: "New Horizon: Innovate Without Limits: New Horizons Await",
    description:
      "Join us to kickstart the ecosystem of the upcoming EVM-compatible chain, opening new possibilities for developers to explore the limitless potential of our platform.",
    type: "hackathon",
    link: "https://newhorizon.devpost.com/",
    location: "Virtual",
    date: "October 19, 2023 - December 22, 2023",
    image: "Hackathons.png",
    end_date: "December 22, 2023",
  },
];

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
