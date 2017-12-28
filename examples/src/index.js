import { escapes } from '../../lib';
import { Renderer } from '../../lib';
import { Pane, Progress } from '../../lib';

const renderer = new Renderer();

process.stdout.on('resize', function() {
  console.log('screen size has changed!');
  console.log(process.stdout.columns + 'x' + process.stdout.rows);
});

renderer.clearScreen();

//renderer.beep();
//renderer.cursorHide();
//console.log(render.methods);

const pane = new Pane(25, 8, 60, 10, '', 0, {
  _horizontalLine: '═',
  _topLeftEdge: '╔',
  _topRightEdge: '╗',
  _bottomLeftEdge: '╚',
  _bottomRightEdge: '╝',
  _verticalLine: '║',
  _scroll: '#'
});
pane.renderer = renderer;
pane.show();

const progress = new Progress(25, 2, 60, 0, '', {});
progress.renderer = renderer;
progress.show();

renderer.cursorTo(0, 0);

/*
pane.options = {
  borderForegroundColor: escapes.colors.Foreground.Red
};
pane.options = {
  borderBackgroundColor: escapes.colors.Background.Blue
};
*/
/*
pane.options = {
  contentBackgroundColor: escapes.colors.Background.Red
};
*/
/*
progress.options = {
  processedLine: '>',
  unprocessedLine: ' '
};
*/

let indexX = 1;
let indexY = 1;
let indexS = 0.1;
let index = 0;
setInterval(() => {
  progress.percentages += .001;
  progress.label = ((100 * progress.percentages).toFixed(1)) + ' %';
  //progress.width += index;
  //pane.label += index++;
  //pane.x += indexX;
  //pane.y += indexY;
  //pane.scroll += indexS;
  //pane.width += .1;
  //pane.height += .1;

  if (pane.x > 60) {
    indexX = -1;
  } else if (pane.x === 0) {
    indexX = 1;
  }
  if (pane.y > 30) {
    indexY = -1;
  } else if (pane.y === 0) {
    indexY = 1;
  }
  if (pane.scroll === 1) {
    indexS = -0.1;
  } else if (pane.scroll === 0) {
    indexS = 0.1;
  }

  //pane.width = 50;
  //pane.height = 10;
  //pane.hide();
  //pane.show();
  //pane.renderer = undefined;
  //console.log('now where?');
}, 80);

const frames1 = [
  "⠋",
  "⠙",
  "⠹",
  "⠸",
  "⠼",
  "⠴",
  "⠦",
  "⠧",
  "⠇",
  "⠏"
];
const frames = [
  "🌑 ",
  "🌒 ",
  "🌓 ",
  "🌔 ",
  "🌕 ",
  "🌖 ",
  "🌗 ",
  "🌘 "
];
