import AbstractView from "./abstract.js";

const createAuthorizationTemplate = (link) => {
  return (
    `<div class="authorization" >
      <a href="${link}" class="authorization__link">Click to authorize in Spotify</a>
    </div>`
  );
};

export default class Authorization extends AbstractView {
  constructor(link) {
    super();

    this._link = link;
  }

  getTemplate() {
    return createAuthorizationTemplate(this._link);
  }
}
