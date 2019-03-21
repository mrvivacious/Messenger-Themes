// themes.js
// this fileis responsible for the coloring

// step 1
// grab the ID's of Messenger's chat bubbles, text, and background

window.onload = () => {
  setInterval(recolor, 5000);

  let body = document.getElementsByClassName('_673w')[0];
  let bubbles = document.getElementsByClassName('_3058 _ui9 _hh7 _6ybn _s1- _52mr _43by _3oh-');

  body.style.backgroundColor = "#624b5c";
  document.getElementsByClassName('_1enh')[0].style.backgroundColor = "#624b5c";
  document.getElementsByClassName('_20bp')[0].style.backgroundColor = "#624b5c";

  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].style.backgroundColor = 'fuchsia'
  }


// step 2
// modify the color

// step 3
}

function recolor() {
  let body = document.getElementsByClassName('_673w')[0];
  let bubbles = document.getElementsByClassName('_3058 _ui9 _hh7 _6ybn _s1- _52mr _43by _3oh-');
  //alert('num of bubbles = ' + bubbles.length);

  body.style.backgroundColor = "#624b5c";
  document.getElementsByClassName('_1enh')[0].style.backgroundColor = "#624b5c";
  document.getElementsByClassName('_20bp')[0].style.backgroundColor = "#624b5c";


  // color the bubbles
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].style.backgroundColor = 'fuchsia'
  }
}
