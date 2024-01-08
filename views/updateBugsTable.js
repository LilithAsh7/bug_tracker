  let bug_id;

  // Define function to handle creating a bug
  function createBug(formValues) {

    // Construct bug data object
    const bugData = {
      bug_type: formValues.bug_type || null, 
      bug_description: formValues.bug_description || null,
      file: formValues.file || null,
      line: formValues.line || null,
      priority: formValues.priority || null,
      status: formValues.status || null,
      user_id: formValues.user_id || null,
      project_id: formValues.project_id || null,
      fixer_notes: formValues.fixer_notes || null,
      reason: formValues.reason || null,
    };

    // Stop server from crashing if fields are left empty
    if (!(bugData.bug_type || bugData.bug_description || bugData.priority || bugData.status || bugData.user_id || bugData.project_id)) {
      alert('One or more required fields left empty. Prompt canceled.');
      return;
    } else if (bugData.priority !== "low" && bugData.priority !== "medium" && bugData.priority !== "high") {
      alert('Incorrect priority input. Must be low, medium, or high Prompt canceled.');
      return;
    }
  
    // Make POST request to the server
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
        fetch(`http://localhost:3000/bugs/inactive/${bugIdToDelete}`, {
          method: 'PUT',
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
  function updateBug(formValues, bug_id) {

    const bugIdToUpdate = bug_id;
  
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
            // Construct bug data object
            const bugData = {
                bug_type: formValues.bug_type || null, 
                bug_description: formValues.bug_description || null,
                file: formValues.file || null,
                line: formValues.line || null,
                priority: formValues.priority || null,
                status: formValues.status || null,
                user_id: formValues.user_id || null,
                project_id: formValues.project_id || null,
                fixer_notes: formValues.fixer_notes || null,
                reason: formValues.reason || null,
            };

            // Stop server from crashing if fields are left empty
          if (!(bugData.bug_type || bugData.bug_description || bugData.priority || bugData.status || bugData.user_id || bugData.project_id)) {
            alert('One or more required fields left empty. Prompt canceled.');
            return;
          } else if (bugData.priority !== "low" && bugData.priority !== "medium" && bugData.priority !== "high") {
            alert('Incorrect priority input. Must be low, medium, or high Prompt canceled.');
            return;
          }
  
          // Make a PUT request to update the bug
          fetch(`http://localhost:3000/bugs/${bugIdToUpdate}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bugData),
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

  function submitForm() {
    
    const urlParams = new URLSearchParams(window.location.search);
    bug_id = urlParams.get('bug_id');
    let mode = urlParams.get('mode');
    
    // Create an object with all field values
    const formValues = {
      bug_type: document.getElementById('bug_type').value,
      bug_description: document.getElementById('bug_description').value,
      file: document.getElementById('file').value,
      line: document.getElementById('line').value,
      priority: document.getElementById('priority').value,
      status: document.getElementById('status').value,
      user_id: document.getElementById('user_id').value,
      project_id: document.getElementById('project_id').value,
      fixer_notes: document.getElementById('fixer_notes').value,
      reason: document.getElementById('reason').value
    };
  
    // Call correct function with the array of values
    if (mode === 'create') {
        createBug(formValues);
    } else if (mode === 'update') {
        updateBug(formValues, bug_id);
    }
  }
  
  function openBugForm(mode){
    
    if (mode === 'create') {
      var url = 'http://localhost:3000/bugForm?mode=create';
    } else {
      bug_id = prompt("Enter the id of the bug you would like to update:");
      if (bug_id === null || bug_id.trim() === '') {
        return;
      }
      var url = `http://localhost:3000/bugForm?bug_id=${bug_id}&mode=update`;
    }
    
    var newWindow = window.open(url, '_blank', 'scrollbars=yes,resizable=yes,width=500,height=400');
    if (newWindow) {
      newWindow.focus();
    }
  }