(function (global) {
    app = global.app = global.app || {};   
    
    app.appointmentsDataSource = new kendo.data.DataSource.create({
      transport: {
        read: {
          url: getUriApiMobile("Appointments")
        }
      }
    });
    
    var dayDisplayFormat = "dddd, MMM d";
    var monthDisplayFormat = "MMMM yyyy";    
    var dateFormat = "MMM dd, yyyy"; // kendo date formats are invalid for javascript, so need to pick a format and toString the dates before working with them

    app.appointmentsService = {   
        viewModel: kendo.observable({
        selectedDate: null,
        month: kendo.toString(new Date(), monthDisplayFormat),
        daysOfWeek: new kendo.data.DataSource({ data: [] }),
        startDate: null,
        endDate: null,
        noData: true,
        updateDaysOfWeek: function () {
            var daysOfWeek = new Array();
            
            // get currently selected date - toString required because kendo dates are in invalid formats for javascript
            var sunday = Date.parse(app.appointmentsService.viewModel.selectedDate.toString(dateFormat));
            
            // move to sunday of the current week
            if (sunday.is().sunday() === false) {
                sunday = sunday.last().sunday();
            }
            
            // save the sunday as the start date of the week
            app.appointmentsService.viewModel.set("startDate", sunday.toString(dateFormat));

            // add each day of the week to the list
            for (var i = 0; i < 7; i++) {
                daysOfWeek.push({ 
                    day: sunday.toString("ddd"), 
                    date: sunday.getDate(), 
                    month: sunday.toString(monthDisplayFormat),
                	dateValue: sunday.toString(dayDisplayFormat)});
                sunday.add(1).days();
            }
            // save the following sunday as the last day of the week
            app.appointmentsService.viewModel.set("endDate", sunday.toString(dateFormat));
            
            // push the dates to the datasource that the date selector is bound to
            app.appointmentsService.viewModel.daysOfWeek.data(daysOfWeek);
            
            // update the month picker 
            app.appointmentsService.viewModel.set("month", app.appointmentsService.viewModel.selectedDate.toString(monthDisplayFormat));
            
            // get the appointments for that week from the service
            app.appointmentsDataSource.read(app.appointmentsService.viewModel.getDateRange());
        },
	    getDateRange: function(){
            // get the dates for the start and end of the week to pass to the service
          return { startDate: app.appointmentsService.viewModel.startDate, endDate: app.appointmentsService.viewModel.endDate};
        },
        renderDetailsTemplate: function(data) {
            return kendo.Template.compile($('#appointments-details-template').html())(data);
        },
        onShow: function(e) {
            app.appointmentsService.viewModel.clearHighlighting();

            app.appointmentsDataSource.read(app.appointmentsService.viewModel.getDateRange());
            var scroller_km = $("#appointments-scroller").data("kendoMobileScroller");
            scroller_km.reset();
        },
        scrollToSelectedDate: function(item)
        {
            app.appointmentsService.viewModel.clearHighlighting();

            // hilight the current day of week in the date slider
            item.addClass("selectedGroup");
            var selectedDate = item.find(".day-of-week-value").val();
            var selectedDateListItem = $(".listHeader:contains(" + selectedDate + ")");
            selectedDateListItem.addClass("selectedGroup");
            app.appointmentsService.viewModel.set("month", item.find(".day-of-week-month").val());

            // scroll the referrals to match the date selected
            var scroller = $("#appointments-scroller");
            var scroller_km = scroller.data("kendoMobileScroller");
            
            if (selectedDateListItem.length) {
                // scroll to the selected date in the listview
                scroller_km.animatedScrollTo(0, scroller.offset().top - scroller_km.scrollTop - selectedDateListItem.offset().top);
            }
            else {
                scroller_km.animatedScrollTo(0, 0);
            }
        },
        onClick: function(e) {
            app.appointmentsService.viewModel.scrollToSelectedDate(e.item)
        },
        onSwipeMonth: function(e) {
            // move ahead or behind a month
            var monthsToAdd = 1;
            if (e.direction === "right") {
                monthsToAdd = -1;                                                
            }
            var currentDate = kendo.parseDate(app.appointmentsService.viewModel.selectedDate);
            currentDate = currentDate.add(monthsToAdd).months();
            app.appointmentsService.viewModel.set("month", currentDate.toString(monthDisplayFormat));
            
            // if moving ahead, move to the first day of the month
            // if moving back a month, move to the last day of the month
            if(monthsToAdd === 1) {
                currentDate = currentDate.moveToFirstDayOfMonth();
            }
            else {
                currentDate = currentDate.moveToLastDayOfMonth();
            }
            
            // update the selected date
            app.appointmentsService.viewModel.set("selectedDate", kendo.parseDate(currentDate.toString(dateFormat), dateFormat));
        },
        onWeekSwipe: function(e) {
            // move ahead of back a week
            var currentlySelectedDate = Date.parse(app.appointmentsService.viewModel.selectedDate.toString(dateFormat));

            if (e.direction === "right") { // going to previous week, set selected date to last saturday
                app.appointmentsService.viewModel.set("selectedDate", currentlySelectedDate.last().saturday());
            } else { // going to next week, set selected date to next sunday
                app.appointmentsService.viewModel.set("selectedDate", currentlySelectedDate.next().sunday());
            }
        },
        onDataBound: function(e) {
            // show no availability mesasge if no records
            if(this.dataSource.data().length === 0) {
                app.appointmentsService.viewModel.set("noData", true);
            }
            else {
                app.appointmentsService.viewModel.set("noData", false);
            }
            
            // hilight the selected date
            var selectedDate = app.appointmentsService.viewModel.selectedDate.toString(dayDisplayFormat);
            var selectedItem = $("input[value='" + selectedDate + "']").closest("li");

            app.appointmentsService.viewModel.setScrollerHeight();
            app.appointmentsService.viewModel.scrollToSelectedDate(selectedItem);
        },
        setScrollerHeight: function(e) {
            // set the scroller to the correct height depending on the position of the device
            $("#appointments-scroller").css("height", $(window).height() - $("#appointments-header").height() - 20 + "px");
        },
        clearHighlighting: function()
        {
            // remove the highlighting from currently selected dates
            $("li").removeClass("selectedGroup");
            $(".listHeader").removeClass("selectedGroup"); 
        }
      })
    }
    app.appointmentsService.viewModel.bind("change", function(e) {
        if (e.field === "selectedDate") {
            app.appointmentsService.viewModel.updateDaysOfWeek();
        }
    });
    app.appointmentsService.viewModel.set("selectedDate", new Date());
    
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', app.appointmentsService.viewModel.setScrollerHeight, false);
    }
})(window);