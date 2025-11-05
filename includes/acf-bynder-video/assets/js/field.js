/**
 * Included when bynder_image fields are rendered for editing by publishers.
 */
(function ($) {
    function initialize_field(field) {
        const wrapper = field.find('.acf-bynder-wrapper');
        const preview = wrapper.find('.bynder-preview .bynder-asset');

        const input = wrapper.find('input.bynder-url');
        const removeAsset = wrapper.find(".bynder-asset-remove");

        wrapper.find('.open-bynder').on('click', function (e) {
            e.preventDefault();

            BynderCompactView.open({
                language: "en_US",
                theme: { colorButtonPrimary: "#3380FF" },
                mode: "SingleSelectFile",
                portal: {
                    url: "assets.robotics.omron.com",
                },
                assetTypes: ['VIDEO'],
                onSuccess: function (assets) {
                    const asset = assets[0];

                    const imageURL = asset.files.webImage ? asset.files.webImage.url : "";
                    const fileURL = asset.previewUrls[0];

                    const value = {
                        thumbnail: imageURL,
                        file: fileURL,
                        name: asset.name
                    }

                    if (!fileURL) return;

                    input.val(JSON.stringify(value)).trigger('change');
                    updatePreview(preview, value);
                },
                onError: function (error) {
                    alert('Bynder error: ' + error.message);
                }
            });
        });

        removeAsset.click(function () {
            const value = {
                thumbnail: null,
                file: null,
                name: null
            }

            input.val(value).trigger('change');
            updatePreview(preview, value, true);
        });
    }

    function updatePreview(preview, data, remove = false) {
        const { thumbnail, name } = data;

        const previewText = preview.find('p');
        const previewImage = preview.find('img');

        if (remove) {
            previewText.remove();
            previewImage.remove();
        } else {
            if (previewText.length) {
                previewText.text(name);
                previewImage.attr("src", thumbnail);
            } else {
                preview.html(`<img src="${thumbnail}" loading="lazy" alt="${name}"><p>${name}</p>`);
            }
        }
    }

    if (typeof acf.add_action !== 'undefined') {
        /**
         * Run initialize_field when existing fields of this type load,
         * or when new fields are appended via repeaters or similar.
         */
        acf.add_action('ready_field/type=bynder_video', initialize_field);
        acf.add_action('append_field/type=bynder_video', initialize_field);
    }
})(jQuery);
