class ReadAloudView {
  constructor(pages, readAloudManager) {
    this.pages = pages;
    this.readAloudManager = readAloudManager;
    this.storyContainer = document.querySelector(".story-container");
    this.subcribeToEvents();
  }

  subcribeToEvents() {
    this.readAloudManager.on("wordChanged", (data) => {
      this.handleWordChanged(data);
    });

    this.readAloudManager.on("pageChanged", (data) => {
      this.handlePageChanged(data);
    });
  }

  loadStory() {
    this.storyContainer.innerHTML = "";
    this.pages.forEach((page, index) => {
      const pageElement = this.createPageElement(page.text, page.image, index);
      this.storyContainer.appendChild(pageElement);
    });
  }

  createPageElement(text, image, index) {
    const pageElement = document.createElement("div");
    pageElement.classList.add("page");
    if (index !== 0) {
      pageElement.classList.add("hidden");
    }
    const textSection = document.createElement("div");
    textSection.classList.add("text-section");
    const textContent = document.createElement("div");
    textContent.classList.add("text-content");
    text.split(" ").forEach((word, i) => {
      const button = this.createWordButton(word, i === 0);
      textContent.appendChild(button);
    });
    textSection.appendChild(textContent);

    const imageSection = document.createElement("div");
    imageSection.classList.add("image-section");
    const img = document.createElement("img");
    img.src = image;
    imageSection.appendChild(img);

    pageElement.appendChild(textSection);
    pageElement.appendChild(imageSection);

    return pageElement;
  }

  createWordButton(word, isFirstWord) {
    const button = document.createElement("button");
    button.textContent = word;
    button.classList.add("text-like-button");
    if (isFirstWord) {
      button.classList.add("current-word");
    }
    button.addEventListener("click", () => {
      // TODO: Implement readWordToUser functionality or similar
    });
    return button;
  }

  switchCurrentWord(currentWordIndex, currentPageIndex) {
    const currentWordElement = document.querySelector(".current-word");
    if (currentWordElement) {
      currentWordElement.classList.remove("current-word");
    }
    const pageEl = document.querySelectorAll(".story-container .page")[
      currentPageIndex
    ];
    if (pageEl) {
      const textLikeButton =
        pageEl.querySelectorAll(".text-like-button")[currentWordIndex];
      if (textLikeButton) {
        textLikeButton.classList.add("current-word");
      }
    }
  }

  showCurrentPage(currentPageIndex) {
    const pageEl = document.querySelectorAll(".story-container .page")[
      currentPageIndex
    ];
    if (pageEl) {
      pageEl.classList.remove("hidden");
    }
  }

  handleWordChanged(data) {
    const currentWordIndex = data.currentWordIndex;
    const currentPageIndex = data.currentPageIndex;
    this.switchCurrentWord(currentWordIndex, currentPageIndex);
  }

  handlePageChanged(data) {
    const currentWordIndex = data.currentWordIndex;
    const currentPageIndex = data.currentPageIndex;
    this.switchCurrentWord(currentWordIndex, currentPageIndex);
    this.showCurrentPage(currentPageIndex);
    this.scrollToBottom(".story-container");
  }

  scrollToBottom(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }

  toggleTranscribeButtons(isTranscribing) {
    this.startTranscribeBtn.disabled = isTranscribing;
    this.stopTranscribeBtn.disabled = !isTranscribing;
  }
}

export default ReadAloudView;
