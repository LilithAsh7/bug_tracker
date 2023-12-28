document.addEventListener('DOMContentLoaded', function () {
    fetchData('http://localhost:3000/bugs', 'table1');
    fetchData('http://localhost:3000/projects', 'table2');
    fetchData('http://localhost:3000/users', 'table3');
  });
  
  function fetchData(url, tableName) {
    fetch(url)
      .then(response => response.json())
      .then(data => populateTable(data, tableName))
      .catch(error => console.error('Error fetching data:', error));
  }
  
  function populateTable(data, tableName) {
    const table = document.getElementById(tableName);
    const headers = Object.keys(data[0]);
  
    // Create table header
    const headerRow = table.insertRow(0);
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
  
    // Create table rows
    data.forEach(rowData => {
      const row = table.insertRow();
      headers.forEach(header => {
        const cell = row.insertCell();
        cell.textContent = rowData[header];
      });
    });
  }