baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-accordion-table");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
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

            items.each(function () {
                const subSelf = $(this);
                const trigger = subSelf.find(".acc-close");

                trigger.click(function () {
                    if (subSelf.hasClass("active")) {
                        subSelf.removeClass("active");
                    } else {
                        items.removeClass("active");
                        subSelf.addClass("active");
                    }

                    baunfire.Global.screenSizeChange();
                });
            });
        };

        script();
    }
});