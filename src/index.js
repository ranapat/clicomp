import Renderer from './renderer';
import Pane from './components/pane';
import Progress from './components/progress';
import Label from './components/label';
import Paragraph from './components/Paragraph';

import { WORD_WRAP_CUT as pwwCut } from './components/Paragraph';
import { WORD_WRAP_KEEP as pwwKeep } from './components/Paragraph';
import { WORD_WRAP_BREAK as pwwBreak } from './components/Paragraph';

import * as escapes from './escapes';
import * as icons from './icons';

export { escapes, icons };
export { Renderer };
export { Pane, Progress, Label, Paragraph };
export { pwwCut, pwwKeep, pwwBreak };

const renderer = Renderer.instance;
export { renderer };
