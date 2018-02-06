import { keyInSelect } from 'readline-sync';

import { Renderer } from '../../lib';

import absolute from './absolute';

const options = [
  'absolute examples'
];

const renderer = Renderer.instance;

do {
  renderer.clearScreen();

  const index = keyInSelect(options, 'Pick one?');

  if (index === 0) {
    absolute();

    break;
  } else {
    console.log('nothing picked, try again...');
  }

} while (true);
