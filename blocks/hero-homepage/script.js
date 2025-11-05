baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.hero-homepage");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                const innerWords = self.find(".inner-word");

                innerWords.each(function (index) {
                    this.style.transitionDelay = `${index * 50}ms`;
                });

                const videoContainer = self.find(".video-container");
                gsap.set(videoContainer, { x: 0, xPercent: 60 })

                const ticker = self.find(".ticker");

                gsap.timeline({
                    scrollTrigger: {
                        trigger: self,
                        start: "top 70%",
                        once: true,
                        onEnter: () => innerWords.addClass("reveal")
                    }
                })
                    .to(videoContainer,
                        {
                            delay: 0.4,
                            xPercent: 0,
                            autoAlpha: 1,
                            duration: 0.8,
                            ease: "power2.easeOut",
                            onComplete: () => {
                                if (!videoContainer.length) return;
                                baunfire.Global.importVimeoScript(() => handleVideo(self, videoContainer));
                            },
                        },
                    )
                    .to(ticker,
                        {
                            x: 0,
                            duration: 3,
                            ease: "expo.out",
                            onComplete: () => {
                                if (!videoContainer.length) return;
                                baunfire.Global.importVimeoScript(() => handleVideo(self, videoContainer, true, true));
                            }
                        },
                        "<0.5"
                    )
            });
        }

        const handleVideo = (self, videoContainer, ready = true, completed = false) => {
            if (ready && !completed) {
                const videoID = videoContainer.data("video");
                videoContainer.append(baunfire.Global.generateVimeoIframe(videoID, true));
                return;
            }

            if (completed) {
                const playerContainer = videoContainer.find("iframe");
                if (!playerContainer.length) return;

                const playerInstance = new Vimeo.Player(playerContainer.get(0));
                playerInstance.setMuted(true);

                ScrollTrigger.create({
                    trigger: self,
                    start: "top center",
                    end: "bottom 80%",
                    onEnter: () => {
                        playerInstance.play();
                    },
                    onLeave: () => {
                        playerInstance.pause();
                    },
                    onEnterBack: () => {
                        playerInstance.play();
                    },
                    onLeaveBack: () => {
                        playerInstance.pause();
                    }
                });

                return;
            }
        }

        script();
    }
});
