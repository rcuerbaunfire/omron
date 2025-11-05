baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.resources-featured-block");
            if (!els.length) return;

            let mm = window.matchMedia("(max-width: 767px)");

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

                handleLottie(self, self.find(".lottie"));

                const items = self.find('.item');
                if (!items.length) return;

                items.each(function () {
                    const subSelf = $(this);
                    const contentArea = subSelf.find(".item-content");

                    contentArea.hover(
                        function () {
                            if (subSelf.hasClass("active")) return;

                            items.removeClass("active");
                            subSelf.addClass("active");

                            if (mm.matches) {
                                setTimeout(() => {
                                    subSelf.get(0).scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'start'
                                    });
                                }, 300);
                            }
                        }, function () {
                            return;
                        }
                    );
                });
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
