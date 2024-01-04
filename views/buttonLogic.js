function togglePopup() {
  const popup = document.getElementById('popup-container');
  popup.style.display = (popup.style.display === 'none' || popup.style.display === '') ? 'block' : 'none';
}

function submitForm() {
// Create an object with all field values
const formValues = {
  bug_type: document.getElementById('bug_type').value,
  bug_description: document.getElementById('bug_description').value,
  file: document.getElementById('file').value,
  line: document.getElementById('line').value,
  priority: document.getElementById('priority').value,
  status: document.getElementById('status').value,
  user_id: document.getElementById('user_id').value,
  project_id: document.getElementById('project_id').value,
  fixer_notes: document.getElementById('fixer_notes').value,
  reason: document.getElementById('reason').value
};

// Call createBug with the array of values
createBug(formValues);

// Close the popup
togglePopup();
}