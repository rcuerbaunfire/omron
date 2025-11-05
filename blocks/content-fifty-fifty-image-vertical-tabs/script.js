baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        let mm = window.matchMedia("(max-width: 768px)");

        const script = () => {
            const els = $("section.content-fifty-fifty-image-vertical-tabs");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                baunfire.Animation.headingAnimation(self.find(".main-title .inner-word"), {
                    trigger: self,
                    start: "top 60%",
                });

                handleItems(self);
            });
        }

        const handleItems = (self) => {
            const items = self.find(".item");
            const images = self.find(".item-image");

            if (!items.length) return;
            let firstLoad = true;

            items.click(function () {
                const subSelf = $(this);
                if (subSelf.hasClass("active")) return;

                const index = subSelf.data("index");

                const target = self.find(`.item-image[data-index='${index}']`);
                if (!target.length) return;

                items.removeClass("active");
                images.removeClass("active");
                subSelf.addClass("active");
                target.addClass("active");
                baunfire.Global.screenSizeChange();

                if (mm.matches && !firstLoad) {
                    gsap.to(window, {
                        duration: 0.6,
                        overwrite: true,
                        scrollTo: { y: subSelf, offsetY: 80, autoKill: true },
                        ease: "circ.out",
                    });
                }

                firstLoad = false;
            });

            items.first().trigger("click");
        }

        script();
    }
});
