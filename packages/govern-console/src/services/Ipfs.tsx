class Ipfs {
  private _ipfs: any = null;

  addToIpfs(file: any) {
    if (!this._ipfs) {
      console.log('shemovida');
      this._ipfs = 10;
    }
    console.log('finished');
  }
}

export default new Ipfs();
