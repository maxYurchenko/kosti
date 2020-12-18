var notificationApiUrl = "/api/notification";

function initHeaderFunctions() {
  var activeEl =
    $(".header .active").length > 0
      ? $(".header .active")
      : $(".header-logo a");
  if (!activeEl.length > 0) {
    return false;
  }
  $(".active_element").css(
    "left",
    activeEl.offset().left - 3 + activeEl.width() / 2
  );
  $(
    ".nav-list .nav-item a, .js_search-icon, .js_header-user, .js_notification-icon"
  ).on("mouseenter", function () {
    $(".active_element").css(
      "left",
      $(this).offset().left - 3 + $(this).width() / 2
    );
  });
  $(
    ".nav-list .nav-item a, .js_search-icon, .js_header-user, .js_notification-icon"
  ).on("mouseleave", function () {
    $(".active_element").css(
      "left",
      activeEl.offset().left - 3 + activeEl.width() / 2
    );
  });
  $(".js_search-icon").on("click", function () {
    $(".js_header-search").addClass("show");
    $(".js_search-input").focus();
  });
  $(".js_header-search").on("focusout", function (e) {
    if ($(this).has(e.relatedTarget).length === 0) {
      $(".js_header-search").removeClass("show");
    }
  });
  $(".js_notification-icon").on("click", function (e) {
    e.preventDefault();
    $(".js_notification-block").html("");
    $(".js_notification-loader").removeClass("hidden");
    $(".js_header-notification").addClass("show_notification");
    var call = makeAjaxCall(notificationApiUrl, "GET");
    call.done(function (data) {
      $(".js_notification-loader").addClass("hidden");
      $(".js_notification-block").html(data.html);
      var currQty = parseInt(
        $(".js_header-notification .notification-qty").text()
      );
      if (currQty - 3 < 1) {
        $(".js_header-notification").removeClass("have_qty");
      } else {
        $(".js_header-notification .notification-qty").text(currQty - 3);
      }
    });
  });
  $(".js_notification-block").on(
    "mouseover",
    ".js_notification-item",
    function () {
      $(this).removeClass("new");
    }
  );
  if (!$("body").hasClass("landing-page")) {
    $(document).on("scroll", function () {
      if ($(document).scrollTop() > 85) {
        if (
          $("body").hasClass("homepage") ||
          $("body").hasClass("article-page")
        ) {
          $(".header").addClass("header-scroll");
        }
        if (!$(".header").hasClass("change-logo")) {
          $(".header").addClass("change-logo");
          setTimeout(function () {
            $(".active_element").css(
              "left",
              activeEl.offset().left - 3 + activeEl.width() / 2
            );
          }, 100);
        }
      } else {
        if ($(".header").hasClass("change-logo")) {
          $(".header").removeClass("header-scroll change-logo");
          setTimeout(function () {
            $(".active_element").css(
              "left",
              activeEl.offset().left - 3 + activeEl.width() / 2
            );
          }, 100);
        }
      }
    });
  } else {
    $(document).on("scroll", function () {
      if ($(document).scrollTop()) {
        $(".header").addClass("header-scroll");
      } else {
        $(".header").removeClass("header-scroll");
      }
    });
  }
}
