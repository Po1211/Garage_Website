// Lắng nghe sự kiện click vào nút "Cuộn xuống"
document.querySelector('.scroll-down').addEventListener('click', function (e) {
  e.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết

  // Tìm phần tử Tin tức Sự kiện (id="news")
  const target = document.querySelector('#news');

  // Tính toán vị trí cần cuộn đến
  const offsetTop = target.getBoundingClientRect().top + window.scrollY;

  // Thực hiện cuộn mượt đến phần tử đó
  window.scrollTo({
    top: offsetTop, // Vị trí trên của phần tử
    behavior: 'smooth' // Hiệu ứng cuộn mượt
  });
});
