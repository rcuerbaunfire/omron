baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-image-carousel");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                let heading = self.find(".main-title .inner-word");
                baunfire.Animation.headingAnimation(heading, {
                    trigger: self,
                    start: "top 60%"
                });

                baunfire.Animation.orbAnimation(self.find(".box"), self.find(".orb"));
                baunfire.Global.importVimeoScript(() => handleVideo(self));
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

        const handleVideo = (self) => {
            const videoContainers = self.find(".video-container");
            if (!videoContainers.length) return;

            const playerInstances = [];

            videoContainers.each(function (index) {
                const subSelf = $(this);

                const videoPlay = subSelf.find(".video-play");
                const videoThumbnail = subSelf.find(".video-thumbnail");

                const videoID = subSelf.data("video-id");

                let playerInstance = null;

                videoPlay.click(function () {
                    if (!subSelf.hasClass("loaded")) {
                        subSelf.append(baunfire.Global.generateVimeoIframe(videoID));

                        const playerContainer = subSelf.find("iframe");
                        playerInstance = new Vimeo.Player(playerContainer.get(0));
                        playerInstances[index] = playerInstance;

                        ScrollTrigger.create({
                            trigger: self,
                            start: "top center",
                            end: "bottom 30%",
                            onLeave: () => {
                                playerInstance.pause();
                            },
                            onLeaveBack: () => {
                                playerInstance.pause();
                            }
                        });

                        playerInstance.on('pause', function () {
                            videoThumbnail.fadeIn();
                        });

                        playerInstance.on('play', function () {
                            playerInstances.forEach((instance, pIndex) => {
                                if (index == pIndex) return;
                                instance.pause();
                            });
                        });

                        subSelf.addClass("loaded");
                    }

                    if (playerInstance) {
                        playerInstance.play();
                    }

                    videoThumbnail.fadeOut();
                });

                setImageThumbnail(videoID, videoThumbnail);
            });
        }

        const setImageThumbnail = (videoID, videoThumbnail) => {
            fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoID}&width=1920&height=1080`)
                .then(res => res.json())
                .then(data => {
                    $('<img>', {
                        src: data.thumbnail_url,
                        alt: data.title,
                    }).appendTo(videoThumbnail);
                });
        }

        script();
    }
});
