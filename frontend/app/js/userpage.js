var imageApi = "/api/user/image";
var userApi = "/api/user";
var gameSignOutUrl = "/api/festival/gamesignout";

function initUserPageFunctions() {
  $("#userImageUpload").on("submit", function (e) {
    e.preventDefault();
    var formData = new FormData(this);
    if (
      $("#userImage")
        .val()
        .match(/.(jpg|jpeg|png|gif)$/i)
    ) {
      showLoader();
      $.ajax({
        type: "POST",
        url: imageApi,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
          $(".user-avatar-img_wrap img").attr("src", data.url);
          $(".profile-upload-image img").attr("src", data.url);
          hideLoader();
        },
        error: function (data) {
          hideLoader();
        }
      });
    } else {
      showSnackBar("Не подходящий файл для аватара.", "error");
    }
  });
  $(".js_profile-settings").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(".js_edit_user-modal").addClass("show");
    removeScroll();
  });
  $(".js_edit_user-form").on("submit", function (e) {
    e.preventDefault();
    showLoader();
    var formData = getFormData(this);
    editUserData(formData);
  });

  $("#userImage").on("change", function () {
    $("#userImageUpload").submit();
  });

  $(".user_page-wrap .profile .profile-avatar").on("click", function () {
    $("#userImageUpload input").click();
  });

  $(".js_user-game-signout").on("click", function (e) {
    e.preventDefault();
    showLoader();
    signOutOfGame(this);
  });

  if (findGetParameter("action") === "settings") {
    $(".js_edit_user-modal").addClass("show");
  }
}

$(document).ready(function () {
  initUserPageFunctions();
});

function editUserData(formData) {
  var call = makeAjaxCall(userApi, "POST", formData, true);
  call.done(function (data) {
    hideLoader();
    if (data.error) {
      showSnackBar(data.message, "Произошла ошибка при редактировании данных.");
    } else {
      if (data.message) {
        showSnackBar(data.message, "success");
      } else {
        showSnackBar("Данные обновлены.", "success");
      }
      $(".js_edit_user-modal").removeClass("show");
    }
  });
}

function signOutOfGame(el) {
  var data = { gameId: $(el).data().gameid };
  $.ajax({
    url: gameSignOutUrl,
    data: data,
    type: "POST",
    success: function (data) {
      hideLoader();
      $(el).closest(".js_games-my-game-item").remove();
    },
    error: function (data) {
      hideLoader();
      showSnackBar("Произошла ошибка.", "error");
    }
  });
}
