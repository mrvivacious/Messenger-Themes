// themes.js
//
// This file is responsible for the coloring of Messenger
//
// @Author Vivek Bhookya (mrvivacious)

// TODO
// o Users add custom theme profiles
// o Storage for the theme profiles
// o Support for editing and deleting profiles
// o Add links to GitHub, source code, etc
// o Recolor based on user input events instead of a time interval cuz
//  this will feel more responsive and avoids "non colored"-down time
// o URL itself inside message (no priority)

// Step 1
// grab the classes of Messenger's text and misc elements

// O(n) for the elements, which is fine

// https://stackoverflow.com/questions/48760542/time-complexity-of-includes-function-in-javascript
// O(n) for the .includes(), can we do better?
// + The className.length is somewhat long
// for element in getElementsByClassName(ALL_MESSAGES)
// if (elemnt.className.includes(OUR_MESSAGES)) { color OUR_COLOR }
// else { color THEIR_COLOR }

// for element in getElementsByClassName(ALL_MESSAGES)
// + This way, classList[6] has length of 5 instead of className = 44
// if (element.classList[6] === (OUR_MESSAGES)) { color OUR_COLOR }
// else if (element.classList[6] === (THEIR_MESSAGES)) { color THEIR_COLOR }

// Else, do nothing, undefined behavior

// ?? Attach some kind of event listener that listens for new messages
//  and colors them immediately, avoiding any time delay between
//  our setInterval and the coloring of the message

// Enter key is pressed when sending a message
// onKeyupEvent => if "Enter" was pressed => Recolor messages
//
// Navigating between chats is done via mouseclicks
// onMouseUpEvent => Recolor background and messages

// onConversationChange, recolorBackground
// onMessageSendOrReceive, recolorMessages
// etc.

// window.onload = () => {// Silence fucking errors
  getColorsFromStorage();
  chrome.runtime.onMessage.addListener(acceptExtensionMessage);
  setInterval(recolor, 800);
// }

function getColorsFromStorage() {
  chrome.storage.sync.get('colors', function(colorsList) {
    let theMe = colorsList.colors[0];

    OUR_COLOR = theMe[0];
    THEIR_COLOR = theMe[1];
    BACKGROUND_COLOR = theMe[2];
    OUR_TEXT_COLOR = theMe[3];
    THEIR_TEXT_COLOR = theMe[4];

    META_TEXT_COLOR = colorIsLight(hexToRGB(BACKGROUND_COLOR));

    recolor();
  });
}

function acceptExtensionMessage(request, sender, sendResponse) {
  recolor(
    request.ourColor,
    request.theirColor,
    request.backgroundColor,
    request.ourTextColor,
    request.theirTextColor
  );
}

function recolorSVG() {
  // Make list of SVG
  // Cycle through the list
  // Recolor each

  // We need a better way of searching for the SVG elements ?
  // Nothing wrong with hardcoding though
  // TODO replace hardcoded string ids with constants
  //  declared at the top of this file
  let svgIds = [
    'Fill-11', // Phone
    'original', // Video chat button
    'Fill-17' // I for information button top right
  ];

  // IDs
  for (let i = 0; svgIds[i]; i++) {
    // Get the SVG element corresponding to the current ID value
    let svgId = svgIds[i];
    let svg = document.getElementById(svgId);

    // SVG doesn't exist? Move to next ID
    if (!svg) {
      continue;
    }

    // Get the current HTML of this SVG
    let body = svg.outerHTML;

    body = recoloredSVG(body);

    // Thank you,
    // https://stackoverflow.com/questions/1750815/get-the-string-representation-of-a-dom-node
    svg.outerHTML = body;
  }
}

