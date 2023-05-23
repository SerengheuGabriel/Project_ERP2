sap.ui.define([
	"./BaseController",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, formatter, Filter, FilterOperator) {
	"use strict";
	return BaseController.extend("sap.ui.demo.walkthrough.controller.SupplierList", {
		formatter: formatter, 
		onFilterInvoices : function (oEvent) {

			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter({filters:[new Filter("CompanyName", FilterOperator.Contains, sQuery),
				 new Filter("Country", FilterOperator.Contains, sQuery), new Filter("Address", FilterOperator.Contains, sQuery)], and: false}));
			}

			// filter binding
			var oList = this.byId("supplierList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);

			
		},
		onPress: function (oEvent) {
			var oItem = oEvent.getSource();
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("products", {
				supplierPath: window.encodeURIComponent(oItem.getBindingContext().getObject().SupplierID)
			});
		}
	});
});