  // Define function to handle creating a project
  function createProject() {
    // Prompt the user for each field value
    const name = prompt("Enter project name: (Required)");
    const user_id = prompt("Enter your user_id: (Required)");


    // Stop server from crashing if a field is left empty
    if (!name || !user_id) {
      alert('One or more required fields left empty. Prompt canceled.');
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

        // Stop server from crashing if a field is left empty
        if (!name || !user_id) {
          alert('One or more required fields left empty. Prompt canceled.');
          return;
        }

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
