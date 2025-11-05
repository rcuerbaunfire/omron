/**
 * Included when bynder_image fields are rendered for editing by publishers.
 */
(function ($) {
    function initialize_field(field) {
        const wrapper = field.find('.acf-bynder-wrapper');
        const preview = wrapper.find('.bynder-preview');
        const previewImageContainer = preview.find('.bynder-preview-image');

        const input = wrapper.find('input.bynder-url');
        const imageURL = input.val();

        const removeImage = wrapper.find(".bynder-preview-remove");

        wrapper.find('.open-bynder').on('click', function (e) {
            e.preventDefault();

            BynderCompactView.open({
                language: "en_US",
                theme: { colorButtonPrimary: "#3380FF" },
                mode: "SingleSelectFile",
                portal: {
                    url: "assets.robotics.omron.com",
                },
                assetTypes: ['IMAGE'],
                onSuccess: function (assets) {
                    var asset = assets[0];
                    var url = asset.files.webImage ? asset.files.webImage.url : (asset.url || '');
                    if (!url) return;

                    input.val(url).trigger('change');
                    updateImage(previewImageContainer, url);
                },
                onError: function (error) {
                    alert('Bynder error: ' + error.message);
                }
            });
        });

        removeImage.click(function () {
            input.val(null).trigger('change');
            updateImage(previewImageContainer, null, true);
        });

        if (imageURL) {
            updateImage(previewImageContainer, imageURL)
        }
    }

    function updateImage(previewImageContainer, url, remove = false) {
        const previewImage = previewImageContainer.find('img');

        if (remove) {
            previewImage.remove();
        } else {
            if (previewImage.length) {
                previewImage.attr("src", url)
            } else {
                previewImageContainer.html('<img src="' + url + '"/>');
            }
        }
    }

    if (typeof acf.add_action !== 'undefined') {
        /**
         * Run initialize_field when existing fields of this type load,
         * or when new fields are appended via repeaters or similar.
         */
        acf.add_action('ready_field/type=bynder_image', initialize_field);
        acf.add_action('append_field/type=bynder_image', initialize_field);
    }
})(jQuery);
