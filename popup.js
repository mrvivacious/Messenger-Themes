// popup.js
//
// This file adds functionality to the popup,
//  such as previewing, saving, selecting, and editing custom TheMes
//
// @author Vivek Bhookya (mrvivacious)
// @author Linus Zhu (linuszhu1031)

const inputIDs = [
  'ourColor',
  'theirColor',
  'backgroundColor',
  'ourTextColor',
  'theirTextColor'
];

fetchColorsAndFillPopup();

// Function fetchColorsAndFillPopup
// Reads the saved colors from storage and populates the popup accordingly
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
let button_save = document.getElementById('save');
button_save.addEventListener('click', saveClicked);

// Add event listeners to all the inputs in the popup in order to enable
//  "live coloring preview"
let inputs = document.getElementsByTagName('input');
let lis = document.getElementsByTagName('li');

// ??? https://www.w3schools.com/jsref/event_onchange.asp
for (let input = 0; input < inputs.length; input++) {
  inputs[input].addEventListener('change', previewCurrentColors);
}

for (let li = 0; li < lis.length; li++) {
  lis[li].addEventListener('click', loadTheme);
}

// Function loadTheme
// Set the theme chosen by the user from the saved themes list
//  onto Messenger and save it as the current theme in storage
function loadTheme(e) {
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
      source.parentElement.remove();
      // todo remove from storage
    }
  }
  else {
    alert('THEMES DEBUG:: loadThemes, source = ' + source.toString());
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

function rgbToHex(rgb) {
  // Get the RGB values
  let colors = rgb.split('(')[1].split(')')[0].split(', ');

  let r = colors[0];
  let g = colors[1];
  let b = colors[2];

  // Convert each value into hex code in the jankiest way possible
  let redFirstNumber = parseInt(r / 16).toString();
  let greenFirstNumber = parseInt(g / 16).toString();
  let blueFirstNumber = parseInt(b / 16).toString();

  // Ligmao ripppppppppppppppppp
  redFirstNumber = redFirstNumber.replace('10','A').replace('11','B').replace('12','C');
  redFirstNumber = redFirstNumber.replace('13','D').replace('14','E').replace('15','F');

  blueFirstNumber = blueFirstNumber.replace('10','A').replace('11','B').replace('12','C');
  blueFirstNumber = blueFirstNumber.replace('13','D').replace('14','E').replace('15','F');

  greenFirstNumber = greenFirstNumber.replace('10','A').replace('11','B').replace('12','C');
  greenFirstNumber = greenFirstNumber.replace('13','D').replace('14','E').replace('15','F');

  // Second value
  let redSecondNumber = (r % 16).toString();
  let greenSecondNumber = (g % 16).toString();
  let blueSecondNumber = (b % 16).toString();

  // Hehehehehehehehhehehehhe
  redSecondNumber = redSecondNumber.replace('10','A').replace('11','B').replace('12','C');
  redSecondNumber = redSecondNumber.replace('13','D').replace('14','E').replace('15','F');

  blueSecondNumber = blueSecondNumber.replace('10','A').replace('11','B').replace('12','C');
  blueSecondNumber = blueSecondNumber.replace('13','D').replace('14','E').replace('15','F');

  greenSecondNumber = greenSecondNumber.replace('10','A').replace('11','B').replace('12','C');
  greenSecondNumber = greenSecondNumber.replace('13','D').replace('14','E').replace('15','F');

  let red = redFirstNumber + '' + redSecondNumber;
  let green = greenFirstNumber + greenSecondNumber;
  let blue = blueFirstNumber + blueSecondNumber;

  return '#' + red + green + blue;
}

// Function previewCurrentColors
// Send a message from the popup to the window with the selected colorway
//  so that the window can update the Messenger interface with the new colors
//  for the user to preview
function previewCurrentColors(event) {
  ourColor = '#' + document.getElementById(inputIDs[0]).value;
  theirColor = '#' + document.getElementById(inputIDs[1]).value;
  backgroundColor = '#' + document.getElementById(inputIDs[2]).value;

  // text color todo
  ourTextColor = '#' + document.getElementById(inputIDs[3]).value;
  theirTextColor = '#' + document.getElementById(inputIDs[4]).value;

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

function saveClicked() {
  // √ Save to storage
  // store();

  // √ Build TheMe UI element
  addTheMe();
}

function addTheMe() {
  // Get TheMe name from the input field
  let name = document.getElementById('INPUT_name').value.trim();

  //todo uncomment
  // if (!name.length) {
  //   alert('add a name lmao');
  //   return;
  // }

  // Make li and text objects
  let br = document.createElement('br');
  let li = document.createElement('li');
  let t = document.createTextNode(name);

  // Append text to li so we can show the text
  li.appendChild(t);
  li.appendChild(br);

  // Thank you,
  // https://github.com/mrvivacious/PorNo-_public/blob/master/linkManager.js#L191
  let span = document.createElement("SPAN");
  let txt = document.createTextNode("\u00D7");
  span.className = "delete";
  span.appendChild(txt);
  li.appendChild(span);

  // Append the color palette to the li
  buildColorPalette(li);

  li.appendChild(br);

  // Add to TheMe list
  document.getElementById('themeList').appendChild(li);

  // Clear input field
  document.getElementById('INPUT_name').value = '';
}

function buildColorPalette(li) {
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

  // Append to li
  li.appendChild(div);
}

// Function store
// Store the user selected values into localStorage
function store(themeFromMenu) {
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

  if (!themeFromMenu) {
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
  else {
    chrome.storage.sync.set({colors:[themeFromMenu]}, function() {});
  }
}
