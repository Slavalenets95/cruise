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
    const formData = this.getFormData();
    const filterData = {
      destinations: new Set(),
      ports: new Set(),
      dates: new Set(),
    }

    this.searchPanel.allVoyages.forEach(({ pkg }) => {
      let date = new Date(pkg.vacation.from);
      const month = getMonth(date) + 1 < 10 ? `0${getMonth(date) + 1}` : getMonth(date) + 1;
      const year = getYear(date);
      date = `${year}-${month}`;

      let correctDest = true;
      let correctPort = true;
      let correctDate = true;

      if (formData.destinations.length) {
        correctDest = pkg.destinations.some(destination => formData.destinations.includes(destination.key));
      }
      if (formData.ports.length) {
        correctPort = formData.ports.includes(pkg.location.from.code);
      }
      if (formData.dates.length) {
        correctDate = formData.dates.includes(date);
      }

      if (correctDest && correctPort) {
        filterData.dates.add(date);
      }
      if (correctDate && correctPort) {
        pkg.destinations.forEach(dest => filterData.destinations.add(dest.key));
      }
      if (correctDate && correctDest) {
        filterData.ports.add(pkg.location.from.code);
      }
    })

    return {
      destinations: [...filterData.destinations],
      ports: [...filterData.ports],
      dates: [...filterData.dates]
    };
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
