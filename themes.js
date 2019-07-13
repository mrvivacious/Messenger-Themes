// themes.js
// this fileis responsible for the coloring

// TODO
// find the small details!!!
// Messages with reactions somehow become immune to recoloring
// URL message background needs to be recolored
// The reactions on messages needs to be recolored

// step 1
// grab the classes of Messenger's text and misc elements
// CLASSES
// Messages
const ALL_MESSAGES = '_s1-';
const OUR_MESSAGES = '_43by';
const THEIR_MESSAGES = '_3oh-';

// Background
// TOP: Top of the chat window, where the recipient's profile picture and
//  name sit
// LEFT: "Chats" panel, where all the conversations sit
// CHAT: Where the messages in an opened conversation sit
// DIVIDER: The vertical line between the list of all conversations and
//  the currently opened conversation
const BACKGROUND_PANEL_TOP = '_673w';
const BACKGROUND_PANEL_LEFT = '_1enh';
const BACKGROUND_PANEL_CHAT = '_5irm';
const BACKGROUND_PANEL_DIVIDER = '_4sp8';

// Misc
// POPUP_MEDIA_PANEL: When the Messenger window is
//  minimized to a particular width, the Upload image / Stickers / GIF / etc
//  menu disappears -- we keep this to recolor the panel when it is toggled open
const TYPING_INDICATOR = 'clearfix _17pz';
const MESSAGE_STATUS_INDICATOR = '_2her';
const POPUP_MEDIA_PANEL = '_7mkk _7t1o _7t0e';

// COLORS
const OUR_COLOR = '#FF94F0';
const THEIR_COLOR = '#FFCEE3';
const BACKGROUND_COLOR = '#624b5c';

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

// window.onload = () => {
  setInterval(recolor, 2000);
// }

function recolorBackground() {
  // Recolor the background
  let backgroundTop = document.getElementsByClassName(BACKGROUND_PANEL_TOP)[0];
  let backgroundLeft = document.getElementsByClassName(BACKGROUND_PANEL_LEFT)[0];
  let backgroundChat = document.getElementsByClassName(BACKGROUND_PANEL_CHAT)[0];
  let backgroundDivider = document.getElementsByClassName(BACKGROUND_PANEL_DIVIDER)[0];

  // Silence console warnings by only recoloring if the item
  //  was successfully found
  if (backgroundTop) {
    backgroundTop.style.backgroundColor = BACKGROUND_COLOR;
  }

  if (backgroundLeft) {
    backgroundLeft.style.backgroundColor = BACKGROUND_COLOR;
  }

  if (backgroundChat) {
    backgroundChat.style.backgroundColor = BACKGROUND_COLOR;
  }

  if (backgroundDivider) {
    backgroundDivider.style.backgroundColor = BACKGROUND_COLOR;
  }
}

function recolorMessages() {
  // Recolor the messages
  let allMessages = document.getElementsByClassName(ALL_MESSAGES);

  for (let i = 0; allMessages[i]; i++) {
    let currentMessage = allMessages[i];
    let currentClass = currentMessage.classList[6];

    if (currentClass === OUR_MESSAGES) {
      // Dynamic themes have a background-image attribute,
      //  OUR_COLOR won't show until this attribute is removed
      currentMessage.style.backgroundImage = '';
      currentMessage.style.backgroundColor = OUR_COLOR;
    }
    else if (currentClass === THEIR_MESSAGES) {
      currentMessage.style.backgroundColor = THEIR_COLOR;
    }
    // Else, we found something that isn't a chat bubble, so
    //  let's not worry about it
  }
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
  // TODO add if (exists) to avoid errors
  for (let i = 0; svgIds[i]; i++) {
    // Get the SVG element corresponding to the current ID value
    let svgId = svgIds[i];
    let svg = document.getElementById(svgId);

    // Get the current HTML of this SVG
    let body = svg.outerHTML;
    // console.log(body)

    // TODO function to extract the current fill value out of this svg
    // body = body.replace("#0099ff", "#aabbcc");
    body = recoloredSVG(body);

    // Thank you,
    // https://stackoverflow.com/questions/1750815/get-the-string-representation-of-a-dom-node
    svg.outerHTML = body;
  }
}

function recolorBottomSVG() {
  // TODO IF THE PLUS BUTTON OPENS A PANEL ABOVE IT INSTEAD OF
  //  SHOWING THE ICONS TO THE RIGHT OF IT, THIS CODE BREAKS
  // BOTTOM PANEL SVGs

  // Iterate over the SVGs on the bottom panel
  let iconContainer = document.getElementsByClassName('_5irm _7mkm')[0];

  // The window is wide enough to show all the SVG icons to the right of the
  //  plus icon so the popup doesn't exist
  // Note the different icon case numbering in each conditional block
  if (iconContainer.childElementCount === 5) {
    let bottomSVGS = document.getElementsByClassName('_7oal');

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
          currentSVG.outerHTML = recoloredSVG(currentSVG.outerHTML);
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
    let bottomSVGS = document.getElementsByClassName('_7oal');

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
    let bottomSVGS = document.getElementsByClassName('_7oal');

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

function recolorMisc() {
  let typingIndicator = document.getElementsByClassName(TYPING_INDICATOR)[0];

  if (typingIndicator) {
    typingIndicator.style.backgroundColor = BACKGROUND_COLOR;
  }

  let messageStatusIndicator = document.getElementsByClassName(MESSAGE_STATUS_INDICATOR);
  if (messageStatusIndicator) {
    for (let msg = 0; messageStatusIndicator[msg]; msg++) {
      messageStatusIndicator[msg].style.color = OUR_COLOR;
    }
  }

  let popupMediaPanel = document.getElementsByClassName(POPUP_MEDIA_PANEL)[0];
  if (popupMediaPanel) {
    popupMediaPanel.style.backgroundColor = BACKGROUND_COLOR;
  }

  // ClassNames hardcode TODO
  let svgClassNames = [
    '_30yy _38lh _7kpi', // Bottom right, paper airplane when typing
    '_30yy _7odb' // Smile face inside message input
  ]

  let paperAirplane = document.getElementsByClassName(svgClassNames[0])[0];
  if (paperAirplane) {
    paperAirplane = paperAirplane.children[0];
    paperAirplane.outerHTML = recoloredSVG(paperAirplane.outerHTML);
  }

  let smileyFace = document.getElementsByClassName(svgClassNames[1])[0];
  if (smileyFace) {
    smileyFace = smileyFace.children[0];
    smileyFace.outerHTML = recoloredSVG(smileyFace.outerHTML);
  }
}

function recolor() {
  recolorBackground();

  recolorMessages();

  recolorSVG();
  recolorBottomSVG();

  recolorMisc();
}
