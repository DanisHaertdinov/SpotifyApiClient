export default class UserProfile {
  constructor(profile) {
    this._userProfile = profile;
  }

  static adaptToClient(profile) {
    return {
      name: profile[`display_name`],
      id: profile[`id`],
    };
  }

  setUserProfile(profile) {
    this._userProfile = profile;
  }

  getUserProfile() {
    return this._userProfile;
  }
}
