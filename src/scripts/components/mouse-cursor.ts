function followCursor(): void {
	'use strict';

	const myCursor: HTMLElement | null = document.querySelector('.mouse-cursor');

	if (myCursor) {
		if (document.body) {
			let cursorInner: HTMLElement | null = document.querySelector('.cursor-inner');
			let cursorOuter: HTMLElement | null = document.querySelector('.cursor-outer');
			let mouseY = 0;
			let mouseX = 0;
			let isMoving = false;

			window.onmousemove = function (event: MouseEvent): void {
				mouseY = event.clientY;
				mouseX = event.clientX;

				if (!isMoving) {
					if (cursorOuter) {
						cursorOuter.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
					}
				}
				if (cursorInner) {
					cursorInner.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
				}

				const target: HTMLElement = document.elementFromPoint(mouseX, mouseY) as HTMLElement;

				if (target && target.matches('a, .cursor-pointer') && cursorInner && cursorOuter) {
					cursorInner.classList.add(
						'!-ml-[40px]',
						'!-mt-[40px]',
						'!w-[80px]',
						'!h-[80px]',
						'!opacity-30'
					);
					cursorOuter.classList.add('opacity-0');
				} else if (cursorInner && cursorOuter) {
					cursorInner.classList.remove(
						'!-ml-[40px]',
						'!-mt-[40px]',
						'!w-[80px]',
						'!h-[80px]',
						'!opacity-30'
					);
					cursorOuter.classList.remove('opacity-0');
				}
			};

			if (cursorInner) {
				cursorInner.style.visibility = 'visible';
			}
			if (cursorOuter) {
				cursorOuter.style.visibility = 'visible';
			}
		}
	}
}

export { followCursor };
