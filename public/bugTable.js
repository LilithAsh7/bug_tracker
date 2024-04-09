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

document.getElementById('completed').addEventListener('click', function() {
  updateTableByStatus('completed');
});

document.getElementById('all').addEventListener('click', function() {
  updateTableByStatus('all');
});

document.getElementById('rejected').addEventListener('click', function() {
  updateTableByStatus('rejected');
});

document.getElementById('pending').addEventListener('click', function() {
  updateTableByStatus('pending');
});

document.addEventListener('DOMContentLoaded', function() {
  const dropdownOptions = document.querySelectorAll('.dropdown-content a');

  dropdownOptions.forEach((option, index) => {
    option.addEventListener('click', function(event) {
      event.preventDefault();
      const projectId = event.target.id; // This will be like "project1", "project2", etc.
      console.log(projectId);
      //updateTableByProjectId(projectId);
    });
  });
});