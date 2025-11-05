baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-secondary-nav");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                const snav = self.find(".s-nav");

                ScrollTrigger.create({
                    trigger: self,
                    pin: snav,
                    pinSpacing: false,
                    start: "top top",
                    end: "max",
                    pinType: "fixed", //pinType: window.isTouchDevice() ? "fixed" : "transform",
                    toggleClass: { targets: self, className: "active" },
                });

                mobileDD(self);
            });
        }

        const mobileDD = (self) => {
            const sNavMobileSelect = self.find(".s-nav-mobile-select");
            const sNavMobileItems = self.find(".anchor");
            const sNavSelectText = self.find(".s-nav-mobile-select p");

            sNavMobileSelect.click(function () {
                $(this).toggleClass("open");
            });

            sNavMobileItems.each(function () {
                const subSelf = $(this);
                const href = subSelf.attr("href");
                if (!href || href == '#') return;

                let target = $(href);
                if (!target) return;

                if (!target.hasClass("in-center")) {
                    target = target.parent();
                }

                ScrollTrigger.create({
                    trigger: target,
                    start: "top 60%",
                    end: "bottom 60%",
                    onEnter: () => handleDDState(sNavSelectText, subSelf.text()),
                    onEnterBack: () => handleDDState(sNavSelectText, subSelf.text())
                });
            });
        }

        const handleDDState = (text, value) => {
            text.text(value);
        }

        script();
    }
});
