import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import JSON5 from 'json5';
import { esbuildDecorators } from 'esbuild-decorators';

const plugindata = JSON5.parse(readFileSync("../../src/main/resources/teseract.plugin.json"));
const package_name = plugindata.id;
const version = plugindata.version;
const dependencies =["@minecraft/server",...plugindata.dependencies || []];

const initialMS = Date.now();
console.log(`Started building ${package_name}@${version}!`);


const indexcode = `
import Teseract from "./@teseract/server-api/src/Teseract";
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
writeFileSync("data/index.js", indexcode)

// const entryPoints = Object.values(plugindata.entrypoints).flatMap(ep => Object.values(ep).map(path => resolve("data/" + path)));
const entryPoints = ["data/index.js"]

// Crear un archivo temporal para importar los módulos externos
// const tempEntryPoint = resolve("BP/scripts/temp_entry.js");
// const tempImportCode = dependencies.map(dep => `import "${dep}";`).join('\n');
// writeFileSync(tempEntryPoint, tempImportCode, { recursive: true });

// Combinar el archivo temporal con los entrypoints especificados
const finalEntryPoints = [...entryPoints];

// Ejecutar esbuild para crear el bundle
build({
    entryPoints: finalEntryPoints,
    bundle: true,
    outfile: 'BP/scripts/index.js',
    platform: 'node', // Esto asegura que se traten los módulos externos correctamente
    target: 'es2020',
    external: dependencies, // Incluye las dependencias en el bundle
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
      treeShaking: true
}).then(() => {
    // Elimina el archivo temporal
    console.log(`Building finished in ${Date.now() - initialMS} milliseconds!`);
}).catch(() => process.exit(1));
