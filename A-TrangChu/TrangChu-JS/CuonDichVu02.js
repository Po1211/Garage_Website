// Lấy các phần tử cần thiết
const scrollContainer = document.querySelector('.scroll-container');
const fieldContent = document.querySelector('.field-content');
let isDragging = false;
let startX;
let scrollLeft;

// Bắt đầu kéo
scrollContainer.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.pageX - scrollContainer.offsetLeft;
  scrollLeft = scrollContainer.scrollLeft;
  scrollContainer.style.cursor = 'grabbing';
});

// Kết thúc kéo
scrollContainer.addEventListener('mouseup', () => {
  isDragging = false;
  scrollContainer.style.cursor = 'grab';
});

// Khi chuột rời container
scrollContainer.addEventListener('mouseleave', () => {
  isDragging = false;
  scrollContainer.style.cursor = 'grab';
});

// Khi di chuyển chuột
scrollContainer.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - scrollContainer.offsetLeft;
  const walk = (x - startX) * 2; // Tốc độ kéo
  scrollContainer.scrollLeft = scrollLeft - walk;

  // Kiểm tra xem thẻ đã che phần văn bản chưa
  if (scrollContainer.scrollLeft > 50) {
    fieldContent.classList.add('hidden'); // Ẩn văn bản khi bị che
  } else {
    fieldContent.classList.remove('hidden'); // Hiện lại văn bản
  }
});
