/*
 * File: mainMenuLogic.js
 * Description: Contains functions for opening new tabs and adding event listeners based on the current page.
 * Author: Lilith Ashbury
 * Date: 2/13/2024
 */

function openNewTab(route) {
    const url = window.location.origin + route;
    window.open(url, '_blank');
}

function addEventListenersBasedOnPage() {
    // Check if bugsButton exists
    const bugsButton = document.getElementById('bugsButton');
    if (bugsButton) {
        bugsButton.addEventListener('click', function() {
            openNewTab('/bugTable');
        });
    }

    // Check if projectsButton exists
    const projectsButton = document.getElementById('projectsButton');
    if (projectsButton) {
        projectsButton.addEventListener('click', function() {
            openNewTab('/projectTable');
        });
    }

    // Check if usersButton exists
    const usersButton = document.getElementById('usersButton');
    if (usersButton) {
        usersButton.addEventListener('click', function() {
            openNewTab('/userTable');
        });
    }
}

document.addEventListener('DOMContentLoaded', addEventListenersBasedOnPage);