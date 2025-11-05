var $ = jQuery.noConflict();

export const Gated = {
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
        Gated.handleForm(self, state, index);
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
            loop: true,
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
