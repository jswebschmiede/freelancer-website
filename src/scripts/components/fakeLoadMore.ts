class FakeLoadMore {
	private element: HTMLElement;
	private elementItems: NodeListOf<HTMLElement>;
	private loadmoreBtn: HTMLElement | null;
	private k = 3;
	private j = 9;

	constructor(element: HTMLElement) {
		this.element = element;
		this.elementItems = this.element.querySelectorAll('a.card') || null;
		this.loadmoreBtn = document.querySelector('.ajax-load-more') || null;

		console.log(this.elementItems);
		this.init();
	}

	private init(): void {
		if (!this.loadmoreBtn) {
			console.error('No loadmore button found');
			return;
		}

		this.loadmoreBtn.addEventListener('click', this.handleClick);
	}

	private handleClick = (event: Event): void => {
		event.preventDefault();
		event.stopPropagation();

		const range = `a:nth-child(n+${this.k}):nth-child(-n+${this.j})`;

		this.element.querySelectorAll(range).forEach((item) => {
			item.setAttribute('style', 'display: block');
		});

		if (this.elementItems.length <= this.j) {
			this.loadmoreBtn?.parentElement.parentElement.classList.add('hidden');
		} else {
			this.k += 3;
			this.j += 3;
		}
	};
}

export { FakeLoadMore };
