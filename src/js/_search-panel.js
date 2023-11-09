import { addMonths, addYears, endOfYear, formatISO, startOfYear, getYear, getMonth } from 'date-fns';
import { SeawareApiClient } from './integrations/seaware/sdk/seaware-api-client';
import { SearchPanelControls } from './search-panel/controls';
import { SearchPanelFilter } from './search-panel/filter';
import { SearchPanelMonthPicker } from './search-panel/month-picker';
import { SearchPanelRenderer } from './search-panel/renderer';

class SearchPanel {
  searchForm = document.querySelector('#search-form');
  #monthPicker = new SearchPanelMonthPicker();
  #controls = new SearchPanelControls();
  #filter = new SearchPanelFilter(this);
  #renderer = new SearchPanelRenderer();
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

  prepareRenderData() {
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
    if (!this.searchForm) {
      return;
    }

    await this.#getAllVoyages();

    this.prepareRenderData();
    this.#renderer.render(this.renderData);

    this.#controls.init();

    this.#monthPicker.init(this.allDates);

    this.#filterAndUpdateOnDropdownClose();
  }

  #getAllVoyages() {
    const fromDateISO = formatISO(new Date(Date.now()));
    const toDateISO = formatISO(endOfYear(addYears(new Date(Date.now()), 2)));

    return this.#seawareApiClient
      .getAvailableVoyages(fromDateISO, toDateISO)
      .then(res => this.allVoyages = res.data.availableVoyages);
  }

  #filterAndUpdateOnDropdownClose() {
    document
      .querySelector('#search-form')
      .addEventListener('close-search-dropdown', () => {
        this.#filter.process();
      });
  }
}

export default new SearchPanel();