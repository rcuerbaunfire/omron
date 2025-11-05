baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.post-footer-subscribe");
            if (!els.length) return;

            els.each(function (index) {
                const self = $(this);

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

            const stylizeSubmitBtn = (container) => {
                const submitBTN = formContainer.find('.hs_submit .actions input[type="submit"]');
                const iconHTML = $('<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.55697 10.375L11.8486 6.94618L8.55697 3.51736" stroke="white" stroke-width="1.5" stroke-miterlimit="10"></path><path d="M1.01411 0.500006L1.0141 5.84896C1.0141 6.45463 1.50566 6.94618 2.11133 6.94618L11.9863 6.94618" stroke="white" stroke-width="1.5" stroke-miterlimit="10"></path></svg>');
                const buttonHTML = $('<div class="btn form-btn borderized newsletter"></div>');

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
                    addPlaceHolders(formContainer.find(".hs-fieldtype-text, .hs-fieldtype-phonenumber"));
                    addPlaceHolders(formContainer.find(".hs-fieldtype-select"), "select");
                },
                onFormSubmit: function (form, data) {
                    console.log('Form submitted!');
                    baunfire.Global.screenSizeChange();
                }
            });
        }

        script();
    }
});