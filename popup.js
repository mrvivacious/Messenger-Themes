// popup.js
//
// This file adds functionality to the popup,
//  such as previewing, saving, selecting, and editing custom TheMes
//
// @author Vivek Bhookya
// @author Linus Zhu

let inputs = document.getElementsByTagName('input');
let ourColor = '#' + inputs[0].value;
let theirColor = '#' + inputs[1].value;
let backgroundColor = '#' + inputs[2].value;

// ??? https://www.w3schools.com/jsref/event_onchange.asp
for (let input = 0; input < inputs.length; input++) {
  inputs[input].addEventListener('change', show);
}

function show(event) {
  ourColor = '#' + inputs[0].value;
  theirColor = '#' + inputs[1].value;
  backgroundColor = '#' + inputs[2].value;

  // alert(yourBubbleColor);
  // Get selected colors
  // Send message to themes.js to start reloading the preview colors
  //  instead of the current theme's colors

  // Thank you,
  // https://github.com/mrvivacious/ahegao/commit/0fbb0c7cd4c6d2630e028d9f08daa3ff55a5ecd7
  chrome.tabs.query({active: true, currentWindow: true},
    function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {ourColor, theirColor, backgroundColor});
    }
  )
}

// Store the user selected values into localStorage
function store() {
  var inputOurColor = '#' + inputs[0];
  var inputTheirColor = '#' + inputs[1];
  var inputBackgroundColor = '#' + inputs[2];

  localStorage.setItem(inpurOurColor, ourColor);
  localStorage.setItem(inputTheirColor, theirColor);
  localStorage.setItem(inputBackgroundColor, backgroundColor);

}
