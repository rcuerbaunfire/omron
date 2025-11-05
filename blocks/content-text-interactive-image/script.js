baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-text-interactive-image");
            if (!els.length) return;

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

                const items = self.find(".point");
                const dialog = self.find("dialog");
                const dialogClose = self.find(".dialog-close");
                if (!items.length) return;
                handlePopup(items, dialog, dialogClose);
            });
        }

        const handlePopup = (items, dialog, dialogClose) => {
            const viewportWidth = $(window).width();
            const mm = gsap.matchMedia();

            mm.add({
                isDesktop: `(min-width: 768px)`,
                isMobile: `(max-width: 767.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                if (isDesktop || isMobile) {
                    items.removeClass("active");
                    items.off("click");
                    dialog[0].close();
                }

                if (isDesktop) {
                    items.click(function () {
                        const subSelf = $(this);

                        if (!subSelf.hasClass("active")) {
                            items.removeClass("active");
                            subSelf.addClass("active");

                            const popupCard = subSelf.find(".point-card");
                            const popupRect = popupCard.get(0).getBoundingClientRect();
                            const width = popupCard.outerWidth();

                            if ((popupRect.left + width) > viewportWidth) {
                                popupCard.css({
                                    left: 'auto',
                                    right: '50%',
                                });
                            }
                        } else {
                            subSelf.removeClass("active");
                        }
                    });
                }

                if (isMobile) {
                    items.click(function () {
                        const subSelf = $(this);
                        const popupCard = subSelf.find(".point-card");
                        dialog.append(popupCard.clone());
                        dialog[0].showModal();
                    });
                }

                return () => { }
            });

            dialogClose.click(function () {
                dialog[0].close();
                dialog.find(".point-card").remove();
            });

            $(document).on("click", function (e) {
                if ($(e.target).is('[class^="point"]') === false) {
                    items.removeClass("active");
                }
            });
        }

        script();
    }
});
