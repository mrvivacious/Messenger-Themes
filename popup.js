// popup.js
//
// This file adds functionality to the popup,
//  such as previewing, saving, selecting, and editing custom TheMes
//
// @author Vivek Bhookya (mrvivacious)
// @author Linus Zhu (linuszhu1031)

fetchColors();

function fetchColors() {
  chrome.storage.sync.get('colors', function(colorsList) {
    let theMe = colorsList.colors[0];

    let inputIDs = [
      'ourColor',
      'theirColor',
      'backgroundColor',
      'ourTextColor',
      'theirTextColor'
    ];

    for (let id = 0; inputIDs[id]; id++) {
      document.getElementById(inputIDs[id]).value = theMe[id];
      document.getElementById(inputIDs[id]).style.backgroundColor = theMe[id];
    }

  });
}

let inputs = document.getElementsByTagName('input');
let ourColor = '#' + inputs[0].value;
let theirColor = '#' + inputs[1].value;
let backgroundColor = '#' + inputs[2].value;

// text color todo
let ourTextColor = '#' + inputs[3].value;
let theirTextColor = '#' + inputs[4].value;

let button_save = document.getElementById('save');
button_save.addEventListener('click', store);

// ??? https://www.w3schools.com/jsref/event_onchange.asp
for (let input = 0; input < inputs.length; input++) {
  inputs[input].addEventListener('change', show);
}

function show(event) {
  ourColor = '#' + inputs[0].value;
  theirColor = '#' + inputs[1].value;
  backgroundColor = '#' + inputs[2].value;

  // text colorz todo
  ourTextColor = '#' + inputs[3].value;
  theirTextColor = '#' + inputs[4].value;

  // alert(yourBubbleColor);
  // Get selected colors
  // Send message to themes.js to start reloading the preview colors
  //  instead of the current theme's colors

  // Thank you,
  // https://github.com/mrvivacious/ahegao/commit/0fbb0c7cd4c6d2630e028d9f08daa3ff55a5ecd7
  chrome.tabs.query({active: true, currentWindow: true},
    function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        ourColor,
        theirColor,
        backgroundColor,
        ourTextColor,
        theirTextColor
      });
    }
  )
}

// Store the user selected values into localStorage
function store() {
  // var inputOurColor = '#' + inputs[0];
  // var inputTheirColor = '#' + inputs[1];
  // var inputBackgroundColor = '#' + inputs[2];
  //
  // let inputOurTextColor = '#' + inputs[3];
  // let inputTheirTextColor = '#' + inputs[4];

  // DANGER
  // Setting the KEY to a dynamic value (the colors are generated in the lines
  //  right above) will make looking for them DIFFICULT because you need to search
  //  by the COLOR instead of like "SAVED_OUR_COLOR"
  // Use STRINGS for KEYS, dynamic values for VALUES
  // localStorage.setItem(inpurOurColor, ourColor);
  // localStorage.setItem(inputTheirColor, theirColor);
  // localStorage.setItem(inputBackgroundColor, backgroundColor);
  // localStorage.setItem(inputOurTextColor, inputOur);
  // localStorage.setItem(inputTheirTextColor, backgroundColor);

  let colors = [
    ourColor,
    theirColor,
    backgroundColor,
    ourTextColor,
    theirTextColor
  ];

  // Save to storage.sync
  // Thank you,
  // https://github.com/mrvivacious/ahegao/blob/master/popupFunctions.js#L45
  chrome.storage.sync.set({colors:[colors]}, function() {
    // Any code to run after saving
  });
}