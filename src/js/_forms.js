import { AroyaApiClient } from "./integrations/aroya/aroya-api-client";
import intlTelInput from 'intl-tel-input';
import { isAr } from "./helpers";

class Forms {
  #aroyaApiClient = new AroyaApiClient();

  /**
   * @type { intlTelInput.Plugin }
   */
  #contactUsPhoneInput;

  initPhoneCode() {
    const codeInput = document.getElementById('phone');
    const siteCountry = isAr() ? 'sa' : 'us';

    if(this.#contactUsPhoneInput) {
      this.#contactUsPhoneInput = intlTelInput(codeInput, {
        initialCountry: siteCountry,
        preferredCountries: ['sa', 'us'],
        separateDialCode: true,
        utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.4/js/utils.js',
      });
    }
  }

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

  afterSubmit(form, response) {
    if (!response) return;

    if (response.ok) {
      form.classList.add('thank');
    } else {
      form.classList.add('error');
    }

    setTimeout(() => {
      form.classList.remove('thank');
      form.classList.remove('error');
    }, 10000);
  }

  initSubmitHandlers() {
    const contactUsForm = document.getElementById('contact-form');
    contactUsForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(contactUsForm);

      contactUsForm.classList.add('loading');

      const phone = this.#contactUsPhoneInput.getNumber().slice(1) || undefined;
      const country = phone
        ? this.#contactUsPhoneInput.getSelectedCountryData().name.split('(')[0].trim()
        : undefined;

      const response = await this.#aroyaApiClient.contactUs({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        question: formData.get('question'),
        phone,
        country,
        reservationNumber: Number(formData.get('reservationNumber')) || undefined,
      }, contactUsForm);
      contactUsForm.classList.remove('loading');

      this.afterSubmit(contactUsForm, response);
    });

    const subscribeForm = document.querySelector('.footer-subscribe__form');
    subscribeForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(subscribeForm);

      subscribeForm.classList.add('loading');
      const response = await this.#aroyaApiClient.subscribeToNewsletter({
        email: formData.get('email'),
      }, subscribeForm);
      subscribeForm.classList.remove('loading');
      if(response.ok) {
        document.cookie = 'subscribeUser=true; max-age=' + + 60 * 60 * 24 * 30 * 12;
      }
      this.afterSubmit(subscribeForm, response);
    });

    const signUpForm = document.querySelector('.signup-form');
    signUpForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(signUpForm);

      signUpForm.classList.add('loading');
      const response = await this.#aroyaApiClient.signUp({
        email: formData.get('email'),
        phone: formData.get('phone') || undefined,
      }, signUpForm);
      signUpForm.classList.remove('loading');
      
      this.afterSubmit(signUpForm, response);
    });

    const signPopup = document.querySelector('.sign-popup__form');
    signPopup?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(signPopup);

      signPopup.classList.add('loading');
      const response = await this.#aroyaApiClient.subscribeToNewsletter({
        email: formData.get('email'),
      }, signPopup);
      signPopup.classList.remove('loading');
      if(response.ok) {
        document.cookie = 'subscribeUser=true; max-age=' + + 60 * 60 * 24 * 30 * 12;
      }
      this.afterSubmit(signPopup, response);
    })
  }

  make() {
    this.initPhoneCode();
    this.selectChangeColor();
    this.initSubmitHandlers();
  }
}

export default new Forms();