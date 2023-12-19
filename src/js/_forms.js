import { AroyaApiClient } from "./integrations/aroya/aroya-api-client";

class Forms {
  #aroyaApiClient = new AroyaApiClient();

  selectChangeColor() {
    const selects = document.querySelectorAll('[data-select]');
    const selectWrappers = document.querySelectorAll('.select-wrapper');
    const body = document.querySelector('body');

    if (selects.length) {
      selects.forEach(select => {
        select.addEventListener('change', (evt) => {
          if (evt.target.value) {
            evt.target.setAttribute('data-selected', '');
          } else {
            evt.target.removeAttribute('data-selected');
          }
        })
      })
    }

    if (selectWrappers.length) {
      body.addEventListener('click', (evt) => {
        const openedSelectWrapper = document.querySelectorAll('[data-select-open]');

        if (openedSelectWrapper.length && evt.target.tagName.toLowerCase() !== 'select') {
          openedSelectWrapper.forEach(wrapper => wrapper.removeAttribute('data-select-open'));
        }
      })
      selectWrappers.forEach(wrapper => {
        const select = wrapper.querySelector('select');

        if (select) {
          select.addEventListener('click', () => {
            if (wrapper.hasAttribute('data-select-open')) {
              wrapper.removeAttribute('data-select-open');
            } else {
              wrapper.setAttribute('data-select-open', '');
            }
          })
        }
      })
    }
  }

  initSubmitHandlers() {
    const contactUsForm = document.getElementById('contact-form');
    contactUsForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(contactUsForm);

      await this.#aroyaApiClient.contactUs({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        question: formData.get('question'),
        phone: formData.get('phone') || undefined,
        reservationNumber: Number(formData.get('reservationNumber')) || undefined,
      });
    });

    const subscribeForm = document.querySelector('.footer-subscribe__form');
    subscribeForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(subscribeForm);

      await this.#aroyaApiClient.subscribeToNewsletter({
        email: formData.get('email'),
      });
    });

    const signUpForm = document.querySelector('.signup-form');
    signUpForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(signUpForm);

      await this.#aroyaApiClient.signUp({
        email: formData.get('email'),
        phone: formData.get('phone') || undefined,
      });
    });
  }

  make() {
    this.selectChangeColor();
    this.initSubmitHandlers();
  }
}

export default new Forms();