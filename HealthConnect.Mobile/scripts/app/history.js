(function (global) {
        app = global.app = global.app || {};
    
    app.historyService = {   
      viewModel: kendo.observable({
        selectedTimeFrame: {name: "1 week", value: "7"},
        timeFrames: [
        {name: "1 week", value: "7"}, 
        {name: "30 days", value: "30"},
        {name: "60 days", value: "60"},
        {name: "90 days", value: "90"},
        {name: "All", value: "0"}
        ],
        onTimeFrameChange: function(e){
            app.historyService.history.read({timeFrame: this.get("selectedTimeFrame").value});
        },        
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
        }),
      history: new kendo.data.DataSource.create({
            transport: {
                read: {
                    url:"http://localhost:5286/Api/Mobile/History",
                	data: {timeFrame: "7"}
                    }
            }
        })
    }
    
})(window);