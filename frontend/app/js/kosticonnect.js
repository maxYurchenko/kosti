function initKosticonnetcScripts() {
  $(".js_scroll").on("click", function (e) {
    e.preventDefault();
    scrollToItem($("." + $(this).data().direction), true);
  });
  $(".js_ticket-buy").on("click", function (e) {
    addTocart(e, this);
  });

  $(".js_faq-item h4").on("click", function () {
    var parent = $(this).parent();
    if (parent.hasClass("active")) {
      parent.removeClass("active");
    } else {
      $(".js_faq-item.active").removeClass("active");
      parent.addClass("active");
    }
  });
}

function addTocart(e, element) {
  e.preventDefault();
  let data = {
    action: "modify",
    cartId: getCookieValue("cartId"),
    itemId: $(element).data().itemid,
    amount: 1
  };
  let sizeSelect = $(element).parent().find("select");
  if (sizeSelect.length > 0) {
    data.size = sizeSelect.val();
  }
  let call = makeAjaxCall(updateCartUrl, "POST", data, true);
  call.done(function (data) {
    if (data.success) {
      var cart = data.data;
      setCookie(cart._id);
      window.location.href = baseUrl + "/cart";
    } else {
      showSnackBar("Не удалось добавить билет", "error");
    }
  });
}

$(document).ready(function () {
  initKosticonnetcScripts();
});
