(function (global) {
    var LoginViewModel,
        app = global.app = global.app || {};

    LoginViewModel = kendo.data.ObservableObject.extend({
                    isLoggedIn: false,
                    username: "",
                    password: "",

                    onLogin: function () {
                        var that = this,
                            username = that.get("username").trim(),
                            password = that.get("password").trim();
                        
                        console.log('onLogin');

                        if (username === "" || password === "") {
                            navigator.notification.alert("Both fields are required!",
                                                         function () {
                                                         }, "Login failed", 'OK');

                            return;
                        }

                        $.ajax({
                                   url: getUriApiMobile("Login"),
                                   type: "POST",
                                   data: { userName: username, password: password, api: true }
                               })
                            .done(function (e) {
                                if (e === 200) {
                                    that.set("isLoggedIn", true);
                                    app.application.navigate("views/menu.html");
                                } else {
                                    navigator.notification.alert("Invalid username or password", function () {
                                    }, "Login failed", 'OK'); 
                                }
                            })
                            .fail(function (e) {
                                navigator.notification.alert("An error has occurred",
                                                             function () {
                                                             }, "Login failed", 'OK');
                            });
                    },


                    onLogout: function () {
                        var that = this;
                        that.clearForm();
                        
                        that.set("isLoggedIn", false);
                        $.ajax({
                            type: "POST",
                            url: getUriApiMobile("Logout")
                        })
                       .done(function (e) {
                            app.application.navigate("views/login.html");
                        })
                        .fail(function (e) {
                            app.application.navigate("views/login.html");
                        });
                    },

                    clearForm: function () {
                        var that = this;

                        that.set("username", "");
                        that.set("password", "");
                    },

                    checkEnter: function (e) {
                        var that = this;

                        if (e.keyCode == 13) {
                            $(e.target).blur();
                            that.onLogin();
                        }
                    }
                });

    app.loginService = {
        viewModel: new LoginViewModel()
    };
})(window);
