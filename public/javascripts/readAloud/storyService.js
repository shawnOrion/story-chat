class StoryService {
  constructor(pages) {
    this.pages = pages;
  }

  // Returns the story as a single string
  getStoryString() {
    return this.pages.map((page) => page.text).join("\n");
  }

  // Returns the story in a word-by-word format for each page
  getWordsOfPages() {
    const storyTextStr = this.getStoryString();
    return storyTextStr.split("\n").map((text) =>
      text.split(" ").map((word) =>
        word
          .toLowerCase()
          .replace(/[^a-zA-Z ]/g, "")
          .trim()
      )
    );
  }
}

export default StoryService;
