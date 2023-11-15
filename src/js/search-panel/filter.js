import { getMonth, getYear } from "date-fns";

// Need refactoring filter
export class SearchPanelFilter {
  searchPanel = null;

  constructor(searchPanel) {
    this.searchPanel = searchPanel;
  }

  getFormData() {
    const formDataSchema = {
      destinations: [],
      dates: [],
      ports: [],
      adults: 0,
      children: 0,
      infants: 0,
    };

    const formData = new FormData(this.searchPanel.searchForm);
    // Get all destindation
    formDataSchema.destinations = formData.getAll('destinations').slice(0);
    // Get all ports
    formDataSchema.ports = formData.getAll('ports').slice(0);
    // Get all dates
    const activeDates = this.searchPanel.searchForm.querySelectorAll('button[data-date][data-active]');

    formDataSchema.adults = parseInt(document.querySelector('[data-counter][name=adult]').value);
    formDataSchema.children = parseInt(document.querySelector('[data-counter][name=children]').value);
    formDataSchema.infants = parseInt(document.querySelector('[data-counter][name=infants]').value);

    if (activeDates.length) {
      activeDates.forEach(date => {
        formDataSchema.dates.push(date.getAttribute('data-date'));
      })
    }

    return formDataSchema;
  }

  #filterData() {
    const selected = this.getFormData();
    const availables = this.#setAvailability();

    return this.#removeUnavailables(selected, availables);
  }

  #setAvailability() {
    const availables = {
      destinations: {},
      ports: {},
      dates: {}
    };

    this.searchPanel.allVoyages.forEach(({ pkg }) => {
      const date = `${getYear(pkg.vacation.from)}-${getMonth(pkg.vacation.from) + 1}`;
      const port = pkg.location.from.code;

      // Destinations
      pkg.destinations.forEach(destination => {
        if (!availables.destinations[destination.key]) {
          availables.destinations[destination.key] = { ports: new Set(), dates: new Set() };
        }
        availables.destinations[destination.key].ports.add(port);
        availables.destinations[destination.key].dates.add(date);
      })

      // Ports
      if (!availables.ports[port]) {
        availables.ports[port] = { destinations: new Set(), dates: new Set() };
      }

      pkg.destinations.forEach(destination => availables.ports[port].destinations.add(destination.key));
      availables.ports[port].dates.add(date);

      // Dates
      if (!availables.dates[date]) {
        availables.dates[date] = { destinations: new Set(), ports: new Set() };
      }

      pkg.destinations.forEach(destination => availables.dates[date].destinations.add(destination.key));
      availables.dates[date].ports.add(port);
    });

    return availables;
  }

  /**
   * @returns {{
   *  destinations: string[],
   *  ports: string[],
   *  dates: string[],
   * }}
   */
  #removeUnavailables(selected, availables) {
    const filterKeys = Object.keys(availables);

    return filterKeys.reduce((filteredTotal, targetFilter) => {
      const filteredOptionsSet = new Set(Object.keys(availables[targetFilter]));
      
      const filterAvailabilities = availables[targetFilter];
      Object.entries(filterAvailabilities).forEach(([filterOption, dependFilters]) => {
        filterKeys.forEach((dependFilter) => {
          if (dependFilter === targetFilter) return;

          const selectedValues = selected[dependFilter];
          if (!selectedValues.length) return;

          const dependValues = [...dependFilters[dependFilter]];
          if (dependValues.every((dependValue) => !selectedValues.includes(dependValue))) {
            filteredOptionsSet.delete(filterOption);
          }
        });
      });

      filteredTotal[targetFilter] = [...filteredOptionsSet];
      return filteredTotal;
    }, {});
  }

  #showAvailableFilters(filterData) {
    const destinationsInputs = this.searchPanel.searchForm.querySelectorAll('input[name="destinations"]');
    const monthInputs = this.searchPanel.searchForm.querySelectorAll('[data-date]');
    const portsInputs = this.searchPanel.searchForm.querySelectorAll('input[name="ports"]');

    this.#showAvailableTextInputs(filterData.destinations, destinationsInputs);
    this.#showAvailableTextInputs(filterData.ports, portsInputs);
    this.#showAvailableDates(filterData.dates, monthInputs);
  }

  #showAvailableTextInputs(filtered, inputs) {
    inputs.forEach((input) => {
      const parent = input.closest('[data-search-text-parent]');
      if (!filtered.includes(input.value)) {
        input.checked = false;
        parent?.setAttribute('data-hidden', '');
      } else {
        parent.removeAttribute('data-hidden');
      }
    });
  }

  #showAvailableDates(filtered, inputs) {
    inputs.forEach((input) => {
      const dateVal = input.getAttribute('data-date');
      if (!filtered.includes(dateVal)) {
        input.removeAttribute('data-active');
        input.setAttribute('data-disable', '');
      } else {
        input.removeAttribute('data-disable');
      }
    });
  }

  process() {
    this.#showAvailableFilters(this.#filterData());
  }
}
