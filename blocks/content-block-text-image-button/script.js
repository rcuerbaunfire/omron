baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-block-text-image-button");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                gsap.fromTo(self.find(".box"),
                    {
                        y: 40,
                        autoAlpha: 0
                    },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power2.easeOut",
                        scrollTrigger: {
                            trigger: self,
                            start: "top 60%"
                        }
                    }
                )
            });
        }

        script();
    }
});
