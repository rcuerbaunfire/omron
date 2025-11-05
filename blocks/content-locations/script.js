baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-location");
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

                handleCarousel(self);
                // handleParallax(self.find(".parallax"));
            });
        }

        const handleCarousel = (self) => {
            const locationGroups = self.find(".location-group");
            if (!locationGroups.length) return;

            const updateVisibility = (swiperEL, wrapper, next, prev) => {
                const containerWidth = swiperEL.get(0).clientWidth;
                const wrapperWidth = wrapper.get(0).scrollWidth;

                if (wrapperWidth <= containerWidth) {
                    next.removeClass("active");
                    prev.removeClass("active");
                } else {
                    next.addClass("active");
                    prev.addClass("active");
                }
            }

            locationGroups.each(function () {
                const subSelf = $(this);

                const swiperEL = subSelf.find('.swiper-container');
                if (!subSelf.length) return;

                let swiper = null;

                const wrapper = subSelf.find('.swiper-wrapper');
                const next = subSelf.find(".ar-r");
                const prev = subSelf.find(".ar-l");

                const mm = gsap.matchMedia();

                mm.add({
                    isDesktop: `(min-width: 768px)`,
                    isMobile: `(max-width: 767.98px)`,
                }, (context) => {
                    let { isDesktop, isMobile } = context.conditions;

                    if (isDesktop) {
                        if (swiper) {
                            swiper.destroy(true, true);
                            swiper = null;
                        }
                    }

                    if (isMobile) {
                        if (!swiper) {
                            swiper = new Swiper(swiperEL.get(0), {
                                slidesPerView: 1,
                                spaceBetween: 24,
                                loop: true,
                                on: {
                                    init: updateVisibility(swiperEL, wrapper, next, prev),
                                    resize: updateVisibility(swiperEL, wrapper, next, prev),
                                    slideChange: updateVisibility(swiperEL, wrapper, next, prev)
                                },
                            });
                        }
                    }

                    next.click(function () {
                        swiper.slideNext();
                    });

                    prev.click(function () {
                        swiper.slidePrev();
                    });

                    return () => { }
                });
            });
        };

        const handleParallax = (el) => {
            if (!el.length) return;

            const mm = gsap.matchMedia();

            mm.add({
                isDesktop: `(min-width: 992px)`,
                isMobile: `(max-width: 991.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                if (isDesktop) {
                    baunfire.smoother && baunfire.smoother.effects(el, { speed: 'clamp(0.94)' });
                }

                if (isMobile) {
                    baunfire.smoother && baunfire.smoother.effects(el, { speed: 1 });
                }

                return () => { }
            });
        }

        script();
    }
});