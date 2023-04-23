const express = require('express');

const { createProxyMiddleware } = require('http-proxy-middleware');

 

const app = express();

 

app.use('/northwind', createProxyMiddleware({

  target: 'https://services.odata.org/V2/Northwind/Northwind.svc',

  changeOrigin: true,

  pathRewrite: {

    '^/northwind': ''

  }

}));

 

app.use(express.static('webapp'));

 

const port = process.env.PORT || 3000;

app.listen(port, () => {

  console.log(`Server running on port ${port}`);

});