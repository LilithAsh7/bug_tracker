// Define function to handle creating a bug
async function createBug(formValues) {

    console.log("createBug() in updateBugsTable.js")
    console.log(formValues.csrf);
    // Construct bug data object
    const bugData = {
      bug_type: formValues.bug_type || null, 
      bug_description: formValues.bug_description || null,
      file: formValues.file || null,
      line: formValues.line || null,
      priority: formValues.priority || null,
      status: formValues.status || null,
      project_id: formValues.project_id || null,
      fixer_notes: formValues.fixer_notes || null,
      reason: formValues.reason || null,
    };

    // Stop server from crashing if fields are left empty
    if (!(bugData.bug_type || bugData.bug_description || bugData.priority || bugData.status || bugData.project_id)) {
      alert('One or more required fields left empty. Prompt canceled.');
      return;
    } else if (bugData.priority !== "low" && bugData.priority !== "medium" && bugData.priority !== "high") {
      alert('Incorrect priority input. Must be low, medium, or high Prompt canceled.');
      return;
    }
  
    // Make POST request to the server
    await fetch(`/bugs/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': formValues.csrf
      },
      body: JSON.stringify(bugData),
    })
      .then(response => {
        if (response.ok) {
          console.log('Bug created successfully.');
          // close the dashboard page
          window.close()
        } else {
          console.error('Failed to create bug.');
        }
      })
      .catch(error => console.error('Error creating bug:', error));
}

// Define function to handle updating a bug
async function updateBug(formValues, bug_id) {

    console.log("updateBug() in updateBugsTable.js")

    const bugIdToUpdate = bug_id;

    // Fetch existing bug data from the server
    await fetch(`/bugs/${bugIdToUpdate}`)
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
                project_id: formValues.project_id || null,
                fixer_notes: formValues.fixer_notes || null,
                reason: formValues.reason || null,
            };

            // Stop server from crashing if fields are left empty
            if (!(bugData.bug_type || bugData.bug_description || bugData.priority || bugData.status || bugData.project_id)) {
            alert('One or more required fields left empty. Prompt canceled.');
            return;
            } else if (bugData.priority !== "low" && bugData.priority !== "medium" && bugData.priority !== "high") {
            alert('Incorrect priority input. Must be low, medium, or high Prompt canceled.');
            return;
            }

            // Make a PUT request to update the bug
            fetch(`/bugs/${bugIdToUpdate}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': formValues.csrf
            },
            body: JSON.stringify(bugData),
            })
            .then(response => {
                if (response.ok) {
                console.log(`Bug with bug_id ${bugIdToUpdate} updated successfully.`);
                window.close()
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

    event.preventDefault();

    console.log("submitForm() in updateBugsTable.js");
    
    const urlParams = new URLSearchParams(window.location.search);
    let bug_id = urlParams.get('bug_id');
    let mode = urlParams.get('mode');
    
    // Create an object with all field values
    const formValues = {
      bug_type: document.getElementById('bug_type').value,
      bug_description: document.getElementById('bug_description').value,
      file: document.getElementById('file').value,
      line: document.getElementById('line').value,
      priority: document.getElementById('priority').value,
      status: document.getElementById('status').value,
      project_id: document.getElementById('project_id').value,
      fixer_notes: document.getElementById('fixer_notes').value,
      reason: document.getElementById('reason').value,
      csrf:document.getElementsByName('_csrf')[0].value
    };
    console.log(formValues.csrf);
    // Call correct function with the array of values
    if (mode === 'create') {
        createBug(formValues);
    } else if (mode === 'update') {
        updateBug(formValues, bug_id);
    }

    return false;
}

document.getElementById('submitForm').addEventListener('click', function() {
    submitForm();
});

document.addEventListener('DOMContentLoaded', async function () {
    
    // Extract bug_id from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const bug_id = urlParams.get('bug_id');

    // Call the getBugById function if bug_id is available
    if (bug_id) {
        const response = await fetch(`/bugs/${bug_id}`)
        let bugData = await response.json();
        bugData = bugData[0]
        console.log(bugData);

        // Check if bugData is not null and set form values
        if (bugData) {
        const form = document.getElementById('bugForm');
        const bugTypeValue = bugData.bug_type;
        const bugTypeSelect = document.getElementById('bug_type');
        const priorityValue = bugData.priority;
        const prioritySelect = document.getElementById('priority')
        const statusValue = bugData.status;
        const statusSelect = document.getElementById('status')
        console.log(bugData.bug_type);

        // Set values for each form field
        for (var i = 0; i < bugTypeSelect.options.length; i++) {
            if (bugTypeSelect.options[i].value === bugTypeValue) {
            bugTypeSelect.options[i].selected = true;
            break;
            }
        }
        form.elements['bug_description'].value = bugData.bug_description || '';
        form.elements['file'].value = bugData.file || '';
        form.elements['line'].value = bugData.line || '';
        for (var i = 0; i < prioritySelect.options.length; i++) {
            if (prioritySelect.options[i].value === priorityValue) {
            prioritySelect.options[i].selected = true;
            break;
            }
        }
        for (var i = 0; i < statusSelect.options.length; i++) {
            if (statusSelect.options[i].value === statusValue) {
            statusSelect.options[i].selected = true;
            break;
            }
        }
        form.elements['status'].value = bugData.status || '';
        form.elements['project_id'].value = bugData.project_id || '';
        form.elements['fixer_notes'].value = bugData.fixer_notes || '';
        form.elements['reason'].value = bugData.reason || '';
        }
    }
});