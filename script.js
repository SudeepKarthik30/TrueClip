// script.js

// Smooth scroll for navbar links
document.querySelectorAll('a.nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const videoScrollContainer = document.querySelector('.video-scroll-container');
  const allVideos = document.querySelectorAll('.video-item video');
  const fullscreenOverlay = document.getElementById('fullscreen-video-overlay');
  const fullscreenVideo = document.getElementById('fullscreenVideo');
  const closeBtn = document.getElementById('close-video-btn');

  // Initially, all videos in the scrolling track are muted and play on loop without sound
  allVideos.forEach(video => {
    video.muted = true;
    video.play();
  });

  let isDragging = false; // Flag to distinguish between click and drag

  const videoItems = document.querySelectorAll('.video-item');
  videoItems.forEach(item => {
    item.addEventListener('click', (event) => {
      // If we were just dragging, don't open the video.
      if (isDragging) {
        event.preventDefault();
        return;
      }
      
      event.stopPropagation();
      const videoElement = item.querySelector('video');

      fullscreenVideo.src = videoElement.src;
      fullscreenVideo.load();
      fullscreenVideo.play();
      fullscreenVideo.muted = false;

      fullscreenOverlay.classList.add('active');
    });
  });

  // Event listener to close the video when the "X" button is clicked
  closeBtn.addEventListener('click', () => {
    closeFullscreenVideo();
  });

  // Event listener to close the video when clicking the blurred background
  fullscreenOverlay.addEventListener('click', (event) => {
    if (event.target === fullscreenOverlay || event.target.classList.contains('overlay-background')) {
      closeFullscreenVideo();
    }
  });

  function closeFullscreenVideo() {
    fullscreenVideo.pause();
    fullscreenVideo.currentTime = 0;
    fullscreenOverlay.classList.remove('active');
  }

  // NEW: DRAG-TO-SCROLL FUNCTIONALITY
  let isDown = false;
  let startX;
  let scrollLeft;

  videoScrollContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    isDragging = false; // Reset drag flag on mouse down
    videoScrollContainer.classList.add('active');
    startX = e.pageX - videoScrollContainer.offsetLeft;
    scrollLeft = videoScrollContainer.scrollLeft;
  });

  videoScrollContainer.addEventListener('mouseleave', () => {
    isDown = false;
    videoScrollContainer.classList.remove('active');
  });

  videoScrollContainer.addEventListener('mouseup', () => {
    isDown = false;
    videoScrollContainer.classList.remove('active');
    // We need a timeout to reset the dragging flag after the click event has fired
    setTimeout(() => {
        isDragging = false;
    }, 50);
  });

  videoScrollContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    isDragging = true; // If mouse moves while down, it's a drag
    const x = e.pageX - videoScrollContainer.offsetLeft;
    const walk = (x - startX) * 2; // Multiplier for faster scrolling
    videoScrollContainer.scrollLeft = scrollLeft - walk;
  });

});

// This script animates numbers when the stats section scrolls into view.
document.addEventListener('DOMContentLoaded', () => {

    const statsSection = document.getElementById('stats-section');
    let hasAnimated = false; // Flag to ensure the animation runs only once

    // Function to animate a single number
    const animateNumber = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const start = 0;
        const duration = 2000; // Animation duration in milliseconds
        let startTime = null;

        const updateCount = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const value = Math.floor(percentage * target);
            element.textContent = value;

            if (percentage < 1) {
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = target; // Ensure it ends on the exact target value
            }
        };
        requestAnimationFrame(updateCount);
    };

    // Use IntersectionObserver to detect when the section is in the viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                // When the section is visible, find all '.count' elements and animate them
                document.querySelectorAll('.count').forEach(counter => {
                    animateNumber(counter);
                });
                hasAnimated = true;
                observer.unobserve(statsSection); // Stop observing after animation
            }
        });
    }, {
        threshold: 0.5 // Trigger when at least 50% of the section is visible
    });

    if (statsSection) {
        observer.observe(statsSection);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const scrollArrow = document.querySelector('.scroll-arrow');

    // Flag to check if the arrow has been hidden
    let isArrowHidden = false;

    window.addEventListener('scroll', () => {
        // Only run the hiding logic if the arrow is still visible
        if (!isArrowHidden) {
            // Add the 'hidden' class to make the arrow disappear
            scrollArrow.classList.add('hidden');
            
            // Set the flag so this code doesn't run again
            isArrowHidden = true;
        }
    });
});

  document.addEventListener('DOMContentLoaded', function() {
            // Get form and success message elements
            const form = document.getElementById('contact-form');
            const successMessage = document.getElementById('success-message');

            // Listen for form submission
            form.addEventListener('submit', function(event) {
                // Prevent the default form submission (which would cause a page reload)
                event.preventDefault();
                
                // Get the button and change its text to indicate sending
                const submitButton = form.querySelector('.btn-submit');
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;

                // Create a FormData object from the form
                const formData = new FormData(form);

                // Send the data to Formspree using fetch
                fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        // On success, hide the form and show the success message
                        form.style.display = 'none';
                        successMessage.style.display = 'block';

                        // Reset the button and form after a short delay
                        setTimeout(() => {
                            successMessage.style.display = 'none';
                            form.reset(); // Clear the form fields
                            form.style.display = 'block';
                            submitButton.textContent = 'Grow Your Brand Now';
                            submitButton.disabled = false;
                        }, 5000); // Wait 5 seconds before resetting
                    } else {
                        // If there's a problem, show an error message
                        console.error('Form submission failed.');
                        submitButton.textContent = 'Error! Try Again.';
                        submitButton.disabled = false;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    submitButton.textContent = 'Error! Try Again.';
                    submitButton.disabled = false;
                });
            });
        });
