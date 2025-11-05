baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-cta-large-image-bg");
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

                animateBoxBG(self.find(".box"), self.find(".box-bg"));
            });
        }

        const animateBoxBG = (box, boxBG) => {
            if (!box.length || !boxBG.length) return;

            gsap.to(boxBG,
                {
                    clipPath: `inset(7rem 5rem round 0.5rem)`,
                    ease: "linear",
                    scrollTrigger: {
                        trigger: box,
                        start: "top 90%",
                        end: "bottom 90%",
                        scrub: 1,
                        invalidateOnRefresh: true
                    }
                },
            );
        };

        script();
    }
});
