(function (global) {
    var HistoryViewModel,
        app = global.app = global.app || {};

    HistoryViewModel = kendo.data.ObservableObject.extend({
       
        isLoggedIn: false,
        username: "",
        password: "",

        onHistory: function () {
            var that = this,
                username = that.get("username").trim(),
                password = that.get("password").trim();

            if (username === "" || password === "") {
                navigator.notification.alert("Both fields are required!",
                    function () { }, "History failed", 'OK');

                return;
            }

            $.post('http://localhost:5286/Account/History',
              { userName: username, password: password, api: true })
                .done(function (e)
                {
                  that.set("isLoggedIn", true);
                })
                .error(function (e) {
                navigator.notification.alert("Invalid username or password",
                    function () { }, "History failed", 'OK');
                });
        },

        onLogout: function () {
            var that = this;

            that.clearForm();
            that.set("isLoggedIn", false);
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
                that.onHistory();
            }
        }
    });

    app.historyService = {
        viewModel: new HistoryViewModel(),
          reddit: new kendo.data.DataSource.create({
  transport: {
    read: "http://localhost:5286/Api/Mobile/History"
  },
  
}),
    };
})(window);