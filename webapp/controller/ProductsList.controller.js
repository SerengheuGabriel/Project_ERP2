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
            //var aFilter = [];
            var sQuery = oEvent.getParameter("query");
        
            //aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));

            // aFilter.push(new Filter({filters:[new Filter("ProductName", FilterOperator.Contains, sQuery),
            //      new Filter("ProductID", FilterOperator.Contains, sQuery)], and: false}));

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

			//console.log(oSelectedEntry);
			//oDialog.bindElement(oSelectedEntry);
			oView.setModel(new sap.ui.model.json.JSONModel(oSelectedEntry), "productInfo");
			oDialog.open();
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