(function (global) {
    var HistoryViewModel,
        app = global.app = global.app || {};

    HistoryViewModel = kendo.data.ObservableObject.extend({
        listViewClick: function (e) {
            var hidden = $(e.item).find("ul").is(':hidden');
             $('.history-details').hide();
             if(hidden === true) {
                 $(e.item).find("ul").show();
            }
           },
        
        renderDetailsTemplate: function(data) {
    		return kendo.Template.compile($('#history-details-template').html())(data);
			}
        
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