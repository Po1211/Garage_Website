<script>
    document.addEventListener("DOMContentLoaded", function ()) {
        var faqItems = document.getElementsByClassName("faq-item");

        for (var i = 0; i < faqItems.length; i++) {
            faqItems[i].querySelector(".faq-question").onclick = function () {
                // Kiểm tra xem phần trả lời có đang hiển thị không
                var answer = this.nextElementSibling;

                if (answer.style.display === "block") {
                    answer.style.display = "none";
                } else {
                    // Đóng tất cả các phần trả lời khác
                    for (var j = 0; j < faqItems.length; j++) {
                        faqItems[j].querySelector(".faq-answer").style.display = "none";
                    }
                    // Mở phần trả lời của câu hỏi hiện tại
                    answer.style.display = "block";
                }
            };
        }
    });
</script>
