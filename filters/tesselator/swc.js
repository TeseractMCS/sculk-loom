import { transformFile } from "@swc/core";
import { sync } from "glob";
import { mkdirSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import { join, relative, dirname } from "path";
import JSON5 from "json5";

const manifest = JSON5.parse(readFileSync("./BP/manifest.json"));
const tsconfig = JSON5.parse(readFileSync("../../tsconfig.json"));

const package_name = manifest.header.name;
const version = typeof manifest.header.version == "string" ? manifest.header.version : manifest.header.version.join(".");

const initialMS = Date.now();
console.log(`Started building ${package_name}@${version}!`);

const files = sync("./data/**/*.{ts,js}");

Promise.all(
    files.map((file) =>
        transformFile(file, {
            jsc: {
                parser: {
                    syntax: "typescript",
                    tsx: false,
                    decorators: true,
                },
                transform: {
                    legacyDecorator: true,
                    decoratorMetadata: true,
                },
                "paths": tsconfig.compilerOptions.paths ?? {},
                target: "es2020",
                "baseUrl": "data"
            },

            sourceMaps: false,
            module: {
                type: "es6",
            },
        })
            .then((output) => {
                const outPath = join("BP/scripts", relative("data", file));
                const outDir = dirname(outPath);
                mkdirSync(outDir, { recursive: true });
                writeFileSync(outPath.replace(/\.ts$/, ".js"), output.code);
                if (output.map) {
                    writeFileSync(outPath.replace(/\.ts$/, ".js.map"), output.map);
                }
            })
    )
)
    .then(() => {
        console.log(`Bundling finished in ${Date.now() - initialMS} milliseconds!`);
    })
    .catch((error) => {
        console.error(error);
    });
