define(
['jQuery', 'kendo', 'text!../../../views/incoming.html'],
function ($, kendo, incomingHtml) {
      
      var viewModel = kendo.observable({
          selectedTimeFrame: {name: "1 week", value: "7"},
          incomingDataSource: new kendo.data.DataSource.create({
              transport: {
                  read: {
                      url:"http://localhost:5286/Api/Mobile/Incoming",
                      data: {timeFrame: "7"}
                  }
              }
          }),
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
          refreshData: refreshData
      });
    
    function refreshData(e) {
              if(e.view.params.timeFrameValue) {
                  viewModel.set("selectedTimeFrame", {name: e.view.params.timeFrameName, value: e.view.params.timeFrameValue});
              }
              viewModel.incomingDataSource.read({timeFrame: viewModel.get("selectedTimeFrame").value});
          }
    
    return {
        html: incomingHtml,
                    		
        init: function(e) {
            
        },
            
        beforeShow: function(e) {
            
        },
        
        show: function(e) {
            
        },
        
        viewModel: viewModel
    }
})