var $ = jQuery.noConflict();

export const Resources = {
    token: z3.tk,
    baseUrl: z3.b,
    baseTaxonomies: z3.bc,
    baseTaxonomyIds: z3.bids,

    init: (self) => {
        const el = self.find(".resource-list");
        if (!el.length) return;

        const postGrid = self.find(".items");
        const postCount = postGrid.data("per-page");
        const basePosts = postGrid.children();

        const seeMoreBtn = self.find(".see-more");

        const filters = self.find(".res-filter input[type='checkbox']");
        const searchInput = self.find(".search input");

        const loadState = self.find(".load-state");
        const emptyState = self.find(".empty-state");

        const state = {
            post_grid: postGrid,
            post_count: postCount,
            keyword: "",
            taxonomy: "",
            phase: "",
            version: "",
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

        Resources.handleLoadMore(state);
        Resources.handleFilter(state);
        Resources.handleSearch(state);
        Resources.handleClear(self, state);
        Resources.handleAccordion(self);
        Resources.handleFilterDialog(self);
        Resources.handleCardClick(self, el.data("download-text"));
        Resources.handleActionsPin(self);

        state.page++;
        Resources.preloadPosts(state);
    },

    handleActionsPin: (self) => {
        const pinParent = self.find(".actions-container");
        const pinEL = self.find(".actions-inner");
        const offset = 160;

        if (!pinParent.length || !pinEL.length) return;

        const addRemoveClass = () => {
            if ((window.innerHeight - offset) < pinEL.outerHeight()) {
                pinEL.removeClass("will-stick");
            } else {
                pinEL.addClass("will-stick");
            }
        }

        app.Global.prototype.callAfterResize(addRemoveClass);
        addRemoveClass();
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
                    alert("No download URL available.");
                }

                subSelf.removeClass("downloading");
            })
            .catch(() => {
                alert("Failed to retrieve download link.");
                subSelf.removeClass("downloading");
            });
    },

    handleLoadMore: (state) => {
        state.see_more.on("click", function () {
            Resources.getPosts(state);
        });
    },

    handleFilter: (state) => {
        const { filters } = state;
        if (!filters.length) return;

        const preloadPromises = [];

        filters.each(function () {
            const subSelf = $(this);
            const value = subSelf.val();

            const isPhase = subSelf.attr("name") == "phase";

            const isVersion = subSelf.attr("name") == "version";
            const parentPhase = subSelf.attr("phase");

            const preloadParams = {
                post_count: state.post_count,
                keyword: '',
                taxonomy: '',
                phase: '',
                version: '',
                page: 1,
                cache: state.cache,
                pending: state.pending
            };

            if (isVersion) {
                preloadParams.phase = parentPhase;
                preloadParams.version = value;
            } else if (isPhase) {
                preloadParams.phase = value;
            } else {
                preloadParams.taxonomy = value;
            }

            subSelf.change(function () {
                const isChecked = subSelf.prop("checked");
                state.page = 1;

                if (isChecked) {
                    filters.prop("checked", false);
                    subSelf.prop("checked", true);

                    state.taxonomy = "";
                    state.phase = "";
                    state.version = "";

                    if (isVersion) {
                        state.phase = parentPhase;
                        state.version = value;
                    } else if (isPhase) {
                        state.phase = value;
                    } else {
                        state.taxonomy = value;
                    }
                }

                if (state.taxonomy || state.keyword || state.phase || state.version) {
                    Resources.getPosts(state, true);
                } else {
                    Resources.getPosts(state, true, true);
                }
            })

            preloadPromises.push(
                Resources.preloadPosts(preloadParams, true)
            );
        });

        Promise.all(preloadPromises);
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

                if (state.taxonomy || state.keyword || state.phase || state.version) {
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
                state.filters.prop("checked", false);
                state.page = 2;
                state.taxonomy = "";
                state.search = "";
                state.keyword = "";
                state.phase = "";
                state.version = "";
                Resources.getPosts(state, true, true);
            }
        });
    },

    getCacheKey: (params) => {
        return `${params.page}-${params.keyword}-${params.taxonomy}-${params.phase}-${params.version}`;
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

            setTimeout(() => { ScrollTrigger.refresh() }, 50);
        } else {
            let assetsHTML = '';

            assets.forEach((asset) => {
                const asset_date = new Date(asset.dateCreated).toLocaleDateString("en-US", {
                    timeZone: "UTC",
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                });

                const asset_extension = asset.extension[0];
                const asset_icon = Resources.getAssetIcon(asset_extension);
                const asset_subtext = `${asset.name}.${asset_extension}`;
                const asset_type = Resources.getAssetTypeName(asset);

                assetsHTML += `<div class="res-card" data-asset-id="${asset.id}"><div class="res-card-inner"><div class="res-card-head"><div class="res-card-brow"><div class="res-card-brow-square"></div><small>${asset_type}</small></div><small>${asset_date}</small></div><p class="main-title lg">${asset.name}</p><div class="res-card-foot"><div class="res-card-icon">${asset_icon}</div><p class="sm">${asset_subtext}</p></div></div></div>`;
            });

            container.append(assetsHTML);

            setTimeout(() => {
                container.find(".res-card").addClass("active");
                baunfire.Global.screenSizeChange();
            }, 50);
        }
    },

    preloadPosts: (state) => {
        const { post_count, keyword, taxonomy, page, phase, cache, version, pending } = state;
        const cacheKey = Resources.getCacheKey({ page, limit: post_count, taxonomy, keyword, phase, version });

        const query = new URLSearchParams({
            limit: post_count,
            orderBy: 'dateCreated desc',
            property_Asset_Type: 'Documents',
            property_Sync: 'ORT_Website',
            total: 1,
            page: page,
            keyword: keyword,
            propertyOptionId: taxonomy || Resources.baseTaxonomyIds,
            property_Software_Phase: phase,
            property_Software_Versions: version,
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
            phase,
            version,
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
            const cacheKey = Resources.getCacheKey({ page, limit: post_count, taxonomy, keyword, phase, version });

            if (cache[cacheKey]) {
                const response = cache[cacheKey];
                Resources.handlePostResponse(response, state);
                return;
            }

            const query = new URLSearchParams({
                limit: post_count,
                orderBy: 'dateCreated desc',
                property_Asset_Type: 'Documents',
                property_Sync: 'ORT_Website',
                total: 1,
                page: page,
                keyword: keyword,
                propertyOptionId: taxonomy || Resources.baseTaxonomyIds,
                property_Software_Phase: phase,
                property_Software_Versions: version,
            });

            const url = `${Resources.baseUrl}/media/?${query.toString()}`;

            Resources.fetchFromAPIAndCache(url, cache, pending, cacheKey, (data) => {
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
                    'Authorization': `Bearer ${Resources.token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => res.json())
                .then((data) => {
                    cache[cacheKey] = data;
                    onSuccess(data);
                    return data;
                })
                .catch(() => {
                    alert("Failed to fetch assets.");
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
            Resources.preloadPosts(state);
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
        const lines = Resources.getAssetTaxonomyName('lines', asset['property_Product_Line']);
        const software = Resources.getAssetTaxonomyName('categories', asset['property_Software_Phase']);
        const categories = Resources.getAssetTaxonomyName('categories', asset['property_Asset_Sub-Type']);
        const translation = Resources.getAssetTaxonomyName('categories', asset['property_Language']);

        const parts = [lines, software, categories, translation].filter(Boolean);

        return parts.join(', ');
    }
};