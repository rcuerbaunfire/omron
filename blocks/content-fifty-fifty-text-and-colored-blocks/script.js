baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-fifty-fifty-text-and-colored-blocks");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                pinContentHeading(self);
                assignOrbAnimation(self.find(".item"));

                baunfire.Animation.headingAnimation(
                    self.find(".main-title .inner-word"),
                    {
                        trigger: self,
                        start: "top 60%",
                    },
                    {
                        onStart: () => {
                            baunfire.Animation.descAnimation(self.find(".para-desc"));
                        }
                    }
                );
            });
        };

        const assignOrbAnimation = (items) => {
            if (!items.length) return;

            items.each(function () {
                const subSelf = $(this);
                baunfire.Animation.orbAnimation(subSelf, subSelf.find(".orb"));
            });
        }

        const pinContentHeading = (self) => {
            const contentArea = self.find(".inner");
            const pinEL = self.find(".inner-content");
            const mm = gsap.matchMedia();
            let pinST = null;

            mm.add({
                isDesktop: `(min-width: 768px)`,
                isMobile: `(max-width: 767.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                if (isDesktop) {
                    if (!pinST) {
                        pinST = ScrollTrigger.create({
                            trigger: pinEL,
                            pin: pinEL,
                            pinSpacing: false,
                            start: `top ${baunfire.Global.convertRemToPixels(6)}px`,
                            endTrigger: contentArea,
                            end: () => `+=${contentArea.outerHeight() - pinEL.outerHeight()}px`,
                            refreshPriority: 1,
                            invalidateOnRefresh: true,
                            pinType: "fixed", //pinType: window.isTouchDevice() ? "fixed" : "transform",
                        });
                    }
                }

                if (isMobile) {
                    if (pinST) {
                        pinST.kill(true);
                        pinST = null;
                    }
                }
                return () => {
                    if (pinST) {
                        pinST.kill(true);
                        pinST = null;
                    }
                };
            });
        };

        script();
    }
});
