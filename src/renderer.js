document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app-container');
  const tabButtons = document.querySelectorAll('.tab-btn[data-tab]');
  const splitToggleBtn = document.getElementById('btn-split-toggle');
  const panes = document.querySelectorAll('.webview-pane');
  const webviews = {
    chatgpt: document.getElementById('webview-chatgpt'),
    gemini: document.getElementById('webview-gemini'),
    deepseek: document.getElementById('webview-deepseek')
  };

  let activeTab = 'chatgpt';
  let isSplitView = false;

  // Initialize active pane for single view
  function updateView() {
    if (isSplitView) {
      container.classList.remove('view-single');
      container.classList.add('view-split');
      splitToggleBtn.classList.add('active');
      tabButtons.forEach(btn => btn.classList.remove('active'));
      panes.forEach(pane => pane.classList.add('active'));
    } else {
      container.classList.remove('view-split');
      container.classList.add('view-single');
      splitToggleBtn.classList.remove('active');

      tabButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === activeTab) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      panes.forEach(pane => {
        if (pane.getAttribute('data-service') === activeTab) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    }
  }

  // Single tab click handlers
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      activeTab = targetTab;
      isSplitView = false;
      updateView();
    });
  });

  // Split-view toggle handler
  splitToggleBtn.addEventListener('click', () => {
    isSplitView = !isSplitView;
    updateView();
  });

  // Global Navigation Controls
  const globalBackBtn = document.getElementById('btn-global-back');
  const globalForwardBtn = document.getElementById('btn-global-forward');
  const globalReloadBtn = document.getElementById('btn-global-reload');

  globalBackBtn.addEventListener('click', () => {
    if (isSplitView) {
      Object.values(webviews).forEach(wv => {
        if (wv && typeof wv.canGoBack === 'function' && wv.canGoBack()) {
          wv.goBack();
        }
      });
    } else {
      const activeWv = webviews[activeTab];
      if (activeWv && typeof activeWv.canGoBack === 'function' && activeWv.canGoBack()) {
        activeWv.goBack();
      }
    }
  });

  globalForwardBtn.addEventListener('click', () => {
    if (isSplitView) {
      Object.values(webviews).forEach(wv => {
        if (wv && typeof wv.canGoForward === 'function' && wv.canGoForward()) {
          wv.goForward();
        }
      });
    } else {
      const activeWv = webviews[activeTab];
      if (activeWv && typeof activeWv.canGoForward === 'function' && activeWv.canGoForward()) {
        activeWv.goForward();
      }
    }
  });

  globalReloadBtn.addEventListener('click', () => {
    Object.values(webviews).forEach(wv => {
      if (wv && typeof wv.reload === 'function') {
        wv.reload();
      }
    });
  });

  // Individual Pane Navigation Controls
  document.querySelectorAll('.btn-pane-back').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = e.currentTarget.getAttribute('data-target');
      const wv = document.getElementById(targetId);
      if (wv && typeof wv.canGoBack === 'function' && wv.canGoBack()) {
        wv.goBack();
      }
    });
  });

  document.querySelectorAll('.btn-pane-forward').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = e.currentTarget.getAttribute('data-target');
      const wv = document.getElementById(targetId);
      if (wv && typeof wv.canGoForward === 'function' && wv.canGoForward()) {
        wv.goForward();
      }
    });
  });

  document.querySelectorAll('.btn-pane-reload').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = e.currentTarget.getAttribute('data-target');
      const wv = document.getElementById(targetId);
      if (wv && typeof wv.reload === 'function') {
        wv.reload();
      }
    });
  });

  // Initial View setup
  updateView();
});
