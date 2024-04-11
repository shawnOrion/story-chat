### What does this project do? 

This is a project that helps kids learn to read. The user reads a story aloud, and correct spoken words move the story forward. When the read aloud is over, they speak with an AI about the story in an engaging and educational chat.

### Why is this project important?

I started this project because I saw a need for fun ways to check how well kids understand what they read. With voice-interactive conversational AI, kids can talk to the app and improve their reading by engaging with stories out loud. It's a new way to make reading more enjoyable and educational for children.

### What’s the main functionality?

There are two core functionalities,  read-aloud and voice-interactive chat.. When kids read stories aloud, the app listens, instantly checking their words against the story to ensure they're on track.  When the user has finished the story, GPT is used to guide the user through an educational, engaging discussion about the story. This combo of reading and chatting improves various reading skills and makes learning to read fun.

### How did I build this?

I built the app with Node.js and Express because it's a simple and familiar way to make a full stack application. WebSocket and DeepGram are used for immediate transcription of a users' spoken words during read-aloud sessions. And, various technologies from OpenAI are used for the chat. GPT-4 for conversations, with other OpenAI API functions used for transcribing and voicing interactions with the user. 

### How is it structured?
**Frontend Overview**
- Read Aloud Directory (`public/javascripts/readAloud/`): Includes classes for managing the read-aloud functionality, from voice recording to WebSocket for real-time communication.
- Chat Directory (`public/javascripts/chat/`): Includes classes for the chat feature, enabling voice interactive chats with an AI
- App Controller (`public/javascripts/appController.js`): Initializes read-aloud and chat features.

**Backend Overview**
- Routes (`routes/main.js`): Defines the API endpoints for chat features, serving as an entrypoint for frontend-backend communication.
- Controllers (`controllers/`): Handles requests related to audio files, messaging, and voice commands.
- Services (`services/`): Implements core logic for managing file operations, OpenAI interactions, and live transcription.

### What was challenging about this project?

The main challenge involved transforming the app from a chaotic version-1 into a clear structure. There was a point where the app functioned, but its components, like chat and read-aloud features, were jumbled together, making the app hard to understand and build upon. I made the codebase a lot more clear and manageable by organizing related functionalities into dedicated directories and encapsulating them in relevant classes.

### What did I learn?

By refactoring a complex application, I realized the importance of a well-organized (and not just functional) system. Radical improvements aren't the result of overnight overhauls. I focused on immediate, manageable improvements, and gradually transformed the codebase. This patient mindset helped me create something I'm really proud of.
