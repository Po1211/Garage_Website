$(document).ready(function(){
    $('.news-carousel').slick({
        slidesToShow: 3, // Hiển thị 3 ảnh trên màn hình lớn
        slidesToScroll: 1,
        dots: true,
        arrows: true,
        responsive: [
            {
                breakpoint: 1200, // Dưới 1024px
                settings: {
                    slidesToShow: 2, // Hiển thị 2 ảnh
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 800, // Dưới 600px
                settings: {
                    slidesToShow: 1, // Hiển thị 1 ảnh
                    slidesToScroll: 1
                }
            }
        ]
    });
});

