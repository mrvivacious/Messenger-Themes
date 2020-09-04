function recolorMessages() {
  // Recolor the messages
  let allMessages = document.getElementsByClassName(ALL_MESSAGES);

  // Iterate over each message
  for (let i = 0; allMessages[i]; i++) {
    let currentMessage = allMessages[i];
    // let currentClass = currentMessage.classList[6];
    let currentClass = currentMessage.className;

    if (currentClass.includes(OUR_MESSAGES)) {
      // Does this message contain a reaction?
      if (currentMessage.classList[0] &&
        currentMessage.classList[0].includes(MESSAGES_WITH_REACTION)) {
          currentMessage.style.background = OUR_COLOR;
          // If the message contains a reaction and is also a reply,
          //  color the text with this
          // BUG ?? In the future, the child layout could change...
          currentMessage.children[2].style.color = OUR_TEXT_COLOR;
      }

      // Is this message a reply to another message?
      if (currentMessage.classList[9] &&
        currentMessage.classList[9].includes(REPLY_MESSAGE)) {
          currentMessage.children[2].style.color = OUR_TEXT_COLOR;
      }

      // Dynamic themes have a background-image attribute,
      //  OUR_COLOR won't show until this attribute is removed
      currentMessage.style.backgroundImage = '';
      currentMessage.style.backgroundColor = OUR_COLOR;


      // TODO silence dumbfuck bug until further investigation
      if (currentMessage.children[1]) {
        currentMessage.children[1].style.color = OUR_TEXT_COLOR;
      }
    }
    else if (currentClass.includes(THEIR_MESSAGES)) {
      // Does this message contain a reaction?
      if (currentMessage.classList[0] &&
        currentMessage.classList[0].includes(MESSAGES_WITH_REACTION)) {
        currentMessage.style.background = THEIR_COLOR;
        currentMessage.children[2].style.color = THEIR_TEXT_COLOR;
      }

      // Is this message a reply to another message?
      if (currentMessage.classList[7] &&
        currentMessage.classList[7].includes(REPLY_MESSAGE)) {
          currentMessage.children[2].style.color = THEIR_TEXT_COLOR;
      }

      currentMessage.style.backgroundColor = THEIR_COLOR;

      // TODO silence dumbfuck bug until further investigation
      if (currentMessage.children[1]) {
        currentMessage.children[1].style.color = THEIR_TEXT_COLOR;
      }
    }
    // Else, we found something that isn't a chat bubble, so
    //  let's not worry about it
  }
}
