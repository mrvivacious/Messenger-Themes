function recolorBackground() {
  let backgroundPanels = [
    BACKGROUND_PANEL_TOP,
    BACKGROUND_PANEL_LEFT,
    BACKGROUND_PANEL_CHAT,
    BACKGROUND_PANEL_CHAT_LOADING,
    BACKGROUND_PANEL_DIVIDER,
    BACKGROUND_PANEL_BOTTOM,
    BACKGROUND_PANEL_BOTTOM_WHEN_EXPOSED,
    BACKGROUND_PANEL_RECIPIENT_DETAIL_PAGE,
  ];

  for (let i = 0; backgroundPanels[i]; i++) {
    let panel = document.getElementsByClassName(backgroundPanels[i])[0];

    if (panel) {
      panel.style.backgroundColor = BACKGROUND_COLOR;
    }
  }
}
