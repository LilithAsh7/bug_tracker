  let bug_id;

    // Delete bug function
  
    function deleteBug() {

      console.log("deleteBug() in updateBugsTable.js")
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
  
  async function openBugForm(mode){

    console.log("openBugForm() in updateBugsTable.js")
    
    if (mode === 'create') {
      var url = 'http://localhost:3000/bugForm?mode=create';
    } else {
      bug_id = prompt("Enter the id of the bug you would like to update:");
      if (bug_id === null || bug_id.trim() === '') {
        return;
      } else {
        const response = await fetch(`http://localhost:3000/bugs/${bug_id}`);
        let bugData = await response.json();
        bugData = bugData[0];
        if (!bugData) {
          return;
        } else {
          var url = `http://localhost:3000/bugForm?bug_id=${bug_id}&mode=update`;
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