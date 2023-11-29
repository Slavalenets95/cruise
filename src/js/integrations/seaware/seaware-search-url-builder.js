import { endOfMonth, startOfMonth } from "date-fns";

export class SeawareSearchUrlBuilder {
  #baseUrl = "https://uat.booking.aroya.com/touchb2c";
  
  /**
   * @type {{
   *  dateFromVal?: { local: string },
   *  dateToVal?: { local: string },
   *  destinationsVal?: string[],
   *  portsFromVal?: string[],
   *  resParams: {
   *    customerCounts: {
   *      adults: number,
   *      seniors: number,
   *      children: number,
   *      infants: number,
   *      juniors: number,
   *      youths: number,
   *    },
   *  },
   * }}
   */
  #query = { resParams: {} };

  /**
   * @param {string[]} destinationIds
   */
  withDestinations(destinationIds) {
    (this.#query.destinationsVal = destinationIds);
    return this;
  }

  /**
   * @param {string[]} portIds
   */
  withPorts(portIds) {
    portIds.length && (this.#query.portsFromVal = portIds);
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

    this.#query.dateFromVal = { local: startOfMonth(from).toISOString() };
    this.#query.dateToVal = { local: endOfMonth(to).toISOString() };
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
    this.#query.resParams.customerCounts = {
      ...guests,
    };
    return this;
  }

  build() {
    const queryPayload = encodeURI(JSON.stringify(this.#query));
    return `${this.#baseUrl}/?searchVoyages=${queryPayload}`;
  };
}
