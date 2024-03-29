function initOrderPage() {
  $(".js_api-call-button-with-data").on("click", function (e) {
    showLoader();
    e.preventDefault();
    var data = $(this).data();
    $.ajax({
      url: data.url,
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      success: function (data) {
        hideLoader();
        if (data.success) {
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
  $(".js_api-call-button-with-form").on("click", function (e) {
    showLoader();
    e.preventDefault();
    var form = $(this).closest("form");
    var data = {};
    form.find("input, select").each(function () {
      data[$(this).attr("name")] = $(this).val();
    });
    $.ajax({
      url: form.attr("action"),
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      success: function (data) {
        hideLoader();
        if (data.success) {
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
  $(".js_update-api-button-data-select").on("change", function (e) {
    e.preventDefault();
    var button = $(this)
      .parent()
      .parent()
      .find(".js_api-call-button-with-data");
    if (button) {
      button.data($(this).attr("name"), $(this).val());
    }
  });
  $(".js_update-api-button-data-input").on("input", function (e) {
    e.preventDefault();
    var button = $(this).parent().find(".js_api-call-button-with-data");
    if (button) {
      button.data($(this).attr("name"), $(this).val());
    }
  });
}
$(document).ready(function () {
  initOrderPage();
});
