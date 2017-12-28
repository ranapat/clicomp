const ESC = '\u001B[';

const cursorTo = (x, y) => {
  if (typeof x !== 'number') {
    throw new TypeError('The `x` argument is required');
  }

  if (typeof y !== 'number') {
    return ESC + (x + 1) + 'G';
  }

  return ESC + (y + 1) + ';' + (x + 1) + 'H';
};
const cursorMove = (x, y) => {
  if (typeof x !== 'number') {
    throw new TypeError('The `x` argument is required');
  }

  let ret = '';

  if (x < 0) {
    ret += ESC + (-x) + 'D';
  } else if (x > 0) {
    ret += ESC + x + 'C';
  }

  if (y < 0) {
    ret += ESC + (-y) + 'A';
  } else if (y > 0) {
    ret += ESC + y + 'B';
  }

  return ret;
};

const cursorUp = count => ESC + (typeof count === 'number' ? count : 1) + 'A';
const cursorDown = count => ESC + (typeof count === 'number' ? count : 1) + 'B';
const cursorForward = count => ESC + (typeof count === 'number' ? count : 1) + 'C';
const cursorBackward = count => ESC + (typeof count === 'number' ? count : 1) + 'D';
const cursorLeft = ESC + 'G';

const cursorNextLine = ESC + 'E';
const cursorPrevLine = ESC + 'F';

const cursorHide = ESC + '?25l';
const cursorShow = ESC + '?25h';

const eraseLines = count => {
  let clear = '';

  for (let i = 0; i < count; i++) {
    clear += x.eraseLine + (i < count - 1 ? x.cursorUp() : '');
  }

  if (count) {
    clear += x.cursorLeft;
  }

  return clear;
};

const eraseEndLine = ESC + 'K';
const eraseStartLine = ESC + '1K';
const eraseLine = ESC + '2K';
const eraseDown = ESC + 'J';
const eraseUp = ESC + '1J';

const scrollUp = ESC + 'S';
const scrollDown = ESC + 'T';

const eraseScreen = ESC + '2J';
const clearScreen = '\u001Bc';

const beep = '\u0007';

export { ESC };
export { cursorTo, cursorMove };
export { cursorUp, cursorDown, cursorForward, cursorBackward, cursorLeft };
export { cursorNextLine, cursorPrevLine };
export { cursorHide, cursorShow };
export { eraseLines, eraseEndLine, eraseStartLine, eraseLine, eraseDown, eraseUp };
export { scrollUp, scrollDown };
export { eraseScreen, clearScreen };
export { beep };
