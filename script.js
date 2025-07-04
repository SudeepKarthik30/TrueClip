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

// Autoplay videos when #work is in view
document.addEventListener('DOMContentLoaded', () => {
  const workSection = document.getElementById('work');
  const videos = document.querySelectorAll('.work-video');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        videos.forEach(video => video.play());
      } else {
        videos.forEach(video => video.pause());
      }
    });
  }, { threshold: 0.5 });

  observer.observe(workSection);

  // Modal video handling
  const modal = new bootstrap.Modal(document.getElementById('videoModal'));
  const modalVideo = document.getElementById('modalVideo');

  videos.forEach(video => {
    video.addEventListener('click', () => {
      const src = video.getAttribute('src');
      modalVideo.querySelector('source').src = src;
      modalVideo.load();
      modal.show();
    });
  });

  // Pause modal video when closed
  document.getElementById('videoModal').addEventListener('hidden.bs.modal', () => {
    modalVideo.pause();
    modalVideo.currentTime = 0;
  });
});
