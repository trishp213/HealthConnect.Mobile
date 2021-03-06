(function (global) {
        app = global.app = global.app || {};
    
    app.incomingService = {   
      viewModel: kendo.observable({
        selectedTimeFrame: {name: "1 week", value: "7"},
        noData: true,
        renderDetailsTemplate: function(data) {
    		return kendo.Template.compile($('#incoming-details-template').html())(data);
			},
          onShow: function(e) {
              if(e.view.params.timeFrameValue) {
            	app.incomingService.viewModel.set("selectedTimeFrame", {name: e.view.params.timeFrameName, value: e.view.params.timeFrameValue});
                }
              app.incomingDataSource.read({timeFrame: app.incomingService.viewModel.get("selectedTimeFrame").value});
          },
          onDataBound: function(e) {
              $("span:contains('Today')").closest(".listHeader").addClass("selectedGroup");
              if(this.dataSource.data().length === 0) {
                app.incomingService.viewModel.set("noData", true);
            }
            else {
                app.incomingService.viewModel.set("noData", false);
                }
          }
        })
        }
       app.incomingDataSource = new kendo.data.DataSource.create({
            transport: {
                read: {
                    url:getUriApiMobile("Incoming"),
                	data: {timeFrame: app.incomingService.viewModel.selectedTimeFrame.value}
                    }
            },
        error: function(e) {
            showError();
          }
        })
})(window);