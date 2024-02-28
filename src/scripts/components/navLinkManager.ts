class NavLinkManager {
  private element: HTMLElement;
  private navLinks: HTMLElement[];

  constructor(element: HTMLElement) {
    this.element = element;
    this.navLinks = Array.from(this.element.querySelectorAll("a"));

    this.updateNavLinks();
  }

  private updateNavLinks() {
    const path = window.location.pathname;

    this.navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const span = link.children[0] as HTMLElement | null;

      if (span) {
        if (href === path) {
          link.setAttribute("aria-current", "page");
          span.classList.add("w-5", "bg-black-500", "dark:bg-whitegreen-500");
        } else {
          link.removeAttribute("aria-current");
          span.classList.remove("w-5", "bg-black-500", "dark:bg-whitegreen-500");
          span.classList.add("w-0", "bg-black-200", "dark:bg-whitegreen-800");
        }
      }
    });
  }
}

export { NavLinkManager };
