function recolorMisc() {
  //   let typingIndicator = document.getElementsByClassName(TYPING_INDICATOR)[0];
  //   let messageStatusIndicator = document.getElementsByClassName(
  //     MESSAGE_STATUS_INDICATOR
  //   );
  //   let popupMediaPanel = document.getElementsByClassName(POPUP_MEDIA_PANEL)[0];
  //   let paperAirplaneWhileTypingMessage =
  //     document.getElementsByClassName(PAPER_AIRPLANE)[0];
  //   let smileyFaceInsideChatInput =
  //     document.getElementsByClassName(SMILEY_FACE)[0];

  //   if (typingIndicator) {
  //     typingIndicator.style.backgroundColor = BACKGROUND_COLOR;
  //   }

  //   if (popupMediaPanel) {
  //     popupMediaPanel.style.backgroundColor = BACKGROUND_COLOR;
  //   }

  //   if (paperAirplaneWhileTypingMessage) {
  //     paperAirplaneWhileTypingMessage =
  //       paperAirplaneWhileTypingMessage.children[0];
  //     paperAirplaneWhileTypingMessage.outerHTML = recoloredSVG(
  //       paperAirplaneWhileTypingMessage.outerHTML
  //     );
  //   }

  //   if (smileyFaceInsideChatInput) {
  //     smileyFaceInsideChatInput = smileyFaceInsideChatInput.children[0];
  //     smileyFaceInsideChatInput.outerHTML = recoloredSVG(
  //       smileyFaceInsideChatInput.outerHTML
  //     );
  //   }

  //   if (messageStatusIndicator) {
  //     for (let msg = 0; messageStatusIndicator[msg]; msg++) {
  //       messageStatusIndicator[msg].style.color = OUR_COLOR;
  //     }
  //   }

  let replies = document.getElementsByClassName(REPLIES);
  if (replies) {
    for (let reply = 0, n = replies.length; reply < n; reply++) {
      replies[reply].style.backgroundColor = BACKGROUND_COLOR;
    }
  }

  let callUpdates = document.getElementsByClassName(CALL_UPDATES);
  if (callUpdates) {
    for (let update = 0, n = callUpdates.length; update < n; update++) {
      callUpdates[update].style.backgroundColor = BACKGROUND_COLOR;
    }
  }
}

// TODO remove this function after making recolorSVG file
function recoloredSVG(originalHTML) {
  let startOfFill = originalHTML.lastIndexOf("#");
  if (startOfFill < 0) {
    // console.log('hidden')
    return;
  }

  let originalFill = "";

  for (let i = startOfFill; i < startOfFill + 7; i++) {
    originalFill += originalHTML[i];
  }

  return originalHTML.replace(originalFill, OUR_COLOR);
}
