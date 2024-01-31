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
    fetch('/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': formValues.csrf
      },
      body: JSON.stringify(userData),
    })
      .then(response => {
        if (response.ok) {
          console.log('User created successfully.');
          // Reload the dashboard page
          window.close()
        } else {
          console.error('Failed to create user.');
        }
      })
      .catch(error => console.error('Error creating user:', error));
  }

  // Define function to handle updating a user
function updateUser(formValues, user_id) {

  const userIdToUpdate = user_id;

  // Fetch existing user data from the server
  fetch(`/users/${userIdToUpdate}`)
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
        fetch(`/users/${userIdToUpdate}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': formValues.csrf
          },
          body: JSON.stringify(userData),
        })
          .then(response => {
            if (response.ok) {
              console.log(`User with id ${userIdToUpdate} updated successfully.`);
              // Reload the dashboard page
              window.close()
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
    
  event.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  user_id = urlParams.get('user_id');
  let mode = urlParams.get('mode');
  
  // Create an object with all field values
  const formValues = {
    username: document.getElementById('username').value,
    password: document.getElementById('password').value,
    csrf:document.getElementsByName('_csrf')[0].value
  };

  // Call correct function with the array of values
  if (mode === 'create') {
      createUser(formValues);
  } else if (mode === 'update') {
      updateUser(formValues, user_id);
  }
}

document.getElementById('submitForm').addEventListener('click', function() {
    submitForm();
});

document.addEventListener('DOMContentLoaded', async function () {
    // Extract user_id from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const user_id = urlParams.get('user_id');

    // Call the getuserById function if user_id is available
    if (user_id) {
      const response = await fetch(`/users/${user_id}`)
      let userData = await response.json();
      userData = userData[0]
      console.log(userData);

      // Check if userData is not null and set form values
      if (userData) {
        const form = document.getElementById('userForm');
        console.log(userData.username);

        // Set values for each form field
        form.elements['username'].value = userData.username;
      }
    }
  });