function recolorMessages() {
  // Recolor the messages
  let ourMessages = document.querySelectorAll(OUR_MESSAGES);
  let theirMessages = document.querySelectorAll(THEIR_MESSAGES);

  for (let i = 0, n = ourMessages.length; i < n; i++) {
    let message = ourMessages[i];
    message.firstElementChild.firstElementChild.style.backgroundColor =
      OUR_COLOR;
    message.firstElementChild.firstElementChild.firstElementChild.style.color =
      OUR_TEXT_COLOR;
  }

  for (let i = 0, n = theirMessages.length; i < n; i++) {
    let message = theirMessages[i];
    message.firstElementChild.firstElementChild.style.backgroundColor =
      THEIR_COLOR;
    message.firstElementChild.firstElementChild.firstElementChild.style.color =
      THEIR_TEXT_COLOR;
  }
}
