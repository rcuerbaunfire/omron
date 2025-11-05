(function () {
    const $ = baunfire.$;

    baunfire.Global = {
        init() {
            this.handleSpecialLinks();
            this.fixLangLinks();
            this.siteSearch();

            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener("click", function (e) {
                    e.preventDefault();

                    const target = document.querySelector(this.getAttribute("href"));
                    if (target) {
                        target.scrollIntoView({
                            behavior: "smooth"
                        });
                    }
                });
            });
        },

        screenSizeChange() {
            ScrollTrigger.refresh();
            // baunfire.lenis.resize();
        },

        callAfterResize(func, delay = 0.2) {
            const dc = gsap.delayedCall(delay, func).pause();
            const handler = () => dc.restart(true);
            window.addEventListener("resize", handler);
            return handler;
        },

        generateVimeoIframe(id, background = false) {
            if (background) {
                // https://player.vimeo.com/video/${id}?height=1920&width=1080&title=0&pip=0&autopause=1&airplay=0&vimeo_logo=0&dnt=1&api=1&background=1
                return `<iframe src="https://player.vimeo.com/video/${id}?badge=0&portrait=0&byline=0&title=0&pip=0&autopause=1&airplay=0&vimeo_logo=0&dnt=1&background=1" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"></iframe>`;
            }

            return `<iframe src="https://player.vimeo.com/video/${id}?badge=0&portrait=0&byline=0&title=0&pip=0&autopause=1&airplay=0&vimeo_logo=0&dnt=1" playsinline frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"></iframe>`;
        },

        refreshScrollTriggers() {
            const triggers = ScrollTrigger.getAll();

            triggers.forEach((trigger) => {
                // if (trigger.vars.id == 'nav-bg-scroll' || trigger.vars.id == 'nav-bg-hide') return;
                trigger.refresh(true);
            });
        },

        handleSpecialLinks() {
            const download = () => {
                const links = $(`a[href^="download:"]`);
                if (!links.length) return;

                links.each(function () {
                    const self = $(this);
                    const href = self.attr('href');
                    self.attr('href', href.replace('download:', ''));
                    self.attr('download', '');
                });
            }

            download();
        },

        updateSelectClass(target) {
            const parent = target.selectmenu("menuWidget");
            parent.find(".selected").removeClass("selected");

            const activeItem = parent.find(".ui-state-active");
            activeItem.addClass("selected");
        },

        convertRemToPixels(rem) {
            return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
        },

        fixLangLinks() {
            const language = $("body").data("lang"); // Current language (e.g., "de")
            if (language == "en") return;

            const siteURL = $("body").data("site-url"); // e.g., "https://omron.test/de" for German
            const baseURL = siteURL.replace(`${language}/`, "");

            const links = $(`nav a:not(.wpml-ls-link), footer a, main a`);
            if (!links.length) return;

            links.each(function () {
                const self = $(this);

                const href = self.attr('href');
                if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.includes(siteURL)) return;

                const isRelative = !/^https?:\/\//.test(href);
                const isInternal = href.startsWith(baseURL) || isRelative;
                if (!isInternal) return;

                // console.log(href, baseURL, isRelative, href.startsWith(baseURL));

                if (isRelative) {
                    const newHref = href.startsWith("/") ? href : "/" + href;
                    const finalHref = `${baseURL}${language}` + newHref;
                    self.attr("href", finalHref);
                } else {
                    const newHref = href.replace(`${baseURL}`, `${baseURL}${language}/`);
                    self.attr("href", newHref);
                }
            });
        },

        siteSearch() {
            const searchEvent = () => {
                const searchInput = $("input.nav-search");
                searchInput.each(function () {
                    const self = $(this);

                    self.on('keypress', function (e) {
                        if (e.which == 13) {
                            e.preventDefault();
                            const action = self.data("action");
                            window.location.href = `${action}${self.val()}`;
                        }
                    });
                })
            }

            const searchPage = () => {
                const container = $("section.search-result");
                if (!container.length) return;

                searchItemsEvent(container);
                searchFilterDialogEvent(container);
                searchFilterAccordionEvent(container);
            }

            const searchItemsEvent = (container) => {
                const items = container.find(".search-item");
                if (!items.length) return;

                items.click(function () {
                    const self = $(this);
                    const href = self.data("href");
                    window.location.href = href;
                });
            }

            const searchFilterDialogEvent = (container) => {
                const dialog = container.find("dialog");
                const dialogTrigger = container.find(".dialog-trigger");
                const dialogClose = container.find(".dialog-close");

                dialogTrigger.click(function () {
                    dialog[0].showModal();
                    dialog.scrollTop(0);
                    dialog.find('.dialog-body').scrollTop(0);
                });

                dialogClose.click(function () {
                    dialog[0].close();
                });

                const mm = gsap.matchMedia();

                mm.add({
                    isDesktop: `(min-width: 992px)`,
                    isMobile: `(max-width: 991.98px)`,
                }, (context) => {
                    let { isDesktop, isMobile } = context.conditions;

                    if (isDesktop) {
                        dialogClose.trigger("click");
                    }

                    return () => { }
                });
            }

            const searchFilterAccordionEvent = (container) => {
                const items = container.find(".search-filter-group");
                if (!items.length) return;

                items.each(function () {
                    const subSelf = $(this);
                    const head = subSelf.find(".search-filter-head");

                    head.click(function () {
                        subSelf.toggleClass("active");
                        baunfire.Global.screenSizeChange();
                    });
                })

                searchFilterEvent(container);
                items.first().find(".search-filter-head").click();
            }

            const searchFilterEvent = (container) => {
                const items = container.find(".search-filter");
                if (!items.length) return;

                items.each(function () {
                    const self = $(this);
                    const radio = self.find("input[type='radio']");
                    const count = self.find(".search-filter-count").text();

                    if (count != 0 || radio.val() == 'all') {
                        radio.change(function () {
                            window.location.href = radio.data("url");
                        });
                    } else {
                        self.addClass("disabled");
                    }
                });
            }

            searchEvent();
            searchPage();
        },

        importVimeoScript(callback) {
            if (window.Vimeo) {
                callback?.(window.Vimeo);
                return;
            }

            this.fancyLog('Loading Vimeo Player...');

            const script = document.createElement('script');
            script.src = `${templateURL}/assets/js/external/vimeo-player.js`;
            script.defer = true;

            script.onload = () => {
                this.fancyLog('Vimeo Player loaded:', window.Vimeo);
                callback?.(window.Vimeo);
            };

            script.onerror = () => {
                console.error('Failed to load Vimeo Player script.');
            };

            document.body.appendChild(script);
        },

        importHubspotScript(callback) {
            if (typeof hbspt !== 'undefined') {
                callback?.();
                return;
            }

            this.fancyLog('Loading Hubspot...');

            const script = document.createElement('script');
            script.src = `${templateURL}/assets/js/external/hubspot-embed.min.js`;
            script.defer = true;

            script.onload = () => {
                this.fancyLog('Hubspot Embed loaded.');
                callback?.();
            };

            script.onerror = () => {
                console.error('Failed to load Hubspot Embed script.');
            };

            document.body.appendChild(script);
        },

        handleFooter() {
            const handleForm = () => {
                const formContainer = $("footer .form-container.footer-form");
                if (!formContainer.length) return;

                const region = formContainer.data("region");
                const formId = formContainer.data("form-id");
                const portalId = formContainer.data("portal-id");

                const addPlaceHolders = (fields, type = "text") => {
                    if (!fields.length) return;

                    fields.each(function () {
                        const subSelf = $(this);
                        const labelText = subSelf.find("label span:not(.hs-form-required)").text();

                        if (type == "text") {
                            const input = subSelf.find(".input input");

                            if (input.attr("placeholder") != "") return;
                            input.attr("placeholder", labelText);

                        } else if (type == "select") {
                            const select = subSelf.find(".input select");
                            const targetOption = select.find("option[disabled]");
                            targetOption.text(labelText);
                        }
                    });
                }

                const stylizeSubmitBtn = (container) => {
                    const submitBTN = container.find('.hs_submit .actions input[type="submit"]');
                    const iconHTML = $('<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.55697 10.375L11.8486 6.94618L8.55697 3.51736" stroke="white" stroke-width="1.5" stroke-miterlimit="10"></path><path d="M1.01411 0.500006L1.0141 5.84896C1.0141 6.45463 1.50566 6.94618 2.11133 6.94618L11.9863 6.94618" stroke="white" stroke-width="1.5" stroke-miterlimit="10"></path></svg>');
                    const buttonHTML = $('<div class="btn form-btn blue"></div>');

                    submitBTN.wrap(buttonHTML);
                    submitBTN.after(iconHTML);

                    baunfire.Global.screenSizeChange();
                }

                hbspt.forms.create({
                    region,
                    portalId,
                    formId,
                    target: ".footer .form-container.footer-form",
                    onFormReady: function () {
                        stylizeSubmitBtn(formContainer);
                        addPlaceHolders(formContainer.find(".hs-fieldtype-text"));
                        baunfire.Global.screenSizeChange();
                    },
                    onFormSubmit: function () {
                        console.log('Form submitted!');
                        baunfire.Global.screenSizeChange();
                    }
                });
            };

            const handleCookieButtonText = () => {
                $("button.ot-sdk-show-settings").filter(function () {
                    return $(this).text().trim() === "Do Not Sell or Share My Personal Information";
                }).addClass("is-cali");
            };

            handleCookieButtonText();

            this.importHubspotScript(() => {
                handleForm();
            });
        },

        fancyLog(message, type = "info") {
            const styles = {
                info: {
                    label: 'ℹ️ INFO:',
                    style1: 'color: white; background-color: #2196F3; padding: 2px 6px; border-radius: 4px;',
                    style2: 'color: #FFF;'
                },
                warn: {
                    label: '⚠️ WARNING:',
                    style1: 'color: black; background-color: #FFEB3B; padding: 2px 6px; border-radius: 4px;',
                    style2: 'color: #000;'
                },
                error: {
                    label: '⛔ ERROR:',
                    style1: 'color: white; background-color: #F44336; padding: 2px 6px; border-radius: 4px;',
                    style2: 'color: #FFF;'
                }
            };

            const { label, style1, style2 } = styles[type] || styles.info;

            if (typeof message === 'object') {
                console.log(`%c${label}`, style1);
                console.log(message);
            } else {
                console.log(`%c${label} %c${message}`, style1, style2);
            }
        }
    };

    baunfire.addModule(baunfire.Global);
})();
