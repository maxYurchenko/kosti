var updateUserDataUrl = "/api/festival/userdata";
var gameSignUpUrl = "/api/festival/gamesignup";
var gameSignOutUrl = "/api/festival/gamesignout";
var checkTicketUrl = "/api/festival/ticket";

function initKosticonnetcScripts() {
  $(".js_game-sign-up-step-1").validate({
    ignore: [],
    highlight: function (element, errorClass, validClass) {},
    unhighlight: function (element, errorClass, validClass) {}
  });
  $(".js_festival-agreement").validate({
    ignore: [],
    highlight: function (element, errorClass, validClass) {},
    unhighlight: function (element, errorClass, validClass) {}
  });

  $(".js_sign-out-of-game").on("click", function (e) {
    e.preventDefault();
    signOutOfGame();
  });

  $(".js_sign-up-for-game").on("click", function (e) {
    e.preventDefault();

    if (formData.festivalIsMeetUp) {
      signupForGame();
      return;
    }

    if (formData.formShowed) {
      updateUserData();
    } else if (formData.ticketRequired || formData.userNameRequired) {
      $(".js_game-sign-up-step-1").show("slow");
      formData.formShowed = true;
    } else if (formData.requireDiscord) {
      $(".js_game-sign-up-step-2").show("slow");
      $(".js_sign-up-for-game").hide();
    } else {
      signupForGame();
    }
  });
}

function checkTicket(ticketId, el) {
  if (!$(".js_game-sign-up-step-1").valid()) {
    hideLoader();
    return false;
  }
  $.ajax({
    url: checkTicketUrl,
    data: { ticketId: ticketId, gameId: $(".js_game-id").data().id },
    type: "POST",
    success: function (data) {
      hideLoader();
      if (data.success && data.data.valid) {
        updateUserData();
        $(this).data().step = "login";
        $(".js_game-sign-up-step-2").show("slow");
      } else {
        showSnackBar("Билет не действителен.", "error");
      }
    },
    error: function (data) {
      hideLoader();
      showSnackBar("Произошла ошибка.", "error");
    }
  });
}

function signOutOfGame() {
  var data = { gameId: $(".js_game-id").data().id };
  $.ajax({
    //url: gameSignOutUrl,
    url: gameSignOutUrl,
    data: data,
    type: "POST",
    success: function (data) {
      hideLoader();
      showSnackBar("Вы отписались.", "success");
      $(".js_game-signin-block").removeClass("hidden");
      $(".js_game-signout-block").addClass("hidden");
    },
    error: function (data) {
      hideLoader();
      showSnackBar("Произошла ошибка.", "error");
    }
  });
}

function updateUserData() {
  if (!$(".js_game-sign-up-step-1").valid()) {
    hideLoader();
    return false;
  }
  var userData = getUserData();
  $.ajax({
    url: updateUserDataUrl,
    //url: gameSignUpUrl,
    data: userData,
    type: "POST",
    success: function (data) {
      hideLoader();
      if (!data.error) {
        /*
        !KOSTICONNECT
        */
        if ($(".js_game-sign-up-step-2").length > 0) {
          $(".js_game-sign-up-step-1").hide("slow");
          $(".js_game-sign-up-step-2").show("slow");
          $(".js_sign-up-for-game").hide();
        }
        if (data.message) {
          showSnackBar(data.message, "success");
        } else {
          showSnackBar("Вы записались.", "success");
        }
        $(".js_game-sign-up-step-1").addClass("hidden");
        $(".js_signin-block").addClass("hidden");
        if (checkUserLoggedIn()) {
          $(".js_signout-block").removeClass("hidden");
        }
      } else {
        showSnackBar(data.message, "error");
      }
    }
  });

  $(".js_sign-up-for-game").click(function () {
    $(".js_sign-up-step-1").toggle("slow");
  });
}

function signupForGame() {
  var data = { gameId: $(".js_game-id").data().id };
  $.ajax({
    url: gameSignUpUrl,
    data: data,
    type: "POST",
    success: function (data) {
      hideLoader();
      if (data.error) {
        showSnackBar(data.message, "error");
      } else {
        if (data.message) showSnackBar(data.message, "success");
        else showSnackBar("Вы зарегистрированы.", "success");
        $(".js_game-signin-block").addClass("hidden");
        $(".js_game-signout-block").removeClass("hidden");
      }
    },
    error: function (data) {
      hideLoader();
    }
  });
}

function getUserData() {
  var userData = { gameId: $(".js_game-id").data().id };
  $(".js_get-user-data").each(function () {
    userData[$(this).attr("name")] = $(this).val();
  });
  return userData;
}

$(document).ready(function () {
  initKosticonnetcScripts();
});
