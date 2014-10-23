(function (global) {
    var app = global.app = global.app || {};
    app.application = new kendo.mobile.Application(document.body, { layout: "drawer-layout", initial: "views/login.html", skin: "flat" });
})(window);

function getUriBase()
{
//    return "http://localhost:11252/";
    return "http://hc-test.cloudapp.net:81/";
//    return "http://hc-uatweb.cloudapp.net/";
//    return "http://172.168.12.77/HealthConnect/";
}

function getUriApiMobile(target){
    return getUriBase() + "api/Mobile/" + target;
}

// global error handling
var showAlert = function(message, title, callback) {
    if(navigator.notification){
        navigator.notification.alert(message, callback || function () {}, title, 'OK');
    }
    else alert(message);
        
};
var showError = function(message) {
    if(!message){
        message = 'An error has occurred';
    }
    showAlert(message, 'Error');
    app.application.hideLoading();
    app.loginService.viewModel.set("isLoggedIn", false);
    app.application.navigate("views/login.html");
};

window.addEventListener('error', function (e) {
    e.preventDefault();
    var message = e.message + "' from " + e.filename + ":" + e.lineno;
    showAlert(message, 'Error occurred');
    return true;
});

