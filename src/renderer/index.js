import * as escapes from '../escapes';

import Console from './console';
import StdOut from './stdout';
import StdErr from './stderr';

const CONSOLE = 'console';
const STDOUT = 'stdout';
const STDERR = 'stderr';

let instance = undefined;

class Renderer {
  static get instance() {
    instance = instance !== undefined ? instance : new Renderer();

    return instance;
  }

  constructor(method) {
    this.out = undefined;
    if (method === CONSOLE) {
      this.out = new Console();
    } else if (method === STDOUT) {
      this.out = new StdOut();
    } else if (method === STDERR) {
      this.out = new StdErr();
    } else {
      this.out = new StdOut();
    }

    return new Proxy(this, this);
  }

  get(target, property, receiver) {
    if (this[property]) {
      return this[property];
    } else {
      const scopes = Object.keys(escapes);

      for (const key of scopes) {
        const scoped = escapes[key];
        const keys = Object.keys(scoped);

        if (keys.indexOf(property) !== -1) {
          const escape = scoped[property];
          const typeOfEscape = typeof escape;

          if (typeOfEscape === 'function') {
            return (...args) => {
              this.out.write(escape(...args));
            };
          } else if (typeOfEscape === 'string') {
            return (...args) => {
              this.out.write(escape);
            };

          }
        }
      }

      throw new Error('undefined property ', property);
    }
  }

  maxX() {
    return this.out.maxX;
  }

  maxY() {
    return this.out.maxY;
  }

  write(message) {
    this.out.write(message);
  }
}

export default Renderer;
export { CONSOLE, STDOUT, STDERR };
