sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	"sap/m/Dialog",
	"sap/m/List",
	"sap/m/StandardListItem",
	"sap/m/Button"
], function (Controller, History, Filter, FilterOperator, Dialog, List, StandardListItem, Button) {
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
				new Filter("SupplierID", sap.ui.model.FilterOperator.EQ, this.getView().byId("productsTable").getItems()[0].getAggregation("cells")[2].getProperty("text"))], and: true}));
			} else {
				aFilter.push(new Filter("SupplierID", sap.ui.model.FilterOperator.EQ, this.getView().byId("productsTable").getItems()[0].getAggregation("cells")[2].getProperty("text")));
			}

			// filter binding
			var oList = this.byId("productsTable");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);

		}, 
		onPress: function (oEvent) {
			var oItem = oEvent.getSource();
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("products", {
				supplierPath: window.encodeURIComponent(oItem.getBindingContext().getObject().SupplierID)
			});
		},
		onPress: function (oEvent) {
			var oItem = oEvent.getSource();
			// var aFilter = [];
			var oList = new List({
				items: {
					path: "/Products",
					template: new StandardListItem({
						title: "{ProductName}",
						counter: "{UnitsInStock}"
					})
				}
			});
			// aFilter.push(new Filter("SupplierID", sap.ui.model.FilterOperator.EQ, oItem.getAggregation("cells")[0].getProperty("text")));
			if (!this.oDraggableDialog) {
				this.oDraggableDialog = new Dialog({
					title: "Draggable Available Products",
					contentWidth: "550px",
					contentHeight: "300px",
					draggable: true,
					content: oList,
					endButton: new Button({
						text: "Close",
						press: function () {
							this.oDraggableDialog.close();
						}.bind(this)
					})
				});

				// console.log(oList);
				// console.log(oList.mBindingInfos.items);
				// // console.log(oList.getBindingContext());
				// console.log(oList.getBinding("items"));
				// var oBinding = oList.mBindingInfos.items;
				// oBinding.filter(aFilter);

				//to get access to the controller's model
				this.getView().addDependent(this.oDraggableDialog);
			}

			this.oDraggableDialog.open();
		}

	});
});