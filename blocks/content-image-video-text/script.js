baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-image-video-text");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                let heading = self.find(".main-title .inner-word");
                const mediaContainer = self.find(".media-container");

                const videoContainer = self.find(".video-container");

                baunfire.Animation.headingAnimation(heading, {
                    trigger: self,
                    start: "top 60%",
                }, {
                    onStart: () => {
                        baunfire.Animation.descAnimation(self.find(".para-desc"));

                        if (!videoContainer.length) return;
                        baunfire.Global.importVimeoScript(() => handleVideo(self, videoContainer));
                    },
                    onComplete: () => {
                        if (!videoContainer.length) return;
                        baunfire.Global.importVimeoScript(() => handleVideo(self, videoContainer, true, true));
                    }
                });

                handleLottie(self, self.find(".lottie"));
                mediaContainer.addClass("active");
            });
        }

        const handleLottie = (container, el) => {
            if (!el.length) return;

            const path = el.data("json");
            if (!path.length) return;

            const animation = lottie.loadAnimation({
                container: el.get(0),
                renderer: "svg",
                loop: true,
                autoplay: false,
                path: path
            });

            ScrollTrigger.create({
                trigger: container,
                start: "top 60%",
                end: "bottom top",
                onEnter: () => animation.play(),
                onLeave: () => animation.pause(),
                onEnterBack: () => animation.play(),
                onLeaveBack: () => animation.pause()
            })
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

        const isIOS = () => {
            return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                (navigator.userAgent.includes("Macintosh") && 'ontouchend' in document);
        }

        script();
    }
});
