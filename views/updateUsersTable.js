  // Define function to handle creating a user
  function createUser() {
    // Prompt the user for each field value
    const username = prompt("Enter username: (Required)");
    const password = prompt("Enter your password: (Required)");

    // Prevent server from crashing when prompts left empty
    if (!username || !password) {
      alert('One or more fields left blank. Prompt canceled.');
      return;
    }
  
    // Construct the user data object
    const userData = {
      username: username || null, // Use null if the field is empty
      password: password || null
    };
  
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
function updateUser() {
  // Prompt the user for the id to update
  const userIdToUpdate = prompt("Enter the id of the user you would like to update:");

  // Check if user canceled the prompt or entered an empty string
  if (userIdToUpdate === null || userIdToUpdate.trim() === '') {
    return;
  }

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
        // Prompt the user for each field value with pre-filled existing values
        const username = prompt("Enter username: (Required)", existingUserData.username);
        const password = prompt("Enter password: (Required)", existingUserData.password);

        // Prevent server from crashing when prompts left empty
        if (!username || !password) {
          alert('One or more fields left blank. Prompt canceled.');
          return;
        }

        // Construct the updated user data object
        const updatedUserData = {
          username: username || existingUserData.username,
          password: password || existingUserData.password
        };

        // Make a PUT request to update the user
        fetch(`http://localhost:3000/users/${userIdToUpdate}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUserData),
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