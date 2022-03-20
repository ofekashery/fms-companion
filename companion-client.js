const WebSocket = require("ws");
const fetch = require("node-fetch");

const mapButtons = {
  "Field 1": {
    page: 1,
    button: 2,
  },
  FMS_PREVIEW: {
    page: 1,
    button: 0,
  },
  FMS_SCORE: {
    page: 1,
    button: 0,
  },
  FMS_RESULT: {
    page: 1,
    button: 0,
  },
  FMS_FULL: {
    page: 1,
    button: 0,
  },
  FMS_ALLIANCE: {
    page: 1,
    button: 0,
  },
  FMS_AWARDS: {
    page: 1,
    button: 0,
  },
  FMS_HIDDEN: {
    page: 1,
    button: 0,
  },
};

const fmsServer = new WebSocket("ws://64.227.44.99:3323");

fmsServer.on("open", () => {
  console.log("FMS Server connected");
});

fmsServer.on("message", (data) => {
  const json = JSON.parse(data.toString());
  const reply = (msg) =>
    fmsServer.send(
      JSON.stringify({
        "message-id": json["message-id"],
        status: "ok",
        ...msg,
      })
    );

  const requestType = json["request-type"];

  if (requestType === "GetAuthRequired") {
    return reply({ authRequired: false });
  } else if (requestType === "GetSceneList") {
    return reply({
      currentScene: "FIRST",
      scenes: [
        { name: "FIRST", sources: [] },
        { name: "FMS_PREVIEW", sources: [] },
        { name: "FMS_SCORE", sources: [] },
        { name: "FMS_RESULT", sources: [] },
        { name: "FMS_FULL", sources: [] },
        { name: "FMS_ALLIANCE", sources: [] },
        { name: "FMS_AWARDS", sources: [] },
        { name: "FMS_HIDDEN", sources: [] },
      ],
    });
  } else if (requestType === "SetCurrentScene") {
    const sceneName = json["scene-name"];
    const button = mapButtons[sceneName];

    console.log(`Setting current scene to '${sceneName}'`, button);
    if (button) {
      fetch(
        "http://localhost:8888/press/bank/" + button.page + "/" + button?.button
      );
    }
  }
});

fmsServer.on("close", () => {
  console.log("FMS server closed");
});
