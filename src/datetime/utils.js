export function getMonths(locale = 'en') {
  const intl = new Intl.DateTimeFormat(locale, { month: 'long' });
  const months = [];

  for (let month = 0; month < 12; month += 1) {
    months.push(intl.format(new Date(Date.UTC(2000, month, 1, 0, 0, 0))));
  }

  return months;
}

export function getDays(locale = 'en') {
  const intl = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const days = [];

  for (let day = 2; day < 9; day += 1) {
    days.push(intl.format(new Date(Date.UTC(2000, 0, day, 0, 0, 0))));
  }

  return days;
}

export function createCalendar(year, month) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const row = document.createElement('tr');

  const startOfMonth = new Date(year, month).getDay();
  const numOfDays = new Date(year, month + 1, 0).getDate();

  table.append(thead, tbody);
  thead.append(row);

  for (const day of getDays()) {
    const th = document.createElement('th');
    th.textContent = day;

    row.append(th);
  }

  let current = 1;

  for (let i = 0; i < 6; i += 1) {
    const tr = document.createElement('tr');

    for (let x = 0; x < 7; x += 1) {
      const td = document.createElement('td');

      if (i === 0 && x < startOfMonth) {
        td.classList.add('empty');
      } else if (current > numOfDays) {
        break;
      } else {
        td.textContent = current;
        current += 1;
      }

      tr.append(td);
    }

    tbody.append(tr);
  }

  return table;
}
