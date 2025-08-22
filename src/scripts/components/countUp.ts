interface CountUpOptions {
    separator: boolean;
    duration: number;
    decimal: boolean;
    initial: number;
    delta: number;
}

class CountUp {
    private element: HTMLElement;
    private initialValue: number;
    private finalValue: number;
    private deltaValue: number;
    private intervalId: number;
    private animationTriggered: boolean;
    private srClass: string;
    private currentTime: number | null;
    private options: CountUpOptions;

    constructor(element: HTMLElement, options?: Partial<CountUpOptions>) {
        this.element = element;
        this.options = {
            separator: false,
            duration: 3000,
            decimal: false,
            initial: 0,
            delta: 0,
            ...options
        };
        this.initialValue = parseFloat(this.options.initial.toString());
        this.finalValue = parseFloat(
            this.element.textContent ? this.element.textContent : '0'
        );
        this.deltaValue = parseFloat(this.options.delta.toString());
        this.intervalId = 0;
        this.animationTriggered = false;
        this.srClass = 'sr-only';
        this.currentTime = null;
        this.initCountUp();
    }

    reset = () => {
        window.cancelAnimationFrame(this.intervalId);
        this.element.textContent = this.initialValue.toString();
    };

    restart = () => this.countUpAnimate();

    initCountUp = () => {
        this.initialValue = this.getCountupStart();
        this.initCountUpSr();

        // listen for the element to enter the viewport -> start animation
        const observer = new IntersectionObserver(
            this.countupObserve.bind(this),
            {
                threshold: [0, 0.1]
            }
        );
        observer.observe(this.element);

        this.element.addEventListener('countUpReset', () => {
            this.reset();
        });
        this.element.addEventListener('countUpRestart', () => {
            this.restart();
        });
    };

    countUpShow = () => {
        // reveal countup after it has been initialized
        if (!this.element) {
            console.error('The element is null or undefined.');
            return;
        }

        const parentCountup = this.element.closest('.countup');
        if (parentCountup === null) {
            console.error(
                'The parent node with class "countup" is null or not found.'
            );
            return;
        }

        parentCountup.classList.add('countup--is-visible');
    };

    countupObserve = (entries: any, observer: IntersectionObserver) => {
        // observe countup position -> start animation when inside viewport
        if (
            entries[0].intersectionRatio.toFixed(1) > 0 &&
            !this.animationTriggered
        ) {
            this.countUpAnimate();
        }
    };

    runCountUp = (timestamp: number) => {
        if (!this.currentTime) this.currentTime = timestamp;

        let progress = timestamp - this.currentTime;
        if (progress > this.options.duration) progress = this.options.duration;
        const val = this.getValEaseOut(
            progress,
            this.initialValue,
            this.finalValue - this.initialValue,
            this.options.duration
        );
        this.element.textContent = this.getCountUpValue(val).toString();
        if (progress < this.options.duration) {
            this.intervalId = window.requestAnimationFrame(this.runCountUp);
        } else {
            this.countUpComplete();
        }
    };

    countUpAnimate() {
        // animate countup
        this.element.textContent = this.initialValue.toString();
        this.countUpShow();
        window.cancelAnimationFrame(this.intervalId);
        this.currentTime = null;

        this.intervalId = window.requestAnimationFrame(this.runCountUp);
    }

    getCountUpValue = (val: number) => {
        // reset new countup value to proper decimal places+separator
        if (this.options.decimal) {
            val = parseFloat(val.toFixed());
        } else {
            val = parseInt(val.toString());
        }

        if (this.options.separator) {
            return `${val}+`;
        }

        return val;
    };

    countUpComplete = () => {
        // emit event when animation is over
        this.element.dispatchEvent(new CustomEvent('countUpComplete'));
        this.animationTriggered = true;
    };

    initCountUpSr = () => {
        // make sure countup is accessible
        // hide elements that will be animated to SR
        this.element.setAttribute('aria-hidden', 'true');
        // create new element with visible final value - accessible to SR only
        let srValue = document.createElement('span');
        srValue.textContent = this.finalValue.toString();
        srValue.classList.add(this.srClass);
        if (!this.element || !this.element.parentNode) {
            console.error(
                'The element or its parent node is null or undefined.'
            );
            return;
        }

        this.element.parentNode.insertBefore(srValue, this.element.nextSibling);
    };

    getCountupStart = () => {
        return this.deltaValue > 0
            ? this.finalValue - this.deltaValue
            : this.initialValue;
    };

    getValEaseOut = (t: number, b: number, c: number, d: number) => {
        t /= d;
        return -c * t * (t - 2) + b;
    };
}

export { CountUp };
