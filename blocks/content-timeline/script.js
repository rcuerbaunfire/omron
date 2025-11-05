baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-timeline");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                const swiperEL = self.find('.swiper-container');

                baunfire.Animation.headingAnimation(
                    self.find(".main-title .inner-word"),
                    {
                        trigger: self,
                        start: "top 60%",
                    },
                    {
                        onStart: () => {
                            baunfire.Animation.descAnimation(self.find(".para-desc"));
                        },
                    }
                );

                baunfire.Animation.orbAnimation(self.find(".box"), self.find(".orb"));
                handleCarousel(self);
            });
        }

        const handleCarousel = (self) => {
            const swiperEL = self.find('.swiper-container');
            if (!swiperEL.length) return;

            const wrapper = self.find('.swiper-wrapper');
            const next = self.find(".ar-r");
            const prev = self.find(".ar-l");
            const orb = self.find(".orb");

            const updateVisibility = () => {
                const containerWidth = swiperEL.get(0).clientWidth;
                const wrapperWidth = wrapper.get(0).scrollWidth;

                if (wrapperWidth <= containerWidth) {
                    next.removeClass("active");
                    prev.removeClass("active");
                    orb.fadeOut();
                } else {
                    next.addClass("active");
                    prev.addClass("active");
                    orb.fadeIn();
                }
            }

            const swiper = new Swiper(swiperEL.get(0), {
                slidesPerView: 1,
                spaceBetween: 24,
                breakpoints: {
                    576: {
                        slidesPerView: 'auto',
                        spaceBetween: 48,
                        freeMode: {
                            enable: true,
                            sticky: true,
                            momentumBounceRatio: 0.8,
                            minimumVelocity: 0.01,
                            momentumRatio: 0.6,
                            momentumVelocityRatio: 0.8
                        },
                    },
                },
                speed: 1000,
                resistanceRatio: 1,
                on: {
                    init: updateVisibility,
                    resize: updateVisibility,
                    slideChange: updateVisibility
                },
            });

            next.click(function () {
                swiper.slideNext();
            });

            prev.click(function () {
                swiper.slidePrev();
            });
        }

        script();
    }
});
