define(
    ['jQuery', 'kendo', 'text!../../../views/layout.html'],
    function($, kendo, layoutHtml) {
        
        var viewModel = kendo.observable({
            currentView: currentView
    	});

        function initAjaxLoader() {          
            $(document).ajaxStart(function() {
                app.kendoApp().pane.showLoading();
            });
            
            $(document).ajaxStop(function() {
               app.kendoApp().pane.hideLoading(); 
            });
        }
        
        // Helper function to get the current view in case we don't have access to app.kendoApp().view() yet...
        function currentView() {
            var path = window.location.pathname.split('/');
            path = path[path.length - 1];
            
            var hasHash = /#/;
            if (!hasHash.test(path)) {
                return '';
            }
            
            var captureView = /#(.$)/;
            return path.match(captureView)[0];
        }
        
        function removeExtraHeaders(e) {
            e.layout.header.find('[data-role="sub-header"]').remove();
            // Need to do this in order for kendo to populate the template if there is one
            //e.view.element.find('[data-role="sub-header"]').show();
        }
        
    	return {
    		html: layoutHtml,
            
            init: function() {
                initAjaxLoader();
            },
            
            onViewChange: function(e) {
                removeExtraHeaders(e);
            },
            
    		viewModel: viewModel
    	};
    }
);