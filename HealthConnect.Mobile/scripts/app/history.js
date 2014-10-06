(function (global) {
        app = global.app = global.app || {};
    
    app.historyService = {   
      viewModel: kendo.observable({
        selectedTimeFrame: {name: "1 week", value: "7"},
        noData: true,
        listViewClick: function (e) {
            var hidden = $(e.item).find("ul").is(':hidden');
            $(".history-details").hide();
            $(".km-details").show();
            $("div").removeClass("selectedGroup");
             if(hidden === true) {
                 $(e.item).find("ul").show();
                 $(e.item).find(".listHeader").addClass("selectedGroup");
                 $(e.item).find(".km-details").hide();
            }
           },        
         renderDetailsTemplate: function(data) {
    		return kendo.Template.compile($('#history-details-template').html())(data);
			},
          onShow: function(e) {
              if(e.view.params.timeFrameValue) {
            	app.historyService.viewModel.set("selectedTimeFrame", {name: e.view.params.timeFrameName, value: e.view.params.timeFrameValue});
                }
              app.historyDataSource.read({timeFrame: app.historyService.viewModel.get("selectedTimeFrame").value});
          },
           onDataBound: function(e) {
            if(this.dataSource.data().length === 0) {
                app.historyService.viewModel.set("noData", true);
            }
            else {
                app.historyService.viewModel.set("noData", false);
                }
            }
        })      
    }

    app.historyDataSource = new kendo.data.DataSource.create({
            transport: {
                read: {
                    url:getUriApiMobile("History"),
                	data: {timeFrame: app.historyService.viewModel.selectedTimeFrame.value}
                    }
            }
        })
})(window);