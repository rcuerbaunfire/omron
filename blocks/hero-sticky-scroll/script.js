baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const topPos = "-60px";
        const bottomPos = "80px";

        const script = () => {
            const els = $("section.hero-sticky-scroll");
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

                pinContent(self);
                itemImages(self);
            });
        }

        const pinContent = (self) => {
            const contentArea = self.find(".item-content");
            const mm = gsap.matchMedia();
            let pinST = null;

            mm.add({
                isDesktop: `(min-width: 992px)`,
                isMobile: `(max-width: 991.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                if (isDesktop) {
                    if (!pinST) {
                        pinST = ScrollTrigger.create({
                            trigger: self,
                            pin: contentArea,
                            pinSpacing: false,
                            start: "top 2.5rem",
                            end: "bottom 100%",
                            // markers: true,
                            refreshPriority: 1,
                            invalidateOnRefresh: true,
                            pinType: "fixed", //pinType: window.isTouchDevice() ? "fixed" : "transform",
                        })
                    }
                }

                if (isMobile) {
                    if (pinST) {
                        pinST.kill(true);
                        pinST = null;
                    }
                }

                return () => {
                    if (pinST) {
                        pinST.kill(true);
                    }

                    pinST = null;
                    contentArea.removeAttr("style");
                }
            });
        }

        const itemImages = (self) => {
            const itemImages = self.find(".item-image");
            if (!itemImages.length) return;

            const itemCount = itemImages.length;
            const itemTexts = self.find(".item-text");

            const mm = gsap.matchMedia();
            let imageSTs = [];

            mm.add({
                isDesktop: `(min-width: 992px)`,
                isMobile: `(max-width: 991px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                if (isDesktop) {
                    if (!imageSTs.length) {
                        itemImages.each(function (index) {
                            const subSelf = $(this);
                            const isLastItem = itemCount == (index + 1);

                            const imageST = ScrollTrigger.create({
                                trigger: subSelf,
                                start: "top 60%",
                                end: "top top",
                                // markers: true,
                                onEnter: () => {
                                    animateInOut(self, index, true);
                                },
                                onEnterBack: () => {
                                    if (isLastItem) return;
                                    animateInOut(self, index, true, true);
                                },
                                onLeave: () => {
                                    if (isLastItem) return;
                                    animateInOut(self, index, false);
                                },
                                onLeaveBack: () => {
                                    animateInOut(self, index, false, true);
                                },
                            })

                            imageSTs.push(imageST);
                        });
                    }
                }

                if (isMobile) {
                    if (imageSTs.length) {
                        imageSTs.forEach(imageST => {
                            imageST.kill(true);
                        });

                        imageSTs = [];
                    }

                    // console.log("oyy");
                    // itemTexts.removeAttr("style").removeClass("active");
                }

                return () => {
                    // console.log("oyy");
                    // itemTexts.removeAttr("style").removeClass("active");
                }
            });
        }

        const animateInOut = (self, index, enter = true, back = false) => {
            let targetText = self.find(`.item-text[data-index='${index}']`);

            if (enter) {
                const mm = gsap.matchMedia();

                mm.add({
                    isDesktop: `(min-width: 992px)`,
                    isMobile: `(max-width: 991px)`,
                }, (context) => {
                    let { isDesktop, isMobile } = context.conditions;

                    if (isDesktop) {
                        gsap.fromTo(targetText,
                            {
                                y: !back ? bottomPos : topPos,
                                autoAlpha: 0,
                            },
                            {
                                autoAlpha: 1,
                                y: 0,
                                duration: 0.6,
                                ease: "power2.easeOut",
                                overwrite: true,
                                onStart: () => {
                                    targetText.addClass("active");
                                }
                            }
                        )
                    }

                    if (isMobile) {
                        gsap.set(targetText, {
                            clearProps: true
                        })
                    }
                });
            } else {
                const mm = gsap.matchMedia();

                mm.add({
                    isDesktop: `(min-width: 992px)`,
                    isMobile: `(max-width: 991px)`,
                }, (context) => {
                    let { isDesktop, isMobile } = context.conditions;

                    if (isDesktop) {
                        gsap.fromTo(targetText,
                            {
                                y: 0,
                                autoAlpha: 1,
                            },
                            {
                                autoAlpha: 0,
                                y: !back ? topPos : bottomPos,
                                duration: 0.6,
                                ease: "power2.easeOut",
                                overwrite: true,
                                onComplete: () => {
                                    targetText.removeClass("active");
                                }
                            }
                        )
                    }

                    if (isMobile) {
                        gsap.set(targetText, {
                            clearProps: true
                        })
                    }
                });
            }
        }

        script();
    }
});
