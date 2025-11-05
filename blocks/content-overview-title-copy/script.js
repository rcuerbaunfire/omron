baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-overview-title-copy");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                baunfire.Animation.headingAnimation(
                    self.find(".main-title .inner-word"),
                    {
                        trigger: self,
                        start: "top 60%",
                    },
                    {
                        onStart: () => {
                            baunfire.Animation.descAnimation(self.find(".para-desc"));
                        },
                    }
                );

                // handleParallax(self.find(".parallax"));
            });
        }

        const handleParallax = (el) => {
            if (!el.length) return;

            const mm = gsap.matchMedia();

            mm.add({
                isDesktop: `(min-width: 992px)`,
                isMobile: `(max-width: 991.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                if (isDesktop) {
                    baunfire.smoother && baunfire.smoother.effects(el, { speed: 'clamp(1.1)' });
                }

                if (isMobile) {
                    baunfire.smoother && baunfire.smoother.effects(el, { speed: 1 });
                }

                return () => { }
            });
        }

        script();
    }
});
