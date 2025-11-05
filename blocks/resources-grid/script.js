baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const el = $("section.resources-grid");
            if (!el.length) return;

            const baseVisibleCount = 12;

            el.each(function (index) {
                const self = $(this);

                const searchItems = self.find(".blog-item");
                if (!searchItems.length) return;

                const emptyState = self.find(".empty");
                const loadMoreState = self.find(".load-more");
                const mobileSelect = self.find("select");

                const filters = self.find(".cat-btn input");
                const filterShowAll = self.find(".cat-show-all");
                const filterGroups = self.find(".cat-parent");
                const filterGroupAll = self.find(".cat-body-all");

                let activeCategories = [];
                let activeVisibleCount = baseVisibleCount;

                refreshVisibleItems(searchItems, activeVisibleCount, loadMoreState, emptyState);

                mobileSelect.selectmenu({
                    open: function (event, ui) {
                        const target = $(this);
                        baunfire.Global.updateSelectClass(target);

                        const options = mobileSelect.find("option");
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

                        if (key == 'show-all') {
                            filterShowAll.click();
                        } else if (key.includes("-all")) {
                            self.find(`.cat-body-all[value="${key}"]`).click();
                        } else {
                            const target = self.find(`.cat-btn input[value="${key}"]`);
                            target.prop("checked", true).trigger("change");
                        }
                    },
                    position: {
                        my: "left top",
                        at: "left bottom",
                        collision: "none",
                    },
                });

                loadMoreState.click(function () {
                    activeVisibleCount += baseVisibleCount;
                    refreshVisibleItems(searchItems.filter(".in-filter"), activeVisibleCount, loadMoreState, emptyState);
                });

                filterShowAll.click(function () {
                    filters.prop('checked', false);
                    activeCategories = [];
                    filterShowAll.addClass("active");
                    filterGroupAll.removeClass("active");
                    searchItems.addClass("in-filter");

                    mobileSelect.val("show-all");
                    mobileSelect.selectmenu("refresh");

                    activeVisibleCount = baseVisibleCount;
                    refreshVisibleItems(searchItems, baseVisibleCount, loadMoreState, emptyState);
                });

                if (!filters.length) return;

                filterGroups.each(function () {
                    const subSelf = $(this);
                    const head = subSelf.find(".cat-head");
                    const bodyAll = subSelf.find(".cat-body-all");
                    const bodyFilterItems = subSelf.find(".cat-btn input");
                    const bodyFiltersValues = [];

                    bodyFilterItems.each(function () {
                        bodyFiltersValues.push($(this).val())
                    });

                    head.click(function () {
                        if (!subSelf.hasClass("active")) {
                            filterGroups.removeClass("active");
                            subSelf.addClass("active");
                        } else {
                            subSelf.removeClass("active");
                        }

                        baunfire.Global.screenSizeChange();
                    });

                    bodyAll.click(function () {
                        const bodyAllSelf = $(this);
                        const key = bodyAllSelf.attr("value");

                        if (!bodyAllSelf.hasClass("active")) {
                            filters.prop('checked', false);
                            activeCategories = bodyFiltersValues;

                            bodyAllSelf.addClass("active");
                            filterShowAll.removeClass("active");

                            activeVisibleCount = baseVisibleCount;

                            mobileSelect.val(key);
                            mobileSelect.selectmenu("refresh");

                            refreshSearch(searchItems, activeCategories, baseVisibleCount, loadMoreState, emptyState);
                        } else {
                            filterShowAll.click();
                            bodyAllSelf.removeClass("active");
                        }
                    });
                })

                filters.change(function () {
                    const subSelf = $(this);

                    filterShowAll.removeClass("active");
                    filterGroupAll.removeClass("active");

                    const value = subSelf.val();
                    const isChecked = subSelf.prop('checked');

                    if (isChecked) {
                        activeCategories = [];
                        self.find(`.cat-btn input:not([value='${value}'])`).prop('checked', false);
                        activeCategories.push(value);

                        mobileSelect.val(value);
                        mobileSelect.selectmenu("refresh");
                    } else {
                        activeCategories = $.grep(activeCategories, function (x) {
                            return x !== value;
                        });
                    }

                    if (activeCategories.length === 0) {
                        filterShowAll.click();
                    } else {
                        activeVisibleCount = baseVisibleCount;
                        refreshSearch(searchItems, activeCategories, baseVisibleCount, loadMoreState, emptyState);
                    }
                });

                baunfire.Global.importHubspotScript(() => {
                    handleForm(self, index, filterShowAll);
                });
            });
        }

        const handleForm = (self, index, reset) => {
            const cardContainer = self.find(".blog-card.blog-item.email-form");
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
                    cardContainer.fadeOut();
                    reset.trigger("click");

                    console.log('Form submitted!');
                    baunfire.Global.screenSizeChange();
                }
            });
        }

        const refreshSearch = (items, activeCategories, baseVisibleCount, loadMoreState, emptyState) => {
            items.removeClass("active in-filter");

            items.each(function () {
                const self = $(this);

                const categoryRaw = self.data("category");
                const categoryArray = Object.values(JSON.parse(JSON.stringify(categoryRaw)));

                if (categoryArray.some(item => activeCategories.includes(item))) {
                    self.addClass("in-filter");
                }
            });

            refreshVisibleItems(items.filter(".in-filter"), baseVisibleCount, loadMoreState, emptyState);
        }

        const refreshVisibleItems = (items, count, loadMoreState, emptyState) => {
            emptyState.hide();

            if (items.length) {
                items.removeClass("active");
                items.slice(0, count).addClass("active");

                if (count >= items.length) {
                    loadMoreState.removeClass("active");
                } else {
                    loadMoreState.addClass("active");
                }
            } else {
                loadMoreState.removeClass("active");
                emptyState.show();
            }

            baunfire.Global.screenSizeChange();
        }

        script();
    }
});
