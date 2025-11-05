baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-products-carousel");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                let items = self.find(".item");
                let itemCount = items.length;

                if (itemCount > 1) {
                    let arrowIndex = 0;

                    const arrowContainer = self.find(".arrows");
                    arrowContainer.addClass("active");

                    const arrowLeft = self.find(".ar-l");
                    const arrowRight = self.find(".ar-r");

                    arrowRight.click(function () {
                        if (arrowIndex + 1 < itemCount) {
                            arrowIndex++;
                        } else {
                            arrowIndex = 0;
                        }

                        let targetItem = self.find(`.item[data-index="${arrowIndex}"]`);
                        itemAnimation(targetItem, items);
                    });

                    arrowLeft.click(function () {
                        if (arrowIndex - 1 >= 0) {
                            arrowIndex--;
                        } else {
                            arrowIndex = itemCount - 1;
                        }

                        let targetItem = self.find(`.item[data-index="${arrowIndex}"]`);
                        itemAnimation(targetItem, items);
                    })
                }

                handleLottie(self, self.find(".lottie"));
                // handleParallax(self.find(".parallax"));

                baunfire.Animation.headingAnimation(self.find(".main-title .inner-word"), {
                    trigger: self,
                    start: "top 60%",
                }, {
                    onStart: () => {
                        baunfire.Animation.descAnimation(self.find(".para-desc"));
                    }
                });

                baunfire.Animation.headingAnimation(items.first().find("h4 .inner-word"));
                baunfire.Animation.centeredOrbAnimation(self.find(".box"), self.find(".orb"));
            });
        }

        const itemAnimation = (targetItem, items) => {
            if (targetItem.length) {
                items.removeClass("active");
                targetItem.addClass("active");

                baunfire.Animation.headingAnimation(targetItem.find("h4 .inner-word"), null, { delay: 0.3 });
            }
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
                    baunfire.smoother && baunfire.smoother.effects(el, { speed: 'clamp(0.94)' });
                }

                if (isMobile) {
                    baunfire.smoother && baunfire.smoother.effects(el, { speed: 1 });
                }

                return () => { }
            });
        }

        const handleLottie = (container, el) => {
            if (!el.length) return;

            const path = el.data("json");
            if (!path.length) return;

            const animation = lottie.loadAnimation({
                container: el.get(0),
                renderer: "svg",
                loop: true,
                autoplay: false,
                path: path
            });

            ScrollTrigger.create({
                trigger: container,
                start: "top 60%",
                end: "bottom top",
                onEnter: () => animation.play(),
                onLeave: () => animation.pause(),
                onEnterBack: () => animation.play(),
                onLeaveBack: () => animation.pause()
            })
        }

        script();
    }
});