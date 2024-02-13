/*
 * File: userTable.js
 * Description: Contains functions for managing user table operations, such as opening user forms for creation or updating.
 * Author: Lilith Ashbury
 * Date: 2/13/2014
 */

let user_id;

async function openUserForm(mode){
  
  if (mode === 'create') {
    var url = '/userForm?mode=create';
  } else {
    user_id = prompt("Enter the id of the user you would like to update:");
    if (user_id === null || user_id.trim() === '') {
      return;
    } else {
      const response = await fetch(`/users/${user_id}`)
      let userData = await response.json();
      userData = userData[0]
      if (!userData) {
        return;
      } else {
        var url = `/userForm?user_id=${user_id}&mode=update`;
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