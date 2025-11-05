baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-rich-text-form");
            if (!els.length) return;

            els.each(function (index) {
                const self = $(this);

                baunfire.Animation.headingAnimation(self.find(".main-title .inner-word"), {
                    trigger: self,
                    start: "top 60%",
                }, {
                    onStart: () => {
                        baunfire.Animation.descAnimation(self.find(".para-desc"));
                        gsap.fromTo(self.find(".others"),
                                {
                                    autoAlpha: 0,
                                    y: 20,
                                },
                                {
                                    delay: 0.2,
                                    autoAlpha: 1,
                                    y: 0,
                                    duration: 0.8,
                                    ease: "power2.easeOut"
                                },
                            )
                    }
                });

                baunfire.Global.importHubspotScript(() => {
                    handleForm(self, index);
                });
            });
        }

        const handleForm = (self, index) => {
            const formContainer = self.find(".form-container");
            if (!formContainer.length) return;

            const targetClass = `${self.attr("class").split(" ")[0]}-${index}`;
            formContainer.addClass(targetClass);

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

            const fieldEnhancements = (formContainer) => {
                const fields = formContainer.find(".hs-fieldtype-file");
                if (!fields.length) return;

                const addSVG = (subSelf) => {
                    const label = subSelf.children("label");
                    label.children("span").first().text("Attach an Entitlement ID and C2V file");

                    const attachIconHTML = $('<svg class="attach" width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.4631 0.79715C8.76484 -0.301334 10.7746 -0.264482 12.0291 0.907454C13.2834 2.07956 13.3223 3.95711 12.1461 5.17317L12.0291 5.28904L6.07209 10.8534V10.8543C5.37201 11.5076 4.26409 11.5485 3.51329 10.9767L3.36744 10.8534C2.62173 10.1557 2.62122 9.02485 3.36744 8.3275L8.82833 3.22662L9.54666 3.89772L4.08676 8.99859C3.73747 9.32492 3.73639 9.85487 4.08577 10.1823H4.08676C4.43626 10.5087 5.00338 10.5092 5.35376 10.1823L11.3107 4.61701L11.4685 4.45387C12.2049 3.60995 12.1525 2.36517 11.3107 1.57855C10.4686 0.791776 9.13545 0.742657 8.23203 1.43117L8.05741 1.57855L2.10044 7.14381C0.654447 8.49493 0.654145 10.6863 2.10044 12.038L2.23835 12.1603C3.692 13.3876 5.93728 13.3468 7.33908 12.038L11.3107 8.3275L12.0291 8.99859L8.05741 12.7091C6.27144 14.3768 3.41131 14.4285 1.55872 12.8648L1.38211 12.7091C-0.460686 10.9868 -0.460723 8.19458 1.38211 6.47272L7.33908 0.907454L7.4631 0.79715Z" fill="#262626"/></svg>');
                    const deleteIconHTML = $('<svg class="delete" width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.5615 0L11.7246 0.00585938C12.1035 0.0326624 12.4706 0.153222 12.793 0.357422C13.1615 0.590983 13.4565 0.924671 13.6426 1.31934L14.7168 3.59961H18V4.59961H16.6475L15.2754 16.9531C15.2131 17.5157 14.945 18.0354 14.5234 18.4131C14.1017 18.7907 13.5553 18.9989 12.9893 18.999V19H5.01074V18.999C4.4447 18.9989 3.89828 18.7907 3.47656 18.4131C3.10772 18.0827 2.85654 17.6436 2.75781 17.1621L2.72461 16.9531L1.35254 4.59961H0V3.59961H3.2832L4.3584 1.31934L4.43262 1.17383C4.61861 0.842531 4.88473 0.561777 5.20703 0.357422C5.57531 0.12394 6.00242 1.91603e-05 6.43848 0H11.5615ZM3.71875 16.8428L3.7373 16.9609C3.79309 17.2333 3.93489 17.4821 4.14355 17.6689C4.38188 17.8823 4.69087 17.9999 5.01074 18H12.9893C13.3091 17.9999 13.6181 17.8823 13.8564 17.6689C14.0949 17.4555 14.246 17.1609 14.2812 16.8428L15.6416 4.59961H2.3584L3.71875 16.8428ZM7.7002 8.59961V13.0996H6.7002V8.59961H7.7002ZM11.2998 8.59961V13.0996H10.2998V8.59961H11.2998ZM6.25488 1.0127C6.07328 1.03861 5.89829 1.10317 5.74219 1.20215C5.58614 1.30113 5.4534 1.43177 5.35254 1.58496L5.2627 1.74512L4.38867 3.59961H13.6113L12.7383 1.74512C12.6331 1.52218 12.466 1.3341 12.2578 1.20215C12.1016 1.10317 11.9269 1.0385 11.7451 1.0127L11.5615 1H6.43848L6.25488 1.0127Z" fill="#262626"/></svg>');
                    label.append(attachIconHTML);
                    label.append(deleteIconHTML);
                }

                const addDropzone = (subSelf) => {
                    const fileInput = subSelf.find('input[type="file"]');
                    const label = subSelf.children("label");
                    const labelTextContainer = label.find("span:not(.hs-form-required)");
                    const labelText = labelTextContainer.text();

                    const deleteBtn = label.find("svg.delete");

                    if (fileInput.length) {
                        fileInput.hide();

                        const dropzone = $('<div class="dropzone"></div>');
                        fileInput.before(dropzone);

                        dropzone.on('click', function (e) {
                            e.stopPropagation();
                            fileInput.trigger('click');
                        });

                        dropzone.on('dragover', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            dropzone.addClass('dragover');
                        });

                        dropzone.on('dragleave', function () {
                            dropzone.removeClass('dragover');
                        });

                        dropzone.on('drop', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            dropzone.removeClass('dragover');

                            const files = e.originalEvent.dataTransfer.files;

                            if (files.length) {
                                fileInput[0].files = files;

                                dropzone.text(`File selected: ${files[0].name}`);
                                dropzone.addClass("active");
                            }
                        });

                        fileInput.on('change', function () {
                            if (this.files.length) {
                                labelTextContainer.text(this.files[0].name);
                                dropzone.addClass("active");
                            } else {
                                labelTextContainer.text(labelText);
                                dropzone.removeClass("active");
                            }
                        });

                        deleteBtn.on('click', function (e) {
                            e.preventDefault();
                            e.stopPropagation();

                            fileInput.val('');
                            dropzone.removeClass("active");
                            labelTextContainer.text(labelText);
                        });
                    }
                }

                const createSteps = () => {
                    const fieldsets = formContainer.find('fieldset');
                    if (!fieldsets.length) return;

                    fieldsets.slice(0, 3).wrapAll('<div class="form-step one"></div>');
                    fieldsets.slice(3).wrapAll('<div class="form-step two"></div>');

                    const actions = formContainer.find('.hs-submit .actions');
                    if (!actions.length) return;

                    self.find('.next-btn, .back-btn').appendTo(actions);
                }

                const handleStepOneValidation = (updateButton = true) => {
                    const baseRequiredFields = {
                        'input[name="email"]': val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
                        'input[name="firstname"]': val => val.trim() !== '',
                        'input[name="lastname"]': val => val.trim() !== '',
                        'input[name="company"]': val => val.trim() !== '',
                        'select[name="country"]': val => typeof val === 'string' && val.trim() !== ''
                    };

                    let nextBtn = null;

                    if (updateButton) {
                        nextBtn = formContainer.find(".next-btn");
                        nextBtn.addClass("active");
                    }

                    const validateFields = () => {
                        let allValid = true;

                        const requiredFields = { ...baseRequiredFields };

                        const states = self.find('select[name="us_state"]');
                        if (states.length && states.is(':visible')) {
                            requiredFields['select[name="us_state"]'] = val => typeof val === 'string' && val.trim() !== '';
                        }

                        $.each(requiredFields, function (selector, isValid) {
                            const field = self.find(selector);
                            const value = field.val();

                            if (!isValid(value)) {
                                allValid = false;
                            }
                        });

                        if (updateButton) {
                            if (allValid) {
                                nextBtn.removeClass('disabled');
                            } else {
                                nextBtn.addClass('disabled');
                            }
                        } else {
                            return allValid;
                        }
                    };

                    if (updateButton) {
                        const watchSelectors = [
                            ...Object.keys(baseRequiredFields),
                            'select[name="us_state"]'
                        ].join(',');

                        self.on('input change', watchSelectors, validateFields);

                        setTimeout(validateFields, 300);
                    } else {
                        return validateFields;
                    }
                };

                const handleFormStep = () => {
                    const stepOne = self.find(".form-step.one");
                    const stepTwo = self.find(".form-step.two");
                    const nextBtn = self.find(".hs-submit .actions .next-btn");
                    const backBtn = self.find(".hs-submit .actions .back-btn");
                    const submitBtn = self.find(".hs-submit .actions .form-btn");

                    stepOne.addClass("active");

                    nextBtn.click(function () {
                        if (!handleStepOneValidation(false)) return;
                        stepOne.add(nextBtn).removeClass("active");
                        backBtn.add(submitBtn).add(stepTwo).addClass("active");
                    });

                    backBtn.click(function () {
                        stepOne.add(nextBtn).addClass("active");
                        stepTwo.add(submitBtn).add(backBtn).removeClass("active");

                        gsap.to(window, { duration: 1, overwrite: true, scrollTo: { y: self, autoKill: true }, ease: "circ.out" });
                    });
                }

                fields.each(function () {
                    const subSelf = $(this);
                    addSVG(subSelf);
                    addDropzone(subSelf);
                });

                createSteps();
                handleFormStep();
                handleStepOneValidation();
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
                target: `.${targetClass}`,
                onFormReady: function () {
                    stylizeSubmitBtn(formContainer);
                    addPlaceHolders(formContainer.find(".hs-fieldtype-text"));
                    addPlaceHolders(formContainer.find(".hs-fieldtype-select"), "select");

                    if (formContainer.hasClass("is-attachment")) {
                        fieldEnhancements(formContainer);
                    }

                    baunfire.Global.screenSizeChange();
                },
                onFormSubmit: function () {
                    console.log('Form submitted!');
                    baunfire.Global.screenSizeChange();

                    gsap.to(window, { duration: 1, overwrite: true, scrollTo: { y: self, autoKill: true }, ease: "circ.out" });
                }
            });
        }

        script();
    }
});
