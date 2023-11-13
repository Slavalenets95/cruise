class Forms {
  selectChangeColor() {
    const selects = document.querySelectorAll('[data-select]');

    if(selects.length) {
      selects.forEach(select => {
        select.addEventListener('change', (evt) => {
          if(evt.target.value) {
            evt.target.setAttribute('data-selected' , '');
          } else {
            evt.target.removeAttribute('data-selected');
          }
        })
      })
    }
  }
  make() {
    this.selectChangeColor();
  }
}

export default new Forms();