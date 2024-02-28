// File#: _1_preloader

(function () {
	const js_is_enabled = document.documentElement?.classList.contains('js');

	if (!js_is_enabled) return;

	setTimeout(() => {
		const preloader = document.getElementById('loader');
		preloader?.classList.add('done');

		new Promise((resolve) => setTimeout(resolve, 500)).then(() => {
			preloader?.remove();
		});
	}, 500);
})();
