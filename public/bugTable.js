let bug_id;

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