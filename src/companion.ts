class CompanionAccessor {
  serverUrl: string;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  pressButton(buttonId: string) {
    return fetch(`${this.serverUrl}/press/bank/${buttonId.replace('.', '/')}`);
  }

  setVariable(key: string, value: string) {
    return fetch(`${this.serverUrl}/set/custom-variable/${key}?value=${value}`);
  }
}

export default CompanionAccessor;
