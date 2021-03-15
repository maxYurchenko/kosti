var contentLib = require("/lib/xp/content");
var portal = require("/lib/xp/portal");
var i18n = require("/lib/xp/i18n");
var moment = require("moment");

// Returns the full month name from a Date object.

exports.getImage = getImage;
exports.getPlaceholder = getPlaceholder;
exports.getMonthName = getMonthName;
exports.getFormattedDate = getFormattedDate;
exports.getDayName = getDayName;
exports.getTime = getTime;
exports.validateEmail = validateEmail;
exports.uniqueArray = uniqueArray;

function validateEmail(email) {
  if (/(.+)@(.+){1,}\.(.+){2,}/.test(email)) {
    return true;
  }
  return false;
}

function uniqueArray(array) {
  var unique = array.filter(function (elem, index, self) {
    return index === self.indexOf(elem);
  });
  return unique;
}

function getMonthName(date) {
  var month = date.getMonth();
  var monthName;

  switch (month) {
    case 0:
      monthName = i18n.localize({
        key: "months.jan.date",
        locale: "ru"
      });
      break;
    case 1:
      monthName = i18n.localize({
        key: "months.feb.date",
        locale: "ru"
      });
      break;
    case 2:
      monthName = i18n.localize({
        key: "months.mar.date",
        locale: "ru"
      });
      break;
    case 3:
      monthName = i18n.localize({
        key: "months.apr.date",
        locale: "ru"
      });
      break;
    case 4:
      monthName = i18n.localize({
        key: "months.may.date",
        locale: "ru"
      });
      break;
    case 5:
      monthName = i18n.localize({
        key: "months.jun.date",
        locale: "ru"
      });
      break;
    case 6:
      monthName = i18n.localize({
        key: "months.jul.date",
        locale: "ru"
      });
      break;
    case 7:
      monthName = i18n.localize({
        key: "months.aug.date",
        locale: "ru"
      });
      break;
    case 8:
      monthName = i18n.localize({
        key: "months.sep.date",
        locale: "ru"
      });
      break;
    case 9:
      monthName = i18n.localize({
        key: "months.oct.date",
        locale: "ru"
      });
      break;
    case 10:
      monthName = i18n.localize({
        key: "months.nov.date",
        locale: "ru"
      });
      break;
    case 11:
      monthName = i18n.localize({
        key: "months.dec.date",
        locale: "ru"
      });
      break;
  }

  return monthName;
}

function getDayName(date) {
  var day = date.getDay();
  return i18n.localize({
    key: "days.name." + day
  });
}

function getTime(date) {
  return moment(date).utcOffset("+0300").format("HH:mm");
}

function getFormattedDate(date) {
  if (typeof date == "string") {
    date = new Date(date);
  }
  var dateString = "";
  dateString += " " + date.getDate();
  dateString += ". " + exports.getMonthName(date);
  dateString += " " + (date.getFullYear() - 2000);
  return dateString;
}

exports.getSearchPage = function () {
  var site = portal.getSite();
  var siteConfig = portal.getSiteConfig();
  var searchPageKey = siteConfig.searchPage;
  if (searchPageKey) {
    var searchContent = contentLib.get({ key: searchPageKey });
    if (searchContent) {
      return searchContent._path;
    }
  }
  return site._path + "/search";
};

exports.log = function (data, location) {
  if (location) {
    log.info(
      "Utilities log at %s: %s",
      location,
      JSON.stringify(data, null, 4)
    );
  } else {
    log.info("Utilities log %s", JSON.stringify(data, null, 4));
  }
};

exports.isInt = function (x) {
  return Math.round(x) === x;
};

exports.getContent = function (key) {
  var content;
  if (typeof key == "undefined") {
    content = portal.getContent();
  } else {
    content = contentLib.get({
      key: key
    });
  }
  return content;
};

exports.forceArray = function (data) {
  if (!Array.isArray(data)) {
    data = [data];
  }
  return data;
};

/**
 * Delete all properties with empty string from an object
 * @param {Object} The object to be processed.
 * @param {Boolean} Flag true to delete properties in nested objects.
 * @return {Boolean} Returns true if the value is an integer or can be cast to an integer.
 */
