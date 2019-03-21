// themes.js
// this fileis responsible for the coloring

// step 1
// grab the classes of Messenger's chat bubbles, text, and background
const ALL_MESSAGES = '_s1-';
const OUR_MESSAGES = '_43by';
const THEIR_MESSAGES = '_3oh-';

const OUR_COLOR = 'fuchsia';
const THEIR_COLOR = 'pink';
const BACKGROUND_COLOR = '#624b5c';

// O(n) for the elements, which is fine
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

window.onload = () => {
  setInterval(recolor, 2000);
}

function recolor() {
  // Recolor the background


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
    // Else, undefined behavior
  }



  //
  // let body = document.getElementsByClassName('_673w')[0];
  // let bubbles = document.getElementsByClassName('_3058 _ui9 _hh7 _6ybn _s1- _52mr _43by _3oh-');
  //
  // // Left panel (overview of messages)
  // body.style.backgroundColor = "#624b5c";
  //
  // // Probably the top bar
  // document.getElementsByClassName('_1enh')[0].style.backgroundColor = "#624b5c";
  //
  // // Probably the background of the chat panel
  // document.getElementsByClassName('_20bp')[0].style.backgroundColor = "#624b5c";
  //
  // // The line between the messages overview and the chat panel
  // document.getElementsByClassName('_4sp8')[0].style.backgroundColor = "#624b5c";

}
