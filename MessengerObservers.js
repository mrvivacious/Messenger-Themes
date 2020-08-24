// When conversation changes, refresh the message observer to
//  re-enable message coloring
// Thank you, https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes
function addObserverForURLChange() {
  let oldHref = null;

  window.onload = function() {
    let bodyList = document.querySelector('body');
    let observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (oldHref != document.location.href) {
          // URL has changed
          oldHref = document.location.href;

          // Add chat event listener
          addObserverForMessage();
        }
      });
    });

    let config = {
      childList: true,
      subtree: true
    };

    observer.observe(bodyList, config);
  };
}

// Recolor messages when new messages load instead of on a time interval
//  to avoid jank UI updating and possible slowdown of
//  CPU and browser
// https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
function addObserverForMessage() {
  let messagesPanel = document.querySelectorAll('#js_1')[0];

  if (!messagesPanel) {
    // https://stackoverflow.com/questions/40398054/observe-on-mutationobserver-parameter-1-is-not-of-type-node
    //The node we need does not exist yet.
    //Wait 500ms and try again
    window.setTimeout(addObserverForMessage,500);
    console.log('Waiting...');
    return;
  }

  let config = {childList: true};
  let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      // RECOLOR MESSAGES HERE
      console.log('New message loaded: ' + mutation)
    });
  });

  // pass in the target node, as well as the observer options
  observer.observe(messagesPanel, config);
  console.log('Added message observer')
}

addObserverForURLChange();
