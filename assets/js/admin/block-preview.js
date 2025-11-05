(function () {
    var $ = jQuery.noConflict();

    $(document).on('mouseover', function (e) {
        setTimeout(() => {
            const previewContainer = $('.block-editor-inserter__preview-content-missing');
            if (!previewContainer.length) return;

            const target = $(e.target);
            const targetClass = ".block-editor-block-types-list__item";
            let hoveredBlock = null;

            if (target.closest(targetClass)) {
                hoveredBlock = target.closest(targetClass);
            } else if (target.hasClass("block-editor-block-types-list__list-item")) {
                hoveredBlock = target.find(targetClass);
            }

            if (!hoveredBlock.length) return;

            const blockClass = hoveredBlock.attr('class').match(/editor-block-list-item-acf-\S+/);

            if (blockClass) {
                const blockName = blockClass[0].replace("editor-block-list-item-acf-", "");
                const imageUrl = `${theme_path.url}/blocks/${blockName}/preview.png`;
                if (!imageUrl) return;

                previewContainer.css({
                    'background': `url(${imageUrl}) no-repeat center`,
                    'background-size': 'contain',
                    'font-size': '0px'
                });
            }
        }, 100);
    });
})();