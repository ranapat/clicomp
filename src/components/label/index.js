import * as escapes from '../../escapes';
import Component from '../component';

const OPTIONS = {
  maxWidth: undefined,
  interval: 80,

  labelBackgroundColor: undefined,
  labelForegroundColor: undefined,
  iconBackgroundColor: undefined,
  iconForegroundColor: undefined
};

class Label extends Component {
  constructor(x, y, label, icon, options, ...args) {
    super(...args);

    this._x = undefined;
    this._y = undefined;
    this._label = undefined;
    this._icon = undefined;
    this._options = options || OPTIONS;

    this._validateX = x;
    this._validateY = y;
    this._validateLabel = label;
    this._validateIcon = icon;

    this._queue = [];

    this.__normalizedIcon = undefined;

    this._latestLength = undefined;

    this._interval = undefined;
    this._intervalIndex = undefined;
  }

  set x(value) {
    this._setGenerateCompleteProperty('x', value);
  }

  get x() {
    return this._x;
  }

  set y(value) {
    this._setGenerateCompleteProperty('y', value);
  }

  get y() {
    return this._y;
  }

  set label(value) {
    this._setGenerateCompleteProperty('label', value);
  }

  get label() {
    return this._label;
  }

  set icon(value) {
    this._setGenerateCompleteProperty('icon', value);
  }

  get icon() {
    return this._icon;
  }

  set options(value) {
    this._setGenerateCompleteProperty('options', value);
  }

  get options() {
    return this._options;
  }

  get prepare() {
    const prepared = [...this._queue];
    this._queue = [];
    return prepared;
  }

  set _validateX(value) {
    value = Math.ceil(value);
    const maxWidth = this.maxX - 2;

    if (value < 0) {
      this._x = 0;
    } else if (value > maxWidth) {
      this._validateX = maxWidth - value;
    } else if (value) {
      this._x = value;
    } else {
      this._x = 0;
    }
  }

  set _validateY(value) {
    value = Math.ceil(value);
    const maxHeight = this.maxY - 2;

    if (value < 0) {
      this._y = 0;
    } else if (value > maxHeight) {
      this._validateY = maxHeight - value;
    } else if (value) {
      this._y = value;
    } else {
      this._y = 0;
    }
  }

  set _validateLabel(value) {
    this._label = `${value ? typeof value === 'string' ? value.trim() : value : ''}`;
  }

  set _validateIcon(value) {
    this._icon = Array.isArray(value) ? value : typeof value === 'string' ? value : undefined;
    this.__normalizedIcon = undefined;
  }

  set _validateOptions(value) {
    this._options = value;
  }

  _setGenerateCompleteProperty(property, value) {
    this._generateComplete(true);

    const capitalized = property.replace(/^./, property[0].toUpperCase());
    this[`_validate${capitalized}`] = value;

    this._generateComplete();
    this.hop();
  }

  _normalizedLabel(shift) {
    const optionsMaxWidth = this._options.maxWidth || OPTIONS.maxWidth;
    let maxWidth;
    if (!optionsMaxWidth) {
      maxWidth = this.maxX - this._x;
    } else {
      maxWidth = optionsMaxWidth;
    }
    maxWidth = maxWidth - shift > 0 ? maxWidth - shift : 0;

    let title = maxWidth > 0 ? this._label || '' : '';

    if (title.length > maxWidth) {
      let delta = Math.floor(maxWidth / 2);
      delta = delta > 1 ? delta - 1 : delta;
      const spare = maxWidth - 2 * delta;
      const titlePartOne = title.substring(0, delta);
      const titlePartTwo = title.substring(title.length - delta);

      title = titlePartOne + '.'.repeat(spare) + titlePartTwo;
    }

    return ' '.repeat(shift) + title;
  }

  _normalizedIcon() {
    if (this.__normalizedIcon !== undefined) {
      return this.__normalizedIcon;
    }

    const icon = this._icon ? Array.isArray(this._icon) ? [...this._icon] : [this._icon] : [];
    let result = [];
    let max = 0;

    icon.forEach(item => max = max < item.length ? item.length : max);
    icon.forEach(item => {
      const diff = max - item.length;
      const delta = Math.floor(diff / 2);
      result.push(' '.repeat(delta) + item + ' '.repeat(max - delta - item.length));
    });

    this.__normalizedIcon = result;

    return result;
  }

  _show() {
    this._generateComplete();
  }

  _hide() {
    this._generateComplete(true);
  }

  _generateComplete(hide = false) {
    this._queue.push(escapes.cursor.cursorTo(this._x, this._y));

    const labelBackgroundColor = hide ? undefined : this._options.labelBackgroundColor || OPTIONS.labelBackgroundColor;
    const labelForegroundColor = hide ? undefined : this._options.labelForegroundColor || OPTIONS.labelForegroundColor;

    if (hide) {
      this._queue.push(escapes.colors.Reset);
      this._queue.push(' '.repeat(this._latestLength || 0));

      this._latestLength = undefined;

      this._stopIconLoop();
    } else {
      const icon = this._normalizedIcon();
      const iconLength = icon.length > 0 ? icon[0].length : 0;

      let title = this._normalizedLabel(iconLength > 0 ? iconLength + 1 : 0);

      this._queue.push(escapes.colors.Reset);
      if (labelBackgroundColor) {
        this._queue.push(labelBackgroundColor);
      }
      if (labelForegroundColor) {
        this._queue.push(labelForegroundColor);
      }
      this._queue.push(title);
      this._queue.push(escapes.colors.Reset);

      this._latestLength = title.length;

      this._startIconLoop();
    }
  }

  _startIconLoop() {
    this._stopIconLoop();

    const icon = this._normalizedIcon();

    if (icon.length > 1) {
      this._intervalIndex = 0;
      this._interval = setInterval(() => this._handleIconLoop(), this._options.interval || OPTIONS.interval);
      this._handleIconLoop();
    } else if (icon.length > 0) {
      this._intervalIndex = 0;
      this._handleIconLoop();
    }
  }

  _stopIconLoop() {
    if (this._interval !== undefined) {
      clearInterval(this._interval);

      this._interval = undefined;
    }
    this._intervalIndex = undefined;
  }

  _handleIconLoop() {
    const icon = this._normalizedIcon();
    const item = icon[this._intervalIndex];

    const iconBackgroundColor = this._options.iconBackgroundColor || OPTIONS.iconBackgroundColor;
    const iconForegroundColor = this._options.iconForegroundColor || OPTIONS.iconForegroundColor;

    this._queue.push(escapes.cursor.cursorTo(this._x, this._y));

    this._queue.push(escapes.colors.Reset);
    if (iconBackgroundColor) {
      this._queue.push(iconBackgroundColor);
    }
    if (iconForegroundColor) {
      this._queue.push(iconForegroundColor);
    }
    this._queue.push(item);
    this._queue.push(escapes.colors.Reset);

    this._queue.push(escapes.cursor.cursorTo(this._x + this._latestLength, this._y));

    this.hop();

    this._intervalIndex = this._intervalIndex + 1 < icon.length ? this._intervalIndex + 1 : 0;
  }

}

export default Label;
