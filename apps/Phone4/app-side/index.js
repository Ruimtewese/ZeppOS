AppSideService({
  onInit() {
    console.log("AppSide initialized");
  },

  onRun() {
    console.log("AppSide running");
  },

  onRequest(req, res) {
    console.log("Received request:", req);

    res({
      success: true,
      text: "Hello Watch!"
    });
  },

  onDestroy() {
    console.log("AppSide destroyed");
  }
});