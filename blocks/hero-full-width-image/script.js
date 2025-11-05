baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.hero-full-width-image");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                const mediaContainer = self.find(".media-container");
                const ticker = self.find(".ticker");

                const isVideo = mediaContainer.length && mediaContainer.hasClass("video");

                gsap.timeline()
                    .to(ticker,
                        {
                            x: 0,
                            duration: 3,
                            ease: "expo.out",
                            // duration: 3,
                            // ease: "steps(60)",
                            onComplete: () => {
                                if (!isVideo) return;

                                baunfire.Global.importVimeoScript(() => {
                                    const videoID = mediaContainer.data("video-id");
                                    mediaContainer.append(baunfire.Global.generateVimeoIframe(videoID, true));

                                    const playerContainer = mediaContainer.find("iframe");
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
                                });
                            }
                        }
                    )
            });
        }

        script();
    }
});
