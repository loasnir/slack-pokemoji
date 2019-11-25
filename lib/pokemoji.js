const Pokemon = require('./models/pokemon');

const fs = require('fs').promises;
const fse = require('fs-extra');
const yaml = require('js-yaml');

const out = 'out';
const out_images = `${out}/images`
const yaml_data = { title: 'pokemon', emojis: [] };

module.exports = {
  main: async (lang = 'ja', series = 'x-y', type = 'normal', image_ext = 'png') => {
    const monsters = Pokemon.all(lang).map(p => {
      p.series = series;
      p.type = type;
      p.ext = image_ext;
      return p;
    });

    await fse.remove(out_images);
    await fse.mkdirp(out_images);

    for (const p of monsters) {
      try {
        await fs.writeFile(p.getImagePath(out_images), await p.getImage(), 'binary');
        yaml_data.emojis.push(p.to_yml());
        // console.log(p.id, p.getName());
      } catch (e) {
        console.error(p.id, p.getName(), p.getImageURL());
      }
    }

    await fs.writeFile(`${out}/pokemon.yml`, yaml.dump(yaml_data));
  }
}
