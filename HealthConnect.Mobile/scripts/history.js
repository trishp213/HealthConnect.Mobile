(function (global) {
    var HistoryViewModel,
        app = global.app = global.app || {};

    HistoryViewModel = kendo.data.ObservableObject.extend({
       
           });

    app.historyService = {
        viewModel: new HistoryViewModel(),
        history: new kendo.data.DataSource.create({
            transport: {
                read: "http://localhost:5286/Api/Mobile/History"
            }
        }),
    }
})(window);