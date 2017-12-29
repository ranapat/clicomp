import Renderer from '../renderer';

class Component {
  constructor() {
    this._renderer = undefined;
    this._autoRender = true;
    this._shown = false;
  }

  get prepare() {
    return [];
  }

  show() {
    if (this._renderer === undefined) {
      this._renderer = Renderer.instance;
    }

    if (true !== this._shown) {
      this._show();

      this.render();
    }
    this._shown = true;
  }

  hide() {
    if (false !== this._shown) {
      this._hide();

      this.render();
    }
    this._shown = false;
  }

  _show() {
    //
  }

  _hide() {
    //
  }

  set autoRender(value) {
    if (!this._autoRender && value) {
      this.render();
    }
    this._autoRender = value;
  }

  get autoRender() {
    return this._autoRender;
  }

  set renderer(value) {
    if (!value && this._renderer) {
      this.hide();
    }
    this._renderer = value;

    if (this._shown) {
      this.render();
    }
  }

  get renderer() {
    return this._renderer;
  }

  render() {
    const prepared = this.prepare;

    if (this._renderer && prepared) {
      prepared.forEach(value => this._renderer.write(value));
    }
  }

  hop() {
    if (this._autoRender) {
      this.render();
    }
  }

  get maxX() {
    return process.stdout.columns;
  }

  get maxY() {
    return process.stdout.rows
  }
}

export default Component;
