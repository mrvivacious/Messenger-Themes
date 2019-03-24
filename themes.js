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
const BACKGROUND_PANEL_TOP = '_673w';
const BACKGROUND_PANEL_LEFT = '_1enh';
const BACKGROUND_PANEL_CHAT = '_20bp';
const BACKGROUND_PANEL_DIVIDER = '_4sp8';

// Misc
const TYPING_INDICATOR = 'clearfix _17pz';

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

function recolorMisc() {
  let typingIndicator = document.getElementsByClassName(TYPING_INDICATOR)[0];

  if (typingIndicator) {
    typingIndicator.style.backgroundColor = BACKGROUND_COLOR;
  }
}

function recolor() {
  recolorBackground();

  recolorMessages();

  // Recolor misc
  recolorMisc();
}
