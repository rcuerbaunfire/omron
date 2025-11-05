baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-rich-text-rc-start");
            if (!els.length) return;

            els.each(function () {
                const $start = $(this);
                const $end = $start.nextAll('.content-rich-text-rc-end').first();
                const $container = $start.find('.content');

                if ($end.length && $container.length) {
                    const $elementsInBetween = $start.nextUntil($end);
                    $container.append($elementsInBetween);
                    $start.removeClass('content-rich-text-rc-start').addClass('content-rich-text');
                    $end.remove();
                }
            });

            baunfire.Global.screenSizeChange();
            richTexts();
        }

        const richTexts = () => {
            const els = $("section.content-rich-text");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                let heading = self.find(".main-title .inner-word");
                baunfire.Animation.headingAnimation(heading, {
                    trigger: self,
                    start: "top 60%",
                });

                const contentArea = self.find(".content-outer");

                stylizeButtons(contentArea);
                handleLottie(self, self.find(".lottie"));
            });
        }

        const stylizeButtons = (container) => {
            const submitBTN = container.find('a.wp-block-button__link.wp-element-button, a.wp-block-file__button');
            const iconHTML = $('<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.55697 10.375L11.8486 6.94618L8.55697 3.51736" stroke="white" stroke-width="1.5" stroke-miterlimit="10"></path><path d="M1.01411 0.500006L1.0141 5.84896C1.0141 6.45463 1.50566 6.94618 2.11133 6.94618L11.9863 6.94618" stroke="white" stroke-width="1.5" stroke-miterlimit="10"></path></svg>');

            submitBTN.each(function () {
                const subSelf = $(this);
                let buttonHTML = $('<div class="btn post-btn filled blue"></div>');

                if (subSelf.parent().hasClass("has-border")) {
                    buttonHTML = $('<div class="btn post-btn has-border blue"></div>');
                }

                subSelf.wrap(buttonHTML);
                subSelf.after(iconHTML);
            })

            baunfire.Global.screenSizeChange();
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