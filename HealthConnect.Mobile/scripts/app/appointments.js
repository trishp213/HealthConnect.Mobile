(function (global) {
    app = global.app = global.app || {};
    
    
    
    app.appointmentsDataSource = new kendo.data.DataSource.create({
      transport: {
			read: {
                  url:"http://localhost:5286/Api/Mobile/Appointments",
              }
        }
        });
    
    var dayDisplayFormat = "dddd, MMM d";
    var monthDisplayFormat = "MMMM yyyy";    
    var dateFormat = "MMM dd, yyyy";

    app.appointmentsService = {   
        viewModel: kendo.observable({
        selectedDate: null,
        month: kendo.toString(new Date(), monthDisplayFormat),
        daysOfWeek: new kendo.data.DataSource({ data: [] }),
        startDate: null,
        endDate: null,
        updateDaysOfWeek: function () {
            var daysOfWeek = new Array();
            var sunday = Date.parse(app.appointmentsService.viewModel.selectedDate.toString(dateFormat));
            if (sunday.is().sunday() === false) {
                sunday = sunday.last().sunday();
            }
            
            app.appointmentsService.viewModel.set("startDate", sunday.toString(dateFormat));

            for (var i = 0; i < 7; i++) {
                daysOfWeek.push({ 
                    day: sunday.toString("ddd"), 
                    date: sunday.getDate(), 
                    month: sunday.toString(monthDisplayFormat),
                	dateValue: sunday.toString(dayDisplayFormat)});
                sunday.add(1).days();
            }
            app.appointmentsService.viewModel.set("endDate", sunday.toString(dateFormat));
            
            app.appointmentsService.viewModel.daysOfWeek.data(daysOfWeek);
            app.appointmentsService.viewModel.set("month", app.appointmentsService.viewModel.selectedDate.toString(monthDisplayFormat));
            app.appointmentsDataSource.read(app.appointmentsService.viewModel.getDateRange());
        },
	    getDateRange: function(){
          return { startDate: app.appointmentsService.viewModel.startDate, endDate: app.appointmentsService.viewModel.endDate};
        },
        renderDetailsTemplate: function(data) {
            return kendo.Template.compile($('#appointments-details-template').html())(data);
        },
        refreshData: function(e) {
            app.appointmentsDataSource.read(app.appointmentsService.viewModel.getDateRange());
            $("#appointments-scroller").data("kendoMobileScroller").reset();
        },
        onClick: function(e) {
            $("li").removeClass("selectedGroup");
            $(".listHeader").removeClass("selectedGroup"); // unhilite all
            e.item.addClass("selectedGroup");
            var selectedDate = e.item.find(".day-of-week-value").val();
            var selectedDateListItem = $(".listHeader:contains(" + selectedDate + ")");
            selectedDateListItem.addClass("selectedGroup");
            app.appointmentsService.viewModel.set("month", e.item.find(".day-of-week-month").val());
            
            // scroll to selected date in list view
            var scroller = $("#appointments-scroller").data("kendoMobileScroller");
            scroller.reset();
            
            var pos = $(selectedDateListItem).offset();
            if(pos){
            	scroller.scrollTo(-pos.left, -pos.top + $("#appointments-header").height() + selectedDateListItem.height());
                }
        },
        onSwipeMonth: function(e) {
            
            var monthsToAdd = 1;
            if (e.direction === "right") {
                monthsToAdd = -1;                                                
            }
            var currentDate = kendo.parseDate(app.appointmentsService.viewModel.selectedDate);
            currentDate = currentDate.add(monthsToAdd).months();
            app.appointmentsService.viewModel.set("month", currentDate.toString(monthDisplayFormat));
            
            if(monthsToAdd === 1) {
                currentDate = currentDate.moveToFirstDayOfMonth();
            }
            else {
                currentDate = currentDate.moveToLastDayOfMonth();
            }
            app.appointmentsService.viewModel.set("selectedDate", kendo.parseDate(currentDate.toString(dateFormat), dateFormat));
            
        },
        onWeekSwipe: function(e) {
            var currentlySelectedDate = Date.parse(app.appointmentsService.viewModel.selectedDate.toString(dateFormat));

            if (e.direction === "right") { // going to previous week, set selected date to last saturday
                app.appointmentsService.viewModel.set("selectedDate", currentlySelectedDate.last().saturday());
            } else { // going to next week, set selected date to next sunday
                app.appointmentsService.viewModel.set("selectedDate", currentlySelectedDate.next().sunday());
            }
        },
        onDataBound: function(e) {
            var selectedDate = app.appointmentsService.viewModel.selectedDate.toString(dayDisplayFormat);
            $("input[value='" + selectedDate + "']").closest("li").addClass("selectedGroup");
            app.appointmentsService.viewModel.setScrollerHeight();
            
            var selectedDateListItem = $(".listHeader:contains(" + selectedDate + ")");
            selectedDateListItem.addClass("selectedGroup");
            
            // scroll to selected date in list view
            var scroller = $("#appointments-scroller").data("kendoMobileScroller");
            scroller.reset();
            
            var pos = $(selectedDateListItem).offset();
            if(pos){
            	scroller.scrollTo(-pos.left, -pos.top + $("#appointments-header").height() + selectedDateListItem.height());
                }
        },
        setScrollerHeight: function(e) {
            $("#appointments-scroller").css("height", $(window).height() - $("#appointments-header").height());
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