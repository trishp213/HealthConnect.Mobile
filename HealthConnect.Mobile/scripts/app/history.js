(function (global) {
        app = global.app = global.app || {};
    
    app.historyService = {   
      viewModel: kendo.observable({
        selectedTimeFrame: {name: "1 week", value: "7"},
        listViewClick: function (e) {
            var hidden = $(e.item).find("ul").is(':hidden');
             $('.history-details').hide();
             if(hidden === true) {
                 $(e.item).find("ul").show();
            }
           },        
         renderDetailsTemplate: function(data) {
    		return kendo.Template.compile($('#history-details-template').html())(data);
			},
          refreshData: function(e) {
              if(e.view.params.timeFrameValue) {
            	app.historyService.viewModel.set("selectedTimeFrame", {name: e.view.params.timeFrameName, value: e.view.params.timeFrameValue});
                }
              app.historyDataSource.read({timeFrame: app.historyService.viewModel.get("selectedTimeFrame").value});
          }
        })      
    }

    app.historyDataSource = new kendo.data.DataSource.create({
            transport: {
                read: {
                    url:"http://localhost:5286/Api/Mobile/History",
                	data: {timeFrame: app.historyService.viewModel.selectedTimeFrame.value}
                    }
            }
        })
})(window);