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
  const videoScrollTrack = document.querySelector('.video-scroll-track');
  const allVideos = document.querySelectorAll('.video-item video');
  const fullscreenOverlay = document.getElementById('fullscreen-video-overlay');
  const fullscreenVideo = document.getElementById('fullscreenVideo');
  const closeBtn = document.getElementById('close-video-btn');

  // Initially, all videos in the scrolling track are muted and play on loop without sound
  allVideos.forEach(video => {
    video.muted = true;
    video.play();
  });

  const videoItems = document.querySelectorAll('.video-item');
  videoItems.forEach(item => {
    item.addEventListener('click', (event) => {
      // Prevents the event from bubbling up to the document click listener
      event.stopPropagation();
      
      const videoElement = item.querySelector('video');

      // Stop the scrolling animation
      videoScrollTrack.style.animationPlayState = 'paused';

      // Set the fullscreen video source and play it
      fullscreenVideo.src = videoElement.src;
      fullscreenVideo.load();
      fullscreenVideo.play();
      fullscreenVideo.muted = false;

      // Show the fullscreen overlay
      fullscreenOverlay.classList.add('active');
    });
  });

  // Event listener to close the video when the "X" button is clicked
  closeBtn.addEventListener('click', () => {
    closeFullscreenVideo();
  });

  // Event listener to close the video when clicking the blurred background
  fullscreenOverlay.addEventListener('click', (event) => {
    // Check if the click was on the background and not on the video itself
    if (event.target === fullscreenOverlay || event.target.classList.contains('overlay-background')) {
      closeFullscreenVideo();
    }
  });

  // Function to handle closing the video and resuming the scroll
  function closeFullscreenVideo() {
    // Pause the video and reset its time
    fullscreenVideo.pause();
    fullscreenVideo.currentTime = 0;
    
    // Hide the fullscreen overlay
    fullscreenOverlay.classList.remove('active');
    
    // Resume the scrolling animation
    videoScrollTrack.style.animationPlayState = 'running';
  }
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
