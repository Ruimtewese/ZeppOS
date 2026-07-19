import { MessageBuilder } from "@zos/message";

App({
  globalData: {
    messageBuilder: null
  },

  onCreate() {
    console.log("App started");

    const builder = new MessageBuilder();

    builder.connect();

    this.globalData.messageBuilder = builder;
  },

  onDestroy() {
    console.log("App closed");

    if (this.globalData.messageBuilder) {
      this.globalData.messageBuilder.disConnect();
    }
  }
});