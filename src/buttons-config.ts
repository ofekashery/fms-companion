import fs from 'fs/promises';
import { SceneName } from './scenes';

type Values = {
  [key in SceneName]?: string;
};

class ButtonsConfig {
  private values: Values = {};

  setAll(values: Values) {
    Object.assign(this.values, values);
  }

  getAll() {
    return this.values;
  }

  setButton(scene: SceneName, value: string) {
    this.values[scene] = value;
  }

  getButton(scene: SceneName) {
    return this.values[scene];
  }

  save() {
    return fs.writeFile('config.json', JSON.stringify(this.values, null, 2));
  }

  load() {
    return fs
      .readFile('config.json', 'utf8')
      .then((data) => {
        Object.assign(this.values, JSON.parse(data));
        console.log('Successfully loaded config file.');
      })
      .catch(() => {
        console.log('No config file found.');
      });
  }
}

export default new ButtonsConfig();
