function openNewTab(route) {
    const url = window.location.origin + route;
    window.open(url, '_blank');
}

document.getElementById('bugsButton').addEventListener('click', function() {
    openNewTab('/bugTable');
});

document.getElementById('projectsButton').addEventListener('click', function() {
    openNewTab('/projectTable');
});

document.getElementById('usersButton').addEventListener('click', function() {
    openNewTab('/userTable');
});