import { AvatarState, DEFAULT_AVATAR_STATE } from "./AvatarStates";

export class AvatarController {
  private state: AvatarState = DEFAULT_AVATAR_STATE;

  getState(): AvatarState {
    return this.state;
  }

  setState(state: AvatarState) {
    this.state = state;
  }

  is(state: AvatarState): boolean {
    return this.state === state;
  }

  reset() {
    this.state = DEFAULT_AVATAR_STATE;
  }
}
