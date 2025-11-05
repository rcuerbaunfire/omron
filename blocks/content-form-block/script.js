baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-form-block");
            if (!els.length) return;

            els.each(function (index) {
                const self = $(this);
                const box = self.find(".box");

                gsap.fromTo(box,
                    {
                        y: 40,
                        autoAlpha: 0,
                    },
                    {
                        duration: 0.8,
                        autoAlpha: 1,
                        y: 0,
                        ease: "power2.easeOut",
                        scrollTrigger: {
                            trigger: self,
                            start: "top 60%",
                        },
                        onStart: () => {
                            setTimeout(() => {
                                baunfire.Animation.headingAnimation(self.find(".main-title .inner-word"), {
                                    trigger: self,
                                    start: "top 60%",
                                });
                            }, 300);
                        }
                    }
                )


                handleLottie(self, self.find(".lottie"));
                // handleParallax(self.find(".parallax"));
                
                baunfire.Global.importHubspotScript(() => {
                    handleForm(self, index);
                });
            });
        }

        const handleLottie = (container, el) => {
            if (!el.length) return;

            const path = el.data("json");
            if (!path.length) return;

            const animation = lottie.loadAnimation({
                container: el.get(0),
                renderer: "svg",
                loop: true,
                autoplay: false,
                path: path
            });

            ScrollTrigger.create({
                trigger: container,
                start: "top 60%",
                end: "bottom top",
                onEnter: () => animation.play(),
                onLeave: () => animation.pause(),
                onEnterBack: () => animation.play(),
                onLeaveBack: () => animation.pause()
            })
        }

        const handleParallax = (el) => {
            if (!el.length) return;

            const mm = gsap.matchMedia();

            mm.add({
                isDesktop: `(min-width: 992px)`,
                isMobile: `(max-width: 991.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                if (isDesktop) {
                    baunfire.smoother && baunfire.smoother.effects(el, { speed: 'clamp(0.94)' });
                }

                if (isMobile) {
                    baunfire.smoother && baunfire.smoother.effects(el, { speed: 1 });
                }

                return () => { }
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
                const submitBTN = container.find('.hs_submit .actions input[type="submit"]');
                const iconHTML = $('<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.55697 10.375L11.8486 6.94618L8.55697 3.51736" stroke="white" stroke-width="1.5" stroke-miterlimit="10"></path><path d="M1.01411 0.500006L1.0141 5.84896C1.0141 6.45463 1.50566 6.94618 2.11133 6.94618L11.9863 6.94618" stroke="white" stroke-width="1.5" stroke-miterlimit="10"></path></svg>');
                const buttonHTML = $('<div class="btn form-btn white"></div>');

                submitBTN.wrap(buttonHTML);
                submitBTN.after(iconHTML);

                ScrollTrigger.refresh();
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
                onFormSubmit: function () {
                    console.log('Form submitted!');
                    ScrollTrigger.refresh();
                }
            });
        }

        script();
    }
});