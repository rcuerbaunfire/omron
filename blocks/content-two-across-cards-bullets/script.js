baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-two-across-cards-bullets");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                baunfire.Animation.headingAnimation(
                    self.find(".main-title .inner-word"),
                    {
                        trigger: self,
                        start: "top 60%",
                    },
                    {
                        onStart: () => {
                            baunfire.Animation.descAnimation(self.find(".para-desc"));
                        }
                    }
                );
            });
        };
        
        script();
    }
});
