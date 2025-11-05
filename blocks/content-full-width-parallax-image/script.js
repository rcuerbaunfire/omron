baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-full-width-parallax-image");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                // handleParallax(self.find(".parallax"));
            });
        }

        const handleParallax = (el) => {
            if (!el.length) return;
            baunfire.smoother && baunfire.smoother.effects(el, { speed: 'clamp(1.1)' });
        }

        script();
    }
});
