baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-full-width-video");
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

                baunfire.Animation.orbAnimation(self.find(".video-box"), self.find(".video-play"), true);
                baunfire.Global.importVimeoScript(() => handleVideo(self));
            });
        }

        const handleVideo = (self) => {
            const videoContainer = self.find(".video-container");
            if (!videoContainer.length) return;

            const videoPlay = self.find(".video-play");
            const videoThumbnail = self.find(".video-thumbnail");

            const videoID = videoContainer.data("video-id");

            let playerInstance = null;

            videoPlay.click(function () {
                if (!videoContainer.hasClass("loaded")) {
                    videoContainer.append(baunfire.Global.generateVimeoIframe(videoID));

                    const playerContainer = videoContainer.find("iframe");
                    playerInstance = new Vimeo.Player(playerContainer.get(0));

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
                        videoPlay.fadeIn();
                        videoThumbnail.fadeIn();
                    });

                    videoContainer.addClass("loaded");
                }

                if (playerInstance) {
                    videoPlay.fadeOut();
                    playerInstance.play();
                }

                videoThumbnail.fadeOut();
            });

            setImageThumbnail(videoID, videoThumbnail);
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
