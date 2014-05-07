define(
['jQuery', 'kendo', 'date', 'text!../../../views/appointments.html'],
function ($, kendo, date, appointmentsHtml) {
    var dayDisplayFormat = "dddd, MMM d";
    var monthDisplayFormat = "MMMM yyyy";    
    var dateFormat = "MMM dd, yyyy"; // kendo date formats are invalid for javascript, so need to pick a format and toString the dates before working with them
      var viewModel = kendo.observable({selectedDate: null,
        month: kendo.toString(new Date(), monthDisplayFormat),
        daysOfWeek: new kendo.data.DataSource({ data: [] }),
        startDate: null,
        endDate: null,
        noData: true,
        appointmentsDataSource: new kendo.data.DataSource.create({
      	transport: {
			read: {
                  url:"http://localhost:5286/Api/Mobile/Appointments",
              }
        	}
        }),
        updateDaysOfWeek: updateDaysOfWeek,
	    getDateRange: getDateRange,
        renderDetailsTemplate: renderDetailsTemplate,
        onShow: onShow,
        onClick: onClick,
        onSwipeMonth: onSwipeMonth,
        onWeekSwipe: onWeekSwipe,
        onDataBound: onDataBound,
        setScrollerHeight: setScrollerHeight,
        change: change,
        
      });
    function getDateRange(){
            // get the dates for the start and end of the week to pass to the service
          return { startDate: this.startDate, endDate: this.endDate};
        }
    function renderDetailsTemplate(data) {
            return kendo.Template.compile($('#appointments-details-template').html())(data);
        };
    function onClick(e) {
            // remove the hilighting currently selected dates
            $("li").removeClass("selectedGroup");
            $(".listHeader").removeClass("selectedGroup"); 
            
            // hilight the current day of week in the date slider
            e.item.addClass("selectedGroup");
            var selectedDate = e.item.find(".day-of-week-value").val();
            var selectedDateListItem = $(".listHeader:contains(" + selectedDate + ")");
            selectedDateListItem.addClass("selectedGroup");
            this.set("month", e.item.find(".day-of-week-month").val());
            
            // scroll tback to the top
            var scroller = $("#appointments-scroller").data("kendoMobileScroller");
            scroller.reset();
            
            // get the position of the selected date in the listview
            var pos = $(selectedDateListItem).offset();
            if(pos){
                // scroll to the selected date in the listview
            	scroller.scrollTo(-pos.left, -pos.top + $("#appointments-header").height() + selectedDateListItem.height());
                }
        };
    function onSwipeMonth(e) {
            // move ahead or behind a month
            var monthsToAdd = 1;
            if (e.direction === "right") {
                monthsToAdd = -1;                                                
            }
            var currentDate = kendo.parseDate(this.selectedDate);
            currentDate = currentDate.add(monthsToAdd).months();
            viewModel.set("month", currentDate.toString(monthDisplayFormat));
            
            // if moving ahead, move to the first day of the month
            // if moving back a month, move to the last day of the month
            if(monthsToAdd === 1) {
                currentDate = currentDate.moveToFirstDayOfMonth();
            }
            else {
                currentDate = currentDate.moveToLastDayOfMonth();
            }
            
            // update the selected date
            viewModel.set("selectedDate", kendo.parseDate(currentDate.toString(dateFormat), dateFormat));
        }
    function onWeekSwipe(e) {
            // move ahead of back a week
            var currentlySelectedDate = Date.parse(viewModel.selectedDate.toString(dateFormat));

            if (e.direction === "right") { // going to previous week, set selected date to last saturday
                viewModel.set("selectedDate", currentlySelectedDate.last().saturday());
            } else { // going to next week, set selected date to next sunday
                viewModel.set("selectedDate", currentlySelectedDate.next().sunday());
            }
        };
    function setScrollerHeight(e) {
            // set the scroller to the correct height depending on the position of the device
            $("#appointments-scroller").css("height", $(window).height() - $("#appointments-header").height());
        };
    function change(e){
            if (e.field === "selectedDate") {
           	viewModel.updateDaysOfWeek();
            }
        };
    function onDataBound(e) {
            // show no availability mesasge if no records
            if(viewModel.dataSource.data().length === 0) {
                viewModel.set("noData", true);
            }
            else {
                viewModel.set("noData", false);
            }
            
            // hilight the selected date
            var selectedDate = viewModel.selectedDate.toString(dayDisplayFormat);
            $("input[value='" + selectedDate + "']").closest("li").addClass("selectedGroup");
            viewModel.setScrollerHeight();
            
            var selectedDateListItem = $(".listHeader:contains(" + selectedDate + ")");
            selectedDateListItem.addClass("selectedGroup");
            
            // scroll to the top
            var scroller = $("#appointments-scroller").data("kendoMobileScroller");
            scroller.reset();
            
            var pos = $(selectedDateListItem).offset();
            if(pos){
                // scroll to the selected date in the list
            	scroller.scrollTo(-pos.left, -pos.top + $("#appointments-header").height() + selectedDateListItem.height());
                }
        };
    
    function updateDaysOfWeek() {
            var daysOfWeek = new Array();
            
            // get currently selected date - toString required because kendo dates are in invalid formats for javascript
            var sunday = Date.parse(viewModel.selectedDate.toString(dateFormat));
            
            // move to sunday of the current week
            if (sunday.is().sunday() === false) {
                sunday = sunday.last().sunday();
            }
            
            // save the sunday as the start date of the week
            viewModel.set("startDate", sunday.toString(dateFormat));

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
            viewModel.set("endDate", sunday.toString(dateFormat));
            
            // push the dates to the datasource that the date selector is bound to
            viewModel.daysOfWeek.data(daysOfWeek);
            
            // update the month picker 
            viewModel.set("month", viewModel.selectedDate.toString(monthDisplayFormat));
            
            // get the appointments for that week from the service
            viewModel.appointmentsDataSource.read(viewModel.getDateRange());
        };
    
    function onShow(e) {
            viewModel.appointmentsDataSource.read(viewModel.getDateRange());
            $("#appointments-scroller").data("kendoMobileScroller").reset();
        };
    
   
    return {
        html: appointmentsHtml,
                    		
        init: function(e) {

        },
            
        beforeShow: function(e) {
            
        },
        
        show: function(e) {
            
        },
        
        viewModel: viewModel
    }
})