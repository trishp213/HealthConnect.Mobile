define(
    function(require){
        var kendoApp,
    	    $ = require('jQuery'),
    	    kendo = require('kendo'),
    	    kendoLayouts = {
    		    main: require('app/views/layout')
    	    },
    	    kendoViews = {
                timeFrames: require('app/views/timeFrames'),
                menu: require('app/views/menu'),
                history: require('app/views/history'),
                login: require('app/views/login'),
                appointments: require('app/views/appointments'),
                incoming: require('app/views/incoming'),
    	    };
        
        // Loop through all kendo layouts and views and spit their HTML into the BODY
    	function onBeforeInit() {
    		var i,
                item,
                objects = [kendoLayouts, kendoViews],
                htmlBuffer = [];

    		for (i=0; i<objects.length; i++) {
    			for (item in objects[i]) {
    				if (objects[i].hasOwnProperty(item) && objects[i][item].hasOwnProperty('html')) {
    					htmlBuffer.push(objects[i][item].html);
    				}
    			}
    		}

    		$(document.body).prepend(htmlBuffer.join(''));
    	}
        
        function initKendo() {
            function onInit() {
                kendoApp = new kendo.mobile.Application(document.body, {
                    initial: "login-view",
                    layout: 'drawer-layout'
                });
            }
            
            /**
             * We have to load up kendo once we know if the user is
             * signed in or not in order to determine which view to start with
             */
            onInit();
        }
        
        return {
            init: function () {
                onBeforeInit();
                initKendo();
            },
            kendoApp: function() { return kendoApp; },
            layouts: kendoLayouts,
            views: kendoViews
        }
    }
);
