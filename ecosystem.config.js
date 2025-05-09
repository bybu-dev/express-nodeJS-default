module.exports = {
    apps: [
      {
        name: "app",
        script: "./dist/index.js",
        instances: "max",
        exec_mode: "cluster",
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  