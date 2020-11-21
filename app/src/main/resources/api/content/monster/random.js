const thymeleaf = require("/lib/thymeleaf");
const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const i18nLib = require("/lib/xp/i18n");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const cacheLib = require(libLocation + "cacheLib");

const cache = cacheLib.api.createGlobalCache({
  name: "monsters",
  size: 100,
  expire: 60 * 60 * 24
});

exports.get = function (req) {
  var count = cache.api.getOnly("monstersCount");
  if (!count) {
    count = countMonsters();
    cache.api.put("monstersCount", count);
  }
  var body = { monster: createMarkup(getMonster(count)) };
  return {
    body: body,
    contentType: "application/json"
  };

  function countMonsters() {
    var res = contentLib.query({
      start: 0,
      count: 0,
      query:
        "_parentPath = '/content" +
        getMonsterLocation()._path +
        "'and data.translated = 'true'"
    });
    return res.total;
  }

  function getMonster(count) {
    var start = Math.floor(Math.random() * count);
    var res = contentLib.query({
      start: start,
      count: 1,
      query:
        "_parentPath = '/content" +
        getMonsterLocation()._path +
        "' and data.translated = 'true'"
    });
    return res.hits[0];
  }

  function getMonsterLocation() {
    var site = portal.getSiteConfig();
    return contentLib.get({ key: site.monstersLocation });
  }

  function createMarkup(monster) {
    var reply = [];
    var res = "\n";
    res += "**" + monster.displayName + "**\n";
    res +=
      "*" +
      i18nLib.localize({
        key: "monster.size." + monster.data.size,
        locale: "ru"
      }) +
      " " +
      i18nLib.localize({
        key: "monster.type." + monster.data.type,
        locale: "ru"
      }) +
      ", " +
      i18nLib.localize({
        key: "monster.alignment." + monster.data.alignment,
        locale: "ru"
      }) +
      "*\n\n";
    res += "Коэфициент брони: " + monster.data.armorClass;
    res += monster.data.armorDesc ? "(" + monster.data.armorDesc + ")" : "";
    res += "\n";
    res +=
      "Здоровье: " +
      monster.data.hitPoints +
      "(" +
      monster.data.hitDice +
      ")\n";
    res += "Скорость: " + monster.data.speed.walk + " фт.\n\n";
    res +=
      "   **СИЛ**   |   **ЛОВ**   |   **ВЫН**   |   **ИНТ**   |   **МДР**   |   **ХАР**   \n";
    res += getStats() + "\n\n";
    res += "Сложность: " + monster.data.challengeRating + "\n";
    res += monster.data.senses ? "Чувства: " + monster.data.senses + "\n" : "";
    res += monster.data.languages
      ? "Языки: " + monster.data.languages + "\n"
      : "";
    res += getSavingThrows();
    res += getSkills();
    reply.push(res);
    reply.push("\n**Действия**\n" + getActions("actions"));

    if (monster.data.legendaryActions) {
      reply.push(
        "\n**Легендарные действия**\n" + getActions("legendaryActions")
      );
    }
    if (monster.data.specialAbilities) {
      reply.push("\n**Особые умения**\n" + getActions("specialAbilities"));
    }
    return reply;

    function getActions(type) {
      var actions = "";
      var monsterActions = norseUtils.forceArray(monster.data[type]);
      monsterActions.forEach((a) => {
        actions += a.name + ". " + a.desc + "\n\n";
      });
      return actions;
    }

    function getSkills() {
      var res = "";
      for (var prop in monster.data.skills) {
        if (res !== "") {
          res += ", ";
        }
        res +=
          i18nLib.localize({
            key: "monster.skills." + prop,
            locale: "ru"
          }) +
          " " +
          (parseInt(monster.data.skills[prop]) > 0
            ? "+" + monster.data.skills[prop]
            : monster.data.skills[prop]);
      }
      if (res !== "") {
        res = "Навыки: " + res + "\n\n";
      }
      return res;
    }

    function getStats() {
      var res = "";
      var stats = [
        monster.data.strength,
        monster.data.dexterity,
        monster.data.constitution,
        monster.data.intelligence,
        monster.data.wisdom,
        monster.data.charisma
      ];
      stats.forEach((s) => {
        var modifier = getModifier(s);
        s = s.toString();
        if ((s + modifier).length === 3) {
          res += "  " + s + " (" + modifier + ")  |";
        } else if ((s + modifier).length === 5) {
          res += "" + s + " (" + modifier + ") |";
        } else {
          res += " " + s + " (" + modifier + ") |";
        }
      });
      return res;
    }

    function getSavingThrows() {
      var res = "";
      res += monster.data.strengthSave
        ? " СИЛ +" + monster.data.strengthSave
        : "";
      res += monster.data.dexteritySave
        ? " ЛОВ +" + monster.data.dexteritySave
        : "";
      res += monster.data.constitutionSave
        ? " ВЫН +" + monster.data.constitutionSave
        : "";
      res += monster.data.intelligenceSave
        ? " ИНТ +" + monster.data.intelligenceSave
        : "";
      res += monster.data.wisdomSave ? " МДР +" + monster.data.wisdomSave : "";
      res += monster.data.charismaSave
        ? " ХАР +" + monster.data.charismaSave
        : "";
      if (res != "") {
        res = "Спасброски:" + res + "\n";
      }
      return res;
    }

    function getModifier(value) {
      var value = Math.floor((parseInt(value) - 10) / 2).toFixed();
      if (value > 0) {
        return "+" + value;
      }
      return value;
    }
  }
};
