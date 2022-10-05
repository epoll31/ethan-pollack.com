
export interface Page {
  name: string;
  html: HTMLElement;
  onload: () => void;
}

export interface PageManager {
  pages: Array<Page>;
  init: () => void;
  setPage: (href? : string) => void;
};

export const pageManager: PageManager = {
  pages: [],
  init: () => {
  },
  setPage: (href = '../html/main.html') => {
      window.location.href = href;
  },
};

