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

  filterData() {
    const formData = this.getFormData();
    const filtered = {
      destinations: {},
      ports: {},
      dates: {}
    };
    let filteredDestinations = [...this.searchPanel.availableDestinations.keys()];
    let filteredPorts = [...this.searchPanel.availablePorts.keys()];
    let filteredDates = [...this.searchPanel.availableDates];

    this.searchPanel.allVoyages.forEach(({ pkg }) => {
      const date = `${getYear(pkg.vacation.from)}-${getMonth(pkg.vacation.from) + 1}`;
      const port = pkg.location.from.code;
      // Destinations
      pkg.destinations.forEach(destination => {
        if (!filtered.destinations[destination.key]) {
          filtered.destinations[destination.key] = {};
          filtered.destinations[destination.key].ports = new Set();
          filtered.destinations[destination.key].dates = new Set();
        }
        filtered.destinations[destination.key].ports.add(port);
        filtered.destinations[destination.key].dates.add(date);
      })

      // Ports
      if (!filtered.ports[port]) {
        filtered.ports[port] = {};
        filtered.ports[port].destinations = new Set();
        filtered.ports[port].dates = new Set();
      }
      pkg.destinations.forEach(destination => filtered.ports[port].destinations.add(destination.key));
      filtered.ports[port].dates.add(date);

      // Dates
      if (!filtered.dates[date]) {
        filtered.dates[date] = {};
        filtered.dates[date].destinations = new Set();
        filtered.dates[date].ports = new Set();
      }
      pkg.destinations.forEach(destination => filtered.dates[date].destinations.add(destination.key));
      filtered.dates[date].ports.add(port);
    })

    if (formData.destinations.length) {
      Object.keys(filtered.ports).forEach(key => {
        if (![...filtered.ports[key].destinations].some(destination => formData.destinations.includes(destination))) {
          filteredPorts = filteredPorts.filter(port => port !== key);
        }
      })
      Object.keys(filtered.dates).forEach(key => {
        if (![...filtered.dates[key].destinations].some(destination => formData.destinations.includes(destination))) {
          filteredDates = filteredDates.filter(date => date !== key);
        }
      })
    }

    if (formData.ports.length) {
      Object.keys(filtered.destinations).forEach(key => {
        if (![...filtered.destinations[key].ports].some(port => formData.ports.includes(port))) {
          filteredDestinations = filteredDestinations.filter(destination => destination !== key);
        }
      })
      Object.keys(filtered.dates).forEach(key => {
        if (![...filtered.dates[key].ports].some(port => formData.ports.includes(port))) {
          filteredDates = filteredDates.filter(date => date !== key);
        }
      })
    }

    if (formData.dates.length) {
      Object.keys(filtered.destinations).forEach(key => {
        if (![...filtered.destinations[key].dates].some(date => formData.dates.includes(date))) {
          filteredDestinations = filteredDestinations.filter(destination => destination !== key);
        }
      })
      Object.keys(filtered.ports).forEach(key => {
        if (![...filtered.ports[key].dates].some(date => formData.dates.includes(date))) {
          filteredPorts = filteredPorts.filter(port => port !== key);
        }
      })
    }

    return {
      destinations: filteredDestinations,
      ports: filteredPorts,
      dates: filteredDates
    };
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
    const filterData = this.filterData();
    this.#showAvailableFilters(filterData);
  }
}