function recolorBottomSVGGroupChat() {
  // Iterate over the SVGs on the bottom panel
  let iconContainer = document.getElementsByClassName('_5irm _7mkm')[0];
  let bottomSVGS = document.getElementsByClassName('_7oal');

  // The window is wide enough to show all the SVG icons to the right of the
  //  plus icon so the popup doesn't exist
  // Note the different icon case numbering in each conditional block
  if (iconContainer.childElementCount === 5) {
    for (let svg = 2; bottomSVGS[svg]; svg++) {
      // Get the current SVG
      let currentSVG = bottomSVGS[svg];

      if (bottomSVGS.length === 11) {
        // Due to the -1 indexing, the file upload icon will be skipped over rip
        // If we aren't at the file icon, proceed as normal, else jump down
        if (svg === 10) {
          // Color the file icon
          currentSVG = currentSVG.children[0].children[0].children[1];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
        }

        // Update with respect to the different list indexing
        currentSVG = bottomSVGS[svg - 1];
      }

      // Use the appropriate search:
      // Thank you,
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch
      switch (svg) {
        // Ignore, for these SVGs aren't icons / aren't visible
        case 0: case 1: case 8:
          break;

        // rgba handling
        // The plus icon on the bottom left [that toggles the other buttons]
        case 2:
          currentSVG.children[0].children[1].style.fill = OUR_COLOR;
          break;

        // 1 level
        // The like button / emoji reaction icon on the bottom right
        case 12:
          currentSVG = currentSVG.children[0];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
          break;

        // The poll
        case 3:
          currentSVG = currentSVG.children[0].children[0];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
          break;

        // 2 levels
        // GIF selector | Sticker selector icon
        case 9: case 10:
          currentSVG = currentSVG.children[0].children[1];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
          break;

        // 3 levels
        // Camera | Gamepad | Microphone | File upload icon
        case 4: case 5: case 7: case 11:
          currentSVG = currentSVG.children[0].children[0].children[1];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
          break;

        // Special double-child SVG case lmao
        // Currency icon
        case 6:
          currentSVG = currentSVG.children[0].children[0];
          currentSVG.children[1].outerHTML = recoloredSVG(currentSVG.children[1].outerHTML);
          currentSVG.children[2].outerHTML = recoloredSVG(currentSVG.children[2].outerHTML);
          break;

        default:
          console.log('TheMes::DEBUG: How did we get here lol -> ' + currentSVG);
      }
    }
  }
  // Else if, the window must display half of the SVG icons in a popup above the chat input
  else if (iconContainer.childElementCount === 4) {
    for (let svg = 1; bottomSVGS[svg]; svg++) {
      // Get the current SVG
      let currentSVG = bottomSVGS[svg];

      if (bottomSVGS.length === 11) {
        // Due to the -1 indexing, the file upload icon will be skipped over rip
        // If we aren't at the file icon, proceed as normal, else jump down
        if (svg === 10) {
          // Color the file icon
          currentSVG = currentSVG.children[0].children[0].children[1];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
        }

        // Update with respect to the different list indexing
        currentSVG = bottomSVGS[svg - 1];
      }

      // Use the appropriate search:
      // Thank you,
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch
      switch (svg) {
        // Ignore, for these SVGs aren't icons / aren't visible
        case 0: case 1: case 8:
          break;

        // rgba handling
        // The plus icon on the bottom left [that toggles the other buttons]
        case 7:
          currentSVG.children[0].children[1].style.fill = OUR_COLOR;
          break;

        // 1 level
        // The like button / emoji reaction icon on the bottom right
        case 12:
          currentSVG = currentSVG.children[0];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
          break;

        // The poll
        case 6:
          currentSVG = currentSVG.children[0].children[0];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
          break;

        // 2 levels
        // GIF selector | Sticker selector icon
        case 9: case 10:
          currentSVG = currentSVG.children[0].children[1];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
          break;

        // 3 levels
        // Camera | Gamepad | Microphone | File upload icon
        case 5: case 4: case 2: case 11:
          currentSVG = currentSVG.children[0].children[0].children[1];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
          break;

        // Special double-child SVG case lmao
        // Currency icon
        case 3:
          currentSVG = currentSVG.children[0].children[0];
          currentSVG.children[1].outerHTML = recoloredSVG(currentSVG.children[1].outerHTML);
          currentSVG.children[2].outerHTML = recoloredSVG(currentSVG.children[2].outerHTML);
          break;

        default:
          console.log('TheMes::DEBUG: How did we get here lol -> ' + currentSVG);
      }
    }
  }
  // Else, the window must display all of the SVG icons in a popup above the chat input
  else {
    for (let svg = 1; bottomSVGS[svg]; svg++) {
      // Get the current SVG
      let currentSVG = bottomSVGS[svg];

      if (bottomSVGS.length === 11) {
        // Due to the -1 indexing, the file upload icon will be skipped over rip
        // If we aren't at the file icon, proceed as normal, else jump down
        if (svg === 10) {
          // Color the plus icon
          currentSVG.children[0].children[1].style.fill = OUR_COLOR;
        }

        // Update with respect to the different list indexing
        currentSVG = bottomSVGS[svg - 1];
      }

      // Use the appropriate search:
      // Thank you,
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch
      switch (svg) {
        // Ignore, for these SVGs aren't icons / aren't visible
        case 0: case 1: case 4:
          break;

        // rgba handling
        // The plus icon on the bottom left [that toggles the other buttons]
        case 11:
          currentSVG.children[0].children[1].style.fill = OUR_COLOR;
          break;

        // 1 level
        // The like button / emoji reaction icon on the bottom right
        case 12:
          currentSVG = currentSVG.children[0];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
          break;

        // The poll
        case 10:
          currentSVG = currentSVG.children[0].children[0];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
          break;

        // 2 levels
        // GIF selector | Sticker selector icon
        case 5: case 3:
          currentSVG = currentSVG.children[0].children[1];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
          break;

        // 3 levels
        // Camera | Gamepad | Microphone | File upload icon
        case 9: case 8: case 6: case 2:
          currentSVG = currentSVG.children[0].children[0].children[1];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
          break;

        // Special double-child SVG case lmao
        // Currency icon
        case 7:
          currentSVG = currentSVG.children[0].children[0];
          currentSVG.children[1].outerHTML = recoloredSVG(currentSVG.children[1].outerHTML);
          currentSVG.children[2].outerHTML = recoloredSVG(currentSVG.children[2].outerHTML);
          break;

        default:
          console.log('TheMes::DEBUG: How did we get here lol -> ' + currentSVG);
      }
    }
  }
}

