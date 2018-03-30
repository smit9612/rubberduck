// Github blob (file view) view handler
// Exports a hover listener method with a callback param
// Callback gets object: filePath, fileSha, lineNumber, charNumber, name
import BaseGithubListener from "./base";

class BlobPageListener extends BaseGithubListener {
  constructor(fileSha) {
    super();
    this.fileSha = fileSha;
  }

  getFontAspectRatio = () => {
    return 0.6; // TODO(arjun): Calculate this methodically
  };

  getFileSha = element => {
    return this.fileSha;
  };

  getCharNumber = (element, mouseX) => {
    const node = element.parentNode;
    let actualElement = node;
    if (node.id.indexOf("LC") < 0) {
      // node or parentNode is the relevant `td` element we need
      if (node.parentNode.id.indexOf("LC") >= 0) {
        actualElement = node.parentNode;
      } else {
        return -1;
      }
    }
    const bbox = actualElement.getBoundingClientRect();
    const charInPixels = mouseX - bbox.x - this.getPaddingLeft(actualElement);
    const fontSize = this.getFontSize(actualElement);
    const estimatedChars = this.getCharsFromPixels(charInPixels, fontSize);
    const tabSize = this.getTabSize(actualElement);
    const numTabs = this.getNumTabs(actualElement);
    return Math.round(estimatedChars - numTabs * (tabSize - 1));
  };

  getLineNumber = element => {
    const node = element.parentNode;
    const nodeId = node.id;
    const parentNodeId = node.parentNode.id;
    // One of these two needs to look like LC12
    if (nodeId.indexOf("LC") >= 0) {
      return +nodeId.replace("LC", "") - 1; // for 0-indexed
    } else if (parentNodeId.indexOf("LC") >= 0) {
      return +parentNodeId.replace("LC", "") - 1; // for 0-indexed
    } else {
      return -1;
    }
  };

  getFileUri = element => {
    const pathElement = document.getElementById("blob-path");

    if (pathElement !== null) {
      const fullPath = pathElement.textContent.trim();
      const firstSlashIndex = fullPath.indexOf("/");
      return fullPath.slice(firstSlashIndex + 1);
    }

    return "";
  };
}

export const listener = (event, callback, fileSha) => {
  const pageListener = new BlobPageListener(fileSha);
  const result = pageListener.readXY(event.x, event.y);
  callback(result);
};

export const readXY = (x, y, fileSha) => {
  const pageListener = new BlobPageListener(fileSha);
  return pageListener.readXY(x, y);
};
