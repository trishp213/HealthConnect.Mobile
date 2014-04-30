(function (global) {
    app = global.app = global.app || {};
    
    app.appointmentsDataSource = new kendo.data.DataSource.create({
      transport: {
			read: {
                  url:"http://localhost:5286/Api/Mobile/Appointments",
              }
        }
        });
    
    app.appointmentsService = {   
        viewModel: kendo.observable({
        selectedDate: null,
        month: kendo.toString(new Date(), "MMMM yyyy"),
        daysOfWeek: new kendo.data.DataSource({ data: [] }),
        startDate: null,
        endDate: null,
        updateDaysOfWeek: function () {
            var daysOfWeek = new Array();

            var sunday = Date.parse(app.appointmentsService.viewModel.selectedDate.toString("MMM dd, yyyy"));
            if (sunday.is().sunday() === false) {
                sunday = sunday.last().sunday();
            }
            
            app.appointmentsService.viewModel.set("startDate", sunday.toString("MMM dd, yyyy"));

            for (var i = 0; i < 7; i++) {
                daysOfWeek.push({ day: sunday.toString("ddd"), date: sunday.getDate()});
                sunday.add(1).days();
            }
            app.appointmentsService.viewModel.set("endDate", sunday.toString("MMM dd, yyyy"));
            
            app.appointmentsService.viewModel.daysOfWeek.data(daysOfWeek);
            app.appointmentsService.viewModel.set("month", app.appointmentsService.viewModel.selectedDate.toString("MMMM yyyy"));
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
        },
        onClick: function(e) {
            $("li").removeClass("selectedGroup");
            $(".listHeader").removeClass("selectedGroup"); // unhilite all
            e.item.addClass("selectedGroup");
            var selectedDate = e.item.find(".day-of-week-date").text();
            $(".listHeader:contains(" + selectedDate + ")").addClass("selectedGroup");
            
        },
        onSwipeMonth: function(e) {
            
            var monthsToAdd = 1;
            if (e.direction === "right") {
                monthsToAdd = -1;                                                
            }
            var currentDate = kendo.parseDate(app.appointmentsService.viewModel.selectedDate);
            currentDate = currentDate.add(monthsToAdd).months();
            app.appointmentsService.viewModel.set("month", currentDate.toString("MMMM yyyy"));
            
            if(monthsToAdd === 1) {
                currentDate = currentDate.moveToFirstDayOfMonth();
            }
            else {
                currentDate = currentDate.moveToLastDayOfMonth();
            }
            app.appointmentsService.viewModel.set("selectedDate", kendo.parseDate(currentDate.toString("MMM dd, yyyy"), "MMM dd, yyyy"));
            
        },
        onWeekSwipe: function(e) {
            var currentlySelectedDate = Date.parse(app.appointmentsService.viewModel.selectedDate.toString("MMM dd, yyyy"));

            if (e.direction === "right") { // going to previous week, set selected date to last saturday
                app.appointmentsService.viewModel.set("selectedDate", currentlySelectedDate.last().saturday());
            } else { // going to next week, set selected date to next sunday
                app.appointmentsService.viewModel.set("selectedDate", currentlySelectedDate.next().sunday());
            }
        },
        onDataBound: function(e) {
            $("span:contains('Today')").closest(".listHeader").addClass("selectedGroup");
        }
                                    })
    }
    app.appointmentsService.viewModel.bind("change", function(e) {
        if (e.field === "selectedDate") {
            app.appointmentsService.viewModel.updateDaysOfWeek();
        }
    });
    app.appointmentsService.viewModel.set("selectedDate", new Date());
    
})(window);