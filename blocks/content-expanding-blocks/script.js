baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-expanding-blocks");
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

                handleItems(self);
            });
        }

        const handleItems = (self) => {
            const items = self.find(".item");
            if (!items.length) return;

            const activateImage = (subSelf) => {
                items.removeClass("active");
                subSelf.classList.add("active");
            }

            const mm = gsap.matchMedia();

            mm.add({
                isDesktop: `(min-width: 992px)`,
                isMobile: `(max-width: 991.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                if (isDesktop) {
                    ScrollTrigger.batch(items, {
                        start: "top 40%",
                        end: "top 20%",
                        onEnter: (batch) => {
                            batch.forEach((subSelf) => activateImage(subSelf));
                        },
                        onEnterBack: (batch) => {
                            batch.forEach((subSelf) => activateImage(subSelf));
                        }
                    });
                }

                if (isMobile) {
                    baunfire.smoother && baunfire.smoother.effects(parallaxEl, { speed: 'clamp(1.4)' });
                }

                return () => { }
            });
        }

        script();
    }
});
