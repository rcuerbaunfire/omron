baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const el = $("section.training-list");
            if (!el.length) return;

            el.each(function (index) {
                const self = $(this);

                const itemsContainer = self.find(".items");
                const baseVisibleCount = itemsContainer.data("per-page");

                const items = self.find(".res-card");
                if (!items.length) return;

                const data = {
                    parent: self,
                    items: items,
                    activeQuery: '',
                    activeTags: [],
                    search: self.find(".search input"),
                    baseVisibleCount: baseVisibleCount,
                    activeVisibleCount: baseVisibleCount,
                    filters: self.find(".res-filter input[type='checkbox']"),
                    loadMore: self.find(".see-more"),
                    emptyText: self.find(".empty-state"),
                    reset: self.find(".clear-all")
                }

                handleFilterDialog(self);
                handleAccordion(self);
                handleLoadMore(data);
                handleSearch(data);
                handleReset(data);
                handleFilter(data);
                refreshVisibleItems(data);
            });
        };

        const handleAccordion = (self) => {
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
        }

        const handleLoadMore = (data) => {
            const { loadMore, baseVisibleCount } = data;

            loadMore.click(function () {
                data.activeVisibleCount += baseVisibleCount;
                refreshVisibleItems(data);
            });
        };

        const handleFilter = (data) => {
            const { filters } = data;
            if (!filters.length) return;

            filters.change(function () {
                data.activeTags = filters.filter(":checked").map(function () { return this.value }).get();
                processItems(data);
            });
        };

        const handleSearch = (data) => {
            const { search } = data;

            const debounce = (func, delay = 300) => {
                let timeout;
                return (...args) => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(null, args), delay);
                };
            };

            const runSearch = debounce((value) => {
                data.activeQuery = value.toLowerCase().trim();
                processItems(data);
            }, 300);

            search.on("keyup", function (e) {
                e.preventDefault();
                runSearch(this.value);
            });
        };

        const processItems = (data) => {
            const { items, baseVisibleCount, activeQuery, activeTags } = data;
            items.removeClass("active in-filter");

            items.each(function () {
                const self = $(this);

                let matchesQuery = true;

                if (activeQuery) {
                    const title = self.find(".main-title").text().toLowerCase();
                    matchesQuery = title.includes(activeQuery.toLowerCase());
                }

                let matchesCategory = true;

                if (activeTags.length > 0) {
                    const categoryArray = Object.values(self.data("tags") || {});
                    matchesCategory = activeTags.some(cat => categoryArray.includes(cat));
                }

                if (matchesQuery && matchesCategory) {
                    self.addClass("in-filter");
                }
            });

            data.activeVisibleCount = baseVisibleCount;
            refreshVisibleItems(data, true);
        };

        const refreshVisibleItems = (data, reset = false) => {
            const { parent, activeVisibleCount, loadMore, emptyText } = data;
            emptyText.removeClass("active");

            const items = (data.items || $()).filter(".in-filter");

            if (items.length) {
                items.removeClass("active");
                const visibleItems = items.slice(0, activeVisibleCount).addClass("active");

                visibleItems.find(".card-image img[data-src]").each(function () {
                    const image = $(this);
                    image.attr("src", image.data("src")).removeAttr("data-src");
                    image.closest(".card-image").addClass("active");
                });

                loadMore.toggleClass("active", activeVisibleCount < items.length);
            } else {
                loadMore.removeClass("active");
                emptyText.addClass("active");
            }

            baunfire.Global.screenSizeChange();

            if (reset) repositionScroll(parent);
        };

        const handleReset = (data) => {
            const { items, reset, emptyText, filters, loadMore, baseVisibleCount } = data;

            reset.on("click", function () {
                data.activeVisibleCount = baseVisibleCount;
                data.activeQuery = "";
                data.activeTags = [];
                data.search.val("");

                loadMore.removeClass("active");
                emptyText.removeClass("active");
                items.removeClass("active").addClass("in-filter");
                filters.prop("checked", false);
                refreshVisibleItems(data, true);
            });
        };

        const repositionScroll = (el) => {
            gsap.to(window, {
                duration: 1,
                overwrite: true,
                scrollTo: { y: el, offsetY: 0, autoKill: true },
                ease: "circ.out",
            });
        };

        const handleFilterDialog = (self) => {
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
        };

        script();
    }
});
