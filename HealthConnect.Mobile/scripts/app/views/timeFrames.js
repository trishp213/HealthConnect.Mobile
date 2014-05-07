define(
['jQuery', 'kendo', 'text!../../../views/timeFrames.html'],
function ($, kendo, timeFramesHtml) {
    var viewModel = kendo.observable({
           	 selectedTimeFrame: {name: "1 week", value: "7"},
                timeFrames: [
                {name: "1 week", value: "7"}, 
                {name: "30 days", value: "30"},
                {name: "60 days", value: "60"},
                {name: "90 days", value: "90"},
                {name: "All", value: "0"}
                ],
                onTimeFrameChange: onTimeFrameChange  
              });
    
    function onTimeFrameChange(e){
        var lastView = app.kendoApp().pane.history;
        var callingPage = lastView[lastView.length - 2] + "?timeFrameName=" + e.dataItem.name + "&timeFrameValue=" + e.dataItem.value;
        var hasParameters = lastView[lastView.length - 2].indexOf("?");
        if (hasParameters > 0) {
             callingPage = lastView[lastView.length - 2].substring(0,(lastView[lastView.length - 2].indexOf("?"))) + "?timeFrameName=" + e.dataItem.name + "&timeFrameValue=" + e.dataItem.value;
        }
        app.kendoApp().navigate(callingPage);
    };
    
    return {
        html: timeFramesHtml,
                    		
        init: function(e) {
            
        },
            
        beforeShow: function(e) {
            
        },
        
        show: function(e) {
            
        },
        
        viewModel: viewModel
    }
    }
)