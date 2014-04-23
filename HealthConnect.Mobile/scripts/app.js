(function (global) {
    var app = global.app = global.app || {};
    app.application = new kendo.mobile.Application(document.body, { layout: "drawer-layout", initial: "views/login.html"});
})(window);