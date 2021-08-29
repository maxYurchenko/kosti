var playersListUrl = "/api/festival/admin/games/players/list";
var removePlayerUrl = "/api/festival/admin/games/players/delete";
var addPlayerUrl = "/api/festival/admin/games/players/add";

function initFestivalAdminScripts() {
  $("body").on("click", ".js_game-players-list", function (e) {
    loadPlayersList($(this));
    showModal(e);
  });
  $("body").on("click", ".js_game-add-player", function (e) {
    loadAddPlayerForm($(this));
    showModal(e);
  });
  $("body").on("click", ".js_game-add-player-submit", function (e) {
    addPlayer($(this));
    showModal(e);
  });

  $("body").on("click", ".js_remove-player", function (e) {
    e.preventDefault();
    removePLayer($(this));
  });
}

function showModal(e) {
  e.preventDefault();
  e.stopPropagation();
  hideAllModals();
  removeScroll();
  $(".js_modal").addClass("show");
}

function removePLayer(el) {
  $.ajax({
    url: removePlayerUrl,
    data: { gameId: el.data().gameid, playerId: el.data().playerid },
    type: "GET",
    success: function (data) {
      hideLoader();
    },
    error: function (data) {
      hideLoader();
    }
  });
}

function loadAddPlayerForm(el) {
  $.ajax({
    url: addPlayerUrl,
    data: { gameId: el.data().gameid },
    type: "GET",
    success: function (data) {
      $(".js_modal-content").html(data.html);
      hideLoader();
    },
    error: function (data) {
      hideLoader();
    }
  });
}

function addPlayer(el) {
  var data = {};
  $(".js_game-add-player-form input").each(function () {
    data[$(this).attr("name")] = $(this).val();
  });
  $.ajax({
    url: addPlayerUrl,
    data: data,
    type: "POST"
  });
}

function loadPlayersList(el) {
  $.ajax({
    url: playersListUrl,
    data: { gameId: el.data().gameid },
    type: "GET",
    success: function (data) {
      $(".js_modal-content").html(data.html);
      hideLoader();
    },
    error: function (data) {
      hideLoader();
    }
  });
}

$(document).ready(function () {
  initFestivalAdminScripts();
});
