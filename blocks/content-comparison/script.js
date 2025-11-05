baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-comparison");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                baunfire.Animation.headingAnimation(self.find(".main-title .inner-word"), {
                    trigger: self,
                    start: "top 60%"
                });

                handleCarousel(self);
                handleTablePan(self);
            });
        }

        const handleTablePan = (self) => {
            const table = self.find(".table-outer");
            if (!table.length) return;

            const scrollAmount = 300;
            const next = self.find(".ar-r.for-table");
            const prev = self.find(".ar-l.for-table");

            prev.click(function () {
                gsap.to(table, {
                    scrollLeft: table.scrollLeft() - scrollAmount,
                    duration: 0.4,
                    ease: "power2.out"
                });
            })

            next.click(function () {
                gsap.to(table, {
                    scrollLeft: table.scrollLeft() + scrollAmount,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });

            const updateArrowVisibility = () => {
                const scrollWidth = table[0].scrollWidth;
                const clientWidth = table[0].clientWidth;

                next.removeClass("scrollable");
                prev.removeClass("scrollable");

                if (scrollWidth <= clientWidth) {
                    next.removeClass("active");
                    prev.removeClass("active");
                } else {
                    next.addClass("active");
                    prev.addClass("active");

                    const scrollLeft = table.scrollLeft();

                    if (scrollLeft > 0) {
                        prev.addClass("scrollable");
                    }

                    if (scrollLeft + clientWidth < scrollWidth - 1) {
                        next.addClass("scrollable");
                    }
                }
            }

            $(window).on('load resize', updateArrowVisibility);
            table.on('scroll', updateArrowVisibility);
        }

        const handleCarousel = (self) => {
            const swiperEL = self.find('.swiper-container');
            if (!swiperEL.length) return;

            const items = self.find(".swiper-slide");
            const wrapper = self.find('.swiper-wrapper');
            const next = self.find(".ar-r:not(.for-table)");
            const prev = self.find(".ar-l:not(.for-table)");

            const updateVisibility = () => {
                const containerWidth = swiperEL.get(0).clientWidth;
                const wrapperWidth = wrapper.get(0).scrollWidth;

                if (wrapperWidth <= containerWidth) {
                    next.removeClass("active");
                    prev.removeClass("active");
                } else {
                    next.addClass("active");
                    prev.addClass("active");
                }
            }

            const swiper = new Swiper(swiperEL.get(0), {
                slidesPerView: 2,
                speed: 600,
                resistanceRatio: 1,
                loop: true,
                on: {
                    init: updateVisibility,
                    resize: updateVisibility,
                    slideChange: updateVisibility
                },
            });

            swiper.on('beforeResize', function () {
                reAlignMobileTable(self, items);
            });

            swiper.on('init', function () {
                reAlignMobileTable(self, items);
            });

            next.click(function () {
                swiper.slideNext();
            });

            prev.click(function () {
                swiper.slidePrev();
            });
        }

        const reAlignMobileTable = (self, items) => {
            if (!window.matchMedia("(max-width: 991.98px)").matches) return;

            let numRows = 0;

            items.each(function () {
                const subSelf = $(this);
                const cellCount = subSelf.children().length;

                if (cellCount > numRows) {
                    numRows = cellCount;
                }
            });

            for (var i = 0; i < numRows; i++) {
                let maxHeight = 0;
                let cells = $();

                items.each(function () {
                    const subSelf = $(this);
                    const cell = subSelf.find('.cell').eq(i);

                    if (cell.length) {
                        var cellHeight = cell.height();
                        if (cellHeight > maxHeight) {
                            maxHeight = cellHeight;
                        }

                        cells = cells.add(cell);
                    }
                });

                cells.height(maxHeight);

                if (i !== 0) {
                    const cellGuide = self.find('.cell-guide').eq(i - 1);
                    cellGuide.css("top", cells.position().top).addClass("active");
                }
            }
        }

        script();
    }
});