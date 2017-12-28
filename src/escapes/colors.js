const Reset = '\x1b[0m';
const Bright = '\x1b[1m';
const Dim = '\x1b[2m';
const Underscore = '\x1b[4m';
const Blink = '\x1b[5m';
const Reverse = '\x1b[7m';
const Hidden = '\x1b[8m';
const Foreground = {
  Black: '\x1b[30m',
  Red: '\x1b[31m',
  Green: '\x1b[32m',
  Yellow: '\x1b[33m',
  Blue: '\x1b[34m',
  Magenta: '\x1b[35m',
  Cyan: '\x1b[36m',
  White: '\x1b[37m',
  Crimson: '\x1b[38m'
};
const Background = {
  Black: '\x1b[40m',
  Red: '\x1b[41m',
  Green: '\x1b[42m',
  Yellow: '\x1b[43m',
  Blue: '\x1b[44m',
  Magenta: '\x1b[45m',
  Cyan: '\x1b[46m',
  White: '\x1b[47m',
  Crimson: '\x1b[48m'
};

export { Reset };
export { Bright, Dim, Underscore, Blink };
export { Reverse, Hidden };
export { Foreground, Background };
