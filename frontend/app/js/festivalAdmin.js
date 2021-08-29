var playersListUrl = "/api/festival/admin/games/players/list";
var removePlayerUrl = "/api/festival/admin/games/players/delete";
var addPlayerUrl = "/api/festival/admin/games/players/add";

function initFestivalAdminScripts() {
  $("body").on("click", ".js_game-players-list", function (e) {
    showLoader();
    e.preventDefault();
    loadPlayersList($(this), e);
  });
  $("body").on("click", ".js_game-add-player", function (e) {
    showLoader();
    e.preventDefault();
    loadAddPlayerForm($(this), e);
  });
  $("body").on("click", ".js_game-add-player-submit", function (e) {
    showLoader();
    e.preventDefault();
    addPlayer($(this), e);
  });

  $("body").on("click", ".js_remove-player", function (e) {
    showLoader();
    e.preventDefault();
    removePLayer($(this));
  });
}

function showModal(e) {
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
      var players = forceArray(data.game.data.players);
      $(".js_game-seats-" + data.game._id).html(
        players.length + "/" + data.game.data.maxPlayers
      );
    },
    error: function (data) {
      hideLoader();
      showSnackBar(data.message ? data.message : "Error", "error");
    }
  });
}

function loadAddPlayerForm(el, event) {
  $.ajax({
    url: addPlayerUrl,
    data: { gameId: el.data().gameid },
    type: "GET",
    success: function (data) {
      $(".js_modal-content").html(data.html);
      showModal(event);
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
      hideLoader();
      if (data.error) {
        showSnackBar(data.message ? data.message : "Игрок добавлен.", "error");
        return;
      }

      hideAllModals();
      var players = forceArray(data.game.data.players);
      $(".js_game-seats-" + data.game._id).html(
        players.length + "/" + data.game.data.maxPlayers
      );
      showSnackBar(data.message ? data.message : "Игрок добавлен.", "success");
    },
    error: function (data) {
      hideLoader();
      showSnackBar(data.message ? data.message : "Error", "error");
    }
  });
}

function loadPlayersList(el, event) {
  $.ajax({
    url: playersListUrl,
    data: { gameId: el.data().gameid },
    type: "GET",
    success: function (data) {
      $(".js_modal-content").html(data.html);
      showModal(event);
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
