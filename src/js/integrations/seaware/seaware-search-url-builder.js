import { endOfMonth, startOfMonth } from "date-fns";

export class SeawareSearchUrlBuilder {
  #baseUrl = "https://uat.booking.aroya.com/touchb2c";
  
  /**
   * @type {{
   *  dateFrom?: string,
   *  dateTo?: string,
   *  destination?: string[],
   *  portFrom?: string,
   *  guests: {
   *    adults: number,
   *    seniors: number,
   *    children: number,
   *    infants: number,
   *    juniors: number,
   *    youths: number,
   *  },
   * }}
   */
  #query = { resParams: {} };

  #language = 'en';

  /**
   * @param {string[]} destinationIds
   */
  withDestinations(destinationIds) {
    destinationIds.length && (this.#query.destination = destinationIds.join(','));
    return this;
  }

  /**
   * @param {string} portIds
   */
  withPorts(portIds) {
    // Current API only accept one value of portFrom
    portIds.length && (this.#query.portFrom = portIds.join(','));
    return this;
  }

  /**
   * @param {Date?} from
   * @param {Date?} to
   */
  withDates(from, to) {
    if (!from || !to) {
      return this;
    }

    this.#query.dateFrom = startOfMonth(from).toISOString();
    this.#query.dateTo = endOfMonth(to).toISOString();
    return this;
  }

  /**
   * @param {{
   *  adults: number,
   *  children: number,
   *  infants: number,
   * }} guests
   */
  withGuest(guests) {
    this.#query.guests = {
      ...guests,
    };
    return this;
  }

  withLanguage(language) {
    this.#language = language;
    return this;
  }

  build() {
    const { guests, ...params } = this.#query;
    const query = {
      locale: this.#language,
      runSearch: true,
      ...params,
      ...guests,
    };

    const queryPayload = encodeURI(JSON.stringify(query));

    return `${this.#baseUrl}/?inJsonGet=${queryPayload}`;
  };
}
