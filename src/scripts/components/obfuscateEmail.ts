class ObfuscateEmail {
  private elements: HTMLElement[];

  constructor() {
    this.elements = Array.from(document.querySelectorAll("[data-obfuscate-email]"));
    this.init();
  }

  private createEmailLink() {
    this.elements.forEach((element) => {
      const username = element.dataset.username;
      const domain = element.dataset.domain;

      const email = `${username}@${domain}`;
      const link = document.createElement("a");
      link.href = `mailto:${email}`;
      link.innerHTML = email;
      element.appendChild(link);
    });
  }

  private init() {
    if (this.elements.length) {
      this.createEmailLink();
    }
  }
}

export { ObfuscateEmail };
