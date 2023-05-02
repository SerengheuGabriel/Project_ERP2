sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, History, Filter, FilterOperator) {
	"use strict";
	return Controller.extend("sap.ui.demo.walkthrough.controller.ItemsList", {


		onInit: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("products").attachPatternMatched(this._onObjectMatched, this);
		},
		
		_onObjectMatched: function (oEvent) {

			var aFilter = [];
			var oArgs = oEvent.getParameter("arguments").supplierPath;
			var oFilter1 = new Filter("SupplierID", sap.ui.model.FilterOperator.EQ, oArgs);
			aFilter.push(oFilter1);

			// filter binding
			var oList = this.byId("productsTable");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);

		},

		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("suppliers", {}, true);
			}
		},

		onFilterProducts: function (oEvent) {
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter({filters:[new Filter("ProductName", FilterOperator.Contains, sQuery),
				 new Filter("UnitsInStock", FilterOperator.EQ, sQuery)], and: false}));
				console.log(this.getView().byId("productsTable"));
				aFilter.push(new Filter("SupplierID", sap.ui.model.FilterOperator.EQ, this.getView().byId("productsTable").getRows()[0].getCells()[1].getText()));
			}

			// filter binding
			var oList = this.byId("productsTable");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);

		}

	});
});