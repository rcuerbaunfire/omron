baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-50-50");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                const ticker = self.find(".ticker");
                const videoContainer = self.find(".video-container");

                baunfire.Animation.headingAnimation(self.find(".main-title .inner-word"), {
                    trigger: self,
                    start: "top 60%",
                }, {
                    onStart: () => {
                        baunfire.Animation.descAnimation(self.find(".para-desc"));
                        gsap.fromTo(self.find(".items"),
                            {
                                autoAlpha: 0,
                                y: 20,
                            },
                            {
                                delay: 0.2,
                                autoAlpha: 1,
                                y: 0,
                                duration: 0.6,
                                ease: "power2.easeOut"
                            }
                        )
                    }
                });

                gsap.to(ticker,
                    {
                        y: 0,
                        duration: 3,
                        ease: "expo.out",
                        // duration: 3,
                        // ease: "steps(60)",
                        delay: 0.6,
                        scrollTrigger: {
                            trigger: self,
                            start: "top 60%"
                        },
                        onStart: () => {
                            if (!videoContainer.length) return;

                            baunfire.Global.importVimeoScript(() => {
                                const videoID = videoContainer.data("video-id");
                                videoContainer.append(baunfire.Global.generateVimeoIframe(videoID));

                                const playerContainer = videoContainer.find("iframe");
                                const playerInstance = new Vimeo.Player(playerContainer.get(0));

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
                            });
                        },
                    }
                )
            });
        }

        script();
    }
});
