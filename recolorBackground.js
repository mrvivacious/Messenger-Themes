function recolorBackground() {
  let backgroundPanels = [
    BACKGROUND_PANEL_TOP,
    BACKGROUND_PANEL_LEFT,
    BACKGROUND_PANEL_CHAT,
    BACKGROUND_PANEL_DIVIDER,
    BACKGROUND_PANEL_BOTTOM
  ];

  for (let i = 0; backgroundPanels[i]; i++) {
    let panel = document.getElementsByClassName(backgroundPanels[i])[0];

    if (panel) {
      panel.style.backgroundColor = BACKGROUND_COLOR;
    }
  }
}
