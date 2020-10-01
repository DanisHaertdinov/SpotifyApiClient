import {render} from './util/render';
import AuthorizationView from './views/authorization';

const siteMainElement = document.querySelector(`.main`);

render(siteMainElement, new AuthorizationView(`#`));
