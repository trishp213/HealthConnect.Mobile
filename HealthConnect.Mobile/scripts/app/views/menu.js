define(
    ['jQuery', 'kendo', 'text!../../../views/menu.html'],
    function($, kendo, menuHtml) {
        
        var viewModel = kendo.observable({});
                
    	return {
    		html: menuHtml,
            
            init: function() {

            },            
            
    		viewModel: viewModel
    	};
    }
);