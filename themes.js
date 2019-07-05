// themes.js
// this fileis responsible for the coloring

// TODO
// find the small details!!!
// Messages with reactions somehow become immune to recoloring
// URL message background needs to be recolored
// The reactions on messages needs to be recolored
// We can't recolor the SVG elements via document.getElement... code
// + What do we do for the SVG? They default to the selected Messenger theme and
//    do not adopt the custom color scheme from theMes

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
const TYPING_INDICATOR = 'clearfix _17pz';
const MESSAGE_STATUS_INDICATOR = '_2her';

// COLORS
const OUR_COLOR = 'fuchsia';
const THEIR_COLOR = 'pink';
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

window.onload = () => {
  setInterval(recolor, 2000);
}

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

  // TODO replace hardcoded string ids with constants
  //  declared at the top of this file
  let svgIds = [
    'Fill-11', // Phone
    'original', // Video chat button
    'Fill-17' // I for information
  ];

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
    body = recoloredSVG(body, 'aabbcc');

    // Thank you,
    // https://stackoverflow.com/questions/1750815/get-the-string-representation-of-a-dom-node
    svg.outerHTML = body;
  }
}

function recoloredSVG(originalHTML, newColor) {
  // Dynamic find and replace
  // Find the original <...Fill=...> value and replace the
  //  hex with our newColor
  // + 1 to move one character past the #
  let startOfFill = originalHTML.lastIndexOf('#') + 1;
  let originalFill = '';

  // Get old fill
  for (let i = startOfFill; i < startOfFill + 6; i++) {
    originalFill += originalHTML[i];
  }

  console.log(originalFill)

  return originalHTML.replace(originalFill, newColor);
}

function recolorMisc() {
  let typingIndicator = document.getElementsByClassName(TYPING_INDICATOR)[0];
  let messageStatusIndicator = document.getElementsByClassName(MESSAGE_STATUS_INDICATOR);

  if (typingIndicator) {
    typingIndicator.style.backgroundColor = BACKGROUND_COLOR;
  }

  if (messageStatusIndicator) {
    for (let msg = 0; messageStatusIndicator[msg]; msg++) {
      messageStatusIndicator[msg].style.color = OUR_COLOR;
    }
  }

}

function recolor() {
  recolorBackground();

  recolorMessages();

  recolorSVG();

  // Recolor misc
  recolorMisc();
}
