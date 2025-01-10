$(function () {
    $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitSuccess: function ($form, event) {
            event.preventDefault(); // 阻止默認提交行為

            // 構造 FormData 物件
            var formData = new FormData();
            formData.append("name", $("input#name").val());
            formData.append("email", $("input#email").val());
            formData.append("message", $("textarea#message").val());


            // 發送 AJAX 請求
            $.ajax({
                url: "/contact_me",
                type: "POST",
                data: formData,
                contentType: false, // 確保發送的是 multipart/form-data
                processData: false, // 禁止 jQuery 處理數據
                success: function () {
                    $('#success').html("<div class='alert alert-success'>")
                        .append("<strong>Your message has been sent!</strong>")
                        .append("</div>");
                    $('#contactForm').trigger("reset"); // 清空表單
                },
                error: function () {
                    $('#success').html("<div class='alert alert-danger'>")
                        .append("<strong>Failed to send your message. Please try again later.</strong>")
                        .append("</div>");
                },
            });
        },
    });
});