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
        'CSRF-Token': formValues.csrf
      },
      body: JSON.stringify(projectData),
    })
      .then(response => {
        if (response.ok) {
          console.log('Project created successfully.');
          // Reload the dashboard page
          window.close()
        } else {
          console.error('Failed to create project.');
        }
      })
      .catch(error => console.error('Error creating project:', error));
  }

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
              'CSRF-Token': formValues.csrf
            },
            body: JSON.stringify(projectData),
          })
            .then(response => {
              if (response.ok) {
                console.log(`Project with id ${projectIdToUpdate} updated successfully.`);
                // Reload the dashboard page
                window.close()
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
    
    event.preventDefault();
    
    const urlParams = new URLSearchParams(window.location.search);
    let project_id = urlParams.get('project_id');
    let mode = urlParams.get('mode');
    
    // Create an object with all field values
    const formValues = {
      name: document.getElementById('name').value,
      csrf:document.getElementsByName('_csrf')[0].value
    };
  
    // Call correct function with the array of values
    if (mode === 'create') {
        createProject(formValues);
    } else if (mode === 'update') {
        updateProject(formValues, project_id);
    }
  }

document.getElementById('submitForm').addEventListener('click', function() {
    submitForm();
});

document.addEventListener('DOMContentLoaded', async function () {
    // Extract project_id from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const project_id = urlParams.get('project_id');

    // Call the getprojectById function if project_id is available
    if (project_id) {
      const response = await fetch(`http://localhost:3000/projects/${project_id}`)
      let projectData = await response.json();
      projectData = projectData[0]
      console.log(projectData);

      // Check if projectData is not null and set form values
      if (projectData) {
        const form = document.getElementById('projectForm');
        console.log(projectData.name);

        // Set values for each form field
        form.elements['name'].value = projectData.name;

      }
    }
  });