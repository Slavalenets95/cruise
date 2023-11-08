import { addMonths, addYears, endOfYear, formatISO, startOfYear, getYear, getMonth, format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { SeawareApiClient } from './integrations/seaware/sdk/seaware-api-client';

class SearchPanel {
  searchForm = null
  renderClass = null;
  controlsClass = null;
  monthPicker = null;
  searchPanelFilter = null;
  #seawareApiClient = new SeawareApiClient();

  allVoyages = [];
  // ['key']
  allDestinations = new Set();
  // ['year-month']
  allDates = new Set();
  // ['code']
  allPorts = new Set();
  // Only for first render
  renderData = {
    // [{comment: string, key: string}, ...]
    destinations: [],
    // [{name: string, code: string}, ...]
    ports: [],
    // {year: ['year-month'], ...}
    dates: {},
  }

  constructor(searchFormNode) {
    this.renderClass = new SearchPanelRender();
    this.controlsClass = new SearchPanelControls();
    this.monthPicker = new SearchPanelMonthPicker();
    this.searchPanelFilter = new SearchPanelFilter(this);
    this.searchForm = searchFormNode;
  }

  // Set dates for calendar render
  setCalendarRenderDates() {
    // Get min voyage date
    let minDate = this.allVoyages.map(({ pkg }) => pkg.vacation.from);
    minDate = new Date(Math.min.apply(null, minDate));

    const startDate = startOfYear(new Date(minDate.getTime()));
    const endDate = endOfYear(addYears(new Date(minDate).getTime(), 1));

    // Fill render dates
    let loopDate = new Date(startDate.getTime());
    this.renderData.dates[getYear(loopDate)] = [];
    this.renderData.dates[getYear(loopDate)].push(`${getYear(loopDate)}-${getMonth(loopDate) + 1}`);

    while (addMonths(loopDate, 1).getYear() <= endDate.getYear(``)) {
      loopDate = addMonths(loopDate, 1);
      if (!this.renderData.dates[getYear(loopDate)]) {
        this.renderData.dates[getYear(loopDate)] = [];
      }
      this.renderData.dates[getYear(loopDate)].push(`${getYear(loopDate)}-${getMonth(loopDate) + 1}`);
    }
  }

  // Prepare search form render values
  transformData() {
    // Convert dateFrom string to obj Date
    this.allVoyages.forEach(({ pkg }) => pkg.vacation.from = new Date(pkg.vacation.from));

    this.allVoyages.forEach(({ pkg }) => {
      const destinations = pkg.destinations;
      const port = pkg.location.from;
      const year = getYear(pkg.vacation.from);
      const month = getMonth(pkg.vacation.from) + 1;
      const date = `${year}-${month}`;

      // Filter unique destinations data
      destinations.forEach(destination => {
        const key = destination.key;
        const comment = destination.comments;
        if (!this.allDestinations.has(key)) {
          this.allDestinations.add(key)
          this.renderData.destinations.push({
            comment: comment,
            key: key
          })
        }
      })

      // Filter unique ports data
      if (!this.allPorts.has(port.code)) {
        this.allPorts.add(port.code);
        this.renderData.ports.push({
          name: port.name,
          code: port.code
        });
      }

      // Filter uniquer year-month
      if (!this.allDates.has(date)) {
        this.allDates.add(date);
      }
    })

    this.setCalendarRenderDates();
  }

  async make() {
    if (this.searchForm) {
      // Get all voyages
      const fromDateISO = formatISO(new Date(Date.now()));
      const toDateISO = formatISO(endOfYear(addYears(new Date(Date.now()), 2)));
      await this.#seawareApiClient
        .getAvailableVoyages(fromDateISO, toDateISO)
        .then(res => this.allVoyages = res.data.availableVoyages);

      // Prepare render values
      this.transformData();

      // Render
      this.renderClass.render(
        this.renderData.destinations,
        this.renderData.ports,
        this.renderData.dates
      );

      // Init form controls
      this.controlsClass.init();

      // Init search panel monthpicker
      this.monthPicker.init(this.allDates);

      // Filter & html changes on close search dropdown
      document.querySelector('#search-form').addEventListener('close-search-dropdown', () => {
        this.searchPanelFilter.process();
      })
    }
  }
}

// Need refactoring filter
class SearchPanelFilter {
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
      childrens: 0,
      infants: 0,
    };

    const formData = new FormData(this.searchPanel.searchForm);
    // Get all destindation
    formDataSchema.destinations = formData.getAll('destinations').slice(0);
    // Get all ports
    formDataSchema.ports = formData.getAll('ports').slice(0);
    // Get all dates
    const activeDates = this.searchPanel.searchForm.querySelectorAll('button[data-date][data-active]');

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
    let filteredDestinations = [...this.searchPanel.allDestinations];
    let filteredPorts = [...this.searchPanel.allPorts];
    let filteredDates = [...this.searchPanel.allDates];

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

class SearchPanelRender {
  constructor() { }

  // Return searchCheckboxItem Node
  createSearchCheckboxItem(checkboxName, checkboxValue, checkboxTextValue) {
    const checkboxItem = document.createElement('div');
    checkboxItem.className = 'search-form__checkbox-item';
    checkboxItem.setAttribute('data-search-text-parent', '');
    checkboxItem.innerHTML = `
      <label class="search-form__label flex">
        <input type="checkbox" name="${checkboxName}" value="${checkboxValue}">
        <div class="checkbox-after"></div>
        <span class="search-form__checkbox-text" data-search-text>${checkboxTextValue}</span>
      </label>`;

    return checkboxItem;
  }

  createMonthItem(date, monthName) {
    const dateItem = document.createElement('div');
    dateItem.className = 'search-form__date-item flex';
    dateItem.innerHTML = `
      <button type="button" class="search-form__date-month flex text-16" data-date="${date}">
        ${monthName}
      </button>`

    return dateItem;
  }

  createDatesItems(dates, renderNode) {
    const datesItems = [];
    Object.keys(dates).forEach(key => {
      const datesItem = document.createElement('div');
      datesItem.className = 'search-form__dates-item flex';
      datesItem.innerHTML = `
          <div class="search-form__dates-item-title text-20 extrabold">
            ${key}
          </div>
          <div class="search-form__date flex"></div>`;

      const monthParent = datesItem.querySelector('.search-form__date');

      dates[key].forEach(date => {
        const dateObj = new Date(date);
        const monthName = format(dateObj, 'LLL', { locale: enUS });
        monthParent.appendChild(this.createMonthItem(date, monthName));
      })

      datesItems.push(datesItem);
    })

    datesItems.forEach(dateItem => renderNode.appendChild(dateItem));
  }

  render(destinations, ports, dates) {
    // Destinations render
    const destinationsWrapper = document.querySelector('[data-search-destinations]');
    if (destinationsWrapper && destinations.length) {
      destinations.forEach(destination => {
        destinationsWrapper.appendChild(this.createSearchCheckboxItem('destinations', destination.key, destination.comment));
      })
    }

    // Ports render
    const portsWrapper = document.querySelector('[data-search-ports]')
    if (portsWrapper && ports.length) {
      ports.forEach(port => {
        portsWrapper.appendChild(this.createSearchCheckboxItem('ports', port.code, port.name));
      })
    }

    // Dates render
    const datesWrapper = document.querySelector('[data-search-form-dates]');
    if (datesWrapper && Object.keys(dates).length) {
      this.createDatesItems(dates, datesWrapper);
    }
  }
}

class SearchPanelControls {
  init() {
    this.checkboxClearBtnInit();
    this.clearDateBtnInit();
    this.searchInputInit();
  }

  clearDateBtnInit() {
    const clearDateButtons = document.querySelectorAll('[data-clear-date]');
    if (clearDateButtons.length) {
      clearDateButtons.forEach(clearBtn => {
        clearBtn.addEventListener('click', evt => {
          const parentWrapper = evt.target.closest('[data-clear-parent]');
          if (parentWrapper) {
            const dateItems = parentWrapper.querySelectorAll('[data-date]');
            dateItems.forEach(item => item.removeAttribute('data-active'));
          }
        })
      })
    }
  }

  checkboxClearBtnInit() {
    const clearButtons = document.querySelectorAll('[data-clear-btn]');
    if (clearButtons.length) {
      clearButtons.forEach(clearBtn => {
        clearBtn.addEventListener('click', function (evt) {
          console.log(evt.target.closest('[data-clear-parent]'))
          const clearParent = evt.target.closest('[data-clear-parent]');
          const clearInputs = clearParent.querySelectorAll('input');

          if (clearInputs.length) {
            clearInputs.forEach(input => {
              const inputType = input.type;

              switch (inputType) {
                case 'checkbox':
                  input.checked = false;
                  break;
                default:
                  input.value = '';
                  break;
              }
            })
          }
        })
      })
    }
  }

  searchInputInit() {
    const searchInputs = document.querySelectorAll('[data-search-input]');
    if (searchInputs.length) {
      searchInputs.forEach(searchInput => {
        const searchInputParent = searchInput.closest('[data-search-parent]');
        const searchInputElements = searchInputParent.querySelectorAll('[data-search-text]');

        if (searchInputParent && searchInputElements.length) {
          searchInput.addEventListener('input', function (evt) {
            searchInputElements.forEach(searchEl => {
              if (!searchEl.textContent.toLowerCase().includes((evt.target.value.toLowerCase()))) {
                searchEl.closest('[data-search-text-parent]').setAttribute('data-hidden', '');
              } else {
                searchEl.closest('[data-search-text-parent]').removeAttribute('data-hidden');
              }
            })
          })
        }
      })
    }
  }
}

class SearchPanelMonthPicker {
  init(correctDates) {
    const searchMonthPicker = document.querySelector('.search-form__dates');
    if (searchMonthPicker) {
      const allMonths = searchMonthPicker.querySelectorAll('[data-date]');
      // Disable not correct values
      Array.from(allMonths).forEach(monthEl => {
        const dateString = monthEl.getAttribute('data-date');
        if (!correctDates.has(dateString)) {
          monthEl.removeAttribute('data-active');
          monthEl.setAttribute('data-disable', '');
        }
      })
      const transformAllMonth = Array.from(allMonths).map(monthEl => {
        return {
          el: monthEl,
          date: new Date(monthEl.getAttribute('data-date')),
        }
      });

      allMonths.forEach(monthBtn => {
        monthBtn.addEventListener('click', (evt) => {
          const isDisable = evt.target.hasAttribute('data-disable');
          const maxDate = this.getMaxSelectedDate(transformAllMonth);
          const minDate = this.getMinSelectedDate(transformAllMonth);

          if (!isDisable) evt.target.toggleAttribute('data-active');

          const targetDateTime = new Date(evt.target.getAttribute('data-date')).getTime();

          if (maxDate && minDate) {
            if (targetDateTime > maxDate.date.getTime()) {
              const betweenMaxDates = transformAllMonth.filter(i => {
                return !i.el.hasAttribute('data-disable') &&
                  i.date.getTime() > maxDate.date.getTime() &&
                  i.date.getTime() < targetDateTime;
              })
              betweenMaxDates.forEach(i => i.el.setAttribute('data-active', ''));
            } else if (targetDateTime < minDate.date.getTime()) {
              const betweenMinDates = transformAllMonth.filter(i => {
                return !i.el.hasAttribute('data-disable') &&
                  i.date.getTime() < minDate.date.getTime() &&
                  i.date.getTime() > targetDateTime;
              })
              betweenMinDates.forEach(i => i.el.setAttribute('data-active', ''));
            }
          }
        })
      })
    }
  }

  getMaxSelectedDate(transformAllMonth) {
    const activeEls = transformAllMonth.filter(i => i.el.hasAttribute('data-active'));
    const dates = activeEls.map(i => i.date);
    const maxDate = Math.max.apply(null, dates);
    return activeEls.filter(i => i.date.getTime() === maxDate)[0];
  }

  getMinSelectedDate(transformAllMonth) {
    const activeEls = transformAllMonth.filter(i => i.el.hasAttribute('data-active'));
    const dates = activeEls.map(i => i.date);
    const minDate = Math.min.apply(null, dates);
    return activeEls.filter(i => i.date.getTime() === minDate)[0];
  }
}

const searchForm = document.querySelector('#search-form');

export default new SearchPanel(searchForm);