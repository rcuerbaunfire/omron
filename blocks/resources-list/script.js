baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const Gated = {
            blacklistedDomains: [],

            init: (self, index) => {
                const el = self.find(".gated-cform");
                if (!el.length) return;

                const state = {
                    form_container: self.find(".gated-form"),
                    status_default: self.find(".status-text.default"),
                    status_approved: self.find(".status-text.approved"),
                    status_pending: self.find(".status-text.pending"),
                    status_error: self.find(".status-text.error")
                }

                baunfire.Animation.headingAnimation(self.find(".main-title .inner-word"), {
                    trigger: self,
                    start: "top 60%",
                }, {
                    onStart: () => {
                        baunfire.Animation.descAnimation(self.find(".para-desc"));
                    }
                });

                Gated.blacklistedDomains = el.data("blacklisted-emails");

                Gated.handleEmailPreCheck(self, state);

                baunfire.Global.importHubspotScript(() => {
                    Gated.handleForm(self, state, index);
                });

                Gated.handleLottie(self, self.find(".lottie"));
            },

            handleEmailPreCheck: (self, state) => {
                const { form_container, status_default, status_approved, status_error } = state;
                const gcform = self.find(".gated-cform-checker");
                const input = gcform.find("input");
                const checkBtn = gcform.find(".gated-cform-check");
                const errorContainer = gcform.find(".gated-cform-error");

                const stepOne = self.find(".gated-cform-step.one");
                const stepTwo = self.find(".gated-cform-step.two");

                const clearEmailError = () => {
                    errorContainer.empty();
                };

                const showEmailError = (message) => {
                    clearEmailError();
                    const errorHTML = $(`<p>${message}</p>`);
                    errorContainer.append(errorHTML);
                };

                const isValidEmail = (email, nextStep = false) => {
                    if (email === '') {
                        showEmailError(`Please complete this required field.`);
                        return;
                    }

                    if (!email.includes('@')) {
                        showEmailError(`Please enter a valid email.`);
                        return;
                    }

                    const domain = email.toLowerCase().split('@').pop();
                    const isBlacklisted = Gated.blacklistedDomains.includes(domain);

                    if (isBlacklisted) {
                        showEmailError(`Please enter a different email address. This form does not accept addresses from ${domain}.`);
                        return;
                    }

                    clearEmailError();

                    if (nextStep) {
                        checkUserExists(email);
                    }
                };

                const checkUserExists = (email) => {
                    $.post(
                        z3.ajaxurl,
                        {
                            email,
                            action: "is_existing_member",
                            _ajax_nonce: z3.nonce,
                        },
                        (response) => {
                            if (response.success) {
                                const hash = response.data.hash;

                                Gated.setCookie("member_data", `${email}|${hash}`, 30);
                                Gated.setCookie("vip-go-cb", "1", 30);

                                status_default.removeClass("active");
                                status_approved.addClass("active");
                                Gated.handleCountdownReload(status_approved, 6);

                                gcform.fadeOut();
                                baunfire.Global.screenSizeChange();
                            } else {
                                stepOne.removeClass("active");
                                stepTwo.addClass("active");
                                form_container.find("input[type='email'].hs-input").val(email);
                                baunfire.Global.screenSizeChange();
                            }
                        },
                        "json"
                    ).fail(() => {
                        status_default.removeClass("active");
                        status_error.addClass("active");
                        Gated.createToast("There was a network error. Please try again.");
                        baunfire.Global.screenSizeChange();
                    });
                };

                checkBtn.click(function () {
                    const email = input.val().trim();
                    isValidEmail(email, true);
                });

                input.on('blur input', function () {
                    const email = $(this).val().trim();
                    isValidEmail(email);
                });
            },

            handleForm: (self, state, index) => {
                const { form_container, status_default, status_approved, status_pending, status_error } = state;
                if (!form_container.length) return;

                Gated.deleteCookie("member_data");

                const targetClass = `${self.attr("class").split(" ")[0]}-${index}`;
                form_container.addClass(targetClass);

                const region = form_container.data("region");
                const formId = form_container.data("form-id");
                const portalId = form_container.data("portal-id");

                let isEmailValid = true;

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
                };

                const stylizeSubmitBtn = (container) => {
                    const submitBTN = container.find('.hs_submit .actions input[type="submit"]');
                    const iconHTML = $('<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.55697 10.375L11.8486 6.94618L8.55697 3.51736" stroke="white" stroke-width="1.5" stroke-miterlimit="10"></path><path d="M1.01411 0.500006L1.0141 5.84896C1.0141 6.45463 1.50566 6.94618 2.11133 6.94618L11.9863 6.94618" stroke="white" stroke-width="1.5" stroke-miterlimit="10"></path></svg>');
                    const buttonHTML = $('<div class="btn form-btn white"></div>');

                    submitBTN.wrap(buttonHTML);
                    submitBTN.after(iconHTML);

                    baunfire.Global.screenSizeChange();
                };

                const showEmailError = (emailField, domain) => {
                    emailField.closest('.hs-form-field').find('.custom-email-error').remove();
                    const errorMessage = `Please enter a different email address. This form does not accept addresses from ${domain}.`;
                    const errorHTML = $(`<ul class="hs-error-msgs inputs-list custom-email-error" role="alert"><li class="hs-error-msg hs-main-font-element">${errorMessage}</li></ul>`);
                    emailField.closest('.hs-form-field').addClass('error');
                    emailField.closest('.input').after(errorHTML);
                    errorHTML.css({
                        'color': '#e74c3c',
                        'font-size': '0.75rem',
                        'margin-top': '0.3125rem',
                        'list-style': 'none',
                        'padding': '0'
                    });

                    isEmailValid = false;
                };

                const clearEmailError = (emailField) => {
                    emailField.closest('.hs-form-field').find('.custom-email-error').remove();
                    emailField.closest('.hs-form-field').removeClass('error');

                    isEmailValid = true;
                };

                const isInvalidEmail = (email) => {
                    if (!email || !email.includes('@')) {
                        return true;
                    }

                    const domain = email.toLowerCase().split('@').pop();
                    return !Gated.blacklistedDomains.includes(domain);
                };

                hbspt.forms.create({
                    region,
                    portalId,
                    formId,
                    target: `.${targetClass}`,
                    onFormReady: function () {
                        stylizeSubmitBtn(form_container);
                        addPlaceHolders(form_container.find(".hs-fieldtype-text"));
                        addPlaceHolders(form_container.find(".hs-fieldtype-select"), "select");

                        const emailField = form_container.find('input[name="email"]');

                        emailField.on('blur input', function () {
                            const email = $(this).val().trim();

                            if (email && email.includes('@')) {
                                const domain = email.toLowerCase().split('@').pop();
                                const isBlacklisted = Gated.blacklistedDomains.includes(domain);

                                if (isBlacklisted) {
                                    showEmailError($(this), domain);
                                } else {
                                    clearEmailError($(this));
                                }
                            } else if (email === '') {
                                clearEmailError($(this));
                            }
                        });

                        const form = form_container.find('form');

                        form.on('submit', function (e) {
                            const email = form_container.find('input[name="email"]').val().trim();

                            if (email && !isInvalidEmail(email)) {
                                e.preventDefault();
                                e.stopImmediatePropagation();

                                const domain = email.toLowerCase().split('@').pop();
                                const emailField = form_container.find('input[name="email"]');
                                showEmailError(emailField, domain);

                                return false;
                            }
                        });
                    },
                    onFormSubmit: function ($form) {
                        const formData = {
                            blacklist: Gated.blacklistedDomains
                        };

                        $form.serializeArray().forEach((field) => {
                            formData[field.name] = field.value;
                        });

                        const email = formData.email;

                        if (!isInvalidEmail(email)) {
                            const domain = email.toLowerCase().split('@').pop();
                            const emailField = $form.find('input[name="email"]');
                            showEmailError(emailField, domain);
                            return false;
                        }

                        if (!isEmailValid) {
                            return false;
                        }

                        $.post(
                            z3.ajaxurl,
                            {
                                action: "submit_member_form",
                                data: formData,
                                _ajax_nonce: z3.nonce,
                            },
                            (response) => {
                                if (response.success) {
                                    const email = response.data.email;
                                    const hash = response.data.hash;
                                    const autoApproved = response.data.auto_approved;

                                    Gated.setCookie("member_data", `${email}|${hash}`, 30);
                                    Gated.setCookie("vip-go-cb", "1", 30);

                                    if (autoApproved) {
                                        status_default.removeClass("active");
                                        status_approved.addClass("active");
                                        Gated.handleCountdownReload(status_approved, 6);
                                    } else {
                                        status_default.removeClass("active");
                                        status_pending.addClass("active");
                                    }

                                    form_container.parent().fadeOut();
                                    baunfire.Global.screenSizeChange();
                                } else {
                                    status_default.removeClass("active");
                                    status_error.addClass("active");
                                    Gated.createToast(response.data.message);
                                }
                            },
                            "json"
                        ).fail(() => {
                            status_default.removeClass("active");
                            status_error.addClass("active");
                            Gated.createToast("There was a network error. Please try again.");
                            baunfire.Global.screenSizeChange();
                        });
                    },
                });
            },

            handleCountdownReload: (message, countdown = 5) => {
                const originalText = message.text().trim().replace(/\s*\(redirecting in \.\.\. \d\)/, '');
                let progress = 1;

                const updateMessage = () => {
                    message.text(`${originalText} (reloading in ... ${countdown})`);
                };

                updateMessage();

                const tickerCallback = (time) => {
                    if (!progress) {
                        progress = time;
                        return;
                    }

                    if (time - progress >= 1) {
                        updateMessage();

                        countdown--;
                        if (countdown < 0) {
                            gsap.ticker.remove(tickerCallback);
                            window.location.reload();
                        }

                        progress = time;
                    }
                };

                gsap.ticker.add(tickerCallback);
            },

            createToast: (message) => {
                Toastify({
                    text: message,
                    duration: 5000,
                    close: true,
                    offset: {
                        y: "6em",
                    },
                    style: {
                        background: "#de4f4f",
                    },
                    gravity: "top",
                    position: "center",
                }).showToast();
            },

            setCookie: (name, value, days) => {
                const d = new Date();
                d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
                const expires = "expires=" + d.toUTCString();
                document.cookie = name + "=" + value + ";" + expires + ";path=/";
            },

            deleteCookie: (name) => {
                document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            },

            isEmailDomainBlacklisted: (email) => {
                if (!email || Gated.blacklistedDomains.length === 0) {
                    return false;
                }

                const domain = email.toLowerCase().split("@").pop();
                return Gated.blacklistedDomains.includes(domain);
            },

            handleLottie: (container, el) => {
                if (!el.length) return;

                const path = el.data("json");
                if (!path.length) return;

                const animation = lottie.loadAnimation({
                    container: el.get(0),
                    renderer: "svg",
                    loop: false,
                    autoplay: false,
                    path: path,
                });

                ScrollTrigger.create({
                    trigger: container,
                    start: "top 60%",
                    end: "bottom top",
                    onEnter: () => animation.play(),
                    onLeave: () => animation.pause(),
                    onEnterBack: () => animation.play(),
                    onLeaveBack: () => animation.pause(),
                });
            },
        };

        const Resources = {
            token: z3.tk,
            baseUrl: z3.b,
            cacheVersion: z3.x,
            storageKey: "resources_cache",
            versionKey: "resources_cache_version",
            baseTaxonomies: [],
            baseTaxonomyIds: window.resBaseTaxonomyIds,
            baseMetas: window.resMetas,
            baseAssetTypes: "",
            dateFormat: $("body").hasClass("lang-en") ? "en-US" : "en-GB",

            init: (self) => {
                const el = self.find(".resource-list");
                if (!el.length) return;

                const postGrid = self.find(".items");
                const postCount = postGrid.data("per-page");
                const basePosts = postGrid.children();

                const seeMoreBtn = self.find(".see-more");

                const filters = self.find(".res-filter");
                const searchInput = self.find(".search input");

                const loadState = self.find(".load-state");
                const emptyState = self.find(".empty-state");

                const state = {
                    post_grid: postGrid,
                    post_count: postCount,
                    keyword: "",
                    taxonomy: JSON.parse(Resources.baseTaxonomyIds),
                    query_params: { property_Language: '847280D1-3D0E-4A4E-9B8813A365E0BF0F' }, // default show only english
                    page: 1,
                    cache: {},
                    pending: {},
                    base_posts: basePosts,
                    see_more: seeMoreBtn,
                    load_state: loadState,
                    empty_state: emptyState,
                    see_more_state: seeMoreBtn.hasClass("active"),
                    filters: filters,
                    search_field: searchInput,
                };

                const initialCache = Resources.loadCache();
                state.cache = initialCache;

                Resources.handleLoadMore(state);
                Resources.handleFilter(self, state);
                Resources.handleSearch(state);
                Resources.handleClear(self, state);
                Resources.handleAccordion(self);
                Resources.handleFilterDialog(self);
                Resources.handleCardClick(self, el.data("download-text"));
                Resources.handleTooltips(self);
                Resources.handlePreFilter(self, state);

                state.page++;
                Resources.preloadPosts(state);
            },

            handleTooltips: (self) => {
                const tooltips = self.find(".res-tooltip");
                tooltips.each(function () {
                    const self = $(this);
                    const content = self.find(".res-tooltip-content");

                    tippy(self.get(0), {
                        allowHTML: true,
                        maxWidth: 280,
                        appendTo: () => document.body,
                        content: content.get(0).innerHTML,
                    });
                })
            },

            handleAccordion: (self) => {
                const items = self.find(".res-group");
                if (!items.length) return;

                items.each(function () {
                    const subSelf = $(this);
                    const head = subSelf.find(".res-head");

                    head.click(function () {
                        subSelf.toggleClass("active");
                        baunfire.Global.screenSizeChange();
                    });
                });
            },

            handleFilterDialog: (self) => {
                const dialog = self.find("dialog.filters");
                if (!dialog.length) return;

                const dialogTrigger = self.find(".dialog-trigger");
                const dialogClose = self.find(".dialog-close");

                dialogTrigger.click(function () {
                    dialog[0].showModal();
                    dialog.scrollTop(0);
                    dialog.find(".dialog-body").scrollTop(0);
                });

                dialogClose.click(function () {
                    dialog[0].close();
                });

                const mm = gsap.matchMedia();

                mm.add(
                    {
                        isDesktop: `(min-width: 992px)`,
                        isMobile: `(max-width: 991.98px)`,
                    },
                    (context) => {
                        let { isDesktop, isMobile } = context.conditions;
                        if (isDesktop) dialogClose.trigger("click");

                        return () => { };
                    }
                );
            },

            handleCardClick: (self, message) => {
                const dialog = self.find("dialog.download");
                if (!dialog.length) return;

                const btnConfirm = dialog.find(".btn.confirm");
                const btnCancel = dialog.find(".btn.cancel, .res-dialog-close");

                self.on("click", ".res-card", function (e) {
                    const subSelf = $(this);
                    const assetID = subSelf.data("asset-id");
                    if (!assetID.length) return;

                    baunfire.Global.screenSizeChange();

                    dialog[0].showModal();
                    btnConfirm.off("click");

                    btnConfirm.click(function () {
                        Resources.handleDownload(subSelf, assetID, message);
                        dialog[0].close();
                    });
                });

                btnCancel.click(function () {
                    dialog[0].close();
                });
            },

            handleDownload: (subSelf, assetID, message) => {
                subSelf.addClass("downloading");

                Toastify({
                    text: message,
                    duration: 3000,
                    close: true,
                    offset: {
                        y: "6em",
                    },
                    style: {
                        background: "#262626",
                    },
                    gravity: "bottom",
                    position: "center",
                }).showToast();

                const url = `${Resources.baseUrl}/media/${assetID}/download/`;

                fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${Resources.token}`,
                        'Content-Type': 'application/json'
                    }
                })
                    .then((res) => res.json())
                    .then((response) => {
                        if (response.s3_file) {
                            window.open(response.s3_file, '_blank');
                        } else {
                            baunfire.Global.fancyLog("No download URL available.", "error");
                        }

                        subSelf.removeClass("downloading");
                    })
                    .catch(() => {
                        baunfire.Global.fancyLog("Failed to retrieve download link.", "error");
                        subSelf.removeClass("downloading");
                    });
            },

            handleLoadMore: (state) => {
                state.see_more.on('mouseenter', function () {
                    Resources.preloadPosts(state);
                });

                state.see_more.on("click", function () {
                    Resources.getPosts(state);
                });
            },

            handleFilter: (self, state) => {
                const { filters } = state;
                if (!filters.length) return;

                filters.each(function () {
                    const subSelf = $(this);
                    const isParent = subSelf.hasClass("parent");
                    const checkbox = subSelf.find("> .res-filter-inner input[type='checkbox']");

                    checkbox.change(function () {
                        const isChecked = checkbox.prop("checked");
                        state.page = 1;

                        if (isParent) {
                            subSelf.toggleClass("active", isChecked);

                            if (!isChecked) {
                                const children = subSelf.find(".res-filter-children input[type='checkbox']:checked");

                                children.each(function (index) {
                                    if ((index + 1) == children.length) {
                                        $(this).prop("checked", false).trigger("change")
                                    } else {
                                        $(this).prop("checked", false);
                                    }
                                });
                            }
                        }

                        state.query_params = {};
                        state.taxonomy = [];

                        const allChecked = self.find(".res-filter-inner input[type='checkbox']:checked");
                        const propBuckets = {};

                        allChecked.each(function () {
                            const cb = $(this);

                            const selfProp = `property_${cb.data("parent")}`;
                            const selfVal = JSON.parse(cb.val());

                            if (!propBuckets[selfProp]) {
                                propBuckets[selfProp] = [];
                            }

                            propBuckets[selfProp].push(...selfVal);

                            if (cb.hasClass("is-cols-child")) {
                                const colsProp = `property_${cb.data("collapsed-name")}`;
                                const colsVal = cb.data("collapsed-value");

                                if (!propBuckets[colsProp]) {
                                    propBuckets[colsProp] = [];
                                }

                                propBuckets[colsProp].push(...colsVal);
                            }
                        });

                        Object.entries(propBuckets).forEach(([key, values]) => {
                            const uniqueVals = [...new Set(values)];
                            if (uniqueVals.length === 1) {
                                state.query_params[key] = uniqueVals[0];
                            } else {
                                state.taxonomy.push(...uniqueVals);
                            }
                        });

                        if (state.taxonomy.length || state.keyword || Object.keys(state.query_params).length) {
                            Resources.getPosts(state, true);
                        } else {
                            Resources.getPosts(state, true, true);
                        }
                    });
                });
            },

            handlePreFilter: (self, state) => {
                const { filters } = state;
                const raw = new URLSearchParams(window.location.search).get("id");
                const params = raw ? raw.split(",") : [];

                if (!params.length || !filters.length) return;

                const validFilters = [];
                const missing = [];

                params.forEach(param => {
                    const targetFilter = self.find(`input[type="checkbox"][value='[\"${param}\"]']`);

                    if (targetFilter.length) {
                        validFilters.push(targetFilter);
                    } else {
                        missing.push(param);
                    }
                });

                if (validFilters.length) {
                    validFilters.forEach((filter, index) => {
                        const filterGroup = filter.closest(".res-group");
                        const filterHead = filterGroup.find(".res-head");
                        const filterParents = filter.parents(".res-filter.parent:not(.collapsed)");

                        if (filterParents.length) {
                            filterParents.addClass("active");
                            filterParents
                                .children(".res-filter-inner")
                                .children("input[type='checkbox']")
                                .each(function () {
                                    if (this === filter[0] || this.checked) return;
                                    this.checked = true;
                                });
                        }

                        if (!filterGroup.hasClass("active")) {
                            filterHead.click();
                        }

                        if (index === validFilters.length - 1) {
                            filter.click();
                        } else {
                            filter[0].checked = true;
                        }
                    });
                }

                if (missing.length) {
                    Gated.createToast(
                        `Some of the specified IDs could not be found: ${missing.join(", ")}.`
                    );
                }
            },

            handleSearch: (state) => {
                const { search_field } = state;
                if (!search_field.length) return;

                search_field.on("keyup", function (e) {
                    e.preventDefault();
                    let input = this.value;

                    if (e.which === 13 || (input == "" && state.keyword != "")) {
                        state.page = 1;

                        if (input) {
                            state.keyword = input;
                        } else {
                            state.keyword = "";
                        }

                        if (state.taxonomy || state.keyword || state.query_params) {
                            Resources.getPosts(state, true);
                        } else {
                            Resources.getPosts(state, true, true);
                        }
                    }
                });
            },

            handleClear: (self, state) => {
                const clearBtn = self.find(".clear-all");
                if (!clearBtn.length) return;

                clearBtn.click(function () {
                    if (state.taxonomy || state.page != 1 || state.keyword) {
                        state.search_field.val("");
                        self.find(".res-filter input[type='checkbox']").prop("checked", false);
                        state.page = 2;
                        state.taxonomy = JSON.parse(Resources.baseTaxonomyIds);
                        state.search = "";
                        state.keyword = "";
                        state.query_params = {};
                        Resources.getPosts(state, true, true);
                    }
                });
            },

            getCacheKey: (params) => {
                const { page, keyword, taxonomy, query_params } = params;
                const taxonomyString = taxonomy.map(val => val.trim()).filter(Boolean).sort().join(',');

                const qpString = Object.keys(query_params).sort().map(key => {
                    let val = query_params[key];
                    if (Array.isArray(val)) val = val.sort().join(',');
                    return `${key}=${val}`;
                }).join('&');

                return `${Resources.cacheVersion}-${page}-${keyword || ''}-${taxonomyString}-${qpString}`;
            },

            loadCache: () => {
                try {
                    const savedVersion = localStorage.getItem(Resources.versionKey);

                    if (savedVersion !== Resources.cacheVersion) {
                        localStorage.removeItem(Resources.storageKey);
                        localStorage.setItem(Resources.versionKey, Resources.cacheVersion);
                        return {};
                    }

                    const raw = localStorage.getItem(Resources.storageKey);
                    return raw ? JSON.parse(raw) : {};
                } catch (e) {
                    baunfire.Global.fancyLog("Failed to load cache to localStorage", "error");
                    return {};
                }
            },

            saveCache: (cache) => {
                try {
                    localStorage.setItem("resources_cache", JSON.stringify(cache));
                } catch (e) {
                    baunfire.Global.fancyLog("Failed to save cache to localStorage", "error");
                }
            },

            clearCache: () => {
                localStorage.removeItem("resources_cache");
            },

            getAssetIcon: (type) => {
                if (type == "pdf") {
                    return `<svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.9988 10.8984V6.08485C15.9983 4.81952 15.4954 3.60615 14.6005 2.71157C13.7056 1.817 12.4921 1.31445 11.2268 1.31445H1.62288C1.41106 1.31445 1.20792 1.3986 1.05814 1.54838C0.908363 1.69815 0.824219 1.9013 0.824219 2.11311V18.885C0.824219 19.0968 0.908363 19.2999 1.05814 19.4497C1.20792 19.5995 1.41106 19.6836 1.62288 19.6836H4.00129" stroke="#1263FF" stroke-linecap="round" stroke-linejoin="round" /><path d="M12.0054 1.37891V4.51046C12.0054 4.72227 12.0895 4.92542 12.2393 5.07519C12.3891 5.22497 12.5922 5.30912 12.804 5.30912H15.9348" stroke="#1263FF" stroke-linecap="round" stroke-linejoin="round" /><path d="M9.5921 14.8922C9.5921 15.102 9.55079 15.3097 9.47052 15.5035C9.39024 15.6973 9.27258 15.8734 9.12426 16.0217C8.97593 16.17 8.79985 16.2877 8.60605 16.368C8.41225 16.4482 8.20455 16.4896 7.99478 16.4896H6.39746V13.2949H7.99478C8.41842 13.2949 8.8247 13.4632 9.12426 13.7628C9.42381 14.0623 9.5921 14.4686 9.5921 14.8922Z" stroke="#1263FF" stroke-linecap="round" stroke-linejoin="round" /><path d="M6.39746 19.6829V16.4883" stroke="#1263FF" stroke-linecap="round" stroke-linejoin="round" /><path d="M11.189 13.2949C12.0362 13.2949 12.8488 13.6315 13.4479 14.2306C14.047 14.8297 14.3836 15.6423 14.3836 16.4896C14.3836 17.3368 14.047 18.1494 13.4479 18.7485C12.8488 19.3476 12.0362 19.6842 11.189 19.6842V13.2949Z" stroke="#1263FF" stroke-linecap="round" stroke-linejoin="round" /><path d="M15.981 19.6842V14.4929C15.981 14.1752 16.1072 13.8705 16.3318 13.6458C16.5565 13.4211 16.8612 13.2949 17.1789 13.2949H19.1756" stroke="#1263FF" stroke-linecap="round" stroke-linejoin="round" /><path d="M15.981 16.4883H17.9776" stroke="#1263FF" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
                }

                return `<svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.16645 3.925C9.18762 4.09819 9.17187 4.2739 9.1202 4.44053C9.06845 4.60716 8.98195 4.76093 8.86645 4.89167C8.74762 5.0237 8.60245 5.12928 8.4402 5.20155C8.27798 5.27381 8.10236 5.31116 7.92477 5.31116C7.74717 5.31116 7.57155 5.27381 7.40933 5.20155C7.24709 5.12928 7.10188 5.0237 6.9831 4.89167C6.86461 4.76233 6.77507 4.6092 6.72046 4.4425C6.66586 4.27581 6.64743 4.09939 6.66643 3.925L6.97476 0.916672H8.74978L9.16645 3.925Z" stroke="#1263FF" stroke-linecap="round" stroke-linejoin="round" /><path d="M7.91781 7.37499C7.80275 7.37499 7.70947 7.28172 7.70947 7.16666C7.70947 7.0516 7.80275 6.95833 7.91781 6.95833" stroke="#1263FF" /><path d="M7.91748 7.37499C8.03254 7.37499 8.12581 7.28172 8.12581 7.16666C8.12581 7.0516 8.03254 6.95833 7.91748 6.95833" stroke="#1263FF" /><path d="M7.91781 9.45834C7.80275 9.45834 7.70947 9.36509 7.70947 9.25001C7.70947 9.13492 7.80275 9.04167 7.91781 9.04167" stroke="#1263FF" /><path d="M7.91748 9.45834C8.03254 9.45834 8.12581 9.36509 8.12581 9.25001C8.12581 9.13492 8.03254 9.04167 7.91748 9.04167" stroke="#1263FF" /><path d="M7.91781 11.5417C7.80275 11.5417 7.70947 11.4484 7.70947 11.3333C7.70947 11.2182 7.80275 11.125 7.91781 11.125" stroke="#1263FF" /><path d="M7.91748 11.5417C8.03254 11.5417 8.12581 11.4484 8.12581 11.3333C8.12581 11.2182 8.03254 11.125 7.91748 11.125" stroke="#1263FF" /><path d="M7.91781 13.625C7.80275 13.625 7.70947 13.5317 7.70947 13.4167C7.70947 13.3016 7.80275 13.2083 7.91781 13.2083" stroke="#1263FF" /><path d="M7.91797 13.625C8.03303 13.625 8.1263 13.5317 8.1263 13.4167C8.1263 13.3016 8.03303 13.2083 7.91797 13.2083" stroke="#1263FF" /><path d="M7.91781 15.7083C7.80275 15.7083 7.70947 15.6151 7.70947 15.5C7.70947 15.3849 7.80275 15.2917 7.91781 15.2917" stroke="#1263FF" /><path d="M7.91797 15.7083C8.03303 15.7083 8.1263 15.6151 8.1263 15.5C8.1263 15.3849 8.03303 15.2917 7.91797 15.2917" stroke="#1263FF" /><path d="M7.91781 17.7917C7.80275 17.7917 7.70947 17.6984 7.70947 17.5833C7.70947 17.4682 7.80275 17.375 7.91781 17.375" stroke="#1263FF" /><path d="M7.91797 17.7917C8.03303 17.7917 8.1263 17.6984 8.1263 17.5833C8.1263 17.4682 8.03303 17.375 7.91797 17.375" stroke="#1263FF" /><path d="M17.6752 4.25002C17.7524 4.32789 17.8135 4.42023 17.855 4.52176C17.8964 4.6233 17.9175 4.73201 17.9168 4.84169V19.25C17.9168 19.471 17.829 19.683 17.6727 19.8393C17.5165 19.9956 17.3045 20.0833 17.0835 20.0833H2.91683C2.69581 20.0833 2.48385 19.9956 2.32757 19.8393C2.1713 19.683 2.0835 19.471 2.0835 19.25V1.75002C2.0835 1.529 2.1713 1.31704 2.32757 1.16076C2.48385 1.00448 2.69581 0.916686 2.91683 0.916686H13.9918C14.1015 0.916052 14.2102 0.937072 14.3117 0.978542C14.4132 1.02001 14.5057 1.08112 14.5835 1.15835L17.6752 4.25002Z" stroke="#1263FF" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
            },

            renderContent: (container, assets, revert = false) => {
                if (revert) {
                    container.append(assets);
                    setTimeout(() => { baunfire.Global.screenSizeChange() }, 50);
                } else {
                    let assetsHTML = '';

                    assets.forEach((asset) => {
                        const asset_date = new Date(asset.dateCreated).toLocaleDateString(Resources.dateFormat, {
                            timeZone: "UTC",
                            month: "numeric",
                            day: "numeric",
                            year: "numeric",
                        });

                        const asset_extension = asset.extension[0];
                        const asset_icon = Resources.getAssetIcon(asset_extension);
                        const asset_subtext = asset.description ? asset.description : `${asset.name}.${asset_extension}`;
                        // const asset_type = Resources.getAssetTypeName(asset);
                        // const asset_type = "Asset";
                        let asset_type = asset.property_Asset_Type[0];

                        if (asset_type == "Software" && asset?.property_Software_Phase) {
                            asset_type = `${asset_type} → ${Resources.getAssetLabelByName(Resources.baseMetas.Software_Phase, asset.property_Software_Phase[0])}`;
                        }

                        assetsHTML += `<div class="res-card" data-asset-id="${asset.id}"><div class="res-card-inner"><div class="res-card-head"><div class="res-card-brow"><div class="res-card-brow-square"></div><small>${asset_type}</small></div><small>${asset_date}</small></div><p class="main-title lg">${asset.name}</p><div class="res-card-foot"><div class="res-card-icon">${asset_icon}</div><p class="sm">${asset_subtext}</p></div></div></div>`;
                    });

                    container.append(assetsHTML);

                    setTimeout(() => {
                        container.find(".res-card").addClass("active");
                        baunfire.Global.screenSizeChange();
                    }, 10);
                }
            },

            preloadPosts: (state) => {
                const { post_count, keyword, taxonomy, query_params, page, cache, pending } = state;
                const cacheKey = Resources.getCacheKey({
                    page: state.page,
                    limit: post_count,
                    taxonomy: state.taxonomy,
                    keyword: state.keyword,
                    query_params: state.query_params
                });

                const query = new URLSearchParams({
                    limit: post_count,
                    orderBy: 'dateCreated desc',
                    property_Sync: 'ORT_Website',
                    total: 1,
                    page: page,
                    keyword: keyword,
                    propertyOptionId: taxonomy.join(","),
                    ...query_params
                });

                const url = `${Resources.baseUrl}/media/?${query.toString()}`;
                Resources.fetchFromAPIAndCache(url, cache, pending, cacheKey);
            },

            getPosts: (state, reset = false, revert = false) => {
                const {
                    post_grid,
                    post_count,
                    keyword,
                    taxonomy,
                    query_params,
                    page,
                    cache,
                    pending,
                    base_posts,
                    see_more,
                    empty_state,
                    load_state,
                    see_more_state,
                } = state;

                if (reset) {
                    post_grid.children().remove();

                    setTimeout(() => {
                        Resources.handleScrollReset(post_grid, 120);
                    }, 100);
                }

                load_state.addClass("active");
                see_more.removeClass("active");
                empty_state.removeClass("active");

                if (revert) {
                    load_state.removeClass("active");
                    empty_state.removeClass("active");

                    if (see_more_state) see_more.addClass("active");
                    Resources.renderContent(post_grid, base_posts, true);
                    return;
                } else {
                    console.log("<---- START  ---->");

                    const cacheKey = Resources.getCacheKey({
                        page: state.page,
                        limit: post_count,
                        taxonomy: state.taxonomy,
                        keyword: state.keyword,
                        query_params: state.query_params
                    });

                    baunfire.Global.fancyLog(taxonomy, "info");
                    baunfire.Global.fancyLog(query_params, "info");

                    if (cache[cacheKey]) {
                        const response = cache[cacheKey];
                        Resources.handlePostResponse(response, state);
                        console.log("<---- END  ---->");
                        return;
                    }

                    const query = new URLSearchParams({
                        limit: post_count,
                        orderBy: 'dateCreated desc',
                        property_Sync: 'ORT_Website',
                        total: 1,
                        page: page,
                        keyword: keyword,
                        propertyOptionId: taxonomy.join(","),
                        ...query_params
                    });

                    const url = `${Resources.baseUrl}/media/?${query.toString()}`;

                    Resources.fetchFromAPIAndCache(url, cache, pending, cacheKey, (data) => {
                        console.log("<---- END  ---->");

                        Resources.handlePostResponse(data, state);
                    });
                }
            },

            fetchFromAPIAndCache: (url, cache, pending, cacheKey, onSuccess = () => { }) => {
                if (cache[cacheKey]) {
                    onSuccess(cache[cacheKey]);
                    return Promise.resolve(cache[cacheKey]);
                }

                if (pending[cacheKey]) {
                    return pending[cacheKey].then(onSuccess);
                }

                pending[cacheKey] =
                    fetch(url, {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                            authorization: `Bearer ${Resources.token}`
                        }
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            cache[cacheKey] = data;
                            Resources.saveCache(cache);
                            onSuccess(data);
                            return data;
                        })
                        .catch(() => {
                            baunfire.Global.fancyLog("Interrupted or failed to fetch assets.", "error");
                        })
                        .finally(() => {
                            delete pending[cacheKey];
                        });

                return pending[cacheKey];
            },

            handlePostResponse: (response, state) => {
                const { post_grid, post_count, page, see_more, empty_state, load_state } = state;

                const assets = response.media;
                const totalCount = response.total.count;
                const totalPages = Math.ceil(totalCount / post_count);

                if (assets.length == 0) {
                    load_state.removeClass("active");
                    see_more.removeClass("active");
                    empty_state.addClass("active");
                } else {
                    const hasMore = page < totalPages;

                    Resources.renderContent(post_grid, assets);
                    load_state.removeClass("active");

                    if (!hasMore) {
                        see_more.removeClass("active");
                    } else {
                        see_more.addClass("active");
                    }

                    state.page++;
                }
            },

            handleScrollReset: (self, offset = 0) => {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: self, offsetY: offset, autoKill: true },
                    ease: "circ.out",
                });
            },

            getAssetTaxonomyName: (key, types) => {
                const matches = new Set();

                if (!Array.isArray(types)) {
                    return '';
                }

                types.forEach((type) => {
                    Resources.baseTaxonomies[key].forEach((taxonomy) => {
                        taxonomy.children.forEach((child) => {
                            if (child.name.toLowerCase() === type.toLowerCase()) {
                                matches.add(taxonomy.name);
                            }
                        });
                    });
                });

                return Array.from(matches).join(", ");
            },

            getAssetTypeName: (asset) => {
                // const lines = Resources.getAssetTaxonomyName('lines', asset['property_Product_Line']);
                // const software = Resources.getAssetTaxonomyName('categories', asset['property_Software_Phase']);
                // const categories = Resources.getAssetTaxonomyName('categories', asset['property_Asset_Sub-Type']);
                // const translation = Resources.getAssetTaxonomyName('categories', asset['property_Language']);

                // const parts = [lines, software, categories, translation].filter(Boolean);

                // return parts.join(', ');
            },

            getAssetLabelByName(data, optionName) {
                if (!data || !data.options) return null;

                const option = data.options.find(opt => opt.name === optionName);
                return option ? option.label : null;
            }
        };

        const script = () => {
            const el = $("section.resources-list");
            if (!el.length) return;

            el.each(function (index) {
                const self = $(this);
                Resources.init(self);
                Gated.init(self, index);
            });
        };

        script();
    }
});
