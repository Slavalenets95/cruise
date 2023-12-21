import { AroyaFormValidation } from "./aroya-form-validation";

export class AroyaApiClient {
  // Make from env
  static #contactUsUrl = "https://prod-108.westeurope.logic.azure.com:443/workflows/4e4825c95f8e43339e4bd480bb87e180/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xqy7XWkArwwqCaWUxt4bTaJSlwqfDH-rdDsSqoTiyL0";
  static #subscribeUrl = "https://prod-141.westeurope.logic.azure.com:443/workflows/cbffffbd49054cfc9c024f65141e98b6/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=InEr-geeaqqCA_wxwUkBBm5tp-nXNrkJagA984PlpwY";
  static #signUpUrl = "https://prod-89.westeurope.logic.azure.com:443/workflows/e5aa9229ed57407ab72bd2ba71901952/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=cQb26Fx3WvFOsoqrqIwoTZrKoVd1KiAdWG3hq5NrjoQ";

  aroyaFormValidation = new AroyaFormValidation();

  /**
   * @param {{
   *  firstName: string,
   *  lastName: string,
   *  email: string,
   *  phone?: string,
   *  country?: string,
   *  reservationNumber?: number,
   *  question: string,
   * }} formData Contact Us form data
   */
  contactUs(formData, formEl) {
    const validationFields = [
      {
        field: 'firstName',
        type: ['required']
      },
      {
        field: 'lastName',
        type: ['required']
      },
      {
        field: 'email',
        type: ['email', 'required']
      },
      {
        field: 'question',
        type: ['required']
      },
      {
        field: 'phone',
        type: ['phone']
      }
    ];
    if (this.aroyaFormValidation.validate(formData, formEl, validationFields)) {
      return fetch(AroyaApiClient.#contactUsUrl, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }
    return false;
  }

  /**
   * @param {{ email: string }} formData Subscribe form data
   */
  subscribeToNewsletter(formData, formEl) {
    const validationFields = [
      {
        field: 'email',
        type: ['email', 'required']
      }
    ];
    if(this.aroyaFormValidation.validate(formData, formEl, validationFields)) {
      return fetch(AroyaApiClient.#subscribeUrl, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }
    return false;
  }

  /**
   * @param {{
   *  email: string,
   *  phone?: string,
   * }} formData Sign Up form data
   */
  signUp(formData, formEl) {
    const validationFields = [
      {
        field: 'email',
        type: ['email', 'required']
      },
      {
        field: 'phone',
        type: ['phone']
      }
    ];
    if(this.aroyaFormValidation.validate(formData, formEl, validationFields)) {
      return fetch(AroyaApiClient.#signUpUrl, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }

    return false;
  }
}
