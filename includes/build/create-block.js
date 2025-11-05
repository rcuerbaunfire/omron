//Created by Rich Cuer v1.0

const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question(`✨ Block Folder Name (ex. hero-homepage — ⚠️ Use only lowercase letters, dashes, and no spaces, numbers or special characters): \n`, (blockName) => {
    rl.question('\n✨ Block Title (ex. Hero Homepage): \n', (blockTitle) => {
        const rootDir = path.resolve(__dirname, "../../");
        const blocksDir = path.join(rootDir, 'blocks');
        const blockPath = path.join(blocksDir, blockName);
        const templatesDir = path.join(rootDir, 'includes/boilerplate');
        const defaultPreviewPath = path.join(rootDir, 'assets/img/png/preview.png');

        const files = {
            'block.json': 'block.json.template',
            'block.css': 'block.css.template',
            'controller.php': 'controller.php.template',
            'preview.png': null,
            'script.min.asset.php': 'script.min.asset.php.template',
            'script.js': 'script.js.template',
            'template.twig': 'template.twig.template',
        };

        fs.ensureDir(blockPath)
            .then(() => {
                const filePromises = Object.entries(files).map(([fileName, template]) => {
                    const filePath = path.join(blockPath, fileName);

                    if (fileName === 'preview.png') {
                        return fs.copy(defaultPreviewPath, filePath);
                    } else if (template) {
                        const templatePath = path.join(templatesDir, template);
                        return fs.readFile(templatePath, 'utf8').then((content) => {
                            const customizedContent = content
                                .replace(/\[\[BLOCK_NAME\]\]/g, blockName)
                                .replace(/\[\[BLOCK_TITLE\]\]/g, blockTitle);
                            return fs.writeFile(filePath, customizedContent);
                        });
                    } else {
                        return fs.writeFile(filePath, '');
                    }
                });

                return Promise.all(filePromises);
            })
            .then(() => {
                console.log(`\nBlock folder '${blockName}' created with the following files:`);
                Object.keys(files).forEach((file) => console.log(`✅ ${file}`));
            })
            .catch((err) => {
                console.error(`\n⚠️ Error creating block folder or files:`, err);
            })
            .finally(() => {
                rl.close();
            });
    });
});