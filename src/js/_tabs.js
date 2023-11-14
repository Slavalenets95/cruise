class Tabs {
  make() {
    const tabItems = document.querySelectorAll('[data-tab-parent]');

    if(tabItems.length) {
      tabItems.forEach(tab => {
        const tabNavParent = tab.querySelector('[data-tab-nav]');
        
        if(tabNavParent) {
          tabNavParent.addEventListener('click', evt => {
            const isTabBtn = evt.target.hasAttribute('data-tab-btn') || evt.target.closest('[data-tab-btn]');
            const activeTab = tab.querySelectorAll('[data-tab-active]');
            const sameTab = evt.target.hasAttribute('data-tab-active') || evt.target.closest('[data-tab-active]');

            if(isTabBtn && !sameTab) {
              const tabBtn = evt.target.hasAttribute('data-tab-btn') ? evt.target : evt.target.closest('[data-tab-btn]');

              let idx = [...tabNavParent.children].indexOf(tabBtn);
              
              if(idx !== -1) {
                const nextActiveTabBody = tab.querySelector(`[data-tab-item]:nth-child(${idx + 1})`);

                activeTab?.forEach(active => active.removeAttribute('data-tab-active'));

                nextActiveTabBody.setAttribute('data-tab-active', '');
                tabBtn.setAttribute('data-tab-active', '');
              }
            }
          })
        }
      })
    }
  }
}

export default new Tabs();