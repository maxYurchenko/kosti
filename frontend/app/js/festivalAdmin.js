var playersListUrl = "/api/festival/admin/games/players/list";
var removePlayerUrl = "/api/festival/admin/games/players/delete";
var addPlayerUrl = "/api/festival/admin/games/players/add";

function initFestivalAdminScripts() {
  $("body").on("click", ".js_game-players-list", function (e) {
    showLoader();
    loadPlayersList($(this));
    showModal(e);
  });
  $("body").on("click", ".js_game-add-player", function (e) {
    showLoader();
    loadAddPlayerForm($(this));
    showModal(e);
  });
  $("body").on("click", ".js_game-add-player-submit", function (e) {
    showLoader();
    addPlayer($(this));
    showModal(e);
  });

  $("body").on("click", ".js_remove-player", function (e) {
    showLoader();
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
      $(".js_modal-content").html(data.html);
      hideLoader();
      showSnackBar(data.message ? data.message : "Игрок удален.", "success");
    },
    error: function (data) {
      hideLoader();
      showSnackBar(data.message ? data.message : "Error", "error");
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
      showSnackBar(data.message ? data.message : "Error", "error");
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
    type: "POST",
    success: function (data) {
      hideAllModals();
      hideLoader();
      showSnackBar(data.message ? data.message : "Игрок добавлен.", "success");
    },
    error: function (data) {
      hideLoader();
      showSnackBar(data.message ? data.message : "Error", "error");
    }
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
      showSnackBar(data.message ? data.message : "Error", "error");
    }
  });
}

$(document).ready(function () {
  initFestivalAdminScripts();
});
