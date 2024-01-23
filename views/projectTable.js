  let project_id;

async function openProjectForm(mode){
  
  if (mode === 'create') {
    var url = 'http://localhost:3000/projectForm?mode=create';
  } else {
    project_id = prompt("Enter the id of the project you would like to update:");
    if (project_id === null || project_id.trim() === '') {
      return;
    } else {
      const response = await fetch(`http://localhost:3000/projects/${project_id}`);
      let projectData = await response.json();
      projectData = projectData[0];
      if (!projectData) {
        return;
      } else {
        var url = `http://localhost:3000/projectForm?project_id=${project_id}&mode=update`;
      }
    }
  }
  
  var newWindow = window.open(url, '_blank', 'scrollbars=yes,resizable=yes,width=400,height=200');
  if (newWindow) {
    newWindow.focus();
  }
}

document.getElementById('createProject').addEventListener('click', function() {
  openProjectForm('create');
});

document.getElementById('updateProject').addEventListener('click', function() {
  openProjectForm('update');
});

document.getElementById('reload').addEventListener('click', function() {
  reloadData('projects');
});