function recolorBottomSVG() {
  // TODO IF THE PLUS BUTTON OPENS A PANEL ABOVE IT INSTEAD OF
  //  SHOWING THE ICONS TO THE RIGHT OF IT, THIS CODE BREAKS
  // BOTTOM PANEL SVGs

  // Iterate over the SVGs on the bottom panel
  let iconContainer = document.getElementsByClassName('_5irm _7mkm')[0];
  let bottomSVGS = document.getElementsByClassName('_7oal');

  // Group chats offer a poll SVG
  // If the SVG count on the bottom panel is 13 (default group chat),
  //  OR if a message is being typed therefore the SVG count is 12,
  //  OR (if the SVG count is 11 AND the last child is an emoji instead of the
  //  thumb reaction)
  let reactionIsImgAndNotThumb =
    iconContainer.children[iconContainer.childElementCount - 1].children[0].src
  if (bottomSVGS.length === 13 || bottomSVGS.length === 12 ||
      (bottomSVGS.length === 11 && reactionIsImgAndNotThumb)) {
    console.log('group chat !?');
    recolorBottomSVGGroupChat();
    return;
  }

  // The window is wide enough to show all the SVG icons to the right of the
  //  plus icon so the popup doesn't exist
  // Note the different icon case numbering in each conditional block
  if (iconContainer.childElementCount === 5) {
    for (let svg = 1; bottomSVGS[svg]; svg++) {
      // Get the current SVG
      let currentSVG = bottomSVGS[svg];

      // If the user has a dynamic theme already selected,
      //  the SVG list has a different length and the items
      //  are numbered one less than those from the list of a static theme
      if (bottomSVGS.length === 9) {
        // Due to the -1 indexing, the file upload icon will be skipped over rip
        // If we aren't at the file icon, proceed as normal, else jump down
        if (svg === 8) {
          // Color the file icon
          currentSVG = currentSVG.children[0].children[0].children[1];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
        }

        // Update with respect to the different list indexing
        currentSVG = bottomSVGS[svg - 1];
      }

      // Use the appropriate search:
      // Thank you,
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch
      switch (svg) {
        // Ignore, for these SVGs aren't icons / aren't visible
        case 0: case 6:
          break;

        // rgba handling
        // The plus icon on the bottom left [that toggles the other buttons]
        case 1:
          currentSVG.children[0].children[1].style.fill = OUR_COLOR;
          break;

        // 1 level
        // The like button / emoji reaction icon on the bottom right
        case 10:
          currentSVG = currentSVG.children[0];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
          break;

        // 2 levels
        // GIF selector | Sticker selector icon
        case 7: case 8:
          currentSVG = currentSVG.children[0].children[1];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
          break;

        // 3 levels
        // Camera | Gamepad | Microphone | File upload icon
        case 2: case 3: case 5: case 9:
          currentSVG = currentSVG.children[0].children[0].children[1];
          if (currentSVG) {
            currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
          }
          break;

        // Special double-child SVG case lmao
        // Currency icon
        case 4:
          currentSVG = currentSVG.children[0].children[0];
          currentSVG.children[1].outerHTML = recoloredSVG(currentSVG.children[1].outerHTML);
          currentSVG.children[2].outerHTML = recoloredSVG(currentSVG.children[2].outerHTML);
          break;

        default:
          console.log('TheMes::DEBUG: How did we get here lol -> ' + currentSVG);
      }
    }
  }
  // Else if, the window must display half of the SVG icons in a popup above the chat input
  else if (iconContainer.childElementCount === 4) {
    for (let svg = 1; bottomSVGS[svg]; svg++) {
      // Get the current SVG
      let currentSVG = bottomSVGS[svg];

      // If the user has a dynamic theme already selected,
      //  the SVG list has a different length and the items
      //  are numbered one less than those from the list of a static theme
      if (bottomSVGS.length === 9) {
        // Due to the -1 indexing, the file upload icon will be skipped over rip
        // If we aren't at the file icon, proceed as normal, else jump down
        if (svg === 8) {
          // Color the file icon
          currentSVG = currentSVG.children[0].children[0].children[1];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
        }

        // Update with respect to the different list indexing
        currentSVG = bottomSVGS[svg - 1];
      }

      // Use the appropriate search:
      // Thank you,
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch
      switch (svg) {
        // Ignore, for these SVGs aren't icons / aren't visible
        case 0: case 6:
          break;

        // rgba handling
        // The plus icon on the bottom left [that toggles the other buttons]
        case 5:
          if (currentSVG.children[0].children[1]) {
            currentSVG.children[0].children[1].style.fill = OUR_COLOR;
          }
          break;

        // 1 level
        // The like button / emoji reaction icon on the bottom right
        case 10:
          currentSVG = currentSVG.children[0];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
          break;

        // 2 levels
        // GIF selector | Sticker selector icon
        case 7: case 8:
          currentSVG = currentSVG.children[0].children[1];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
          break;

        // 3 levels
        // Camera | Gamepad | Microphone | File upload icon
        case 4: case 3: case 1: case 9:
          currentSVG = currentSVG.children[0].children[0].children[1];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
          break;

        // Special double-child SVG case lmao
        // Currency icon
        case 2:
          currentSVG = currentSVG.children[0].children[0];
          currentSVG.children[1].outerHTML = recoloredSVG(currentSVG.children[1].outerHTML);
          currentSVG.children[2].outerHTML = recoloredSVG(currentSVG.children[2].outerHTML);
          break;

        default:
          console.log('TheMes::DEBUG: How did we get here lol -> ' + currentSVG);
      }
    }
  }
  // Else, the window must display all of the SVG icons in a popup above the chat input
  else {
    for (let svg = 1; bottomSVGS[svg]; svg++) {
      // Get the current SVG
      let currentSVG = bottomSVGS[svg];

      // If the user has a dynamic theme already selected,
      //  the SVG list has a different length and the items
      //  are numbered one less than those from the list of a static theme
      if (bottomSVGS.length === 9) {
        // Due to the -1 indexing, the plus icon will be skipped over rip
        // If we aren't at the plus icon, proceed as normal, else jump down
        if (svg === 8) {
          // Recolor plus icon
          currentSVG.children[0].children[1].style.fill = OUR_COLOR;
        }

        // Update with respect to the different list indexing
        currentSVG = bottomSVGS[svg - 1];
      }

      // Use the appropriate search:
      // Thank you,
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch
      switch (svg) {
        // Ignore, for these SVGs aren't icons / aren't visible
        case 0: case 3:
          break;

        // rgba handling
        // The plus icon on the bottom left [that toggles the other buttons]
        case 9:
          currentSVG.children[0].children[1].style.fill = OUR_COLOR;
          break;

        // 1 level
        // The like button / emoji reaction icon on the bottom right
        case 10:
          currentSVG = currentSVG.children[0];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
          break;

        // 2 levels
        // GIF selector | Sticker selector icon
        case 4: case 2:
          currentSVG = currentSVG.children[0].children[1];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
          break;

        // 3 levels
        // Camera | Gamepad | Microphone | File upload icon
        case 8: case 7: case 5: case 1:
          currentSVG = currentSVG.children[0].children[0].children[1];
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
          break;

        // Special double-child SVG case lmao
        // Currency icon
        case 6:
          currentSVG = currentSVG.children[0].children[0];
          currentSVG.children[1].outerHTML = recoloredSVG(currentSVG.children[1].outerHTML);
          currentSVG.children[2].outerHTML = recoloredSVG(currentSVG.children[2].outerHTML);
          break;

        default:
          console.log('TheMes::DEBUG: How did we get here lol -> ' + currentSVG);
      }
    }
  }
}

