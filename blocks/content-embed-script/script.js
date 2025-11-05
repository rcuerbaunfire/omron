baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-embed-script");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                const observer = new MutationObserver((mutationsList, observer) => {
                    const content = document.querySelector('.otnotice-content');

                    if (content) {
                        handleContent(self);
                        observer.disconnect();
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true });
            });
        }

        const handleContent = (self) => {
            const hash = window.location.hash;
            const embedContainer = self.find(".embed-container");

            pinContent(self);

            embedContainer.removeClass("loading");
            embedContainer.addClass("active");

            setTimeout(() => {
                baunfire.Global.screenSizeChange();

                if (hash) {
                    const target = $(hash);
                    if (!target.length) return;

                    gsap.to(window, {
                        duration: 0.6,
                        overwrite: true,
                        scrollTo: { y: target, offsetY: 30, autoKill: true },
                        ease: "circ.out",
                    });
                }
            }, 800);
        }

        const pinContent = (self) => {
            const pinParent = self.find(".otnotice-content");
            const pinEL = self.find(".otnotice-menu");
            if (!pinParent.length || !pinEL.length) return;

            const offset = pinEL.get(0).getBoundingClientRect().top + window.scrollY;
            if ((window.innerHeight - offset) < pinEL.outerHeight()) return;

            pinEL.addClass("will-stick");

            // const mm = gsap.matchMedia();
            // let pinST = null;

            // mm.add({
            //     isDesktop: `(min-width: 768px)`,
            //     isMobile: `(max-width: 767.98px)`,
            // }, (context) => {
            //     let { isDesktop, isMobile } = context.conditions;

            //     if (isDesktop) {
            //         if (!pinST) {
            //             pinST = ScrollTrigger.create({
            //                 trigger: pinParent,
            //                 pin: pinEL,
            //                 pinSpacing: false,
            //                 start: `top ${baunfire.Global.convertRemToPixels(6)}px`,
            //                 endTrigger: pinParent,
            //                 end: () => `+=${pinParent.outerHeight() - pinEL.outerHeight()}px`,
            //                 refreshPriority: 1,
            //                 invalidateOnRefresh: true,
            //                 pinType: "fixed",
            //             });
            //         }
            //     }

            //     if (isMobile) {
            //         if (pinST) {
            //             pinST.kill(true);
            //             pinST = null;
            //         }
            //     }

            //     return () => {
            //         if (pinST) {
            //             pinST.kill(true);
            //             pinST = null;
            //         }
            //     };
            // });
        }

        script();
    }
});
