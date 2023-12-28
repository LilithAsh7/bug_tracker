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
  const bug_type = prompt("Enter bug_type: (Required)");
  const bug_description = prompt("Enter bug_description: (Required)");
  const file = prompt("Enter file:");
  const line = prompt("Enter line:");
  const priority = prompt("Enter priority: (Required)");
  const status = prompt("Enter status: (Required)");
  const user_id = prompt("Enter user_id: (Required)");
  const project_id = prompt("Enter project_id: (Required)");
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
        const bug_type = prompt("Enter bug_type: (Required)", existingBugData.bug_type);
        const bug_description = prompt("Enter bug_description: (Required)", existingBugData.bug_description);
        const file = prompt("Enter file:", existingBugData.file);
        const line = prompt("Enter line:", existingBugData.line);
        const priority = prompt("Enter priority: (Required)", existingBugData.priority);
        const status = prompt("Enter status: (Required)", existingBugData.status);
        const user_id = prompt("Enter user_id: (Required)", existingBugData.user_id);
        const project_id = prompt("Enter project_id: (Required)", existingBugData.project_id);
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
    const name = prompt("Enter project name: (Required)");
    const user_id = prompt("Enter your user_id: (Required)");


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

  // Delete project function

  function deleteProject() {
    // Prompt the user for id
    const projectIdToDelete = prompt("Enter the id of the project you would like to delete:");
  
    if (projectIdToDelete !== null && projectIdToDelete !== "") {
      // Make a DELETE request to the server
      fetch(`http://localhost:3000/projects/${projectIdToDelete}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            console.log(`Project with id ${projectIdToDelete} deleted successfully.`);
            // Reload the dashboard page
            window.location.reload();
          } else {
            console.error(`Failed to delete project with id ${projectIdToDelete}.`);
          }
        })
        .catch(error => console.error('Error deleting project:', error));
    }
  }

  // Define function to handle updating a project
function updateProject() {
  // Prompt the user for the id to update
  const projectIdToUpdate = prompt("Enter the id of the project you would like to update:");

  // Check if user canceled the prompt or entered an empty string
  if (projectIdToUpdate === null || projectIdToUpdate.trim() === '') {
    return;
  }

  // Fetch existing project data from the server
  fetch(`http://localhost:3000/projects/${projectIdToUpdate}`)
    .then(response => {
      if (!response.ok) {
        console.error(`Failed to fetch project data for id ${projectIdToUpdate}.`);
        return null;
      }
      return response.json();
    })
    .then(existingProjectData => {
      if (existingProjectData !== null) {
        // Prompt the user for each field value with pre-filled existing values
        const name = prompt("Enter name: (Required)", existingProjectData.name);
        const user_id = prompt("Enter user_id: (Required)", existingProjectData.user_id);

        // Construct the updated project data object
        const updatedProjectData = {
          name: name || existingProjectData.name,
          user_id: user_id || existingProjectData.user_id
        };

        // Make a PUT request to update the project
        fetch(`http://localhost:3000/projects/${projectIdToUpdate}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProjectData),
        })
          .then(response => {
            if (response.ok) {
              console.log(`Project with id ${projectIdToUpdate} updated successfully.`);
              // Reload the dashboard page
              window.location.reload();
            } else {
              console.error(`Failed to update project with id ${projectIdToUpdate}.`);
            }
          })
          .catch(error => console.error('Error updating project:', error));
      }
    })
    .catch(error => console.error('Error fetching project data:', error));
}

  // Define function to handle creating a user
  function createUser() {
    // Prompt the user for each field value
    const username = prompt("Enter username: (Required)");
    const password = prompt("Enter your password: (Required)");


    // Check if the user canceled the prompt
    if (username === null) {
      console.log('Prompt canceled.');
      return;
    }
  
    // Construct the user data object
    const userData = {
      username: username || null, // Use null if the field is empty
      password: password || null
    };
  
    // Make a POST request to the server
    fetch('http://localhost:3000/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => {
        if (response.ok) {
          console.log('User created successfully.');
          // Reload the dashboard page
          window.location.reload();
        } else {
          console.error('Failed to create user.');
        }
      })
      .catch(error => console.error('Error creating user:', error));
  }

  // Delete user function

  function deleteUser() {
    // Prompt the user for id
    const userIdToDelete = prompt("Enter the id of the user you would like to delete:");
  
    if (userIdToDelete !== null && userIdToDelete !== "") {
      // Make a DELETE request to the server
      fetch(`http://localhost:3000/users/${userIdToDelete}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            console.log(`User with id ${userIdToDelete} deleted successfully.`);
            // Reload the dashboard page
            window.location.reload();
          } else {
            console.error(`Failed to delete user with id ${userIdToDelete}.`);
          }
        })
        .catch(error => console.error('Error deleting user:', error));
    }
  }

  // Define function to handle updating a user
function updateUser() {
  // Prompt the user for the id to update
  const userIdToUpdate = prompt("Enter the id of the user you would like to update:");

  // Check if user canceled the prompt or entered an empty string
  if (userIdToUpdate === null || userIdToUpdate.trim() === '') {
    return;
  }

  // Fetch existing user data from the server
  fetch(`http://localhost:3000/users/${userIdToUpdate}`)
    .then(response => {
      if (!response.ok) {
        console.error(`Failed to fetch user data for id ${userIdToUpdate}.`);
        return null;
      }
      return response.json();
    })
    .then(existingUserData => {
      if (existingUserData !== null) {
        // Prompt the user for each field value with pre-filled existing values
        const username = prompt("Enter username: (Required)", existingUserData.username);
        const password = prompt("Enter password: (Required)", existingUserData.password);

        // Construct the updated user data object
        const updatedUserData = {
          username: username || existingUserData.username,
          password: password || existingUserData.password
        };

        // Make a PUT request to update the user
        fetch(`http://localhost:3000/users/${userIdToUpdate}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUserData),
        })
          .then(response => {
            if (response.ok) {
              console.log(`User with id ${userIdToUpdate} updated successfully.`);
              // Reload the dashboard page
              window.location.reload();
            } else {
              console.error(`Failed to update user with id ${userIdToUpdate}.`);
            }
          })
          .catch(error => console.error('Error updating user:', error));
      }
    })
    .catch(error => console.error('Error fetching user data:', error));
}