/*
 * File: bugTable.js
 * Description: Contains functions for managing bug table operations, such as opening bug forms for creation or updating.
 * Author: Lilith Ashbury
 * Date: 2/13/2024
 */

let bug_id;

// Prompt the user to input a bug number
document.getElementById('deleteBug').addEventListener('click', function() {
  // Prompt the user to input a bug number
  var bugNumber = prompt("Enter the bug number you want to delete:");

  // Check if the user entered a bug number
  if (bugNumber !== null && bugNumber.trim() !== "") {
      // Construct the URL with the bug number
      var url = '/bugs/' + bugNumber.trim();

      // Send a DELETE request
      fetch(url, {
          method: 'DELETE'
      })
      .then(response => {
          if (response.ok) {
              alert('Bug ' + bugNumber + ' deleted successfully.');
          } else {
              throw new Error('Failed to delete bug ' + bugNumber);
          }
      })
      .catch(error => {
          console.error('Error:', error);
          alert('Failed to delete bug ' + bugNumber + '. Please try again later.');
      });
  } else {
      alert('Please enter a valid bug number.');
  }
});

  async function openBugForm(mode){

    console.log("openBugForm() in updateBugsTable.js")
    
    if (mode === 'create') {
      var url = `/bugForm?mode=create`;
    } else {
      bug_id = prompt("Enter the id of the bug you would like to update:");
      if (bug_id === null || bug_id.trim() === '') {
        return;
      } else {
        const response = await fetch(`/bugs/${bug_id}`);
        let bugData = await response.json();
        bugData = bugData[0];
        if (!bugData) {
          return;
        } else {
          var url = `/bugForm?bug_id=${bug_id}&mode=update`;
        }
      }
    }
    
    var newWindow = window.open(url, '_blank', 'scrollbars=yes,resizable=yes,width=500,height=400');
    if (newWindow) {
      newWindow.focus();
    }
  }

document.getElementById('createBug').addEventListener('click', function() {
  openBugForm('create');
});

document.getElementById('updateBug').addEventListener('click', function() {
  openBugForm('update');
});

document.getElementById('reload').addEventListener('click', function() {
  reloadData('bugs');
});

// Add event listener to the parent element containing the dropdown items
document.getElementById('projectDropdownBtn').addEventListener('click', function() {
  // Toggle the dropdown content
  document.getElementById('projectDropdown').classList.toggle('show');
});

// Add event listener to handle clicks on status dropdown items
document.querySelector('.status-dropdown .dropdown-content').addEventListener('click', function(event) {
  if (event.target.tagName === 'A') {
      // Extract the selected status value
      const selectedStatus = event.target.id;

      // Update the status dropdown button text
      document.getElementById('statusDropdownBtn').textContent = `Status: ${selectedStatus}`;

      // Get the selected project ID from the project dropdown button text
      const selectedProjectId = document.getElementById('projectDropdownBtn').textContent.split(': ')[1];

      // Call the updateTableByStatusProjectId function with the selected status and project ID
      updateTableByStatusProjectId(selectedStatus, selectedProjectId);
  }
});

// Add event listener to handle clicks on project dropdown items
document.querySelector('.project-dropdown .dropdown-content').addEventListener('click', function(event) {
  if (event.target.tagName === 'A') {
      // Extract the selected project ID
      const selectedProjectId = event.target.id;

      // Update the project dropdown button text
      document.getElementById('projectDropdownBtn').textContent = `Project: ${selectedProjectId === 'all' ? 'All' : selectedProjectId}`;

      // Get the selected status from the status dropdown button text
      const selectedStatus = document.getElementById('statusDropdownBtn').textContent.split(': ')[1];

      // Call the updateTableByStatusProjectId function with the selected status and project ID
      updateTableByStatusProjectId(selectedStatus, selectedProjectId);
  }
});