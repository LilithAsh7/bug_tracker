  let user_id;
  
  // Define function to handle creating a user
  function createUser(formValues) {
   
    // Construct user data object
    const userData = {
      username: formValues.username || null, 
      password: formValues.password || null
    };

    // Prevent server from crashing when prompts left empty
    if (!(userData.username || userData.password)) {
      alert('One or more fields left blank. Prompt canceled.');
      return;
    }
  
    // Make a POST request to the server
    fetch('http://localhost:3000/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => {
        if (response.ok) {
          console.log('User created successfully.');
          // Reload the dashboard page
          window.location.reload();
        } else {
          console.error('Failed to create user.');
        }
      })
      .catch(error => console.error('Error creating user:', error));
  }

  // Delete user function
  function deleteUser() {
    // Prompt the user for id
    const userIdToDelete = prompt("Enter the id of the user you would like to delete:");
  
    if (userIdToDelete !== null && userIdToDelete !== "") {
      // Make a DELETE request to the server
      fetch(`http://localhost:3000/users/${userIdToDelete}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            console.log(`User with id ${userIdToDelete} deleted successfully.`);
            // Reload the dashboard page
            window.location.reload();
          } else {
            console.error(`Failed to delete user with id ${userIdToDelete}.`);
          }
        })
        .catch(error => console.error('Error deleting user:', error));
    }
  }

  // Define function to handle updating a user
function updateUser(formValues, user_id) {

  const userIdToUpdate = user_id;

  // Fetch existing user data from the server
  fetch(`http://localhost:3000/users/${userIdToUpdate}`)
    .then(response => {
      if (!response.ok) {
        console.error(`Failed to fetch user data for id ${userIdToUpdate}.`);
        return null;
      }
      return response.json();
    })
    .then(existingUserData => {
      if (existingUserData !== null) {
        // Construct user data object
        const userData = {
          username: formValues.username || null, 
          password: formValues.password || null
        };
        // Prevent server from crashing when prompts left empty
        if (!(userData.username || userData.password)) {
          alert('One or more fields left blank. Prompt canceled.');
          return;
        }

        // Make a PUT request to update the user
        fetch(`http://localhost:3000/users/${userIdToUpdate}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
          .then(response => {
            if (response.ok) {
              console.log(`User with id ${userIdToUpdate} updated successfully.`);
              // Reload the dashboard page
              window.location.reload();
            } else {
              console.error(`Failed to update user with id ${userIdToUpdate}.`);
            }
          })
          .catch(error => console.error('Error updating user:', error));
      }
    })
    .catch(error => console.error('Error fetching user data:', error));
}

function submitForm() {
    
  const urlParams = new URLSearchParams(window.location.search);
  user_id = urlParams.get('user_id');
  let mode = urlParams.get('mode');
  
  // Create an object with all field values
  const formValues = {
    username: document.getElementById('username').value,
    password: document.getElementById('password').value
  };

  // Call correct function with the array of values
  if (mode === 'create') {
      createUser(formValues);
  } else if (mode === 'update') {
      updateUser(formValues, user_id);
  }
}

function openUserForm(mode){
  
  if (mode === 'create') {
    var url = 'http://localhost:3000/userForm?mode=create';
  } else {
    user_id = prompt("Enter the id of the user you would like to update:");
    if (user_id === null || user_id.trim() === '') {
      return;
    }
    var url = `http://localhost:3000/userForm?user_id=${user_id}&mode=update`;
  }
  
  var newWindow = window.open(url, '_blank', 'scrollbars=yes,resizable=yes,width=400,height=200');
  if (newWindow) {
    newWindow.focus();
  }
}