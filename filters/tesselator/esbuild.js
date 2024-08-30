import JSON5 from 'json5';
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { esbuildDecorators } from 'esbuild-decorators';

const plugindata = JSON5.parse(readFileSync("../../src/main/resources/teseract.plugin.json"));
const package_name = plugindata.id;
const version = plugindata.version;
const external = ["@minecraft/server", "@minecraft/server-ui", ...plugindata.external || []];

const initialMS = Date.now();
console.log(`Started bundling ${package_name}@${version}!`);

const indexcode = `
import { Teseract } from "@teseractmcs/server-api";
${(() => {
        let str = ``
        for (const entryPoint in plugindata.entrypoints) {
            const pointData = plugindata.entrypoints[entryPoint]
            for (const point in pointData) {
                str += `import ${point} from "${pointData[point].replace(/\.ts$|\.js$/, '')}";` + `\nTeseract.registerPlugin(new ${point}(), "${point}");\n`
            }
        }
        return str;
    })()}
`
mkdirSync("BP/scripts")
writeFileSync("data/index.ts", indexcode, { recursive: true })

const entryPoints = ["data/index.ts"]
const finalEntryPoints = [...entryPoints];

build({
    entryPoints: finalEntryPoints,
    bundle: true,
    // minify: true,
    outfile: 'BP/scripts/index.js',
    platform: 'node',
    target: 'es2020',
    external: external,
    allowOverwrite: true,
    format: "esm",
    logLevel: 'info',
    "tsconfig": "../../tsconfig.json",
    define: {
        'process.env.NODE_ENV': '"production"'
    },
    plugins: [
        esbuildDecorators({
            tsconfig: "../../tsconfig.json",
            cwd: process.cwd(),
        }),
    ],
    treeShaking: false
}).then(() => {
    const code = readFileSync("BP/scripts/index.js").toString();
    writeFileSync("BP/scripts/index.js", `var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

` + code)
    console.log(`Building finished in ${Date.now() - initialMS} milliseconds!`);
}).catch((error) => {
    console.error(error)
    process.exit(1)
});
