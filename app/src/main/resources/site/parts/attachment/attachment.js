const portal = require("/lib/xp/portal");
const thymeleaf = require("/lib/thymeleaf");
const contentLib = require("/lib/xp/content");

exports.get = function (req) {
  const component = portal.getComponent();
  const content = portal.getContent();
  const allAttachments = contentLib.getAttachments(content._path);
  const attachment = component.config || [];

  return {
    body: thymeleaf.render(resolve("attachment.html"), getModel()),
    contentType: "text/html"
  };

  function getModel() {
    if (attachment.ATTACHMENT && attachment.ATTACHMENT != "") {
      return getAttachemntFromContent();
    } else if (
      attachment.ATTACHMENT_RELATION &&
      attachment.ATTACHMENT_RELATION != ""
    ) {
      return getAttachmentFromRelation();
    }
  }

  function getAttachemntFromContent() {
    let fileType = attachment.ATTACHMENT.split(".");
    fileType = fileType[fileType.length - 1];

    return {
      title: attachment.ATTACHMENT_TITLE
        ? attachment.ATTACHMENT_TITLE
        : attachment.ATTACHMENT,
      attachmentURL: portal.attachmentUrl({
        name: attachment.ATTACHMENT
      }),
      fileType: fileType,
      attachmentSize: allAttachments[attachment.ATTACHMENT].size
        ? (
            Math.round(
              (allAttachments[attachment.ATTACHMENT].size * 1000) / 1024 / 1024
            ) / 1000
          ).toString() + " MB"
        : 0
    };
  }

  function getAttachmentFromRelation() {
    const relatedContent = contentLib.get({
      key: attachment.ATTACHMENT_RELATION
    });
    const relatedAttachment = relatedContent.attachments[relatedContent._name];
    let fileType = relatedAttachment.mimeType.split("/");
    fileType = fileType[fileType.length - 1];
    return {
      title: attachment.ATTACHMENT_TITLE
        ? attachment.ATTACHMENT_TITLE
        : relatedContent.displayName,
      attachmentURL: portal.attachmentUrl({
        name: relatedAttachment.name,
        id: relatedContent._id
      }),
      fileType: fileType,
      attachmentSize: relatedAttachment.size
        ? (
            Math.round((relatedAttachment.size * 1000) / 1024 / 1024) / 1000
          ).toString() + " MB"
        : 0
    };
  }
};
