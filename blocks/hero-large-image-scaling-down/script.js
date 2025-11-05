baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.hero-large-image-scaling-down");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                const videoContainer = self.find(".media-container.video");
                const videoBox = self.find(".video-box");
                const videoThumbnail = self.find(".video-thumbnail");
                const videoPlay = self.find(".video-play");

                baunfire.Animation.headingAnimation(self.find(".main-title .inner-word"), {
                    trigger: self,
                    start: "top 60%",
                }, {
                    onStart: () => {
                        baunfire.Animation.descAnimation(self.find(".para-desc"));
                        baunfire.Global.importVimeoScript(() => {
                            baunfire.Animation.orbAnimation(self.find(".video-box"), self.find(".video-play"), true);
                            handleVideo(self, videoContainer, videoBox, videoThumbnail);
                        });
                    },
                    onComplete: () => {
                        baunfire.Global.importVimeoScript(() => {
                            handleVideo(self, videoContainer, videoBox, videoThumbnail, videoPlay, true, true);
                        });
                    }
                });
            });
        }

        const handleVideo = (self, videoContainer, videoBox, videoThumbnail, videoPlay, ready = true, completed = false) => {
            if (!videoContainer.length) return;

            if (ready && !completed) {
                const videoID = videoContainer.data("video");
                videoContainer.append(baunfire.Global.generateVimeoIframe(videoID));
                setImageThumbnail(videoID, videoThumbnail);
            }

            if (completed) {
                const playerContainer = videoContainer.find("iframe");
                if (!playerContainer.length) return;

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

                videoPlay.click(function () {
                    if (playerInstance) {
                        playerInstance.play();
                    }

                    videoBox.fadeOut();
                });

                playerInstance.on('pause', function () {
                    videoBox.fadeIn();
                });
            }
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
