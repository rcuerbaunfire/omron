baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.post-blog");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                baunfire.Animation.headingAnimation(self.find(".main-title .inner-word"), {
                    trigger: self,
                    start: "top 60%",
                }, {
                    onStart: () => {
                        baunfire.Animation.descAnimation(self.find(".para-desc"));
                    }
                });

                // const mm = gsap.matchMedia();
                // const parallaxEl = self.find(".parallax");

                // mm.add({
                //     isDesktop: `(min-width: 992px)`,
                //     isMobile: `(max-width: 991.98px)`,
                // }, (context) => {
                //     let { isDesktop, isMobile } = context.conditions;

                //     if (isDesktop) {
                //         baunfire.smoother && baunfire.smoother.effects(parallaxEl, { speed: 'clamp(1.2)' });
                //     }

                //     if (isMobile) {
                //         baunfire.smoother && baunfire.smoother.effects(parallaxEl, { speed: 1 });
                //     }

                //     return () => { }
                // });
            });
        }

        script();
    }
});
