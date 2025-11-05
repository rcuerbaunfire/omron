baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-full-width-image-with-text-overlay");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                const ticker = self.find(".ticker");
                const videoContainer = self.find(".video-container");

                baunfire.Animation.headingAnimation(self.find(".main-title .inner-word"), {
                    trigger: self,
                    start: "top 30%",
                }, {
                    onStart: () => {
                        gsap.to(ticker,
                            {
                                y: 0,
                                duration: 3,
                                ease: "expo.out",
                                delay: 0.6,
                                scrollTrigger: {
                                    trigger: self,
                                    start: "top 60%"
                                },
                                onStart: () => {
                                    if (!videoContainer.length) return;
                                    baunfire.Global.importVimeoScript(() => handleVideo(self, videoContainer));
                                    
                                },
                                onComplete: () => {
                                    if (!videoContainer.length) return;
                                    baunfire.Global.importVimeoScript(() => handleVideo(self, videoContainer, true, true));
                                }
                            }
                        )
                    }
                });
            });
        }

        const handleVideo = (self, videoContainer, ready = true, completed = false) => {
            if (ready && !completed) {
                const videoID = videoContainer.data("video");
                videoContainer.append(baunfire.Global.generateVimeoIframe(videoID, true));
            }

            if (completed) {
                const playerContainer = videoContainer.find("iframe");
                if (!playerContainer.length) return;

                const playerInstance = new Vimeo.Player(playerContainer.get(0));
                playerInstance.setMuted(true);

                ScrollTrigger.create({
                    trigger: self,
                    start: "top center",
                    end: "bottom 30%",
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
            }
        }

        script();
    }
});
