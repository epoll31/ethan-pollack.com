import { Page } from '../pageManager';

export const page: Page = {
    name: 'homePage',
    html:  document.createElement("div"),
    onload: () => {
        console.log('hit');
    }
};