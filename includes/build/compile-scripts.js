const esbuild = require("esbuild");
const path = require("path");
const chokidar = require("chokidar");
const glob = require("glob");

function minifyBlockScript(filePath) {
    const minPath = filePath.replace("script.js", "script.min.js");
    return esbuild.build({
        entryPoints: [filePath],
        outfile: minPath,
        minify: true,
        bundle: true,
        sourcemap: false,
        logLevel: "silent",
    }).then(() => {
        console.log(`✓ Minified block script: ${minPath}`);
    }).catch((err) => {
        console.error(`X Failed to minify block script: ${filePath}`, err.message);
    });
}

function bundleCustomScripts() {
    const input = path.resolve(__dirname, "../../assets/js/custom/index.js");
    const output = path.resolve(__dirname, "../../assets/js/custom.min.js");

    return esbuild.build({
        entryPoints: [input],
        outfile: output,
        minify: true,
        bundle: true,
        sourcemap: false,
        logLevel: "silent",
    }).then(() => {
        console.log("✓ Bundled custom.min.js");
    }).catch((err) => {
        console.error("X Failed to bundle custom.min.js", err.message);
    });
}

function minifyAllBlocks() {
    const blockScripts = glob.sync(path.resolve(__dirname, "../../blocks/**/script.js"));
    return Promise.all(blockScripts.map(minifyBlockScript));
}

async function buildAll() {
    // await minifyAllBlocks();
    await bundleCustomScripts();
}

function startWatcher() {
    const watcher = chokidar.watch(
        [
            // path.resolve(__dirname, "../../blocks/**/script.js"),
            path.resolve(__dirname, "../../assets/js/custom/index.js"),
            path.resolve(__dirname, "../../assets/js/custom/**/*.js")
        ],
        {
            ignoreInitial: false,
        }
    );

    watcher.on("add", filePath => {
        console.log(`File added: ${filePath}`);
        handleChange(filePath);
    });

    watcher.on("change", filePath => {
        console.log(`File changed: ${filePath}`);
        handleChange(filePath);
    });

    watcher.on("unlink", filePath => {
        console.log(`File removed: ${filePath}`);
    });

    async function handleChange(filePath) {
        const rel = path.relative(process.cwd(), filePath).replace(/\\/g, "/");
        if (rel.startsWith("blocks/") && rel.endsWith("script.js")) {
            await minifyBlockScript(filePath);
        } else if (rel.startsWith("assets/js/custom/")) {
            await bundleCustomScripts();
        } else {
            console.log(`(Ignored) ${rel}`);
        }
    }
}

if (process.argv.includes("--watch")) {
    startWatcher();
} else {
    buildAll();
}