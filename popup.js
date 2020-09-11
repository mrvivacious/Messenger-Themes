// popup.js
//
// This file adds functionality to the popup,
//  such as previewing, saving, selecting, and editing custom TheMes
//
// @author Vivek Bhookya (mrvivacious)
// @author Linus Zhu (linuszhu1031)

// What exactly needs to be done?
// What is the format of our data? What format do we want it in?
// Have we implemented create-read-delete for our data?
// "Success for me looks like Freedom"

const inputIDs = [
  'ourColor',
  'theirColor',
  'backgroundColor',
  'ourTextColor',
  'theirTextColor'
];

fetchColorsAndFillPopup();

// Function fetchColorsAndFillPopup
function fetchColorsAndFillPopup(themeFromMenu) {
  if (!themeFromMenu) {
    chrome.storage.sync.get('colors', function(colorsList) {
      let theMe = colorsList.colors[0];

      for (let id = 0; inputIDs[id]; id++) {
        // Remove the hashtag because we add the hashtag to the color hexcode
        //  later in the code and using "##..." hexcode is a big bug
        document.getElementById(inputIDs[id]).value = theMe[id].replace('#', '');
        document.getElementById(inputIDs[id]).style.backgroundColor = theMe[id];
      }
    });
  }
  else {
    for (let color = 0; themeFromMenu[color]; color++) {
      document.getElementById(inputIDs[color]).value = themeFromMenu[color].replace('#', '');
      document.getElementById(inputIDs[color]).style.backgroundColor = themeFromMenu[color];
    }
  }
}

// Save our stored colors for later use
let ourColor = '#' + document.getElementById(inputIDs[0]).value;
let theirColor = '#' + document.getElementById(inputIDs[1]).value;
let backgroundColor = '#' + document.getElementById(inputIDs[2]).value;
let ourTextColor = '#' + document.getElementById(inputIDs[3]).value;
let theirTextColor = '#' + document.getElementById(inputIDs[4]).value;

// Give save-to-storage functionality to the save button
document.getElementById('save').addEventListener('click', saveClicked);

// Add event listeners to all the inputs in the popup in order to enable
//  "live coloring preview"
let inputs = document.getElementsByTagName('input');

// ??? https://www.w3schools.com/jsref/event_onchange.asp
for (let input = 0; input < inputs.length; input++) {
  inputs[input].addEventListener('change', previewCurrentColors);
}

let lis = document.getElementsByTagName('li');
for (let li = 0; li < lis.length; li++) {
  lis[li].addEventListener('click', clickHandler);
}

function clickHandler(e) {
  let source = e.srcElement;
  let swatches;

  // Find the list of swatches
  if (source.toString().includes('HTMLDivElement')) {
    swatches = source.parentElement.children;
  }
  else if (source.toString().includes('HTMLLIElement')) {
    swatches = source.children[2].children;
  }
  else if (source.toString().includes('HTMLSpanElement')) {
    // Delete was clicked
    // https://www.w3schools.com/jsref/met_win_confirm.asp
    if (confirm('Delete this theme?')) {
      deleteTheme(source);
    }
  }
  else {
    alert('THEMES DEBUG:: clickHandler, source = ' + source.toString());
    return;
  }

  // Get colors
  ourColor = rgbToHex(swatches[0].style.backgroundColor);
  theirColor = rgbToHex(swatches[1].style.backgroundColor);
  backgroundColor = rgbToHex(swatches[2].style.backgroundColor);
  ourTextColor = rgbToHex(swatches[3].style.backgroundColor);
  theirTextColor = rgbToHex(swatches[4].style.backgroundColor);

  // Send message
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

  // Update popup and storage
  fetchColorsAndFillPopup([
    ourColor,
    theirColor,
    backgroundColor,
    ourTextColor,
    theirTextColor
  ]);

  store([
    ourColor,
    theirColor,
    backgroundColor,
    ourTextColor,
    theirTextColor
  ]);
}


