baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-simple-accordion");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                baunfire.Animation.headingAnimation(self.find(".main-title .inner-word"), {
                    trigger: self,
                    start: "top 60%",
                });

                handleTab(self);
            });
        }

        const handleTab = (self) => {
            const tabs = self.find(".tab");
            const panels = self.find(".panel");

            if (!tabs.length) return;

            tabs.click(function () {
                if (self.hasClass("active")) return;

                const subSelf = $(this);
                const index = subSelf.data("index");

                const target = self.find(`.panel[data-index='${index}']`);
                if (!target.length) return;

                panels.removeClass("active");
                tabs.removeClass("active");
                subSelf.addClass("active");
                target.addClass("active");
                baunfire.Global.screenSizeChange();
            });

            panels.each(function () {
                const subSelf = $(this);
                handleAccordion(subSelf);
            })

            tabs.first().trigger("click");
            baunfire.Global.screenSizeChange();
        }

        const handleAccordion = (panel) => {
            const items = panel.find(".acc");
            if (!items.length) return;

            let firstLoad = true;

            items.each(function () {
                const subSelf = $(this);
                const head = subSelf.find(".acc-head");

                head.click(function () {
                    if (subSelf.hasClass("active")) return;
                    items.removeClass("active");
                    subSelf.addClass("active");

                    if (!firstLoad) {
                        gsap.to(window, {
                            duration: 0.6,
                            overwrite: true,
                            scrollTo: { y: subSelf, offsetY: 120, autoKill: true },
                            ease: "circ.out",
                        });
                    }

                    baunfire.Global.screenSizeChange();
                    firstLoad = false;
                });
            });

            items.first().find(".acc-head").trigger("click");
        };

        script();
    }
});