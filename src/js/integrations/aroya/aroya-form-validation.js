export class AroyaFormValidation {
  messages = {
    required: 'The field is required.',
    email: 'The e-mail address entered is invalid.',
    phone: 'The telephone number entered is invalid.',
  }

  validate(formData, formEl, validationFields) {
    this.clear(formEl);
    const notValid = [];

    validationFields.forEach(({ field, type }, idx) => {
      const value = formData[field];

      type.forEach(validationType => {
        const message = this[`${validationType}Validation`].call(this, value);
        if (!message) return;

        notValid[idx] = {
          field: field,
          message: message,
        };
      })
    })

    if (!notValid.length) return true;

    this.notValid(formEl, notValid);
  }

  notValid(formEl, data) {
    formEl.classList.add('not-valid');
    data.forEach(({ field, message }) => {
      const input = formEl.querySelector(`[name=${field}]`);
      if (input) {
        const errorEl = this.getErrorEl(message);
        input.insertAdjacentHTML('afterend', errorEl);
      }
    })
  }

  clear(formEl) {
    const errorEls = formEl.querySelectorAll('.valid-error');
    formEl.classList.remove('not-valid');
    if (!errorEls.length) return;

    errorEls.forEach(el => el.remove());
  }

  requiredValidation(val) {
    if (!!val) return;

    return this.messages.required;
  }

  emailValidation(val) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!val || val.match(emailRegex)) return;

    return this.messages.email;
  }

  phoneValidation(val) {
    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
    if (!val || val.match(phoneRegex)) return;

    return this.messages.phone;
  }

  getErrorEl(message) {
    return `<div class="valid-error">${message}</div>`;
  }
}