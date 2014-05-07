define(
['jQuery', 'kendo', 'text!../../../views/home.html'],
function ($, kendo, homeHtml) {
      
      var viewModel = kendo.observable({
          
      });
    
    return {
        html: homeHtml,
                    		
        init: function(e) {
            
        },
            
        beforeShow: function(e) {
            
        },
        
        show: function(e) {
            
        },
        
        viewModel: viewModel
    }
})