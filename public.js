// Fix for logo path in GitHub Pages
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const logoImages = document.querySelectorAll('img[src="/logo.png"]');
    logoImages.forEach(img => {
      img.src = "./logo.png";
    });
  }, 500);
});
