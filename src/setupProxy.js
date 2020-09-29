const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    "/v3/covid-19",
    createProxyMiddleware({
      target: "https://disease.sh",
      changeOrigin: true,
    })
  );
};