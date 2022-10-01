
import { page as homePage } from './pages/home';

export interface Page {
  name: string;
  html: HTMLElement;
  onload: () => void;
}

interface PageManager {
  pages: Array<Page>;
  container?: HTMLDivElement;
  init: (container: HTMLDivElement) => void;
  setPage: (page: Page) => void;
};

export const pageManager: PageManager = {
  pages: [],
  container: undefined,
  init: (container: HTMLDivElement) => {
    pageManager.container = container;
  },
  setPage: (page) => {
    if (pageManager.container) {
      pageManager.container.innerHTML = page.html.outerHTML;
      page.onload();
    }
  },
};

window.onload = () => {
  pageManager.init(<HTMLDivElement>document.getElementById('frame'));
  pageManager.setPage(homePage);
  console.log('hit');
};

/*

continue working on pageManager:
 - implement functions

 figure out import/export
 -



let myObject = {
  field1: value1,
  field2: value2
};
export {myObject as default};
import 

*/