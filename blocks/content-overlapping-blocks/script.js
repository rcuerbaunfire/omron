baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-overlapping-blocks");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                let heading = self.find(".main-title .inner-word");
                baunfire.Animation.headingAnimation(heading, {
                    trigger: self,
                    start: "top 60%"
                });
            });
        }

        script();
    }
});
