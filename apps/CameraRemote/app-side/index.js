import { BaseSideService } from "@zeppos/zml/base-side";

AppSideService(
  BaseSideService({

    onInit() {
      console.log("AppSide initialized");
    },

    onRun() {
      console.log("AppSide running");
    },

    onRequest(req, res) {

      console.log("Request received:");
      console.log(req);

      if (req.method === "hello") {

        res(null, {
          text: "Hello Watch!"
        });

      } else {

        res("Unknown method");

      }

    },

    onDestroy() {
      console.log("AppSide destroyed");
    }

  })
);