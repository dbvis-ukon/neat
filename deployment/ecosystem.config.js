module.exports = {
    apps : [{
      name: "DBVIS VastChallenge 2019 Grand Challenge",
      script: "./dist/app.js",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }]
  }