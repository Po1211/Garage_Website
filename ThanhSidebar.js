// Get the elements
const menuIcon = document.querySelector('.menu-icon');
const sidebar = document.getElementById('sidebar');
const pageOverlay = document.getElementById('page-overlay');
const sidebarLogo = document.querySelector('.sidebar-logo'); // Get the sidebar logo
const menuItems = document.querySelectorAll('.menu-items a'); // Get all menu items

// Function to toggle sidebar and overlay
menuIcon.addEventListener('click', () => {
  sidebar.classList.toggle('open'); // Open/close sidebar
  pageOverlay.classList.toggle('active'); // Show/hide overlay
  sidebarLogo.classList.toggle('hidden'); // Hide/show logo

  // Toggle menu icon between Menu and Close
  if (menuIcon.innerHTML === '✕') {
    menuIcon.innerHTML = '&#9776;'; // Change back to Menu icon
    menuIcon.classList.remove('active');
  } else {
    menuIcon.innerHTML = '✕'; // Change to Close icon
    menuIcon.classList.add('active');
  }
});

// Close sidebar and overlay when clicking the menu icon again
menuIcon.addEventListener('click', () => {
  if (menuIcon.innerHTML === '&#9776;') {
    sidebar.classList.remove('open');
    pageOverlay.classList.remove('active');
    sidebarLogo.classList.remove('hidden'); // Show logo when sidebar is closed
  }
});

// Close sidebar and overlay when clicking any menu item
menuItems.forEach((item) => {
  item.addEventListener('click', () => {
    sidebar.classList.remove('open');
    pageOverlay.classList.remove('active');
    sidebarLogo.classList.remove('hidden'); // Show logo when sidebar is closed
    menuIcon.innerHTML = '&#9776;';
    menuIcon.classList.remove('active');
  });
});
