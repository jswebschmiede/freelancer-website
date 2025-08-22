export class FakeLoadMore {
	private button: HTMLElement | null;
	private itemsToShow: number = 6;
	private items: NodeListOf<Element>;
	private container: HTMLElement | null;

	constructor() {
		this.button = document.querySelector('.ajax-load-more')?.parentElement;
		this.container = document.querySelector('.projects');
		this.items = document.querySelectorAll('.projects > a');

		this.init();
	}

	private init(): void {
		if (!this.button) return;

		this.button.addEventListener('click', (e: Event) => {
			e.preventDefault();
			this.loadMore();
		});

		if (this.getHiddenItems().length === 0) {
			this.button.style.display = 'none';
		}
	}

	private getHiddenItems(): Element[] {
		return Array.from(this.items).filter(
			(item) => window.getComputedStyle(item).display === 'none'
		);
	}

	private loadMore(): void {
		if (!this.container) return;

		const hiddenItems = this.getHiddenItems();
		const itemsToReveal = hiddenItems.slice(0, this.itemsToShow);

		if (itemsToReveal.length === 0) return;

		// Aktuelle Scroll-Position speichern
		const scrollPosition = window.scrollY;

		// Container-Höhe fixieren
		const currentHeight = this.container.offsetHeight;
		this.container.style.height = `${currentHeight}px`;

		itemsToReveal.forEach((item) => {
			(item as HTMLElement).style.display = 'flex';
			item.classList.add('fade-in');
		});

		// Container-Höhe nach Animation wieder freigeben

		this.container!.style.height = 'auto';
		window.scrollTo(0, scrollPosition);

		if (this.getHiddenItems().length === 0) {
			this.button!.style.display = 'none';
		}
	}
}
