(function ($) {
    const l10n = wp.media.view.l10n;
    const OriginalSelect = wp.media.view.MediaFrame.Select;

    wp.media.controller.Library.prototype.defaults.contentUserSetting = false;
    wp.media.controller.FeaturedImage.prototype.defaults.contentUserSetting = false;

    wp.media.view.MediaFrame.Select = OriginalSelect.extend({
        initialize: function () {
            localStorage.removeItem('media-frame-last-state');

            OriginalSelect.prototype.initialize.apply(this, arguments);

            const BynderState = wp.media.controller.State.extend({
                insert: function () {
                    this.frame.close();
                }
            });

            this.states.add([
                new BynderState({
                    id: "omron_bynder",
                    search: false,
                    title: "Bynder"
                })
            ]);

            this.on("content:render:omron_bynder", this.renderMyTabContent, this);
        },

        browseRouter: function (routerView) {
            routerView.set({
                upload: {
                    text: l10n.uploadFilesTitle,
                    priority: 20
                },
                browse: {
                    text: l10n.mediaLibraryTitle,
                    priority: 40
                },
                omron_bynder: {
                    text: "Bynder",
                    priority: 60
                }
            });
        },

        renderMyTabContent: function () {
            const BynderView = wp.Backbone.View.extend({
                tagName: "div",
                className: 'bynder-tab-content',
                active: false,
                toolbar: null,
                frame: null,
                render: function () {
                    this.$el.html(`
                        <div id="bynder-ucv"></div>
                    `);
                    this.openCompactView();
                    return this;
                },
                openCompactView: function () {
                    const container = this.el.querySelector('#bynder-ucv');

                    BynderCompactView.open({
                        language: "en_US",
                        theme: { colorButtonPrimary: "#3380FF" },
                        mode: "SingleSelectFile",
                        container,
                        portal: {
                            url: "assets.robotics.omron.com",
                        },
                        onSuccess: function (assets, additionalInfo) {
                            console.log("Assets selected:", assets, additionalInfo);
                            const asset = assets[0];

                            const attachment = new wp.media.model.Attachment({
                                id: 'bynder-' + asset.id,
                                title: asset.name,
                                filename: asset.name,
                                url: additionalInfo.selectedFile.url,
                                type: asset.type.toLowerCase(),
                                subtype: asset.extensions[0],
                                icon: asset.thumbnails ? asset.thumbnails[0] : '',
                            });

                            attachment.fetch = function () {
                                return Promise.resolve(this);
                            };

                            wp.media.frame.state().get('selection').reset([attachment]);
                            wp.media.frame.close();
                        }
                    });
                }
            });

            const view = new BynderView();
            this.content.set(view);
        }

    });
})(jQuery);
