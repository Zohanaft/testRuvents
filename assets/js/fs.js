export class FileStreamer {
    constructor(file, _chunkSize) {
        this.file = file;
        this.offset = 0;
        
        this.defaultChunkSize = _chunkSize || 5 * 1024 * 1024;
        console.log(this.defaultChunkSize / (1024*1024))
        this.size = file.size;
        // Заранее определим количество операций для eventloop
        this.chunks = Math.ceil(this.size/this.defaultChunkSize)
        console.log(this.chunks)
        this.rewind(); // Сброс
    }
    
    rewind() {
      this.offset = 0;
    }

    loopChunkActions (handler) {
      const fileReader = new FileReader();

      const blob = this.file.slice(
        this.offset * this.defaultChunkSize,
        this.offset * this.defaultChunkSize + this.defaultChunkSize,
        this.file.type
      );
      fileReader.readAsText(blob)
      fileReader.onload = (event) => {
        // Ура... хоть какой-то результат
        try {
          handler(event.target.result, this.chunks, this.offset)
        }
        catch (error) {
          console.error(error.errorCode)
        }
      }
      if (this.offset !== this.chunks) {
        this.offset++
        setTimeout(this.loopChunkActions(handler));
      } else {
        return true;
      }

    }

    startLoop (handler) {
      this.loopChunkActions(handler);
    }

    getChunkSize() {
      return this.chunks
    }

    getOffset() {
      return this.offset
    }

}
