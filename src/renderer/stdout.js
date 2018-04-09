import Default from './default';

class StdOut extends Default {
  write(message) {
    process.stdout.write(message);
  }

  get maxX() {
    return process.stdout.columns;
  }

  get maxY() {
    return process.stdout.rows
  }
}

export default StdOut;
