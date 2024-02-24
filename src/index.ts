import yargs from 'yargs';
import { setupUiServer } from './ui';
import buttonsConfig from './buttons-config';
import FMSWebSocketClient from './fms-client';
import CompanionAccessor from './companion';
import scenes, { SceneName } from './scenes';

const argv = yargs
  .option('ws', {
    alias: 'w',
    describe: 'FMS WebSocket URI',
    demandOption: true,
    type: 'string',
  })
  .option('companion', {
    alias: 'c',
    describe: 'Companion host URL',
    default: 'localhost:8888',
  })
  .parseSync();

(() => {
  const fmsClient = new FMSWebSocketClient(argv.ws);
  const companion = new CompanionAccessor(argv.companion);

  fmsClient.requestHandlers = {
    GetVersion: () => ({ obsVersion: '5.0.0-mock.0' }),
    GetSceneList: () => {
      return {
        currentProgramSceneName: 'FIRST',
        currentPreviewSceneName: 'FIRST',
        scenes: [
          { sceneName: 'FIRST', sources: [] },
          ...scenes.map((scene) => ({
            sceneName: scene.name,
            sources: [],
          })),
        ],
      };
    },
    SetCurrentProgramScene: ({ sceneName }: { sceneName: SceneName }) => {
      const buttonId = buttonsConfig.getButton(sceneName);
      console.log(
        `Scene changed to: ${sceneName}, triggering button: ${buttonId}`
      );
      if (buttonId) {
        companion
          .pressButton(buttonId)
          .then(() => console.log(`Button ${buttonId} pressed successfully`))
          .catch((e) => console.error(`Error pressing button ${buttonId}:`, e));
      }
    },
  };

  setupUiServer();
  buttonsConfig.load();
})();
