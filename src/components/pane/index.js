import * as escapes from '../../escapes';
import Component from '../component';

const OPTIONS = {
  minWidth: 2,
  minHeight: 1,

  horizontalLine: '═',
  verticalLine: '║',
  topLeftEdge: '╔',
  topRightEdge: '╗',
  bottomLeftEdge: '╚',
  bottomRightEdge: '╝',
  scroll: '#',

  borderBackgroundColor: undefined,
  borderForegroundColor: undefined,
  labelBackgroundColor: undefined,
  labelForegroundColor: undefined,
  scrollBackgroundColor: undefined,
  scrollForegroundColor: undefined,
  contentBackgroundColor: undefined
};

class Pane extends Component {
  constructor(x, y, width, height, label, scroll, options, ...args) {
    super(...args);

    this._x = undefined;
    this._y = undefined;
    this._width = undefined;
    this._height = undefined;
    this._label = undefined;
    this._scroll = undefined;
    this._options = options || OPTIONS;

    this._validateX = x;
    this._validateY = y;
    this._validateWidth = width;
    this._validateHeight = height;
    this._validateLabel = label;
    this._validateScroll = scroll;

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

  set width(value) {
    this._setGenerateCompleteProperty('width', value);
  }

  get width() {
    return this._width;
  }

  set height(value) {
    this._setGenerateCompleteProperty('height', value);
  }

  get height() {
    return this._height;
  }

  set label(value) {
    this._validateLabel = value;

    this._generateTop();
    this.hop();
  }

  get label() {
    return this._label;
  }

  set scroll(value) {
    this._validateScroll = value;

    this._generateRight();
    this.hop();
  }

  get scroll() {
    return this._scroll;
  }

  set options(value) {
    this._options = value;

    this._generateComplete();

    this.hop();
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
    const minWidth = this._options.minWidth || OPTIONS.minWidth;
    const maxWidth = this.maxX - 2;

    if (value < 0) {
      this._x = 0;
    } else if (this._width && value + this._width > maxWidth) {
      this._validateX = maxWidth - this._width;
    } else if (!this._width && value > maxWidth - minWidth) {
      this._validateX = maxWidth - minWidth;
    } else if (value) {
      this._x = value;
    } else {
      this._x = 0;
    }
  }

  set _validateY(value) {
    value = Math.ceil(value);
    const minHeight = this._options.minHeight || OPTIONS.minHeight;
    const maxHeight = this.maxY - 2;

    if (value < 0) {
      this._y = 0;
    } else if (this._height && value + this._height > maxHeight) {
      this._validateY = maxHeight - this._height;
    } else if (!this._height && value > maxHeight - minHeight) {
      this._validateY = maxHeight - minHeight;
    } else if (value) {
      this._y = value;
    } else {
      this._y = 0;
    }
  }

  set _validateWidth(value) {
    value = Math.ceil(value);
    const minWidth = this._options.minWidth || OPTIONS.minWidth;
    const maxWidth = this.maxX - 2;

    if (value < 0) {
      this._validateWidth = minWidth;
    } else if (this._x && value + this._x > maxWidth) {
      if (value === minWidth) {
        this._validateX = maxWidth - value;
        this._width = value;
      } else {
        this._validateWidth = maxWidth - this._x;
      }
    } else if (!this._x && value > maxWidth - minWidth) {
      this._validateWidth = maxWidth - minWidth;
    } else if (value) {
      this._width = value;
    } else {
      this._width = minWidth;
    }
  }

  set _validateHeight(value) {
    value = Math.ceil(value);
    const minHeight = this._options.minHeight || OPTIONS.minHeight;
    const maxHeight = this.maxY - 2;

    if (value < 0) {
      this._validateHeight = minHeight;
    } else if (this._y && value + this._y > maxHeight) {
      if (value === minHeight) {
        this._validateY = maxHeight - value;
        this._height = value;
      } else {
        this._validateHeight = maxHeight - this._y;
      }
    } else if (!this._y && value > maxHeight - minHeight) {
      this._validateHeight = maxHeight - minHeight;
    } else if (value) {
      this._height = value;
    } else {
      this._height = minHeight;
    }
  }

  set _validateLabel(value) {
    this._label = ` ${value.trim()} `;
  }

  set _validateScroll(value) {
    this._scroll = value > 1 ? 1 : value < 0 ? 0 : value;
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

  _normalizedTitle(hide) {
    const maxTitleWidth = this._width > 4 ? this._width - 4 : 0;

    let title = maxTitleWidth > 0 ? hide ? ' ' : this._label || '' : '';

    if (title.length > maxTitleWidth) {
      let delta = Math.floor(maxTitleWidth / 2);
      delta = delta > 1 ? delta - 1 : delta;
      const spare = maxTitleWidth - 2 * delta;
      const titlePartOne = title.substring(0, delta);
      const titlePartTwo = title.substring(title.length - delta);

      title = titlePartOne + '.'.repeat(spare) + titlePartTwo;
    }

    return title;
  }

  _generateComplete(hide = false) {
    this._generateTop(hide);
    this._generateRight(hide);
    this._generateBottom(hide);
    this._generateLeft(hide);
    this._generateContent();
  }

  _generateTop(hide = false) {
    this._queue.push(escapes.cursor.cursorTo(this._x, this._y));

    const horizontalLine = hide ? ' ' : this._options.horizontalLine || OPTIONS.horizontalLine;
    const topLeftEdge = hide ? ' ' : this._options.topLeftEdge || OPTIONS.topLeftEdge;
    const topRightEdge = hide ? ' ' : this._options.topRightEdge || OPTIONS.topRightEdge;
    const borderBackgroundColor = hide ? undefined : this._options.borderBackgroundColor || OPTIONS.borderBackgroundColor;
    const borderForegroundColor = hide ? undefined : this._options.borderForegroundColor || OPTIONS.borderForegroundColor;
    const labelBackgroundColor = hide ? undefined : this._options.labelBackgroundColor || OPTIONS.labelBackgroundColor;
    const labelForegroundColor = hide ? undefined : this._options.labelForegroundColor || OPTIONS.labelForegroundColor;

    let title = this._normalizedTitle(hide);
    const titleRealLength = title.trim().length;
    const diff = this._width - title.length;
    const startIndex = Math.floor(diff / 2);
    const endIndex = this._width - Math.floor(diff / 2);

    let inLabel = undefined;

    for (let i = 0; i < this._width; ++i) {
      if (titleRealLength && title && i >= startIndex && i <= endIndex) {
        if (inLabel !== true) {
          inLabel = true;

          this._queue.push(escapes.colors.Reset);
          if (labelBackgroundColor) {
            this._queue.push(labelBackgroundColor);
          }
          if (labelForegroundColor) {
            this._queue.push(labelForegroundColor);
          }
        }
        this._queue.push(title[0]);
        title = title.substring(1);
      } else {
        if (inLabel !== false) {
          inLabel = false;

          this._queue.push(escapes.colors.Reset);
          if (borderBackgroundColor) {
            this._queue.push(borderBackgroundColor);
          }
          if (borderForegroundColor) {
            this._queue.push(borderForegroundColor);
          }
        }
        this._queue.push(i === 0 ? topLeftEdge : i === this._width - 1 ? topRightEdge : horizontalLine);
      }
    }

    this._queue.push(escapes.colors.Reset);
  }

  _generateRight(hide = false) {
    const verticalLine = hide ? ' ' : this._options.verticalLine || OPTIONS.verticalLine;
    const scroll = hide ? ' ' : this._options.scroll || OPTIONS.scroll;
    const scrollBackgroundColor = hide ? undefined : this._options.scrollBackgroundColor || OPTIONS.scrollBackgroundColor;
    const scrollForegroundColor = hide ? undefined : this._options.scrollForegroundColor || OPTIONS.scrollForegroundColor;
    const borderBackgroundColor = hide ? undefined : this._options.borderBackgroundColor || OPTIONS.borderBackgroundColor;
    const borderForegroundColor = hide ? undefined : this._options.borderForegroundColor || OPTIONS.borderForegroundColor;

    this._queue.push(escapes.cursor.cursorTo(this._x + this._width, this._y));

    let scrollAt = this._scroll || undefined;
    let inScroll = undefined;

    for (let i = 0; i < this._height; ++i) {
      const current = (i + 1) / this._height;

      this._queue.push(escapes.cursor.cursorMove(-1, 1));

      if (
        scrollAt !== undefined
          && (scrollAt < current || i === this._height - 1)
      ) {
        if (inScroll !== true) {
          inScroll = true;

          this._queue.push(escapes.colors.Reset);
          if (scrollBackgroundColor) {
            this._queue.push(scrollBackgroundColor);
          }
          if (scrollForegroundColor) {
            this._queue.push(scrollForegroundColor);
          }
        }

        this._queue.push(scroll);
        scrollAt = undefined;
      } else {
        if (inScroll !== false) {
          inScroll = false;

          this._queue.push(escapes.colors.Reset);
          if (borderBackgroundColor) {
            this._queue.push(borderBackgroundColor);
          }
          if (borderForegroundColor) {
            this._queue.push(borderForegroundColor);
          }
        }

        this._queue.push(verticalLine);
      }
    }

    this._queue.push(escapes.colors.Reset);
  }

  _generateBottom(hide = false) {
    const horizontalLine = hide ? ' ' : this._options.horizontalLine || OPTIONS.horizontalLine;
    const bottomLeftEdge = hide ? ' ' : this._options.bottomLeftEdge || OPTIONS.bottomLeftEdge;
    const bottomRightEdge = hide ? ' ' : this._options.bottomRightEdge || OPTIONS.bottomRightEdge;
    const borderBackgroundColor = hide ? undefined : this._options.borderBackgroundColor || OPTIONS.borderBackgroundColor;
    const borderForegroundColor = hide ? undefined : this._options.borderForegroundColor || OPTIONS.borderForegroundColor;

    this._queue.push(escapes.cursor.cursorTo(this._x + this._width, this._y + this._height + 1));

    this._queue.push(escapes.colors.Reset);
    if (borderBackgroundColor) {
      this._queue.push(borderBackgroundColor);
    }
    if (borderForegroundColor) {
      this._queue.push(borderForegroundColor);
    }

    for (let i = 0; i < this._width; ++i) {
      this._queue.push(escapes.cursor.cursorMove(i === 0? -1 : -2, 0));
      this._queue.push(i === 0 ? bottomRightEdge : i === this._width - 1 ? bottomLeftEdge : horizontalLine);
    }

    this._queue.push(escapes.colors.Reset);
  }

  _generateLeft(hide = false) {
    const verticalLine = hide ? ' ' : this._options.verticalLine || OPTIONS.verticalLine;
    const borderBackgroundColor = hide ? undefined : this._options.borderBackgroundColor || OPTIONS.borderBackgroundColor;
    const borderForegroundColor = hide ? undefined : this._options.borderForegroundColor || OPTIONS.borderForegroundColor;

    this._queue.push(escapes.cursor.cursorTo(this._x + 1, this._y + this._height));

    this._queue.push(escapes.colors.Reset);
    if (borderBackgroundColor) {
      this._queue.push(borderBackgroundColor);
    }
    if (borderForegroundColor) {
      this._queue.push(borderForegroundColor);
    }

    for (let i = 0; i < this._height; ++i) {
      this._queue.push(escapes.cursor.cursorMove(-1, i === 0 ? 0 : -1));

      this._queue.push(verticalLine);
    }

    this._queue.push(escapes.colors.Reset);
  }

  _generateContent(hide = false) {
    const contentBackgroundColor = hide ? undefined : this._options.contentBackgroundColor || OPTIONS.contentBackgroundColor;

    if (contentBackgroundColor) {
      this._queue.push(contentBackgroundColor);
    }

    for (let j = 0; j < this._height; ++j) {
      this._queue.push(escapes.cursor.cursorTo(this._x + 1, this._y + 1 + j));
      for (let i = 0; i < this._width - 2; ++i) {
        this._queue.push(' ');
      }
    }

    this._queue.push(escapes.colors.Reset);
  }

}

export default Pane;
