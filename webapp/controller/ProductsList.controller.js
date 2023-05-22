sap.ui.define([
	"./BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	"sap/m/Dialog",
	"sap/m/List",
	"sap/m/StandardListItem",
	"sap/m/Button"
], function (BaseController, History, Filter, FilterOperator, Dialog, List, StandardListItem, Button) {
	"use strict";
	return BaseController.extend("sap.ui.demo.walkthrough.controller.ProductsList", {


		onInit: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("products").attachPatternMatched(this._onObjectMatched, this);
		},
		
		_onObjectMatched: function (oEvent) {

			var sPath = this.getView().getModel().createKey("/Suppliers",
                {SupplierID: oEvent.getParameter("arguments").supplierPath});
			console.log(sPath);
            this.getView().bindElement({path: sPath});

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
			
			// aFilter.push(new Filter({filters:[new Filter("ProductName", FilterOperator.Contains, sQuery),
			// new Filter("ProductID", sap.ui.model.FilterOperator.EQ, sQuery)], and: false}));
		
			aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
			aFilter.push(new Filter("ProductID", sap.ui.model.FilterOperator.EQ, sQuery));

			// filter binding
			var oList = this.byId("productsTable");
			var oBinding = oList.getBinding();
			oBinding.filter(aFilter);

		}, 
		onPress: function (oEvent) {
			var oItem = oEvent.getSource();
			var oSelectedProduct = oItem.getBindingContext().getObject();

			var oList = new List({
				items: 
					new StandardListItem({
						title: oSelectedProduct.ProductName,
						description: "{i18n>priceField}" + oSelectedProduct.UnitPrice.substring(0, oSelectedProduct.UnitPrice.length - 2),
						info: oSelectedProduct.QuantityPerUnit,
						fieldGroupIds: toString(oSelectedProduct.CategoryID),
						counter: parseInt(oSelectedProduct.UnitsInStock)
					})
			});
			this.oDraggableDialog = new Dialog({
				title: oSelectedProduct.ProductName,
				contentWidth: "30%",
				contentHeight: "20%",
				draggable: true,
				content: oList,
				endButton: new Button({
					text: "{i18n>closeButton}",
					press: function () {
						this.oDraggableDialog.close();
					}.bind(this)
				})
			});

			//to get access to the controller's model
			this.getView().addDependent(this.oDraggableDialog);

			this.oDraggableDialog.open();
		}

	});
});