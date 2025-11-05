baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-big-moment-statement");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                handleWordsAnim(self);
            });
        }

        const handleWordsAnim = (self) => {
            const quote = self.find(".quote-text");
            const words = quote.find(".word");
            if (!quote.length || !words.length) return;

            const mm = gsap.matchMedia();
            mm.add({
                isDesktop: `(min-width: 992px)`,
                isMobile: `(max-width: 991.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: quote,
                        scrub: isDesktop ? 1 : true,
                        start: isDesktop ? "top 70%" : "top 80%",
                        end: isDesktop ? "top 30%" : "top 10%"
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

        script();
    }
});
