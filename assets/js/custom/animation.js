(function () {
    const $ = baunfire.$;

    baunfire.Animation = {
        init() {
            this.handleNav();
            this.footerAnimation();
            this.notFoundAnimation();
        },

        handleNav() {
            const nav = $("nav");
            if (!nav.length) return;

            let imagesLoaded = false;

            const toggleBGOnScroll = () => {
                function updateNavScroll() {
                    const nav = document.querySelector("nav");
                    if (!nav) return;

                    if (window.scrollY > 20) {
                        nav.classList.add("scrolled");
                    } else {
                        nav.classList.remove("scrolled");
                    }
                }

                document.addEventListener("scroll", updateNavScroll);
                document.addEventListener("DOMContentLoaded", updateNavScroll);
                window.addEventListener("load", updateNavScroll);
            }

            const showDDPanel = () => {
                const items = nav.find(".nav__item.parent");
                const overlay = nav.find(".nav__overlay");
                const navMobile = nav.find(".nav__mobile");

                overlay.click(function (e) {
                    items.removeClass("active mob-active");
                    hideMobileNav(navMobile);
                });

                items.each(function () {
                    const subSelf = $(this);
                    const inner = subSelf.find(".nav__item-inner, .nav__search-inner");

                    inner.click(function (e) {
                        if (window.matchMedia("(max-width: 1200px)").matches) return;
                        e.stopPropagation();

                        if (!imagesLoaded) {
                            loadImages();
                            imagesLoaded = true;
                        }

                        if (!subSelf.hasClass("active")) {
                            items.removeClass("active");
                            subSelf.addClass("active");

                        } else {
                            overlay.trigger("click");
                        }
                    })
                })
            }

            const productsHover = () => {
                const items = nav.find(".nav__dd.is-products .nav__dd-group-link");
                const itemImages = nav.find(".nav__dd.is-products .nav__dd-image");

                items.hover(
                    function () {
                        if (window.matchMedia("(max-width: 1200px)").matches) return;
                        itemImages.removeClass("active");

                        const subSelf = $(this);
                        const index = subSelf.data("product-index");
                        nav.find(`.nav__dd.is-products .nav__dd-image[data-product-index='${index}']`).addClass("active");
                    }, function () {
                        return;
                    }
                );
            }

            const toggleNav = () => {
                ScrollTrigger.create({
                    id: "nav-bg-hide",
                    trigger: "body",
                    start: "top top",
                    end: "max",
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        if (self.direction === 1) {
                            hideHeader(true);
                        } else {
                            hideHeader(false);
                        }
                    },
                });

                function hideHeader(state) {
                    if (state) {
                        if (nav.hasClass("nav-hidden") || nav.hasClass("mob-active")) return;
                        nav.addClass("nav-hidden");
                    } else {
                        if (!nav.hasClass("nav-hidden")) return;
                        nav.removeClass("nav-hidden");
                    }
                }
            }

            const burgerEvent = () => {
                const burger = nav.find(".nav__burger");

                let mm = gsap.matchMedia();

                mm.add(
                    {
                        isDesktop: `(min-width: 1200px)`,
                        isMobile: `(max-width: 1199.98px)`,
                    },
                    (context) => {
                        let { isDesktop, isMobile } = context.conditions;

                        if (isDesktop) {
                            nav.removeClass("mob-active");
                            nav.find(".nav__mobile .nav__panel-groups .nav__dd").removeClass("active");
                            $("html").removeClass("disable-scrolling");
                            // baunfire.lenis.start();

                            burger.off("click");

                            gsap.set(".nav__mobile", {
                                clearProps: "all"
                            })
                        }

                        if (isMobile) {
                            nav.find(".nav__desktop .nav__item.parent").removeClass("active");

                            burger.click(function () {
                                if (!nav.hasClass("mob-active")) {
                                    showMobileNav();
                                } else {
                                    hideMobileNav();
                                }
                            });
                        }

                        return () => { };
                    }
                );
            }

            const showMobileNav = () => {
                nav.addClass("mob-active");
                $("html").addClass("disable-scrolling");

                if (!imagesLoaded) {
                    loadImages();
                    imagesLoaded = true;
                }
            }

            const hideMobileNav = () => {
                nav.removeClass("mob-active");
                $("html").removeClass("disable-scrolling");
                // baunfire.lenis.start();
                nav.find(".nav__mobile .nav__panel-groups .nav__dd").removeClass("active");
            }

            const mobileDDPanel = () => {
                const items = nav.find(".nav__mobile .nav__item.parent, .nav__lang.is-mobile, .nav__search.is-mobile");
                const panelGroups = nav.find(".nav__mobile .nav__panel-groups .nav__dd");
                const backBtns = nav.find(".nav__mobile .nav__dd-back");

                items.click(function () {
                    if (!window.matchMedia("(max-width: 1200px)").matches) return;

                    const subSelf = $(this);
                    const key = subSelf.data("panel-group");
                    panelGroups.removeClass("active");
                    nav.find(`.nav__dd[data-panel-group="${key}"`).addClass("active");
                })

                backBtns.click(function () {
                    panelGroups.removeClass("active");
                })
            }

            const loadImages = () => {
                const images = nav.find(".lazy-image");
                if (!images.length) return;

                images.each(function () {
                    this.setAttribute('src', this.getAttribute('data-src'));
                    this.removeAttribute('data-src');
                    this.classList.remove("lazy-image");
                })
            }

            if ($(".content-secondary-nav").length) {
                toggleNav();
            }

            toggleBGOnScroll();
            productsHover();
            showDDPanel();
            burgerEvent();
            mobileDDPanel();
        },

        headingAnimation(words, ST, TW = {}) {
            if (!words.length) return;

            words.each(function (index) {
                this.style.transitionDelay = `${index * 50}ms`; // increase delay by 100ms per element
            });

            ScrollTrigger.create({
                ...ST,
                once: true,
                onEnter: () => {
                    words.addClass("reveal")

                    if (TW) {
                        if (typeof TW.onStart === "function") {
                            TW.onStart();
                        }

                        if (typeof TW.onComplete === "function") {
                            setTimeout(() => TW.onComplete(), 1000);
                        }
                    }
                },
            })
        },

        descAnimation(el, timeout = 300) {
            if (!el.length) return;
            setTimeout(() => { el.addClass("reveal"); }, timeout);
        },

        orbAnimation(box, orb, centered = false) {
            if (!box.length || !orb.length) return;

            let mm = window.matchMedia("(max-width: 1200px)");

            const setX = gsap.quickTo(orb, "x", { duration: 0.1, ease: "power1" });
            const setY = gsap.quickTo(orb, "y", { duration: 0.1, ease: "power1" });

            let moveOrb = (e) => {
                const rect = box.get(0).getBoundingClientRect();
                const orbWidth = orb.outerWidth() / 2;
                const orbHeight = orb.outerHeight() / 2;

                setX(e.clientX - rect.left - orbWidth);
                setY(e.clientY - rect.top - orbHeight);
            };

            if (centered) {
                moveOrb = (e) => {
                    const rect = box.get(0).getBoundingClientRect();
                    const offsetX = e.clientX - rect.left - rect.width / 2;
                    const offsetY = e.clientY - rect.top - rect.height / 2;
                    setX(offsetX);
                    setY(offsetY);
                };
            }

            const fade = gsap.to(orb, {
                autoAlpha: 1,
                scale: 1,
                ease: "none",
                paused: true,
            });

            box.on("pointermove", (e) => {
                if (mm.matches) return;
                orb.addClass("active");
                fade.play();
                moveOrb(e);
            });

            box.on("pointerleave", () => {
                if (mm.matches) return;
                orb.removeClass("active");
                fade.reverse()

                if (centered) {
                    setX(0);
                    setY(0);
                }
            });
        },

        centeredOrbAnimation(box, orb) {
            if (!box.length || !orb.length) return;

            let mm = window.matchMedia("(max-width: 1200px)");

            const setX = gsap.quickTo(orb, "x", { duration: 0.1, ease: "power1" });
            const setY = gsap.quickTo(orb, "y", { duration: 0.1, ease: "power1" });

            const moveOrb = (e) => {
                const rect = box.get(0).getBoundingClientRect();
                const orbHeight = orb.outerHeight();
                const xVal = e.clientX - rect.left - rect.width * 0.5;
                const yVal = e.clientY - rect.top - orbHeight / 2 + rect.height * 0.4;

                setX(xVal);
                setY(yVal);
            };

            const fade = gsap.to(orb, {
                ease: "none",
                paused: true,
            });

            box.on("pointermove", (e) => {
                if (mm.matches) return;
                orb.addClass("active");
                fade.play();
                moveOrb(e);
            });

            box.on("pointerleave", () => {
                if (mm.matches) return;
                orb.removeClass("active");
                fade.reverse();

                const rect = box.get(0).getBoundingClientRect();
                const orbHeight = orb.outerHeight();
                setX(0);
                setY(rect.height * 0.9 - orbHeight / 2);
            });
        },

        footerAnimation() {
            const footer = $("footer");
            if (!footer.length) return;

            const backToTopAnim = () => {
                const backToTop = $(`.footer__to-top`);
                if (!backToTop.length) return;

                backToTop.click(function () {
                    gsap.to(window, {
                        duration: 0.6,
                        scrollTo: 0,
                        ease: "power1.inOut",
                        overwrite: true
                    });
                });
            }

            const footerHeadingAnim = () => {
                let heading = $(".footer__pre-heading .inner-word");
                if (!heading.length) return;

                this.headingAnimation(heading, {
                    trigger: "footer",
                    start: "top 60%"
                }, {
                    onComplete: () => {
                        baunfire.Global.importVimeoScript(() => {
                            footerVideo();
                        });

                        baunfire.Global.handleFooter();
                    }
                });
            }

            const footerVideo = () => {
                const videoContainer = $(`.footer__media .video-container`);
                if (!videoContainer.length) return;

                const videoID = videoContainer.data("video-id");
                videoContainer.append(baunfire.Global.generateVimeoIframe(videoID, true));
                videoContainer.addClass("loaded");

                const playerContainer = videoContainer.find("iframe");
                if (!playerContainer.length) return;

                const playerInstance = new Vimeo.Player(playerContainer.get(0));
                playerInstance.setMuted(true);

                ScrollTrigger.create({
                    trigger: "footer",
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

            backToTopAnim();
            footerHeadingAnim();
        },

        notFoundAnimation() {
            const el = $("section.not-found");
            if (!el.length) return;

            const container = el.find(".lottie");
            const path = container.data("json");
            if (!path.length) return;

            lottie.loadAnimation({
                container: container.get(0),
                renderer: "svg",
                loop: true,
                autoplay: true,
                path: path
            });
        },
    };

    baunfire.addModule(baunfire.Animation);
})();