(function (global) {
        app = global.app = global.app || {};
    
    app.incomingService = {   
      viewModel: kendo.observable({
        selectedTimeFrame: {name: "1 week", value: "7"},
        listViewClick: function (e) {
            var hidden = $(e.item).find("ul").is(':hidden');
             $('.incoming-details').hide();
             if(hidden === true) {
                 $(e.item).find("ul").show();
            }
           },        
        renderDetailsTemplate: function(data) {
    		return kendo.Template.compile($('#incoming-details-template').html())(data);
			},
          refreshData: function(e) {
              if(e.view.params.timeFrameValue) {
            	app.incomingService.viewModel.set("selectedTimeFrame", {name: e.view.params.timeFrameName, value: e.view.params.timeFrameValue});
                }
              app.incomingDataSource.read({timeFrame: app.incomingService.viewModel.get("selectedTimeFrame").value});
          }
        })
        }
       app.incomingDataSource = new kendo.data.DataSource.create({
            transport: {
                read: {
                    url:"http://localhost:5286/Api/Mobile/Incoming",
                	data: {timeFrame: app.incomingService.viewModel.selectedTimeFrame.value}
                    }
            }
        })
})(window);