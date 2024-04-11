import EventEmitter from "../utils/eventEmitter.js";

class ReadAloudManager extends EventEmitter {
  constructor(wordsOfPages) {
    super();
    this.wordsOfPages = wordsOfPages;
    this.currentWordIndex = 0;
    this.currentPageIndex = 0;
    this.correctWordsRead = [];
    this.wordsOfPage = this.wordsOfPages[this.currentPageIndex];
  }

  // Updates the list of correctly read words based on transcribed words
  updateCorrectWords(transcribedWords) {
    transcribedWords.forEach((word) => {
      word = word
        .toLowerCase()
        .replace(/[^a-zA-Z ]/g, "")
        .trim();
      if (word === this.wordsOfPage[this.currentWordIndex]) {
        this.correctWordsRead.push(word);
        this.goToNextWord();
      } else {
        console.log("Word skipped or incorrect:", word);
        console.log("Expected word:", this.wordsOfPage[this.currentWordIndex]);
      }
    });
  }

  // Moves to the next word, updating the state and emitting an event
  goToNextWord() {
    this.currentWordIndex++;
    if (this.currentWordIndex < this.wordsOfPage.length) {
      this.emit("wordChanged", {
        currentWordIndex: this.currentWordIndex,
        currentPageIndex: this.currentPageIndex,
      });
    } else {
      console.log("All words read correctly. Moving to next page.");
      this.goToNextPage();
    }
  }

  // Moves to the next page, resetting the relevant state and emitting an event
  goToNextPage() {
    this.currentWordIndex = 0;
    this.currentPageIndex++;
    this.correctWordsRead = [];
    if (this.currentPageIndex < this.wordsOfPages.length) {
      this.wordsOfPage = this.wordsOfPages[this.currentPageIndex]; // Update words to read for the new page
      this.emit("pageChanged", {
        currentWordIndex: this.currentWordIndex,
        currentPageIndex: this.currentPageIndex,
      });
    } else {
      console.log("All pages have been read. Good job!");
      this.emit("stopReadAloud");
    }
  }
}

export default ReadAloudManager;
