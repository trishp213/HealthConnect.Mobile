define(
['jQuery', 'kendo', 'text!../../../views/login.html'],
function ($, kendo, loginHtml) {
    var viewModel = kendo.observable({
        isLoggedIn: false,
        username: "",
        password: "",
		onLogin: onLogin,
		onLogout: onLogOut,
		clearForm: clearForm,
		checkEnter: checkEnter
	});
    function checkEnter(e) {
            if (e.keyCode == 13) {
                $(e.target).blur();
                viewModel.onLogin();
            }
        };
    function clearForm() {
            viewModel.set("username", "");
            viewModel.set("password", "");
        };
    function onLogOut() {
            viewModel.clearForm();
            viewModel.set("isLoggedIn", false);
        };
    
    function onLogin() {
                username = viewModel.get("username").trim(),
                password = viewModel.get("password").trim();

            if (username === "" || password === "") {
                navigator.notification.alert("Both fields are required!",
                    function () { }, "Login failed", 'OK');

                return;
            }

            $.post('http://localhost:5286/Account/Login',
              { userName: viewModel.username, password: viewModel.password, api: true })
                .done(function(e)
                {
                  viewModel.set("isLoggedIn", true);
                })
                .error(function(e) {
                navigator.notification.alert("Invalid username or password",
                    function () { }, "Login failed", 'OK');
                });
        };
    
    return {
        html: loginHtml,
        
        init: function(e) {

        },
        
        beforeShow: function (e) {
            
        },
        
        show: function (e) {
            
        },
        
        viewModel: viewModel
    };
})