exports.deleteEmptyProperties = function (obj, recursive) {
  for (var i in obj) {
    if (obj[i] === "") {
      delete obj[i];
    } else if (recursive && typeof obj[i] === "object") {
      exports.data.deleteEmptyProperties(obj[i], recursive);
    }
  }
};

exports.getTranslation = function () {
  var params = parseParams(arguments);

  var result = params["defaultText"];

  if (params.key && params.key != "") {
    var query = 'data.translation.key = "' + params.key + '"';
    var content = portal.getContent();
    var contentLanguage = content.language;

    if (contentLanguage) {
      query += ' AND language = "' + contentLanguage + '"';
    }
    if (params.context) {
      query += ' AND data.context = "' + params.context + '"';
    }

    var translations = contentLib.query({
      start: 0,
      count: 1,
      query: query,
      contentTypes: [app.name + ":translation"]
    });

    if (translations && translations.count == 1) {
      // get first hit
      var translationLines = translations.hits[0].data.translation;
      translationLines = exports.forceArray(translationLines);
      if (translationLines.length && translationLines.length > 0) {
        translationLines.forEach(function (translation) {
          if (translation.key == params.key) {
            result = translation.text;
            if (params.arguments.length > 0) {
              result = replaceValues(result, params.arguments);
            }
            return result;
          }
        });
      }
    }
  }

  return result;

  function parseParams(params) {
    var parameters = {
      arguments: [],
      defaultText: "",
      key: "",
      context: false
    };
    for (var i = 0; i < params.length; i++) {
      switch (i) {
        case 0:
          parameters["key"] = params[i];
          break;
        case 1:
          parameters["context"] = params[i];
          break;
        case 2:
          parameters["defaultText"] = params[i];
          break;
        default:
          parameters["arguments"].push(params[i]);
          break;
      }
    }

    return parameters;
  }

  function replaceValues(str, args) {
    for (var i = 0; i < args.length; i++) {
      var reg = new RegExp("\\{" + i + "\\}", "gm");
      str = str.replace(reg, args[i]);
    }
    return str;
  }
};

function getImage(id, size, placeholderType, urlType, quality) {
  var result = false;
  if (!size || size == "") {
    size = "max(1366)";
  }
  if (typeof urlType == "undefined") {
    urlType = "server";
  }
  if (typeof quality == "undefined") {
    quality = "75";
  }
  if (id && id !== "") {
    var image = contentLib.get({ key: id });
    if (image) {
      if (image.data.artist) {
        image.data.artist = this.forceArray(image.data.artist);
      } else {
        image.data.artist = false;
      }
      if (
        image.x &&
        image.x.media &&
        image.x.media.imageInfo &&
        image.x.media.imageInfo.contentType === "image/gif"
      ) {
        var url = portal.attachmentUrl({
          path: image._path,
          name: image._name,
          type: urlType
        });
        var urlAbsolute = portal.attachmentUrl({
          path: image._path,
          name: image._name,
          type: "absolute"
        });
      } else {
        var url = portal.imageUrl({
          id: id,
          scale: size,
          type: urlType,
          quality: quality
        });
        var urlAbsolute = portal.imageUrl({
          id: id,
          scale: size,
          type: "absolute"
        });
      }
      result = {
        url: url,
        urlAbsolute: urlAbsolute,
        alt: image.data.altText ? image.data.altText : "",
        caption: image.data.caption ? image.data.caption : "",
        artist: image.data.artist,
        _id: image._id
      };
    } else {
      result = this.getPlaceholder(placeholderType, size);
    }
  } else {
    result = this.getPlaceholder(placeholderType, size);
  }
  return result;
}

function getPlaceholder(placeholderType, size) {
  var result = {};
  switch (placeholderType) {
    case 1: {
      result = {
        url: portal.assetUrl({
          path: "images/default_avatar.png"
        }),
        alt: "City image",
        caption: "",
        placeholder: true
      };
      break;
    }
    case 2: {
      result = {
        url: portal.assetUrl({
          path: "images/townPlaceholder.jpg"
        }),
        alt: "City icon",
        caption: "",
        placeholder: true
      };
      break;
    }
    default: {
      result = {
        url: portal.assetUrl({
          path: "images/townPlaceholder.jpg"
        }),
        alt: "placeholder",
        caption: "",
        placeholder: true
      };
      break;
    }
  }
  return result;
}
