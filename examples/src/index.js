import { escapes, icons } from '../../lib';
import { Renderer } from '../../lib';
import { Pane, Progress, Label, Paragraph } from '../../lib';
import { pwwCut, pwwBreak, pwwKeep } from '../../lib';

const renderer = Renderer.instance;

process.stdout.on('resize', function() {
  console.log('screen size has changed!');
  console.log(process.stdout.columns + 'x' + process.stdout.rows);
});

renderer.clearScreen();

//renderer.beep();
//renderer.cursorHide();
//console.log(render.methods);

const pane = new Pane(25, 6, 60, 11, '', 0, {
  _horizontalLine: '═',
  _topLeftEdge: '╔',
  _topRightEdge: '╗',
  _bottomLeftEdge: '╚',
  _bottomRightEdge: '╝',
  _verticalLine: '║',
  _scroll: '#'
});
//pane.renderer = renderer;
pane.show();

const progress = new Progress(25, 2, 60, 0.5, '', {});
//progress.renderer = renderer;
progress.show();

const label = new Label(25, 4, '^123$'.repeat(100), icons.bar1, {
  maxWidth: 60,
  _interval: 1000,
  _labelBackgroundColor: escapes.colors.Background.Red,
  _labelForegroundColor: escapes.colors.Foreground.Green,
  _iconBackgroundColor: escapes.colors.Background.Green,
  _iconForegroundColor: escapes.colors.Foreground.Red
});
//label.renderer = renderer;
label.show();
//label.hide();

//label.label = undefined;
//label.icon = icons.sun;

/*
label.options = {
  maxWidth: 6
};
*/

const paragraph = new Paragraph(25, 20, '1)example1\n2)example2<br/>3)example3<br>4)example4' + `
5)this
6)a1234567890 b0987654321 c1234567890 d0987654321 e1234567890 f0987654321 g1234567890
7)asd Baskldfjas;dklfjaskl;dfjas;dlkfja;dfa;sdlkfjasd;lfkjasdl;kfjasdl;kfjas;dlkfjas;lkdfjasl;kdfjalskdjfE
8)is the
9)1
10)2
11)3
12)multiline
13)example
14)which is very very
15)long
`, {
  maxWidth: 60,
  maxHeight: 10,
  _offset: .5,
  _wordWrap: 3,
  _backgroundColor: escapes.colors.Background.Red,
  _foregroundColor: escapes.colors.Foreground.Green
});
paragraph.show();
//paragraph.hide();

const paragraph2 = new Paragraph(25, 31, undefined, {
  maxWidth: 60,
  maxHeight: 10,
  _maxLength: 100,
  offset: 1,
  wordWrap: pwwBreak,
  _backgroundColor: escapes.colors.Background.Red,
  _foregroundColor: escapes.colors.Foreground.Green
});
paragraph2.show();
//paragraph2.hide();

renderer.cursorTo(0, 0);

//label.label = 'new';

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
  //label.label = Math.random();
  //progress.percentages += .001;
  //progress.label = ((100 * progress.percentages).toFixed(1)) + ' %';
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

let counter = 0;
setInterval(() => {
  paragraph2.text += `${counter++}.`;
}, 1000);
