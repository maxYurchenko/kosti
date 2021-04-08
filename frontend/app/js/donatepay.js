function initDonatePayPage() {
  $(".js_load-donate-pay").on("click", function (e) {
    showLoader();
    e.preventDefault();
    var data = $(this).data();
    data.skip = $(".js_donatepay-item").length;
    $.ajax({
      url: data.url,
      type: "GET",
      data: data,
      contentType: "application/json",
      success: function (data) {
        hideLoader();
        if (data.success || data.status === "success") {
          $(".js_donatepay-table").append(data.data);
          showSnackBar("Done", "success");
        } else {
          showSnackBar(data.message ? data.message : "Error", "error");
        }
      },
      error: function (data) {
        hideLoader();
        showSnackBar("Error", "error");
      }
    });
  });
}
$(document).ready(function () {
  initDonatePayPage();
});
