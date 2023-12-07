import { jsonToGraphQLQuery } from "json-to-graphql-query";

export const throttle = (func, delay) => {
  let prev = 0;
  return (...args) => {
    let now = new Date().getTime();

    if (now - prev > delay) {
      prev = now;
      return func(...args);
    }
  }
}

export class GraphQL {
  #url;

  constructor(url) {
    this.#url = url;
  }

  #prepareQuery({ queryName, params, fields }) {
    return {
      query: {
        [queryName]: {
          __args: {
            params: {
              ...params
            }
          },
          ...fields
        }
      }
    };
  }

  query(queryObj, headers) {
    const query = jsonToGraphQLQuery(this.#prepareQuery({ ...queryObj }));

    return fetch(this.#url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({ query })
    }).then((res) => res.json());
  }
}

export const isAr = () => document.querySelector('html').getAttribute('lang') === 'ar';