baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.hero-product");
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

                handleEmbedTexts(self);
                loadImages(self);
                pinProductImages(self);
                handleAccordion(self);
                baunfire.Animation.orbAnimation(self.find(".box"), self.find(".orb"), true);
            });
        };

        const loadImages = (self) => {
            const prodImages = self.find(".product-images");
            const images = prodImages.data("images");
            const orbTexts = self.find(".orb small");

            prodImages.click(function () {
                if (prodImages.hasClass("loaded")) return;
                prodImages.addClass("loaded");

                let loadedCount = 0;
                const totalImages = images.length;

                images.forEach(image => {
                    const img = new Image();
                    img.className = "product-image";
                    img.alt = "product image";
                    img.src = image;

                    img.onload = img.onerror = () => {
                        loadedCount++;
                        const percent = Math.round((loadedCount / totalImages) * 100);
                        orbTexts.first().text(`${percent}%`);

                        if (loadedCount === totalImages) {
                            orbTexts.first().hide();
                            orbTexts.last().fadeIn();
                            handle360(self);
                        }
                    };

                    prodImages.append(img);
                });

                prodImages.off("click");
            })
        };

        const handleEmbedTexts = (self) => {
            const items = self.find(".btn.embed-btn");
            if (!items.length) return;

            items.click(function () {
                const subSelf = $(this);
                window.location.href = subSelf.data("url");
            });
        };

        const pinProductImages = (self) => {
            const singleImage = self.find(".product-single-image");

            if (singleImage.length) {
                const singleImages = singleImage.children();
                singleImage.addClass("active");

                singleImage
                    .on("mouseenter", function () {
                        singleImages.first().css("opacity", 0);
                        singleImages.last().css("opacity", 100);
                    })
                    .on("mouseleave", function () {
                        singleImages.first().css("opacity", 100);
                        singleImages.last().css("opacity", 0);
                    })
            }
        };

        const handleAccordion = (self) => {
            const items = self.find(".acc");
            if (!items.length) return;

            items.each(function () {
                const self = $(this);
                const head = self.find(".acc-head");

                head.click(function () {
                    self.toggleClass("active");
                    ScrollTrigger.refresh(true);
                });
            })
        };

        const handle360 = (self) => {
            const imagesContainer = self.find(".product-images");
            const images = self.find(".product-image");

            if (!images.length) return;

            let mm = window.matchMedia("(max-width: 1200px)");

            let currentIndex = 0;
            let isDragging = false;
            let startX = 0;
            let distance = (imagesContainer.outerWidth() / images.length) / 2;

            const updateImage = (index) => {
                if (images.eq(index).hasClass("active")) return;
                images.removeClass("active");
                images.eq(index).addClass("active");
            };

            images.on("dragstart", function (e) {
                e.preventDefault();
            });

            const startDrag = (pageX) => {
                isDragging = true;
                startX = pageX;
                imagesContainer.css("cursor", "grabbing");
            };

            const handleDrag = (pageX) => {
                if (!isDragging) return;

                const diffX = pageX - startX;

                if (diffX > distance) {
                    currentIndex = (currentIndex + 1) % images.length;
                    updateImage(currentIndex);
                    startX = pageX;
                } else if (diffX < (distance * -1)) {
                    currentIndex = (currentIndex - 1 + images.length) % images.length;
                    updateImage(currentIndex);
                    startX = pageX;
                }
            };

            const endDrag = () => {
                if (isDragging) {
                    isDragging = false;
                    imagesContainer.css("cursor", "grab");
                }
            };

            imagesContainer.on("mousedown", function (e) {
                if (mm.matches) return;
                startDrag(e.pageX);
            });

            $(document).on("mousemove", function (e) {
                if (mm.matches || !isDragging) return;
                handleDrag(e.pageX);
            });

            $(document).on("mouseup", function () {
                if (mm.matches) return;
                endDrag();
            });

            imagesContainer.on("touchstart", function (e) {
                if (!mm.matches) return;
                const touch = e.originalEvent.touches[0];
                startDrag(touch.pageX);
            });

            $(document).on("touchmove", function (e) {
                if (!mm.matches || !isDragging) return;
                const touch = e.originalEvent.touches[0];
                handleDrag(touch.pageX);
            });

            $(document).on("touchend", function () {
                if (!mm.matches) return;
                endDrag();
            });
        };

        script();
    }
});