function recoloredSVG(originalHTML) {
  // Dynamic find and replace
  // Find the original <...Fill=...> value and replace the
  //  hex with our newColor
  let startOfFill = originalHTML.lastIndexOf('#');
  if (startOfFill < 0) {
    console.log('hidden')
    return;
  }

  let originalFill = '';

  // Get old fill
  for (let i = startOfFill; i < startOfFill + 7; i++) {
    originalFill += originalHTML[i];
  }

  // console.log(originalFill)

  return originalHTML.replace(originalFill, OUR_COLOR);
}

function recolorMeta() {
  // TODO Add if conditionals to ensure existence of bullshit
  // Recolor chat title
  let chatTitle = '_17w2 _6ybr';
  if (document.getElementsByClassName(chatTitle)[0]) {
    document.getElementsByClassName(chatTitle)[0].children[0].style.color = META_TEXT_COLOR;
  }

  // Time ago
  let timeSinceLastActive = '_2v6o';
  if (document.getElementsByClassName(timeSinceLastActive)[0]) {
    document.getElementsByClassName(timeSinceLastActive)[0].style.color = META_TEXT_COLOR;
  }
  // Type a message input text
  let inputBoxText = '_1mf _1mj';
  // Group chat
  if (document.getElementsByClassName(inputBoxText)[1]) {
    document.getElementsByClassName(inputBoxText)[1].children[0].children[0].style.color = META_TEXT_COLOR;
  }
  // Direct msg
  else {
    if (document.getElementsByClassName(inputBoxText)[0]) {
      document.getElementsByClassName(inputBoxText)[0].children[0].children[0].style.color = META_TEXT_COLOR;
    }
  }

  // Person replied to
  let repliedTo = '_3058 _4k7a _3-9b direction_ltr';
  let repliedToPrompts = document.getElementsByClassName(repliedTo);

  for (let prompt = 0; repliedToPrompts[prompt]; prompt++) {
    repliedToPrompts[prompt].style.color = META_TEXT_COLOR;
  }

  // Left side names
  let namesClassName = '_1ht6 _7st9';
  let chatLogNames = document.getElementsByClassName(namesClassName);

  for (let i = 0; chatLogNames[i]; i++) {
    let name = chatLogNames[i];

    // If a nickname / title has been assigned, there will be a child element
    // Essentially, grab the innermost child and recolor that text
    if (name.children[0]) {
      name.children[0].style.color = META_TEXT_COLOR;
    }
    else {
      name.style.color = META_TEXT_COLOR;
    }
  }

  // Left side timestamps
  let chatMeta = document.getElementsByClassName('_1qt5 _6zkd _5l-3');

  for (let i = 0; chatMeta[i]; i++) {
    // Preview of most recent message
    chatMeta[i].children[0].style.color = META_TEXT_COLOR;

    // Timestamp
    chatMeta[i].children[2].style.color = META_TEXT_COLOR;
  }


}

// Thank you,
// jscolor.js line 1271
function colorIsLight(rgb) {
  let r = rgb[0];
  let g = rgb[1];
  let b = rgb[2];
  let sum = (.213 * r) + (.715 * g) + (.072 * b);

  // True, color is light, use dark text
  if (sum > (255 / 2)) {
    return '#000000';
  }

  // Color is dark, use light text
  return '#FFFFFF';
}

function hexToRGB(hex) {
  // Convert to RGB
  // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}

function recolor(ourColor, theirColor, backgroundColor, ourTextColor, theirTextColor) {
  if (ourColor && theirColor && backgroundColor && ourTextColor && theirTextColor) {
    OUR_COLOR = ourColor;
    THEIR_COLOR = theirColor;
    BACKGROUND_COLOR = backgroundColor;
    OUR_TEXT_COLOR = ourTextColor;
    THEIR_TEXT_COLOR = theirTextColor;

    META_TEXT_COLOR = colorIsLight(hexToRGB(backgroundColor));
    // alert(`${ourColor}, ${theirColor}, ${backgroundColor}`);
  }

  recolorBackground();

  recolorMessages();

  recolorMisc();

  recolorMeta();

  recolorSVG();

  recolorBottomSVG();
}
