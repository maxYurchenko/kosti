function initStatisticsPage() {
  $.ajax({
    url: "/api/statistics/items-sold",
    type: "GET",
    data: { start: $("#start").val(), end: $("#end").val() },
    contentType: "application/json"
  }).done(function (data) {
    createChart("itemsChart", data);
  });
  $.ajax({
    url: "/api/statistics/cart-country",
    type: "GET",
    data: { start: $("#start").val(), end: $("#end").val() },
    contentType: "application/json"
  }).done(function (data) {
    createChart("countryChart", data);
  });
  function createChart(chartId, data) {
    var ctx = document.getElementById(chartId).getContext("2d");
    var labels = [];
    var itemData = [];
    for (var i = 0; i < data.data.length; i++) {
      labels.push(data.data[i].displayName);
      itemData.push(data.data[i].amount);
    }
    var chartData = {
      labels: labels,
      datasets: [
        {
          data: itemData
        }
      ]
    };
    var options = {
      title: {
        display: true,
        text: data.message,
        position: "top"
      },
      plugins: {
        colorschemes: {
          scheme: "brewer.SetThree12"
        }
      }
    };
    var chart = new Chart(ctx, {
      type: "pie",
      data: chartData,
      options: options
    });
  }
}
$(document).ready(function () {
  initStatisticsPage();
});
