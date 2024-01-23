  let user_id;

async function openUserForm(mode){
  
  if (mode === 'create') {
    var url = 'http://localhost:3000/userForm?mode=create';
  } else {
    user_id = prompt("Enter the id of the user you would like to update:");
    if (user_id === null || user_id.trim() === '') {
      return;
    } else {
      const response = await fetch(`http://localhost:3000/users/${user_id}`)
      let userData = await response.json();
      userData = userData[0]
      if (!userData) {
        return;
      } else {
        var url = `http://localhost:3000/userForm?user_id=${user_id}&mode=update`;
      }
    }
  }
  
  var newWindow = window.open(url, '_blank', 'scrollbars=yes,resizable=yes,width=400,height=200');
  if (newWindow) {
    newWindow.focus();
  }
}

document.getElementById('createUser').addEventListener('click', function() {
  openUserForm('create');
});

document.getElementById('updateUser').addEventListener('click', function() {
  openUserForm('update');
});

document.getElementById('reload').addEventListener('click', function() {
  reloadData('users');
});