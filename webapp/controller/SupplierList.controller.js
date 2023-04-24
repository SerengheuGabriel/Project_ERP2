sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, JSONModel, formatter, Filter, FilterOperator) {
	"use strict";
	return Controller.extend("sap.ui.demo.walkthrough.controller.SupplierList", {
		formatter: formatter, 
		onFilterInvoices : function (oEvent) {

			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter({filters:[new Filter("CompanyName", FilterOperator.Contains, sQuery),
				 new Filter("Country", FilterOperator.Contains, sQuery)], and: false}));
			}

			// filter binding
			var oList = this.byId("supplierList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);

			
		},
		onPress: function (oEvent) {
			var oItem = oEvent.getSource();
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("items", {
				supplierPath: window.encodeURIComponent(oItem.getBindingContext("supplier").getPath().substr(1))
			});
		}
	});
});