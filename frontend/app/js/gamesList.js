var requestInProgress = false;
var noMoreGames = false;
var currentBlock = null;
var currentDay = null;

var gamesFetchUrl = "/api/festival/games/list";
var wrapper = $(".js-k_games-wrapper");

function initGamesListScripts() {
  currentBlock = wrapper.data().blockid;
  currentDay = wrapper.data().dayid;
  $(document).on("click", function (e) {
    var el = $(".js-custom_select");
    if (!el.is(e.target) && el.has(e.target).length === 0) {
      el.removeClass("show");
    }
  });

  var selected_arr = [];
  var games_i = 0;

  $(".js-custom_select").on("click", ".js-custom_select-option", function () {
    var val = $(this).data("value");
    var text = $(this).text();

    if (selected_arr.indexOf(val) === -1) {
      selected_arr[games_i] = val;
      addSelectedOption(val, text);
      games_i++;
    }

    $(".js-custom_select-placeholder").hide();
  });

  $(document).on("scroll", function () {
    checkScroll();
  });

  if ($(window).width() < 768) {
    $(".js-k_games-filters-btn").on("click", function () {
      $(this).toggleClass("open");
      $(".js-k_games-filters-list").slideToggle("slow");
    });
  }

  $(".js-custom_select").on("click", ".js-custom_select-button", function (e) {
    $(this).parent().toggleClass("show");
  });

  $(".js_festival-filter-select").on("change", function () {
    getFilteredGames();
  });

  $(".js-custom_select").on(
    "click",
    ".js-custom_select-selected",
    function (e) {
      e.stopPropagation();
      var val = $(this).data("value");
      var index = selected_arr.indexOf(val);

      if (index > -1) {
        selected_arr.splice(index, 1);
      }

      $(".js-custom_select-selected[data-value=" + val + "]").remove();
      games_i--;

      if (selected_arr.length === 0) {
        $(".js-custom_select-placeholder").show();
      }
      getFilteredGames();
    }
  );
}

function checkScroll() {
  var load =
    $(document).height() -
      ($(document).scrollTop() +
        $(window).height() +
        $("footer").height() +
        500) <
      0 &&
    !requestInProgress &&
    !noMoreGames;
  if (load) {
    loadGames();
  }
}

function addSelectedOption(val, text) {
  $(
    "<span class='js-custom_select-selected custom_select-selected_item js_festival-filter-multiselect' data-value='" +
      val +
      "'>" +
      text +
      "<i class='icon-delete'></i></span>"
  ).appendTo(".js-custom_select-button");
  getFilteredGames();
}

function loadGames() {
  requestInProgress = true;
  var wrapperData = wrapper.data();
  var filters = getSelectedFilters();
  var page = wrapperData.page ? parseInt(wrapperData.page) : 1;
  filters.page = page;
  var call = makeAjaxCall(gamesFetchUrl, "GET", filters);
  call.done(function (data) {
    $(".js-k_games-wrapper").append(data.html);
    currentBlock = data.currentBlock;
    currentDay = data.currentDay;
    setTimeout(function () {
      requestInProgress = false;
    }, 500);
    wrapper.data("page", page + 1);
    checkGames(data.noMoreGames);
  });
}

function getFilteredGames() {
  showLoader();
  checkGames(false);
  wrapper.data("page", 1);
  $.ajax({
    url: gamesFetchUrl,
    data: getSelectedFilters(),
    type: "GET",
    success: function (data) {
      currentBlock = null;
      currentDay = null;
      hideLoader();
      $(".js-k_games-wrapper").html(data.html);
      checkGames(data.noMoreGames);
    },
    error: function (data) {
      hideLoader();
    }
  });
}

function getSelectedFilters() {
  var data = {
    theme: []
  };
  $(".js_festival-filter-select").each(function () {
    data[$(this).attr("name")] = $(this).val();
  });
  $(".js_festival-filter-multiselect").each(function () {
    data.theme.push($(this).data().value);
  });
  data.parent = $(".js_games-list").data().id;
  data.currentBlock = currentBlock;
  data.currentDay = currentDay;
  return data;
}

function checkGames(noMoreGamesScoped) {
  if (noMoreGamesScoped) {
    $(".js_games-loader").addClass("hidden");
    $(".js_games-list-empty").removeClass("hidden");
  } else {
    $(".js_games-loader").removeClass("hidden");
    $(".js_games-list-empty").addClass("hidden");
  }
  noMoreGames = noMoreGamesScoped;
}

$(document).ready(function () {
  initGamesListScripts();
});
