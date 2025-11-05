baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-logos");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                const marquee = self.find(".marquee");

                ScrollTrigger.create({
                    trigger: marquee,
                    start: "top 100%",
                    end: "bottom top",
                    onEnter: () => {
                        marquee.removeClass("paused");
                    },
                    onLeave: () => {
                        marquee.addClass("paused");
                    },
                    onEnterBack: () => {
                        marquee.removeClass("paused");
                    },
                    onLeaveBack: () => {
                        marquee.addClass("paused");
                    }
                });
            });
        }

        script();
    }
});
