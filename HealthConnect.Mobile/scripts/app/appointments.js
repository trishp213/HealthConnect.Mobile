(function (global) {
        app = global.app = global.app || {};
    
    app.appointmentsService = {   
      viewModel: kendo.observable({
        selectedDate: new Date(),
        renderDetailsTemplate: function(data) {
    		return kendo.Template.compile($('#appointments-details-template').html())(data);
			},
          refreshData: function(e) {
              app.appointmentsDataSource.read();
          },
          onDataBound: function(e) {
              $("span:contains('Today')").closest(".listHeader").addClass("selectedGroup");
          }
        })
        }
       app.appointmentsDataSource = new kendo.data.DataSource.create({
            transport: {
                read: {
                    url:"http://localhost:5286/Api/Mobile/Appointments",
                    }
            }
        })
})(window);