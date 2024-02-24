const OBSWebSocket = require('obs-websocket-js').default;
const obs = new OBSWebSocket();

obs
  .connect('ws://localhost:1235', '5555')
  .then(async () => {
    console.log('Server is connected!');

    const sceneList = await obs.call('GetSceneList');
    console.log(sceneList);

    await obs.call('SetCurrentProgramScene', {
      sceneName: 'FMS_FULL',
    });
  })
  .catch((err) => {
    console.error('Failed to connect to server', err);
  });
