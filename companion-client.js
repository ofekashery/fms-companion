const WebSocket = require("ws");
const fetch = require("node-fetch");

const mapButtons = {
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

const camelToScore = (key) => {
  const result = key.replace(/([A-Z])/g, " $1");
  return result.split(" ").join("-").toLowerCase();
};

fmsServer.on("open", () => {
  console.log("FMS Server connected");
});

fmsServer.on("message", (data) => {
  const json = JSON.parse(data.toString());
  const reply = (msg) => {
    const data = {
      messageId: json["message-id"],
      status: "ok",
      ...msg,
    };

    fmsServer.send(
      JSON.stringify({
        ...data,
        ...Object.fromEntries(
          Object.entries(data).map(([key, val]) => [camelToScore(key), val])
        ),
      })
    );
  };

  const requestType = json["request-type"];

  if (requestType === "GetAuthRequired") {
    return reply({ authRequired: false });
  } else if (requestType === "GetVersion") {
    return reply({
      version: 1.1,
      availableRequests:
        "AddFilterToSource,AddSceneItem,Authenticate,BroadcastCustomMessage,CreateScene,CreateSource,DeleteSceneItem,DisableStudioMode,DuplicateSceneItem,EnableStudioMode,ExecuteBatch,GetAudioActive,GetAudioMonitorType,GetAudioTracks,GetAuthRequired,GetBrowserSourceProperties,GetCurrentProfile,GetCurrentScene,GetCurrentSceneCollection,GetCurrentTransition,GetFilenameFormatting,GetMediaDuration,GetMediaSourcesList,GetMediaState,GetMediaTime,GetMute,GetOutputInfo,GetPreviewScene,GetRecordingFolder,GetRecordingStatus,GetReplayBufferStatus,GetSceneItemList,GetSceneItemProperties,GetSceneList,GetSceneTransitionOverride,GetSourceActive,GetSourceDefaultSettings,GetSourceFilterInfo,GetSourceFilters,GetSourceSettings,GetSourcesList,GetSourceTypesList,GetSpecialSources,GetStats,GetStreamingStatus,GetStreamSettings,GetStudioModeStatus,GetSyncOffset,GetTextFreetype2Properties,GetTextGDIPlusProperties,GetTransitionDuration,GetTransitionList,GetTransitionPosition,GetTransitionSettings,GetVersion,GetVideoInfo,GetVirtualCamStatus,GetVolume,ListOutputs,ListProfiles,ListSceneCollections,MoveSourceFilter,NextMedia,OpenProjector,PauseRecording,PlayPauseMedia,PreviousMedia,RefreshBrowserSource,ReleaseTBar,RemoveFilterFromSource,RemoveSceneTransitionOverride,ReorderSceneItems,ReorderSourceFilter,ResetSceneItem,RestartMedia,ResumeRecording,SaveReplayBuffer,SaveStreamSettings,ScrubMedia,SendCaptions,SetAudioMonitorType,SetAudioTracks,SetBrowserSourceProperties,SetCurrentProfile,SetCurrentScene,SetCurrentSceneCollection,SetCurrentTransition,SetFilenameFormatting,SetHeartbeat,SetMediaTime,SetMute,SetPreviewScene,SetRecordingFolder,SetSceneItemCrop,SetSceneItemPosition,SetSceneItemProperties,SetSceneItemRender,SetSceneItemTransform,SetSceneTransitionOverride,SetSourceFilterSettings,SetSourceFilterVisibility,SetSourceName,SetSourceRender,SetSourceSettings,SetStreamSettings,SetSyncOffset,SetTBarPosition,SetTextFreetype2Properties,SetTextGDIPlusProperties,SetTransitionDuration,SetTransitionSettings,SetVolume,Sleep,StartOutput,StartRecording,StartReplayBuffer,StartStopRecording,StartStopReplayBuffer,StartStopStreaming,StartStopVirtualCam,StartStreaming,StartVirtualCam,StopMedia,StopOutput,StopRecording,StopReplayBuffer,StopStreaming,StopVirtualCam,TakeSourceScreenshot,ToggleMute,ToggleStudioMode,TransitionToProgram,TriggerHotkeyByName,TriggerHotkeyBySequence",
      obsStudioVersion: "27.2.2",
      obsWebsocketVersion: "4.9.1",
      supportedImageExportFormats:
        "bmp,cur,heic,heif,icns,ico,jp2,jpeg,jpg,pbm,pgm,png,ppm,tif,tiff,wbmp,webp,xbm,xpm",
    });
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
