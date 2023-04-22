#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { SourceMapConsumer } = require('source-map');

const { program } = require('commander');

// Read the package.json file
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

async function getSourceCode(minifiedCodePath, sourceMapPath, outputPath) {
  // Read minified code and source map files
  const minifiedCode = fs.readFileSync(minifiedCodePath, 'utf8');
  const sourceMapRaw = fs.readFileSync(sourceMapPath, 'utf8');
  const sourceMap = JSON.parse(sourceMapRaw);

  // Create a SourceMapConsumer instance
  const smc = await new SourceMapConsumer(sourceMap);

  // Initialize an empty object to store the original source files content
  const sourcesContent = {};

  // Iterate through each source file in the source map
  for (const sourcePath of smc.sources) {
    // Get the source content
    const sourceContent = smc.sourceContentFor(sourcePath);

    // Save the source content to the sourcesContent object
    sourcesContent[sourcePath] = sourceContent;
    }

  // Save the reconstructed original source files to the outputPath
  for (const sourcePath in sourcesContent) {
    const outputFilePath = path.join(outputPath, sourcePath);
    const sourceDir = path.dirname(outputFilePath);

    if (!fs.existsSync(sourceDir)) {
      fs.mkdirSync(sourceDir, { recursive: true });
    }

    fs.writeFileSync(outputFilePath, sourcesContent[sourcePath], 'utf8');
  }
}

async function main() {
  program
    .version(packageJson.version)
    .description(packageJson.description)
    .requiredOption('-m, --minified <path>', 'Path to the minified code')
    .option('-s, --sourcemap <path>', 'Path to the source map (default: <minified_code_path>.map)')
    .requiredOption('-o, --output <path>', 'Path to the output directory')
    .parse(process.argv);

  const { minified, sourcemap, output } = program.opts();

  const sourceMapPath = sourcemap || `${minified}.map`;

  try {
    await getSourceCode(minified, sourceMapPath, output);
    console.log('Source code reconstruction complete.');
  } catch (error) {
    console.error('Error during source code reconstruction:', error);
    process.exit(1);
  }
}

main();
