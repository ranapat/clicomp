import * as escapes from '../../escapes';
import Component from '../component';

const WORD_WRAP_CUT = 1;
const WORD_WRAP_BREAK = 2;
const WORD_WRAP_KEEP = 3;

const OPTIONS = {
  maxWidth: undefined,
  maxHeight: undefined,

  offset: undefined,
  wordWrap: undefined,

  backgroundColor: undefined,
  foregroundColor: undefined
};

class Paragraph extends Component {
  constructor(x, y, label, options, ...args) {
    super(...args);

    this._x = undefined;
    this._y = undefined;
    this._label = undefined;
    this._options = options || OPTIONS;

    this._validateX = x;
    this._validateY = y;
    this._validateLabel = label;

    this._queue = [];
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
    const paragraphWidth = this._options.maxWidth || OPTIONS.maxWidth;

    if (value < 0) {
      this._x = 0;
    } else if (value + paragraphWidth > maxWidth) {
      this._validateX = maxWidth - paragraphWidth;
    } else if (value) {
      this._x = value;
    } else {
      this._x = 0;
    }
  }

  set _validateY(value) {
    value = Math.ceil(value);
    const maxHeight = this.maxY - 2;
    const paragraphHeight = this._options.maxHeight || OPTIONS.maxHeight;

    if (value < 0) {
      this._y = 0;
    } else if (value + paragraphHeight > maxHeight) {
      this._validateY = maxHeight - paragraphHeight;
    } else if (value) {
      this._y = value;
    } else {
      this._y = 0;
    }
  }

  set _validateLabel(value) {
    this._label = `${value ? typeof value === 'string' ? value.trim() : value : ''}`;
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

  _show() {
    this._generateComplete();
  }

  _hide() {
    this._generateComplete(true);
  }

  _normalizedLabel() {
    const offset = this._options.offset || OPTIONS.offset || 0;
    const wordWrap = this._options.wordWrap || OPTIONS.wordWrap || WORD_WRAP_CUT;

    const maxWidth = this._options.maxWidth || OPTIONS.maxWidth;
    const maxHeight = this._options.maxHeight || OPTIONS.maxHeight;

    const width = maxWidth ? maxWidth : this.maxX - this._x;
    const height = maxHeight ? maxHeight : this.maxY - this._y;

    let result = [];
    const split = this._label.split(/\n|<br\/>|<br>/gi);
    split.forEach(item => {
      if (wordWrap === WORD_WRAP_BREAK) {
        result.push(item.substring(0, width));
        const rest = item.substring(width);
        if (rest) {
          result.push(rest);
        }
      } else if (wordWrap === WORD_WRAP_KEEP) {
        const parts = item.split(' ');
        let tmp = '';
        for (let i = 0; i < parts.length; ++i) {
          const sitem = parts[i];
          if (tmp.length + sitem.length < width) {
            tmp += (tmp.length > 0 ? ' ' : '') + sitem;
          } else {
            if (tmp.length > 0) {
              result.push(tmp);
              tmp = '';
            }
            tmp += (tmp.length > 0 ? ' ' : '') + sitem.substring(0, width - tmp.length);
          }
        }
        if (tmp.length > 0) {
          result.push(tmp);
        }
      } else {
        if (item.length > width && width > 3) {
          result.push(item.substring(0, width - 3) + '...');
        } else {
          result.push(item.substring(0, width));
        }
      }
    });

    const diff = result.length - height;
    if (diff > 0) {
      const normalizedOffset = offset < 0 ? 0 : offset > 1 ? 1 : offset;
      let shift = Math.ceil(normalizedOffset * diff);
      result = result.slice(shift, shift + height);
    }

    return result;
  }

  _generateComplete(hide = false) {
    const backgroundColor = hide ? undefined : this._options.backgroundColor || OPTIONS.backgroundColor;
    const foregroundColor = hide ? undefined : this._options.foregroundColor || OPTIONS.foregroundColor;
    const maxWidth = this._options.maxWidth || OPTIONS.maxWidth;
    const maxHeight = this._options.maxHeight || OPTIONS.maxHeight;

    if (hide) {
      this._queue.push(escapes.colors.Reset);
      for (let i = 0; i < maxHeight; ++i) {
        this._queue.push(escapes.cursor.cursorTo(this._x, this._y + i));
        this._queue.push(' '.repeat(maxWidth));
      }
    } else {
      let label = this._normalizedLabel();

      this._queue.push(escapes.colors.Reset);
      if (backgroundColor) {
        this._queue.push(backgroundColor);
      }
      if (foregroundColor) {
        this._queue.push(foregroundColor);
      }
      for (let i = 0; i < label.length; ++i) {
        this._queue.push(escapes.cursor.cursorTo(this._x, this._y + i));

        this._queue.push(label[i]);
      }
      this._queue.push(escapes.colors.Reset);
    }
  }

}

export default Paragraph;
