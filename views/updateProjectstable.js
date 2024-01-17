  let project_id;
  
  // Define function to handle creating a project
  function createProject(formValues) {

    // Construct project data object
    const projectData = {
      name: formValues.name || null, 
    };

    // Stop server from crashing if a field is left empty
    if (!(projectData.name)) {
      alert('One or more required fields left empty. Prompt canceled.');
      return;
    }
  
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
function updateProject(formValues, project_id) {

  const projectIdToUpdate = project_id;

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
        // Construct project data object
        const projectData = {
          name: formValues.name || null, 
        };

        // Stop server from crashing if a field is left empty
        if (!(projectData.name)) {
          alert('One or more required fields left empty. Prompt canceled.');
          return;
        }

        // Make a PUT request to update the project
        fetch(`http://localhost:3000/projects/${projectIdToUpdate}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
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

function submitForm() {
    
  const urlParams = new URLSearchParams(window.location.search);
  project_id = urlParams.get('project_id');
  let mode = urlParams.get('mode');
  
  // Create an object with all field values
  const formValues = {
    name: document.getElementById('name').value,
  };

  // Call correct function with the array of values
  if (mode === 'create') {
      createProject(formValues);
  } else if (mode === 'update') {
      updateProject(formValues, project_id);
  }
}

function openProjectForm(mode){
  
  if (mode === 'create') {
    var url = 'http://localhost:3000/projectForm?mode=create';
  } else {
    project_id = prompt("Enter the id of the project you would like to update:");
    if (project_id === null || project_id.trim() === '') {
      return;
    }
    var url = `http://localhost:3000/projectForm?project_id=${project_id}&mode=update`;
  }
  
  var newWindow = window.open(url, '_blank', 'scrollbars=yes,resizable=yes,width=400,height=200');
  if (newWindow) {
    newWindow.focus();
  }
}
