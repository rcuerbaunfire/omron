baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const cookieDuration = 2147483647;
        //2^31 - 1

        const script = () => {
            const els = $("section.hero-overlay");
            if (!els.length) return;

            $("html").addClass("disable-scrolling");

            els.each(function () {
                const self = $(this);
                const modal = self.find(".modal");
                const close = self.find(".close");

                const pinST = ScrollTrigger.create({
                    pin: self,
                    start: "top top",
                    end: "max",
                    pinReparent: true,
                    refreshPriority: 1,
                    invalidateOnRefresh: true,
                    pinType: "fixed", //pinType: window.isTouchDevice() ? "fixed" : "transform",
                })

                baunfire.Animation.headingAnimation(self.find(".main-title .inner-word"), {
                    trigger: self,
                    start: "top 60%",
                }, {
                    onStart: () => {
                        const mm = gsap.matchMedia();

                        mm.add({
                            isDesktop: `(min-width: 992px)`,
                            isMobile: `(max-width: 991.98px)`,
                        }, (context) => {
                            let { isDesktop, isMobile } = context.conditions;

                            gsap.fromTo(modal,
                                {
                                    autoAlpha: isDesktop ? 0 : 0.8,
                                    y: isDesktop ? 80 : 40,
                                    scale: 0.9
                                },
                                {
                                    autoAlpha: 1,
                                    scale: 1,
                                    y: 0,
                                    duration: 0.8,
                                    ease: "power2.easeOut"
                                }
                            )

                            baunfire.Animation.descAnimation(self.find(".para-desc"));

                            return () => { }
                        });


                    }
                });

                close.click(function () {
                    document.cookie = `hide_welcome_dialog=true; path=/; max-age=${cookieDuration}`;
                    $("html").removeClass("disable-scrolling");

                    gsap.timeline()
                        .to(modal, {
                            autoAlpha: 0,
                            duration: 0.6,
                            scale: 0.8,
                            ease: "power2.easeOut",
                        })
                        .to(self, {
                            autoAlpha: 0,
                            duration: 0.6,
                            ease: "power2.easeOut",
                            onComplete: () => {
                                console.log(self);
                                pinST.kill();
                                self.remove();
                            }
                        }, "<0.2")
                })
            });
        }

        script();
    }
});
