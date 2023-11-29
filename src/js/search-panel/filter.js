import { getMonth, getYear } from "date-fns";

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
    const filters = [
      {
        filterName: 'destinations',
        convertFunction: (voyages) => {
          const destinations = voyages
            .map(({ pkg }) => pkg.destinations.map(({ key }) => key))
            .flat();

          return [...new Set(destinations)];
        },
      },
      {
        filterName: 'ports',
        convertFunction: (voyages) => {
          const ports = voyages.map(({ pkg }) => pkg.location.from.code);
          return [...new Set(ports)];
        },
      },
      {
        filterName: 'dates',
        convertFunction: (voyages) => {
          const dates = voyages
            .map(({ pkg }) => `${getYear(pkg.vacation.from)}-${getMonth(pkg.vacation.from) + 1}`);
          
          return [...new Set(dates)];
        },
      }
    ];

    const formData = this.getFormData();

    return filters.reduce((filtered, { filterName, convertFunction }) => {
      // Should skip filter that is being processed and empty filter
      const availableVoyages = this.searchPanel.allVoyages.filter(({ pkg }) => {
        const date = `${getYear(pkg.vacation.from)}-${getMonth(pkg.vacation.from) + 1}`;
        if (
          filterName !== 'dates'
          && formData.dates.length
          && !formData.dates.includes(date)
        ) return false;

        const destinations = pkg.destinations.map(({ key }) => key);
        if (
          filterName !== 'destinations'
          && formData.destinations.length
          && formData.destinations.every((selected) => !destinations.includes(selected))
        ) return false;

        const port = pkg.location.from.code;
        if (
          filterName !== 'ports'
          && formData.ports.length
          && !formData.ports.includes(port)
        ) return false;

        return true;
      });

      filtered[filterName] = convertFunction(availableVoyages);
      return filtered;
    }, {});
  }

  htmlChange(filterData) {
    const destinationsInputs = this.searchPanel.searchForm.querySelectorAll('input[name="destinations"]');
    const portsInputs = this.searchPanel.searchForm.querySelectorAll('input[name="ports"]');
    const monthInputs = this.searchPanel.searchForm.querySelectorAll('[data-date]');

    if (destinationsInputs.length) {
      destinationsInputs.forEach(destinationInput => {
        const destinationVal = destinationInput.value;
        const parent = destinationInput.closest('[data-search-text-parent]');
        if (!filterData.destinations.includes(destinationVal)) {
          destinationInput.checked = false;
          if (parent) {
            parent.setAttribute('data-hidden', '');
          }
        } else {
          parent.removeAttribute('data-hidden');
        }
      })
    }

    if (portsInputs.length) {
      portsInputs.forEach(portInput => {
        const portVal = portInput.value;
        const parent = portInput.closest('[data-search-text-parent]');
        if (!filterData.ports.includes(portVal)) {
          portInput.checked = false;
          if (parent) {
            parent.setAttribute('data-hidden', '');
          }
        } else {
          parent.removeAttribute('data-hidden');
        }
      })
    }

    if (monthInputs.length) {
      monthInputs.forEach(monthItem => {
        const dateVal = monthItem.getAttribute('data-date');
        if (!filterData.dates.includes(dateVal)) {
          monthItem.removeAttribute('data-active');
          monthItem.setAttribute('data-disable', '');
        } else {
          monthItem.removeAttribute('data-disable');
        }
      })
    }
  }

  process() {
    const filterData = this.filterData();
    this.htmlChange(filterData);
  }
}
