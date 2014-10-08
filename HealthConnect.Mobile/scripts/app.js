(function (global) {
    var app = global.app = global.app || {};
    app.application = new kendo.mobile.Application(document.body, { layout: "drawer-layout", initial: "views/login.html"});
})(window);

function getUriBase()
{
//    return "http://localhost:57719/";
//    return "http://hc-test.cloudapp.net/";
    return "http://hc-uatweb.cloudapp.net/";
}

function getUriApiMobile(target)
{
    return getUriBase() + "Api/Mobile/" + target;
}