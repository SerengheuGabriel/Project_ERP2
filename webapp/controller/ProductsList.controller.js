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
            var sQuery = oEvent.getParameter("query");

            if(isNaN(parseInt(sQuery)))
                var oFilter = new Filter("ProductName", FilterOperator.Contains, sQuery);
            else
                var oFilter = new Filter("ProductID", FilterOperator.EQ,sQuery);
            var aFilter = new Filter({
                filters:[oFilter],
                and:false
            })
            // filter binding
            var oList = this.byId("productsTable");
            var oBinding = oList.getBinding();
            oBinding.filter(aFilter);

        },  
		onSelectionChange: function (oEvent) {
			var oTable = oEvent.getSource();
			var aSelectedIndices = oTable.getSelectedIndices();
			var oSelectedItem = oTable.getContextByIndex(aSelectedIndices[0]);
			  var oModel = oTable.getModel();
			  var oSelectedEntry = oModel.getProperty(oSelectedItem.getPath());
	  
			  this._openDetailsDialog(oSelectedEntry);
		},
		_openDetailsDialog: function(oSelectedEntry) {
			var oView = this.getView();
			var oDialog = oView.byId("productInfoDialog");

			oView.setModel(new sap.ui.model.json.JSONModel(oSelectedEntry), "productInfo");
			oDialog.open();
		},
		closeDialog: function() {
			var oView = this.getView();
			var oDialog = oView.byId("productInfoDialog");
	  
			oDialog.close();
		}

	});
});