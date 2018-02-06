import { keyInSelect } from 'readline-sync';

import { renderer } from '../../lib';

import absolute from './absolute';

const options = [
  'absolute positioning'
];

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
