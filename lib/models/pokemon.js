const pokemonAPI = require('pokemon');
const request = require('request-promise');

const Exceptions = require('../exceptions');

const imageDB = 'https://img.pokemondb.net/sprites';

class Pokemon {
  static all(lang = 'ja') {
    // return pokemonAPI.all('en').slice(0, 12)
    return pokemonAPI.all('en')
      .map(name => new Pokemon(pokemonAPI.getId(name, 'en'), lang));
  }

  constructor(id, lang) {
    this.id = id;
    this.lang = lang;
    this.series = 'x-y';
    this.type = 'normal';
    this.ext = 'png';
  }

  getName() {
    return pokemonAPI.getName(this.id, this.lang);
  }
  getImageName() {
    const name = this.getName()
      .replace('Ｚ', 'z')
      .replace('：', '_')
      .replace('♀', 'f')
      .replace('♂', 'm');
    return `pokemon-${this.id}-${name}`;
  }
  getImageNameForURL() {
    const name = pokemonAPI.getName(this.id, 'en').toLowerCase();
    switch (name) {
      case 'nidoran♀': return 'nidoran-f';
      case 'nidoran♂': return 'nidoran-m';
      case 'farfetch’d': return 'farfetchd';
      case 'mr. mime': return 'mr-mime';
      case 'mime jr.': return 'mime-jr';
      case 'type: null': return 'type-null';
      case 'tapu koko': return 'tapu-koko';
      case 'tapu lele': return 'tapu-lele';
      case 'tapu bulu': return 'tapu-bulu';
      case 'tapu fini': return 'tapu-fini';
      default: return name;
    }
  }
  getImagePath(dir) { return `${dir}/${this.getImageName()}.${this.ext}`; }
  getImageURL() { return `${imageDB}/${this.series}/${this.type}/${this.getImageNameForURL()}.${this.ext}`; }

  async getImage() {
    const res = await request.get({ uri: this.getImageURL(), encoding: null, resolveWithFullResponse: true });
    if (res.statusCode !== 200) throw new Exceptions.ImageDownloadException();
    return res.body;
  }

  to_yml() { return { name: this.getImageName(), src: this.getImageURL() }; }
}

module.exports = Pokemon;
