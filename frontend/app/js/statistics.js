var colors = [
  ["#ffa600"],
  ["#bc5090", "#ffa600"],
  ["#003f5c", "#bc5090", "#ffa600"],
  ["#003f5c", "#7a5195", "#ef5675", "#ffa600"],
  ["#003f5c", "#58508d", "#bc5090", "#ff6361", "#ffa600"],
  ["#003f5c", "#444e86", "#955196", "#dd5182", "#ff6e54", "#ffa600"],
  ["#003f5c", "#374c80", "#7a5195", "#bc5090", "#ef5675", "#ff764a", "#ffa600"],
  [
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "#ffa600"
  ]
];

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
          data: itemData,
          backgroundColor: colors[itemData.length - 1]
        }
      ]
    };
    var options = {
      title: {
        display: true,
        text: data.message,
        position: "top"
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
