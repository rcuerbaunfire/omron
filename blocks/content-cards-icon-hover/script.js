baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-cards-icon-hover");
            if (!els.length) return;

            let resizeTimeout;
            let currentWindowWidth = $(window).width();

            els.each(function () {
                const self = $(this);

                let heading = self.find(".main-title .inner-word");
                baunfire.Animation.headingAnimation(heading, {
                    trigger: self,
                    start: "top 60%"
                });


                const items = self.find(".item");
                if (!items.length) return;

                items.each(function () {
                    const subSelf = $(this);
                    baunfire.Animation.orbAnimation(subSelf, subSelf.find(".orb"));
                });

                adjustPosition(items);

                let mm = window.matchMedia("(max-width: 992px)");

                $(window).on("resize", () => {
                    if (mm.matches) return;

                    if ($(window).width() !== currentWindowWidth) {
                        currentWindowWidth = $(window).width();
                        clearTimeout(resizeTimeout);
                        adjustPosition(items);
                    }
                });

                // const parallaxEl = self.find(".parallax");
                // parallaxItem(parallaxEl);
            });
        }

        const parallaxItem = (parallaxEl) => {
            const mm = gsap.matchMedia();

            mm.add({
                isDesktop: `(min-width: 992px)`,
                isMobile: `(max-width: 991.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                if (isDesktop) {
                    baunfire.smoother && baunfire.smoother.effects(parallaxEl, { speed: 'clamp(1.2)' });
                }

                if (isMobile) {
                    baunfire.smoother && baunfire.smoother.effects(parallaxEl, { speed: 'clamp(1.4)' });
                }

                return () => { }
            });
        }

        const adjustPosition = (items) => {
            items.removeClass("active");

            items.each(function (index) {
                const subSelf = $(this);
                const itemContent = subSelf.find(".item-content");
                const itemDesc = subSelf.find(".item-desc");

                gsap.set(itemContent, {
                    y: () => 1 * itemDesc.outerHeight(),
                })
            });

            setTimeout(() => {
                items.addClass("active");
            }, 600);
        }

        script();
    }
});
