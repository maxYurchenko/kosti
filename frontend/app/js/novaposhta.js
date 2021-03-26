function initNovaPoshta() {
  var apiUrl = "https://api.novaposhta.ua/v2.0/json/";
  var apiKey = "ecc4e836cab6d9c8356bd4ee46ff14a7";
  $(".delivery_np-input-city").on("input", function () {
    if ($(this).val().length > 1) {
      var dataCity = {
        apiKey: apiKey,
        modelName: "Address",
        calledMethod: "searchSettlements",
        methodProperties: {
          Limit: "10"
        }
      };
      dataCity.methodProperties.CityName = $(".delivery_np-input-city").val();

      $.ajax({
        url: apiUrl,
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(dataCity),
        success: function (response) {
          $("#suggestion-list").html("");
          var dataIncome = response.data[0].Addresses;
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
    var dataCity = {
      apiKey: apiKey,
      modelName: "AddressGeneral",
      calledMethod: "getWarehouses",
      methodProperties: {
        Language: "ru",
        Limit: "99999",
        CityRef: $(this).data("ref")
      }
    };

    $.ajax({
      url: apiUrl,
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(dataCity),
      success: function (response) {
        $("#delivery_np-warehouses").html(
          '<option disabled="disabled" selected="selected">Выберите отделение</option>'
        );
        for (var i = 0; i < response.data.length; i++) {
          console.log(response.data[i]);
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
    var dataCity = {
      apiKey: apiKey,
      modelName: "InternetDocument",
      calledMethod: "getDocumentPrice",
      methodProperties: {
        CitySender: "e221d627-391c-11dd-90d9-001a92567626",
        CityRecipient: $(".delivery_np-input-city").data("ref"),
        Weight: $("#cartWeight").val(),
        ServiceType: "WarehouseWarehouse",
        Cost: "100",
        CargoType: "Parcel",
        SeatsAmount: "1"
      }
    };

    $.ajax({
      url: apiUrl,
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(dataCity),
      success: function (response) {
        $(".js_shippingPricenovaposhta").text("UAH " + response.data[0].Cost);
        $("input[name=shippingPrice]").val(response.data[0].Cost);
        $("input#novaposhta").attr("data-price", response.data[0].Cost);
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
