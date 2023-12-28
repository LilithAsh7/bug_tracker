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

  // Define function to handle creating a bug
function createBug() {
  // Prompt the user for each field value
  const bug_type = prompt("Enter bug_type:");
  const bug_description = prompt("Enter bug_description:");
  const file = prompt("Enter file:");
  const line = prompt("Enter line:");
  const priority = prompt("Enter priority:");
  const status = prompt("Enter status:");
  const user_id = prompt("Enter user_id:");
  const project_id = prompt("Enter project_id:");
  const fixer_notes = prompt("Enter fixer_notes:");
  const reason = prompt("Enter reason:");

  // Check if the user canceled the prompt
  if (bug_type === null) {
    console.log('Prompt canceled.');
    return;
  }

  // Construct the bug data object
  const bugData = {
    bug_type: bug_type || null, // Use null if the field is empty
    bug_description: bug_description || null,
    file: file || null,
    line: line || null,
    priority: priority || null,
    status: status || null,
    user_id: user_id || null,
    project_id: project_id || null,
    fixer_notes: fixer_notes || null,
    reason: reason || null,
  };

  // Make a POST request to the server
  fetch('http://localhost:3000/bugs/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bugData),
  })
    .then(response => {
      if (response.ok) {
        console.log('Bug created successfully.');
        // Reload the dashboard page
        window.location.reload();
      } else {
        console.error('Failed to create bug.');
      }
    })
    .catch(error => console.error('Error creating bug:', error));
}

// Delete bug function

  function deleteBug() {
    // Prompt the user for bug_id
    const bugIdToDelete = prompt("Enter the bug_id of the bug you would like to delete:");
  
    if (bugIdToDelete !== null && bugIdToDelete !== "") {
      // Make a DELETE request to the server
      fetch(`http://localhost:3000/bugs/${bugIdToDelete}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            console.log(`Bug with bug_id ${bugIdToDelete} deleted successfully.`);
            // Reload the dashboard page
            window.location.reload();
          } else {
            console.error(`Failed to delete bug with bug_id ${bugIdToDelete}.`);
          }
        })
        .catch(error => console.error('Error deleting bug:', error));
    }
  }

// Define function to handle updating a bug
function updateBug() {
  // Prompt the user for the bug_id to update
  const bugIdToUpdate = prompt("Enter the bug_id of the bug you would like to update:");

  // Check if user canceled the prompt or entered an empty string
  if (bugIdToUpdate === null || bugIdToUpdate.trim() === '') {
    return;
  }

  // Fetch existing bug data from the server
  fetch(`http://localhost:3000/bugs/${bugIdToUpdate}`)
    .then(response => {
      if (!response.ok) {
        console.error(`Failed to fetch bug data for bug_id ${bugIdToUpdate}.`);
        return null;
      }
      return response.json();
    })
    .then(existingBugData => {
      if (existingBugData !== null) {
        // Prompt the user for each field value with pre-filled existing values
        const bug_type = prompt("Enter bug_type:", existingBugData.bug_type);
        const bug_description = prompt("Enter bug_description:", existingBugData.bug_description);
        const file = prompt("Enter file:", existingBugData.file);
        const line = prompt("Enter line:", existingBugData.line);
        const priority = prompt("Enter priority:", existingBugData.priority);
        const status = prompt("Enter status:", existingBugData.status);
        const user_id = prompt("Enter user_id:", existingBugData.user_id);
        const project_id = prompt("Enter project_id:", existingBugData.project_id);
        const fixer_notes = prompt("Enter fixer_notes:", existingBugData.fixer_notes);
        const reason = prompt("Enter reason:", existingBugData.reason);

        // Construct the updated bug data object
        const updatedBugData = {
          bug_type: bug_type || existingBugData.bug_type,
          bug_description: bug_description || existingBugData.bug_description,
          file: file || existingBugData.file,
          line: line || existingBugData.line,
          priority: priority || existingBugData.priority,
          status: status || existingBugData.status,
          user_id: user_id || existingBugData.user_id,
          project_id: project_id || existingBugData.project_id,
          fixer_notes: fixer_notes || existingBugData.fixer_notes,
          reason: reason || existingBugData.reason,
        };

        // Make a PUT request to update the bug
        fetch(`http://localhost:3000/bugs/${bugIdToUpdate}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedBugData),
        })
          .then(response => {
            if (response.ok) {
              console.log(`Bug with bug_id ${bugIdToUpdate} updated successfully.`);
              // Reload the dashboard page
              window.location.reload();
            } else {
              console.error(`Failed to update bug with bug_id ${bugIdToUpdate}.`);
            }
          })
          .catch(error => console.error('Error updating bug:', error));
      }
    })
    .catch(error => console.error('Error fetching bug data:', error));
}

  // Define function to handle creating a project
  function createProject() {
    // Prompt the user for each field value
    const name = prompt("Enter project name:");
    const user_id = prompt("Enter your user_id:");


    // Check if the user canceled the prompt
    if (name === null) {
      console.log('Prompt canceled.');
      return;
    }
  
    // Construct the project data object
    const projectData = {
      name: name || null, // Use null if the field is empty
      user_id: user_id || null,
    };
  
    // Make a POST request to the server
    fetch('http://localhost:3000/projects/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    })
      .then(response => {
        if (response.ok) {
          console.log('Project created successfully.');
          // Reload the dashboard page
          window.location.reload();
        } else {
          console.error('Failed to create project.');
        }
      })
      .catch(error => console.error('Error creating project:', error));
  }
  