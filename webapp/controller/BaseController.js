sap.ui.define([

    "sap/ui/core/mvc/Controller"
  ], function (Controller) {
  
    "use strict";
   
    return Controller.extend("sap.ui.demo.walkthrough.controller.BaseController", {
   
      // just this.getModel() ...
      getModel: function(sName) {
     
        // ... instead of
        return this.getView().getModel(sName);
   
      },
   
      // just this.getResoureBundle() ... 
      getResourceBundle: function () {
   
        // ... instead of
        return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText();
   
      },
   
    });
   
  });