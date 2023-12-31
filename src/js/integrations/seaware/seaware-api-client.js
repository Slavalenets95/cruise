import { formatISO } from 'date-fns';
import { GraphQL } from '../../helpers';

export class SeawareApiClient {
  // Make from env
  static #seawareUrl = "https://uat.booking.aroya.com:3000/graphql";
  
  #graphQLClient = new GraphQL(SeawareApiClient.#seawareUrl);

  /**
   * Search availabilities
   *
   * @param {Date} fromDate
   * @param {Date} toDate
   * @param {'en' | 'ar'} language content language
   * @returns {Promise<{
   *    availableVoyages: {
   *      pkg: {
   *        destinations: {
   *          name: string,
   *          key: string,
   *          comments: string,
   *        },
   *        vacation: { from: Date },
   *        location: { from: { name: string, code: string } },
   *      },
   *    }[]}>}
   */
  getAvailableVoyages(fromDate, toDate, language) {
    const queryObj = {
      queryName: "availableVoyages",
      params: {
        startDateRange: {
          from: formatISO(fromDate),
          to: formatISO(toDate),
        },
        endDateRange: {
          from: formatISO(fromDate),
          to: formatISO(toDate),
        }
      },
      fields: {
        pkg: {
          destinations: {
            name: true,
            key: true,
            comments: true,
          },
          vacation: {
            from: true,
          },
          location: {
            from: {
              name: true,
              code: true,
            },
          }
        }
      }
    };

    return this.#graphQLClient.query(queryObj, {
      'Accept-Languages': language,
    })
      .then((res) => res.data)
      .then((res) => {
        res.availableVoyages
          .forEach(({ pkg }) => pkg.vacation.from = new Date(pkg.vacation.from));
        return res;
      });
  }
}
