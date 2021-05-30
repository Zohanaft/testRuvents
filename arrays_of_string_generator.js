const fs = require("fs");
// const process = require("process");

try {
  fs.rmSync('./server.txt');
}
catch {
  
}
fs.writeFileSync('./server.txt', '');

class ArraysOfRandomStringGenerator {
  /**
   * 
   * @param {number} stringLength Длинна строки
   * @param {number} stringCount количество строк
   * @param {string} symbolDictionary словарь символов
   * @param {number} workChunk чанк (шаг с которым будет выполняться работа по генерации)
   * @param {number} currentIndex начало индексации (1000 to stringCount создаст stringCount - 1000 элементов)
   */
  constructor (
    stringLength = 100,
    stringCount = 10000000,
    symbolDictionary = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopsadfghjklzxcvbnm",
    workChunk = 100000,
    currentIndex = 0,
  ) {
    this.data = '';
    this.stringLength = stringLength;
    this.stringCount = stringCount;
    this.symbolDictionary = symbolDictionary;
    this.workChunk = workChunk;
    this.currentIndex = currentIndex;
  }

  loopGenerateText = () => {
    //this.printProgress();

    do {
      ++this.currentIndex;
      this.newString();
    } while (this.currentIndex % this.workChunk !== 0)
    /*
    if (this.currentIndex !== 1) {
      process.stdout.moveCursor(0, -1);
      process.stdout.clearLine(1);
    }
    */
    fs.appendFileSync('./server.txt', this.data);
    this.data = ''
    if (this.currentIndex < this.stringCount) {
      
      setTimeout(this.loopGenerateText);
    }
  }
  
  newString = () => {
    const string = this.generateString();
    if (this.currentIndex !== 1)
      this.data += '\n' + string
    else
      this.data += string
  }
  
  generateString = () => {
    let string = '';
    for (let i = 0; i < this.stringLength; i ++) {
      string += this.getRandomSymbol();
    }
    return string;
  }
  
  getRandomSymbol = () => {
    return this.symbolDictionary[Math.ceil(Math.random()*100)%this.symbolDictionary.length];
  }
  
  /*
  printProgress = () => {
    let string = '';
    let persent = this.currentIndex / this.stringCount;
    let progressLength = 30;
    for (let i = 0; i < progressLength; i++) {
      if (i/progressLength < persent) {
        string += '#';
      }
      else {
        string += ' '
      }
    }
    string += ' ' + Math.ceil(persent * 100) + '%' + ' items: ' + this.currentIndex;
    console.log(string);
  }
  */
}

const gen = new ArraysOfRandomStringGenerator();
gen.loopGenerateText();
