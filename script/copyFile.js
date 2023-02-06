const fs = require('fs');
const path = require('path');

const cp = () => {
  const assetsPath = path.join(__dirname, '..', 'src', 'resources');
  const outputPath = path.join(__dirname, '..', 'out', 'resources');
  fs.mkdirSync(outputPath, { recursive: true });
  fs.readdirSync(assetsPath).forEach(assetsName => {
    const fullPath = path.join(assetsPath, assetsName);
    fs.copyFileSync(
      fullPath,
      path.join(outputPath, assetsName)
    );
  });
};

cp();