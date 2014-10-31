(function (global) {
    var app = global.app = global.app || {};
    app.application = new kendo.mobile.Application(document.body, { layout: "drawer-layout", initial: "views/login.html", skin: "flat" });
})(window);

function getUriBase()
{
//    return "http://localhost:11252/";                // DEV
    return "http://hc-test.cloudapp.net:81/";          // TEST
//    return "http://hc-demo.cloudapp.net:81/";        // DEMO
//    return "http://hc-uatweb.cloudapp.net:81/";      // UAT
//    return "http://199.79.49.72:81/";                // PRODUCTION
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
        message = 'An unexpected problem has occurred, please login again to continue.';
    }
    showAlert(message, 'Health Connect');
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