function deleteTheme(source) {
  let themeToRemove = source.parentElement.innerText.split('\n')[0];

  chrome.storage.sync.remove([themeToRemove], function() {
    source.parentElement.remove();
  });
}

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
  let hex = parseInt(c).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) {
  // Get the RGB values
  let colors = rgb.split('(')[1].split(')')[0].split(', ');

  let r = colors[0];
  let g = colors[1];
  let b = colors[2];

  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function previewCurrentColors(event) {
  ourColor = '#' + document.getElementById(inputIDs[0]).value;
  theirColor = '#' + document.getElementById(inputIDs[1]).value;
  backgroundColor = '#' + document.getElementById(inputIDs[2]).value;

  // text color todo
  ourTextColor = '#' + document.getElementById(inputIDs[3]).value;
  theirTextColor = '#' + document.getElementById(inputIDs[4]).value;

  // alert(yourBubbleColor);

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

function saveClicked() {
  // Global variables ftw?
  if (ourColor.length > 1) {
    // √ Save to storage
    store();

    // √ Build TheMe UI element
    addTheMe();
  }
}

function addTheMe() {
  // Get TheMe name from the input field
  let name = document.getElementById('INPUT_name').value.trim();

  //todo uncomment
  // if (!name.length) {
  //   alert('add a name lmao');
  //   return;
  // }

  let br = document.createElement('br');
  let li = document.createElement('li');
  let t = document.createTextNode(name);

  li.appendChild(t);
  li.appendChild(br);

  // Thank you,
  // https://github.com/mrvivacious/PorNo-_public/blob/master/linkManager.js#L191
  let span = document.createElement("SPAN");

  let txt = document.createTextNode("x");
  span.className = "delete";
  span.appendChild(txt);
  li.appendChild(span);

  // Append the color palette to the li
  li.appendChild(buildColorPalette());
  li.appendChild(br);

  // Add the event listener to support delete functionality
  li.addEventListener('click', clickHandler)

  // Add to TheMe list
  document.getElementById('themeList').appendChild(li);

  // Clear input field
  document.getElementById('INPUT_name').value = '';
}

function buildColorPalette() {
  // We already have the colors from the member variables at the top of the file
  // Build the freaking css and add the classes
  let div = document.createElement('div');
  div.className = 'swatches';

  let first = document.createElement('span');
  let second = document.createElement('span');
  let third = document.createElement('span');
  let fourth = document.createElement('span');
  let fifth = document.createElement('span');

  first.className = 'first';
  second.className = 'second';
  third.className = 'third';
  fourth.className = 'fourth';
  fifth.className = 'fifth';

  first.style.backgroundColor = ourColor;
  second.style.backgroundColor = theirColor;
  third.style.backgroundColor = backgroundColor;
  fourth.style.backgroundColor = ourTextColor;
  fifth.style.backgroundColor = theirTextColor;

  div.appendChild(first);
  div.appendChild(second);
  div.appendChild(third);
  div.appendChild(fourth);
  div.appendChild(fifth);

  return div;
}

// Store the user selected values into localStorage
function store(themeFromMenu) {
  if (!themeFromMenu) {
    let colors = [
      ourColor,
      theirColor,
      backgroundColor,
      ourTextColor,
      theirTextColor
    ];

    let name = document.getElementById('INPUT_name').value.trim();

    if (name.length > 0) {
      // Save to storage.sync
      // Thank you,
      // https://github.com/mrvivacious/ahegao/blob/master/popupFunctions.js#L45
      chrome.storage.sync.set({[name]:[colors]}, function() {
        // Any code to run after saving
      });
    }
  }
  else {
    chrome.storage.sync.set({colors:[themeFromMenu]}, function() {});

    ourColor = themeFromMenu[0];
    theirColor = themeFromMenu[1];
    backgroundColor = themeFromMenu[2];
    ourTextColor = themeFromMenu[3];
    theirTextColor = themeFromMenu[4];

    // Send message
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
}
