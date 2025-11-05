baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const commas = false;
        const ROI_CREATE_RECORD_URL = '/wp-json/omronroi/v1/create-record';

        const script = () => {
            const els = $("section.content-roi-calculator");
            if (!els.length) return;

            els.each(function (index) {
                const self = $(this);

                const structureData = {
                    selectContainer: self.find(".currency-select-container"),
                    robotGroups: self.find(".robot-group")
                }

                const stepData = {
                    index: 1,
                    inner: self.find(".inner"),
                    tabs: self.find(".tab"),
                    panels: self.find(".panel")
                }

                const fieldsData = {
                    normalFields: self.find(".ff:not(.is-currency)"),
                    currencyFields: self.find(".ff.is-currency")
                }

                const formData = {
                    inflation_rate: stepData.inner.data("inf"),
                    interest_rate: stepData.inner.data("int"),
                    currency_name: 'key_USD',
                    currency_sign: self.find(".prefix").first().text()
                };

                baunfire.Animation.headingAnimation(self.find(".main-title .inner-word"), {
                    trigger: self,
                    start: "top 60%",
                }, {
                    onStart: () => {
                        baunfire.Animation.descAnimation(self.find(".para-desc"));
                    }
                });

                baunfire.Global.importHubspotScript(() => {
                    handleForm(self, fieldsData, structureData, stepData, formData, index);
                });
            });
        }

        const handleForm = (self, fieldsData, structureData, stepData, formData, index) => {
            const formContainer = self.find(".form-container");
            if (!formContainer.length) return;

            const { normalFields, currencyFields } = fieldsData;

            const targetClass = `${self.attr("class").split(" ")[0]}-${index}`;
            formContainer.addClass(targetClass);

            const region = formContainer.data("region");
            const formId = formContainer.data("form-id");
            const portalId = formContainer.data("portal-id");

            const viewResults = self.find(".view-results");

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
                target: `.${targetClass}`,
                onFormReady: function ($form) {
                    handleSteps(stepData, structureData.selectContainer);
                    handleRobotGroups(self, structureData.robotGroups);
                    handleCurrency(self, structureData.robotGroups, stepData.panels.first().find(".next-btn"), formData, fieldsData.currencyFields);
                    handleRobotChilds(self, stepData, formData);
                    
                    createSliders(self, formData, normalFields,);
                    createSliders(self, formData, currencyFields, true);

                    stylizeSubmitBtn(formContainer);
                    addPlaceHolders(formContainer.find(".hs-fieldtype-text"));
                    addPlaceHolders(formContainer.find(".hs-fieldtype-select"), "select");

                    // $form.on('submit', function (e) {
                    //     e.preventDefault();

                    //     fetch(`${ROI_CREATE_RECORD_URL}`, {
                    //         method: "POST",
                    //         headers: {
                    //             "Content-Type": "application/json"
                    //         },
                    //         body: JSON.stringify(formData)
                    //     })
                    //         .then(response => response.json())
                    //         .then(data => {
                    //             if (!data || !data.success || !data.id) return;
                    //             // $form.find('input[name="wp_post_url"]').val(data.post_url);
                    //             $form.get(0).submit();
                    //         })
                    //         .catch(error => {
                    //             console.error("Error sending form data:", error);
                    //         });
                    // });
                },
                onFormSubmit: function () {
                    console.log('Form submitted!');
                    baunfire.Global.screenSizeChange();

                    fetch(`${ROI_CREATE_RECORD_URL}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(formData)
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (!data || !data.success || !data.redirect_uri) return;
                            viewResults.addClass("active");

                            viewResults.click(function () {
                                window.location.href = data.redirect_uri;
                            });
                        })
                        .catch(error => {
                            console.error("Error sending form data:", error);
                        });
                }
            });
        }

        const handleCurrency = (self, groups, nextBtn, formData, currencyFields) => {
            const select = self.find(".jselect.currency select");

            if (!select.length) return;

            select.selectmenu({
                classes: {
                    "ui-selectmenu-menu": "roi-currency"
                },
                create: function (event, ui) {
                    getAvailableRobotChilds(groups, formData['currency_name'], nextBtn);
                },
                open: function (event, ui) {
                    const target = $(this);
                    baunfire.Global.updateSelectClass(target);

                    const options = select.find("option");
                    const parent = target.selectmenu("menuWidget");

                    options.each(function (index) {
                        let className = $(this).attr("class");

                        if (className) {
                            parent.find(".ui-menu-item").eq(index).addClass(className);
                        }
                    });
                },
                change: function (event, data) {
                    const key = data.item.value;
                    const name = data.item.label;
                    formData['currency_sign'] = key;
                    formData['currency_name'] = `key_${name}`;
                    self.find(".prefix").text(key);
                    rebuildSliders(self, formData, currencyFields, name);
                    getAvailableRobotChilds(groups, formData['currency_name'], nextBtn);
                },
                position: {
                    my: "left top",
                    at: "left bottom",
                    collision: "none",
                },
            });
        }

        const alignIndex = (stepData, selectContainer) => {
            const { index, inner, tabs, panels } = stepData;

            tabs.removeClass("current");
            panels.removeClass("active");

            const targetTab = tabs.eq(index - 1);
            const targetPanel = panels.eq(index - 1);

            targetTab.addClass("current");
            targetPanel.addClass("active");

            if (index == 1) {
                selectContainer.show();
            } else {
                selectContainer.hide();
            }

            baunfire.Global.screenSizeChange();

            let mm = window.matchMedia("(max-width: 1200px)");

            if (mm.matches) {
                gsap.to(window, { duration: 1, overwrite: true, scrollTo: { y: inner, offsetY: () => $("nav").outerHeight() + 20, autoKill: true }, ease: "circ.out" });
            }
        }

        const handleSteps = (stepData, selectContainer) => {
            const { tabs, panels } = stepData;

            tabs.each(function () {
                const subSelf = $(this);
                const index = subSelf.data("step");

                subSelf.click(function () {
                    if (subSelf.hasClass("current")) return;

                    stepData.index = index;
                    alignIndex(stepData);
                });
            });

            panels.each(function () {
                const subSelf = $(this);
                const index = subSelf.data("step");

                const backBtn = subSelf.find(".back-btn");
                const nextBtn = subSelf.find(".next-btn");

                if (backBtn.length) {
                    backBtn.click(function () {
                        stepData.index = index - 1;
                        alignIndex(stepData, selectContainer);
                        // console.log(formData);
                    });
                }

                if (nextBtn.length) {
                    nextBtn.click(function () {
                        stepData.index = index + 1;
                        alignIndex(stepData, selectContainer);
                        // console.log(formData);
                    });
                }
            });
        }

        const handleRobotGroups = (self, groups) => {
            const tabs = self.find(".robot-type");
            const select = self.find(".jselect.robot-types select");

            const syncTabSelect = (type) => {
                const targetTab = self.find(`.robot-type[data-type='${type}']`);
                const targetGroup = self.find(`.robot-group[data-type='${type}']`);

                tabs.removeClass("active");
                groups.removeClass("active");

                targetTab.addClass("active");
                targetGroup.addClass("active");
            }

            tabs.click(function () {
                const subSelf = $(this);
                if (subSelf.hasClass("active")) return;

                const type = subSelf.data("type");
                syncTabSelect(type);

                select.val(type);
                select.selectmenu("refresh");
            });

            select.selectmenu({
                classes: {
                    "ui-selectmenu-menu": "roi-currency"
                },
                open: function (event, ui) {
                    const target = $(this);
                    baunfire.Global.updateSelectClass(target);

                    const options = select.find("option");
                    const parent = target.selectmenu("menuWidget");

                    options.each(function (index) {
                        let className = $(this).attr("class");

                        if (className) {
                            parent.find(".ui-menu-item").eq(index).addClass(className);
                        }
                    });
                },
                change: function (event, data) {
                    const type = data.item.value;
                    syncTabSelect(type);
                },
                position: {
                    my: "left top",
                    at: "left bottom",
                    collision: "none",
                },
            });
        }

        const handleRobotChilds = (self, stepData, formData) => {
            const children = self.find(".robot-child");

            const activeRobot = self.find(".robot-current");
            const nextBtn = stepData.panels.first().find(".next-btn");

            const key = self.find(".robot-types-container").data("key");
            const formInput = self.find(`.hs-form-field.${key} .input input`);

            const defaultRobotProps = {
                name: '',
                image: '',
                subtext: ''
            };

            formData['robot'] = defaultRobotProps;

            children.click(function () {
                const subSelf = $(this);
                activeRobot.empty();

                if (subSelf.hasClass("active")) {
                    subSelf.removeClass("active");
                    nextBtn.addClass("disabled");
                    formInput.val("");

                    formData['robot'] = defaultRobotProps;
                } else {
                    const robotData = subSelf.data("robot");
                    formData['robot'] = {
                        name: robotData.name,
                        image: robotData.image,
                        subtext: robotData.subtext
                    };

                    formData['robot_cost'] = robotData.prices.find(item => item.price_currency === formData['currency_name']).robot_item_price;

                    children.removeClass("active");
                    subSelf.addClass("active");

                    formInput.val(robotData.name);

                    subSelf.clone(false).removeClass("active").appendTo(activeRobot);
                    nextBtn.removeClass("disabled");
                }
            });
        }

        const getAvailableRobotChilds = (groups, name, nextBtn) => {
            nextBtn.addClass("disabled");

            groups.each(function () {
                const subSelf = $(this);
                const children = subSelf.find(".robot-child");
                const emptyState = subSelf.find(".robot-children-empty");
                let activeCount = 0;

                emptyState.removeClass("active");
                children.removeClass("enabled active");

                children.each(function () {
                    const child = $(this);
                    const data = child.data("robot");

                    if (!data.prices) return;

                    const targetPrice = data.prices.find(item => item.price_currency === name);

                    if (targetPrice && targetPrice.robot_item_price !== "") {
                        child.addClass("enabled");
                        activeCount++;
                    }
                });

                if (activeCount == 0) {
                    emptyState.addClass("active");
                }
            });
        }

        const rebuildSliders = (container, formData, fields, targetCurrency) => {
            if (!fields.length) return;

            fields.each(function () {
                const subSelf = $(this);
                const slider = subSelf.find(".ff-slider");
                const currencyData = subSelf.data("currency")[`key_${targetCurrency}`];

                slider.data("min", currencyData.min);
                slider.data("max", currencyData.max);

                subSelf.find("span.min").text(currencyData.min);
                subSelf.find("span.max").text(currencyData.max);

                slider.slider("destroy");

                slider.find(".ff-slider-lines").before(`<div class="ff-handle ui-slider-handle"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8Z" fill="#1263FF"/><path fill-rule="evenodd" clip-rule="evenodd" d="M4.70711 8L6.35355 6.35355L5.64645 5.64645L3.29289 8L5.64645 10.3536L6.35355 9.64645L4.70711 8Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M11.2929 8L9.64645 6.35355L10.3536 5.64645L12.7071 8L10.3536 10.3536L9.64645 9.64645L11.2929 8Z" fill="white"/></svg></div>`)
            });

            createSliders(container, formData, fields, true);
        }

        const createSliders = (container, formData, fields, isCurrency = false) => {
            if (!fields.length) return;

            fields.each(function () {
                const subSelf = $(this);
                const inputPreview = subSelf.find(".ff-default input");

                const key = subSelf.data("key");
                const formInput = container.find(`.hs-form-field.${key} .input input`);

                const slider = subSelf.find(".ff-slider");
                const base = slider.data("default");
                const min = slider.data("min");
                const max = slider.data("max");

                const prefix = subSelf.find(".prefix").last().text();
                const suffix = subSelf.find(".suffix").last().text();

                slider.slider({
                    animate: "fast",
                    value: base,
                    min: parseInt(min),
                    max: parseInt(max),
                    step: isCurrency ? 500 : 1,
                    range: "min",
                    create: function (event, ui) {
                        handlePreviewTextUpdate(base, inputPreview, formInput, prefix, suffix, isCurrency);
                        formData[key] = base;
                    },
                    slide: function (event, ui) {
                        handlePreviewTextUpdate(ui.value, inputPreview, formInput, prefix, suffix, isCurrency);
                        formData[key] = ui.value;
                    },
                    change: function (event, ui) {
                        handlePreviewTextUpdate(ui.value, inputPreview, formInput, prefix, suffix, isCurrency);
                        formData[key] = ui.value;
                    }
                });

                inputPreview.on('input', function () {
                    let input = $(this);
                    let val = input.val();

                    if (commas) {
                        let raw = val.replace(/,/g, '').replace(/[^0-9.]/g, '');

                        let numericVal = raw === '' ? min : parseFloat(raw);

                        if (numericVal > max) numericVal = max;
                        if (numericVal < min) numericVal = min;

                        slider.slider('value', numericVal);

                        let parts = numericVal.toString().split('.');
                        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

                        input.val(parts.join('.'));
                    } else {
                        let numericVal = val === '' ? min : parseInt(val, 10);

                        if (numericVal > max) numericVal = max;
                        if (numericVal < min) numericVal = min;

                        slider.slider('value', numericVal);
                        input.val(numericVal);
                    }
                });

                inputPreview.on('keypress', function (e) {
                    if ([46, 69, 101, 45].includes(e.which)) {
                        e.preventDefault();
                    }
                });

                inputPreview.on('paste', function (e) {
                    const pastedData = e.originalEvent.clipboardData.getData('text');
                    if (/[.eE-]/.test(pastedData)) {
                        e.preventDefault();
                    }
                });
            });
        }

        const handlePreviewTextUpdate = (baseValue, inputPreview, formInput, prefix, suffix, isCurrency = false) => {
            let value = baseValue;

            if (isCurrency && commas) {
                value = baseValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }

            inputPreview.val(value);

            value = prefix ? `${prefix}${value}` : value;
            value = suffix && suffix == "%" ? `${value}${suffix}` : value;

            formInput.val(value);
        }

        script();
    }
});