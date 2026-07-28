export class AvatarLoader {
  private modelPath = "/avatar/roy.vrm";

  getModelPath(): string {
    return this.modelPath;
  }

  async load(): Promise<string> {
    return this.modelPath;
  }
}
