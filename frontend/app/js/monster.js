function initMonster() {
  $(".js_monster-form").on("submit", function(e) {
    e.preventDefault();
    if (!checkUserLoggedIn()) {
      showLogin(e);
      return false;
    }
    var data = getFormData(this);
    data = prepareActions(data);
    var call = $.ajax({
      url: monsterServiceUrl,
      type: "POST",
      data: {
        data: JSON.stringify(data)
      },
      success: function() {
        showSnackBar("Успех", "success");
      },
      error: function() {
        showSnackBar("Произошла ошибка", "error");
      }
    });
  });

  function prepareActions(data) {
    data.legendaryActions = [];
    data.actions = [];
    data.reactions = [];
    data.specialAbilities = [];
    if (data.actionsNameLeg) {
      data.actionsNameLeg = forceArray(data.actionsNameLeg);
      data.actionsDescLeg = forceArray(data.actionsDescLeg);
      for (var i = 0; i < data.actionsNameLeg.length; i++) {
        data.legendaryActions.push({
          name: data.actionsNameLeg[i],
          desc: data.actionsDescLeg[i]
        });
      }
    }
    if (data.actionsName) {
      data.actionsName = forceArray(data.actionsName);
      data.actionsDesc = forceArray(data.actionsDesc);
      for (var i = 0; i < data.actionsName.length; i++) {
        data.actions.push({
          name: data.actionsName[i],
          desc: data.actionsDesc[i]
        });
      }
    }
    if (data.specialAbilityName) {
      data.specialAbilityName = forceArray(data.specialAbilityName);
      data.specialAbilityDesc = forceArray(data.specialAbilityDesc);
      for (var i = 0; i < data.specialAbilityName.length; i++) {
        data.specialAbilities.push({
          name: data.specialAbilityName[i],
          desc: data.specialAbilityDesc[i]
        });
      }
    }
    if (data.reactionName) {
      data.reactionName = forceArray(data.reactionName);
      data.reactionDesc = forceArray(data.reactionDesc);
      for (var i = 0; i < data.reactionName.length; i++) {
        data.specialAbilities.push({
          name: data.reactionName[i],
          desc: data.reactionDesc[i]
        });
      }
    }

    delete data.actionsName;
    delete data.actionsDesc;
    delete data.specialAbilityName;
    delete data.specialAbilityDesc;
    delete data.actionsNameLeg;
    delete data.actionsDescLeg;
    return data;
  }
}

$(document).ready(function() {
  initMonster();
});
