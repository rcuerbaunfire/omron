baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-stats");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                handleTextHighlight(self);
                handleCounters(self);
                // handleParallax(self);
            });
        }

        const handleTextHighlight = (self) => {
            const mainTitle = self.find(".main-title");
            if (!mainTitle.length) return;

            const words = mainTitle.find(".word");
            if (!words.length) return;

            const mm = gsap.matchMedia();

            mm.add({
                isDesktop: `(min-width: 992px)`,
                isMobile: `(max-width: 991.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: self,
                        scrub: isDesktop ? 1 : true,
                        start: isDesktop ? "top 70%" : "top 60%",
                        end: "top 20%"
                    },
                });

                words.each(function () {
                    const subSelf = $(this);

                    tl.to(subSelf, {
                        backgroundPositionX: 0,
                        ease: "none",
                    });
                })

                return () => { }
            });
        }

        const handleCounters = (self) => {
            const items = self.find(".item");
            if (!items.length) return;

            items.each(function () {
                const subSelf = $(this);
                const counter = subSelf.find("span");
                const amount = counter.data("amount");

                gsap.fromTo(counter,
                    {
                        textContent: 0,
                    },
                    {
                        textContent: amount,
                        duration: 1.2,
                        snap: { textContent: 1 },
                        ease: "linear",
                        stagger: {
                            each: 0.3,
                            onUpdate: function () {
                                this.targets()[0].innerHTML = numberWithCommas(Math.ceil(this.targets()[0].textContent));
                            },
                        },
                        scrollTrigger: {
                            trigger: self,
                            start: "top 40%",
                            invalidateOnRefresh: true
                        },
                    }
                )

                baunfire.Animation.orbAnimation(subSelf, subSelf.find(".orb"));
            });
        }

        const numberWithCommas = (x) => {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        const handleParallax = (self) => {
            const parallaxEl = self.find(".parallax");
            if (!parallaxEl.length) return;

            const mm = gsap.matchMedia();

            mm.add({
                isDesktop: `(min-width: 992px)`,
                isMobile: `(max-width: 991.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                if (isDesktop) {
                    baunfire.smoother && baunfire.smoother.effects(parallaxEl, { speed: 'clamp(0.94)' });
                }

                if (isMobile) {
                    baunfire.smoother && baunfire.smoother.effects(parallaxEl, { speed: 'clamp(1.1)' });
                }

                return () => { }
            });
        }

        script();
    }
});
