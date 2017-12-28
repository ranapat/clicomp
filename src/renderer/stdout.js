import Default from './default';

class StdOut extends Default {
  write(message) {
    //process.stdout.write(message);


    process.stdout.write(/*colors.Reverse + colors.Bright + colors.bg.Black + colors.fg.Red + */message/* + colors.Reset*/);
  }
}

export default StdOut;
