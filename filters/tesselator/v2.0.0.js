// @ts-check
import JSON5 from "json5";
import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { esbuildDecorators } from "esbuild-decorators";

/**
 * @typedef PluginData 
 * @property {string} name
 * @property {string[]} authors
 * @property {string} id
 * @property {string} description
 * @property {`${number}.${number}.${number}${'' | `-${string}`}${'' | `.${number}${'' | `.${number}`}`}`} version
 * @property {string[]} entryPoints
 * @property {string[]} external
 */

class Tesselator {
    /**
     * @private
     * @type {PluginData}
     */
    static pluginData;
    /**
     * @private
     * @type {string[]}
     */
    static entryPoints;
    /**
     * @private
     * @type {string}
     */
    static index;

    static writeIndex() {
        mkdirSync("BP/scripts");
        writeFileSync("data/index.ts", this.index);
    }

    /**
     * @private
     */
    static build() {
        build({
            entryPoints: ["data/index.ts"],
            bundle: true,
            // minify: true,
            outfile: 'BP/scripts/index.js',
            platform: 'node',
            target: 'es2020',
            external: ["@minecraft/server","@minecraft/server-ui",...this.pluginData.external],
            allowOverwrite: true,
            format: "esm",
            logLevel: 'info',
            "tsconfig": "../../tsconfig.json",
            plugins: [
                esbuildDecorators({
                    tsconfig: "../../tsconfig.json",
                    cwd: process.cwd(),
                }),
            ],
            treeShaking: false
        }).catch(error => {
            throw error;
        }).then(() => {
            this.injectIndex()
        })
    }
    static injectIndex() {
        const code = readFileSync("BP/scripts/index.js").toString();
        let injectedCode = ""
        if (!code.includes("var __classPrivateFieldSet =")) {
            injectedCode += `var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};`
        }

        if (!code.includes("var __classPrivateFieldGet =")) {
            injectedCode += `var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};`
        }

        if (!code.includes("var __decorate =")) {
            injectedCode += `var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};`
        }

        if (!code.includes("var __metadata =")) {
            injectedCode += `var __metadata = function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};`
        }
        writeFileSync("BP/scripts/index.js", injectedCode + code);
    }

    /**
     * @private
     */
    static readPluginData() {
        this.pluginData = JSON5.parse(
            readFileSync(
                "../../src/main/resources/teseract.plugin.json",
            ).toString(),
        );

        const { entryPoints, name, id, description, version, external, authors } = this.pluginData;

        if (entryPoints.length == 0) {
            throw new Error("No entry points specified!");
        };

        const indexImports = [
            `import { Teseract } from "@teseractmcs/server-api";`
        ];
        const indexInitializers = [];

        for (const entry of entryPoints) {
            const defaultImp = entry.match(/[^/]+$/g);
            indexImports.push(`import ${defaultImp} from "${entry}";`);
            indexInitializers.push(`Teseract.registerPlugin(new ${defaultImp}(), "${id}");`);
        };

        this.index = indexImports.join("\n") + "\n\n" + indexInitializers.join("\n");
    }


    static start() {
        this.readPluginData();
        this.writeIndex()
        this.build();
    }
}

Tesselator.start();
