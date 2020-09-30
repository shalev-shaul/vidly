function init() {
  // Raven.config(
  //   "https://1fa5cd45b2e441b1b2b78659e4a820eb@o450694.ingest.sentry.io/5435430",
  //   {
  //     release: "1-0-0",
  //     environment: "development-test",
  //   }
  // ).install();
}

function log(error) {
  console.error(error);
  //Raven.captureException(error);
}

export default {
  init,
  log,
};
