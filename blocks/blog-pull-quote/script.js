baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.post-pull-quote");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                const words = self.find(".word");
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
                            end: "top 30%",
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
            });
        }

        script();
    }
});
