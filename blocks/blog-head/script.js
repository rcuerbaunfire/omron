baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.post-head");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                const heading = self.find(".main-title .inner-word");
                baunfire.Animation.headingAnimation(heading, {
                    trigger: self,
                    start: "top 60%"
                });

                const mainImage = self.find(".main-image");
                animateImage(mainImage);
            });
        }

        const animateImage = (image) => {
            if (!image.length) return;

            const mm = gsap.matchMedia();

            mm.add({
                isDesktop: `(min-width: 992px)`,
                isMobile: `(max-width: 991.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                const clampPercentage = isDesktop ? 8.6 : 7.9;

                gsap.fromTo(image,
                    {
                        clipPath: `inset(0% 0% 0% 0% round 0.5rem)`
                    },
                    {
                        clipPath: `inset(0% ${gsap.utils.clamp(0, clampPercentage, clampPercentage)}vw 0% ${gsap.utils.clamp(0, clampPercentage, clampPercentage)}vw round 0.5rem)`,
                        ease: "linear",
                        scrollTrigger: {
                            trigger: image,
                            start: isDesktop ? "top 30%" : "top 40%",
                            end: "bottom 50%",
                            scrub: 1,
                            // markers: true
                        }
                    },
                );

                return () => {
                    gsap.set(image, {
                        clearProps: true
                    })
                }
            });
        };

        script();
    }
});
