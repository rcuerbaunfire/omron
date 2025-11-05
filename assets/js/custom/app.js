(function (w) {
    'use strict';

    const $ = jQuery.noConflict();

    const baunfire = {
        $,
        initialized: false,
        modules: [],
        init() {
            if (this.initialized) return;
            this.initialized = true;

            this.modules.forEach(mod => {
                if (typeof mod.init === 'function') {
                    mod.init(baunfire);
                }
            });
        },
        smoother: null,
        smoothScroll() {
            this.lenis = new Lenis({
                anchors: true,
                allowNestedScroll: true
            });

            this.lenis.on('scroll', ScrollTrigger.update);

            gsap.ticker.add((time) => {
                this.lenis.raf(time * 1000);
            });

            gsap.ticker.lagSmoothing(0);
        },
        addModule(mod) {
            this.modules.push(mod);
        },
        load() {
            console.log('Baunfire loaded');
        },
        ready(callback) {
            // baunfire.smoothScroll();
            baunfire.init();
            if (typeof callback === 'function') callback(baunfire);
        }
    };

    w.baunfire = baunfire;

})(window);