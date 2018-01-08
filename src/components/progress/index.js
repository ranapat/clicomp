import * as escapes from '../../escapes';
import Component from '../component';

const OPTIONS = {
  minWidth: 2,

  leftBorder: '╟',
  processedLine: '#',
  unprocessedLine: '─',
  rightBorder: '╢',

  borderBackgroundColor: undefined,
  borderForegroundColor: undefined,
  processedLineBackgroundColor: undefined,
  processedLineForegroundColor: undefined,
  unprocessedLineBackgroundColor: undefined,
  unprocessedLineForegroundColor: undefined,
  labelBackgroundColor: undefined,
  labelForegroundColor: undefined
};

class Progress extends Component {
  constructor(x, y, width, percentages, label, options, ...args) {
    super(...args);

    this._x = undefined;
    this._y = undefined;
    this._width = undefined;
    this._percentages = undefined;
    this._label = undefined;
    this._options = options || OPTIONS;

    this._validateX = x;
    this._validateY = y;
    this._validateWidth = width;
    this._validatePercentages = percentages;
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

  set width(value) {
    this._setGenerateCompleteProperty('width', value);
  }

  get width() {
    return this._width;
  }

  set percentages(value) {
    this._setGenerateCompleteProperty('percentages', value);
  }

  get percentages() {
    return this._percentages;
  }

  set label(value) {
    this._setGenerateCompleteProperty('label', value);
  }

  get label() {
    return this._label;
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
    const maxHeight = this.maxY - 2;

    if (value < 0) {
      this._y = 0;
    } else if (value > maxHeight) {
      this._validateY = maxHeight;
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

  set _validatePercentages(value) {
    this._percentages = value > 1 ? 1 : value < 0 ? 0 : value;
  }

  set _validateLabel(value) {
    this._label = ` ${value.trim()} `;
  }

  _setGenerateCompleteProperty(property, value) {
    this._generateComplete(true);

    const capitalized = property.replace(/^./, property[0].toUpperCase());
    this[`_validate${capitalized}`] = value;

    this._generateComplete();
    this.hop();
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

  _show() {
    this._generateComplete();
  }

  _hide() {
    this._generateComplete(true);
  }

  _generateComplete(hide = false) {
    this._queue.push(escapes.cursor.cursorTo(this._x, this._y));

    const leftBorder = hide ? ' ' : this._options.leftBorder || OPTIONS.leftBorder;
    const rightBorder = hide ? ' ' : this._options.rightBorder || OPTIONS.rightBorder;
    const processedLine = hide ? ' ' : this._options.processedLine || OPTIONS.processedLine;
    const unprocessedLine = hide ? ' ' : this._options.unprocessedLine || OPTIONS.unprocessedLine;

    const borderBackgroundColor = hide ? undefined : this._options.borderBackgroundColor || OPTIONS.borderBackgroundColor;
    const borderForegroundColor = hide ? undefined : this._options.borderForegroundColor || OPTIONS.borderForegroundColor;
    const processedLineBackgroundColor = hide ? undefined : this._options.processedLineBackgroundColor || OPTIONS.processedLineBackgroundColor;
    const processedLineForegroundColor = hide ? undefined : this._options.processedLineForegroundColor || OPTIONS.processedLineForegroundColor;
    const unprocessedLineBackgroundColor = hide ? undefined : this._options.unprocessedLineBackgroundColor || OPTIONS.unprocessedLineBackgroundColor;
    const unprocessedLineForegroundColor = hide ? undefined : this._options.unprocessedLineForegroundColor || OPTIONS.unprocessedLineForegroundColor;
    const labelBackgroundColor = hide ? undefined : this._options.labelBackgroundColor || OPTIONS.labelBackgroundColor;
    const labelForegroundColor = hide ? undefined : this._options.labelForegroundColor || OPTIONS.labelForegroundColor;

    let title = this._normalizedTitle(hide);
    const titleRealLength = title.trim().length;
    const diff = this._width - title.length;
    const startIndex = Math.floor(diff / 2);
    const endIndex = this._width - Math.floor(diff / 2);

    let inLabel = undefined;
    let inProcessed = undefined;

    this._queue.push(escapes.colors.Reset);
    if (borderBackgroundColor) {
      this._queue.push(borderBackgroundColor);
    }
    if (borderForegroundColor) {
      this._queue.push(borderForegroundColor);
    }
    this._queue.push(leftBorder);
    this._queue.push(escapes.colors.Reset);

    for (let i = 1; i < this._width - 1; ++i) {
      if (titleRealLength && title && i >= startIndex && i <= endIndex) {
        if (inLabel !== true) {
          inLabel = true;
          inProcessed = undefined;

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
        const inProcessedValue = this._percentages > (i / (this._width - 1));
        if (inProcessed !== inProcessedValue) {
          inProcessed = inProcessedValue;

          if (inProcessed) {
            this._queue.push(escapes.colors.Reset);
            if (processedLineBackgroundColor) {
              this._queue.push(processedLineBackgroundColor);
            }
            if (processedLineForegroundColor) {
              this._queue.push(processedLineForegroundColor);
            }
          } else {
            this._queue.push(escapes.colors.Reset);
            if (unprocessedLineBackgroundColor) {
              this._queue.push(unprocessedLineBackgroundColor);
            }
            if (unprocessedLineForegroundColor) {
              this._queue.push(unprocessedLineForegroundColor);
            }
          }
        }
        if (inLabel !== false) {
          inLabel = false;
        }
        this._queue.push(inProcessedValue ? processedLine : unprocessedLine);
      }
    }

    this._queue.push(escapes.colors.Reset);
    if (borderBackgroundColor) {
      this._queue.push(borderBackgroundColor);
    }
    if (borderForegroundColor) {
      this._queue.push(borderForegroundColor);
    }
    this._queue.push(rightBorder);

    this._queue.push(escapes.colors.Reset);
  }

}

export default Progress;
