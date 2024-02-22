document.addEventListener('DOMContentLoaded', function() {
    var toRegisterButton = document.getElementById('toRegister');
    console.log("button pressed");

    toRegisterButton.addEventListener('click', function() {
        window.location.href = window.location.origin + '/register';
    });
});
  
document.addEventListener('DOMContentLoaded', function() {
    var toMainMenuButton = document.getElementById('toMainMenu');

    toMainMenuButton.addEventListener('click', function() {
        var currentUrl = window.location.href;
        var origin = window.location.origin;
        var newUrl = currentUrl.replace('/register', '');

        window.location.href = newUrl;
    });
});