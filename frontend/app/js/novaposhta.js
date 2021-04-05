function initNovaPoshta() {
  $(".delivery_np-input-city").on("input", function () {
    if ($(this).val().length > 1) {
      const data = { query: $(".delivery_np-input-city").val() };
      $.ajax({
        url: "/api/novaposhta/cities",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(data),
        success: function (response) {
          $("#suggestion-list").html("");
          var dataIncome = response.data;
          for (var i = 0; i < dataIncome.length; i++) {
            $("#suggestion-list").append(
              "<li data-ref='" +
                dataIncome[i].DeliveryCity +
                "'>" +
                dataIncome[i].MainDescription +
                "</li>"
            );
          }
        }
      });
    }
  });
  $("#suggestion-list").on("click", "li", function () {
    $(".delivery_np-input-city").val($(this).text());
    $(".delivery_np-input-city").data("ref", $(this).data("ref"));
    $("#suggestion-list").html("");
    var dataCity = { cityRef: $(this).data("ref") };

    $.ajax({
      url: "/api/novaposhta/warehouses",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(dataCity),
      success: function (response) {
        $("#delivery_np-warehouses").html(
          '<option disabled="disabled" selected="selected">Выберите отделение</option>'
        );
        for (var i = 0; i < response.data.length; i++) {
          $("#delivery_np-warehouses").append(
            '<option data-warehouseid="' +
              response.data[i].Ref +
              '" value="' +
              response.data[i].DescriptionRu +
              '">' +
              response.data[i].DescriptionRu +
              "</option>"
          );
        }
      }
    });
  });
  $("#suggestion-list").on("click", "li", function () {
    const data = { cityRecipient: $(".delivery_np-input-city").data("ref") };

    $.ajax({
      url: "/api/novaposhta/price",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(data),
      success: function (response) {
        $(".js_shippingPricenovaposhta").text("UAH " + response.data.Cost);
        $("input[name=shippingPrice]").val(response.data.Cost);
        $("input#novaposhta").attr("data-price", response.data.Cost);
      }
    });
  });
  $("input[name=shipping]").on("click", function () {
    $("input[name=shippingPrice]").val($(this).data("price"));
  });
  $("#delivery_np-warehouses").on("change", function (e) {
    var form = $(this).closest("form");
    var input = form.find(".js_novaPoshtaWarehouseId");
    input.val($(this).find("option:selected").data().warehouseid);
  });
}

$(document).ready(function () {
  initNovaPoshta();
});
