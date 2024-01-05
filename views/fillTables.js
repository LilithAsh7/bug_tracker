// Creates listener and performs the following fetchData functions
document.addEventListener('DOMContentLoaded', function () {
    // Calls the below fetchData function 3 times. Once for each table.
    fetchData('http://localhost:3000/bugs', 'table1');
    fetchData('http://localhost:3000/projects', 'table2');
    fetchData('http://localhost:3000/users', 'table3');
  });
  
  // fetchData takes a url and a table name, runs the 
  function fetchData(url, tableName) {
    // fetch engages an asynchronous http request using the provided url.
    fetch(url)
      // Populates the table with the given tablename with the populateTable function
      .then(response => response.json())
      .then(data => populateTable(data, tableName))
      // Error handling
      .catch(error => console.error('Error fetching data:', error));
  }
  
  // Populates html table with given data
  // the data variable is an array of objects and tableName is the name of the table to be populated from the data.
  function populateTable(data, tableName) {
    const table = document.getElementById(tableName);
    // Gets table headers (categories)
    const headers = Object.keys(data[0]);
  
    // Create table header
    const headerRow = table.insertRow(0);
    // Iterates through headers and creates table cell for each
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
  
    // Create table rows
    data.forEach(rowData => {
      // Insert new row for each set of data
      const row = table.insertRow();
      // Iterates through headers and populates cells with corresponding data
      headers.forEach(header => {
        const cell = row.insertCell();
        cell.textContent = rowData[header];
      });
    });
  }