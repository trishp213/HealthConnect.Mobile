(function (global) {
    var app = global.app = global.app || {};
    app.application = new kendo.mobile.Application(document.body, { layout: "drawer-layout", initial: "views/login.html", skin: "flat" });
})(window);

function getUriBase()
{
//    return "http://localhost:57719/";
    return "http://hc-test.cloudapp.net/";
//    return "http://hc-uatweb.cloudapp.net/";
//    return "http://172.168.12.77/HealthConnect/";
}

function getUriApiMobile(target)
{
    return getUriBase() + "Api/Mobile/" + target;
}