define(
['jQuery', 'kendo', 'text!../../../views/history.html'],
function ($, kendo, historyHtml) {
 
    var viewModel = kendo.observable({
        selectedTimeFrame: {name: "1 week", value: "7"},
        historyDataSource: new kendo.data.DataSource.create({
            transport: {
                read: {
                    url:"http://localhost:5286/Api/Mobile/History",
                	data: {timeFrame: "7"}
                }
            }
        }),
        listViewClick: function(e) {
            var hidden = $(e.item).find("ul").is(':hidden');
             $('.history-details').hide();
             if(hidden === true) {
                 $(e.item).find("ul").show();
            }
        },
        renderDetailsTemplate: function(data) {
    		return kendo.Template.compile($('#history-details-template').html())(data);
        },
        refreshData: refreshData
       }); 
    
    function refreshData(e) {
              if(e.view.params.timeFrameValue) {
            	viewModel.set("selectedTimeFrame", {name: e.view.params.timeFrameName, value: e.view.params.timeFrameValue});
                }
              viewModel.historyDataSource.read({timeFrame: viewModel.get("selectedTimeFrame").value});
          }
    return {
        html: historyHtml,
            		
        init: function(e) {
            
        },
            
        beforeShow: function(e) {
            
        },
        
        show: function(e) {
            
        },
        
        viewModel: viewModel
    }
});