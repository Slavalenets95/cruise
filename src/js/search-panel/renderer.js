import { format } from "date-fns";
import { enUS } from "date-fns/locale";

export class SearchPanelRenderer {
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

  render(renderData) {
    const { destinations, ports, dates } = renderData;

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
