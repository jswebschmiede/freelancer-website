class totopButton {
    private element: HTMLElement;
    private progressPath: SVGPathElement;
    private totalLength: number;

    constructor(element: HTMLElement) {
        this.element = element;
        this.progressPath = this.element.querySelector(
            '.svg-content path'
        ) as SVGPathElement;
        this.totalLength = this.progressPath.getTotalLength();
        this.setupProgress();
        this.handleScroll();
        this.updateProgressWrap();
        this.updateProgress();
        this.init();
    }

    init = () => {
        this.handleScroll();
        this.setupProgress();
    };

    setupProgress = () => {
        this.progressPath.style.transition = 'none';
        this.progressPath.style.strokeDasharray = `${this.totalLength} ${this.totalLength}`;
        this.progressPath.style.strokeDashoffset = this.totalLength.toString();
        this.progressPath.getBoundingClientRect();
        this.progressPath.style.transition = 'stroke-dashoffset 10ms linear';

        this.updateProgress();
        window.addEventListener('scroll', this.updateProgress);
    };

    updateProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const windowHeight =
            window.innerHeight || document.documentElement.clientHeight;
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
        );
        const offset =
            this.totalLength -
            (scrollTop * this.totalLength) / (documentHeight - windowHeight);
        this.progressPath.style.strokeDashoffset = offset.toString();
    };

    updateProgressWrap = () => {
        if (window.scrollY > 50) {
            this.element.classList.remove(
                'opacity-0',
                'translate-y-5',
                'invisible'
            );
            this.element.classList.add('opacity-1', 'translate-y-0', 'visible');
        } else {
            this.element.classList.remove(
                'opacity-1',
                'translate-y-0',
                'visible'
            );
            this.element.classList.add(
                'opacity-0',
                'translate-y-5',
                'invisible'
            );
        }
    };

    handleScroll = () => {
        this.updateProgressWrap();
        window.addEventListener('scroll', this.updateProgressWrap);

        this.element.addEventListener('click', function (event) {
            event.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return false;
        });
    };
}

export { totopButton };
