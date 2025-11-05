baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-50-50-overlapping-blocks");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                const items = self.find(".item");
                if (!items.length) return;

                items.each(function () {
                    const subSelf = $(this);
                    const ticker = subSelf.find(".ticker");

                    baunfire.Animation.headingAnimation(subSelf.find(".main-title .inner-word"), {
                        trigger: subSelf,
                        start: "top 60%",
                    }, {
                        onStart: () => {
                            baunfire.Animation.descAnimation(self.find(".para-desc"));
                        }
                    });

                    gsap.to(ticker,
                        {
                            y: 0,
                            duration: 3,
                            ease: "expo.out",
                            delay: 0.6,
                            scrollTrigger: {
                                trigger: subSelf,
                                start: "top 60%"
                            }
                        }
                    )
                })
            });
        }

        script();
    }
});