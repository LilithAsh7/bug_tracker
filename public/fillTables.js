/*
 * File: fillTables.js
 * Description: Contains functions for updating and populating HTML tables with data fetched from the server.
 * Author: Lilith Ashbury
 * Date: 2/13/2024
 */

function updateTableByStatus(status) {
  fetchData(status, '/bugs/status/', 'table1');

  document.getElementById('statusDropdownBtn').textContent = `Status: ${status}`;
}

function updateTableByStatusProjectId(status, project_id) {
  fetchData(status, project_id, '/bugs/statusprojectid/', 'table1');

  document.getElementById('projectDropdownBtn').textContent = `Project ID: ${project_id}`;
}

function reloadData(table) {
  if (table === 'bugs'){
    fetchData('all', '/bugs/statusprojectid/', 'table1');
  } else if (table === 'projects') {
    fetchData(null, '/projects', 'table2');
  } else if (table === 'users') {
    fetchData(null, '/users', 'table3');
  }
}

// Creates listener and performs the following fetchData functions
document.addEventListener('DOMContentLoaded', function () {
    
  const bugsTable = document.getElementById('bugsTable');
  const projectsTable = document.getElementById('projectsTable');
  const usersTable = document.getElementById('usersTable');
  // Calls the below fetchData function 3 times. Once for each table.
    if (bugsTable) {
    console.log("Loading bug table");
    fetchData('all', 'all', '/bugs/statusprojectid/', 'table1');
    } else if (projectsTable) {
    console.log("Loading projects table");
    fetchData(null, null, '/projects', 'table2');
    } else if (usersTable) {
    console.log("Loading users table");
    fetchData(null, null, '/users', 'table3');
    }
  });
  
  // fetchData takes a url and a table name, runs the
  function fetchData(status, project_id, url, tableName) {

    console.log(status);
    console.log(project_id);

    if (status) {
    url = url + status + '/' + project_id
    };
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
    
      // Clear existing rows
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
    
    // Gets table headers (categories)
    const headers = Object.keys(data[0]);
  
    // Create table header
    if (table.rows.length === 0) {
      const headerRow = table.insertRow(0);
      // Iterates through headers and creates table cell for each
      headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
      });
    }
  
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