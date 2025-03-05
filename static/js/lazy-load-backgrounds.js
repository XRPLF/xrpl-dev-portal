document.addEventListener('DOMContentLoaded', () => {
  // Function to check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) + 500 && // 500px buffer
      rect.left <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Function to load background image
  function loadBackgroundImage(element) {
    const bgImage = element.getAttribute('data-bg-image');
    if (bgImage) {
      element.style.backgroundImage = `url(${bgImage})`;
      element.removeAttribute('data-bg-image'); // Remove data attribute so we don't process this again
    }
  }

  // Get all card footers
  const cardFooters = document.querySelectorAll('.card-footer[data-bg-image]');
  
  // Check initially which card footers are in viewport
  cardFooters.forEach(footer => {
    if (isInViewport(footer)) {
      loadBackgroundImage(footer);
    }
  });

  // Set up intersection observer for remaining elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadBackgroundImage(entry.target);
        observer.unobserve(entry.target); // Stop observing once loaded
      }
    });
  }, {
    rootMargin: '200px', // Start loading when image is 200px from viewport
  });

  // Observe each card footer that isn't already loaded
  cardFooters.forEach(footer => {
    if (footer.getAttribute('data-bg-image')) {
      observer.observe(footer);
    }
  });

  // Also check on scroll (fallback for older browsers)
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
      cardFooters.forEach(footer => {
        if (footer.getAttribute('data-bg-image') && isInViewport(footer)) {
          loadBackgroundImage(footer);
        }
      });
    }, 100);
  });
}); 