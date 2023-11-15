import { addYears, endOfYear } from 'date-fns';
import { SeawareApiClient } from './integrations/seaware/seaware-api-client';
import { SeawareSearchUrlBuilder } from './integrations/seaware/seaware-search-url-builder';
import { SearchPanelControls } from './search-panel/controls';
import { SearchPanelFilter } from './search-panel/filter';
import { SearchPanelMonthPicker } from './search-panel/month-picker';
import { SearchPanelRenderer } from './search-panel/renderer';

class SearchPanel {
  searchForm = document.querySelector('#search-form');
  #monthPicker = new SearchPanelMonthPicker();
  #controls = new SearchPanelControls(this.searchForm);
  #filter = new SearchPanelFilter(this);
  #renderer = new SearchPanelRenderer();
  #seawareApiClient = new SeawareApiClient();

  allVoyages = [];

  /**
   * @type { Map<string, { comment: string, key: string }[]> }
   */
  availableDestinations = new Map();

  /**
   * @type { Set<string> }
   */
  availableDates = new Set();

  /**
   * @type { Map<string, { name: string, code: string }[]> }
   */
  availablePorts = new Map();

  async make() {
    if (!this.searchForm) {
      return;
    }

    this.allVoyages = await this.#getAllVoyages();
    this.#setAvailabilities();

    this.#renderer.render(this.#getInitialRenderData());
    this.#controls.init();
    this.#monthPicker.init(this.availableDates);

    this.#filterAndUpdateOnDropdownClose();

    this.#toggleLoading();

    this.searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.#redirectToB2C();
    });
  }

  #getAllVoyages() {
    const searchYearPeriod = 2;
    const currentDate = new Date(Date.now());
    const toDate = endOfYear(addYears(currentDate, searchYearPeriod));

    return this.#seawareApiClient
      .getAvailableVoyages(currentDate, toDate)
      .then(({ availableVoyages }) => availableVoyages);
  }

  #setAvailabilities() {
    this.allVoyages.forEach((voyage) => {
      const {
        destinations,
        location: { from: port },
        vacation: { from: date },
      } = voyage.pkg;

      destinations.forEach((destination) => {
        const key = destination.key;
        const comment = destination.comments;

        this.availableDestinations.set(key, { key, comment });
      });

      this.availablePorts.set(port.code, port);

      this.availableDates.add(`${date.getFullYear()}-${date.getMonth() + 1}`);
    });
  }

  #getInitialRenderData() {
    return {
      destinations: [...this.availableDestinations.values()],
      ports: [...this.availablePorts.values()],
      dates: this.#getInitialRenderDates(),
    };
  }

  #getInitialRenderDates() {
    const voyageDates = this.allVoyages.map(({ pkg }) => pkg.vacation.from);
    const minVoyageDate = new Date(Math.min.apply(null, voyageDates));
    const endDate = addYears(minVoyageDate, 1);

    const initialDates = {};
    for (let year = minVoyageDate.getFullYear(); year <= endDate.getFullYear(); year++) {
      initialDates[year] = [];

      for (let month = 1; month <= 12; month++) {
        initialDates[year].push(`${year}-${month}`);
      }
    }

    return initialDates;
  }

  #filterAndUpdateOnDropdownClose() {
    this.searchForm.addEventListener('close-search-dropdown', () => {
      this.#filter.process();
    });
  }

  #toggleLoading() {
    this.searchForm.classList.toggle('loading');
  }

  #redirectToB2C() {
    const { destinations, ports, dates, ...guests } = this.#filter.getFormData();
    
    const fromDate = dates[0] && new Date(dates[0]);

    const toDateString = dates[dates.length - 1];
    const toDate = toDateString && new Date(toDateString);

    const redirectUrlBuilder = new SeawareSearchUrlBuilder()
      .withDestinations(destinations)
      .withPorts(ports)
      .withDates(fromDate, toDate)
      .withGuest(guests)
      .build();

    window.open(redirectUrlBuilder);
  };
}

export default new SearchPanel();
