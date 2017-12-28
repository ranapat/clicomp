import Default from './default';

class StdErr extends Default {
  write(message) {
    process.stderr.write(message);
  }
}

export default StdErr;
