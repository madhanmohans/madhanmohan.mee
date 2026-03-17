### index.js
```js
import { ChatOpenAI } from 'langchain/chat_models/openai'

//import { ChatOpenAI } from "@langchain/openai"

import { PromptTemplate } from 'langchain/prompts'

// import { PromptTemplate } from "@langchain/core/prompts"

import { StringOutputParser } from 'langchain/schema/output_parser'

// import { StringOutputParser } from "@langchain/core/output_parsers"

import { retriever } from '/utils/retriever'

import { combineDocuments } from '/utils/combineDocuments'

import { RunnablePassthrough, RunnableSequence } from "langchain/schema/runnable"

// import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables"

import { formatConvHistory } from '/utils/formatConvHistory'

  

document.addEventListener('submit', (e) => {

e.preventDefault()

progressConversation()

})

  

const openAIApiKey = process.env.OPENAI_API_KEY

const llm = new ChatOpenAI({ openAIApiKey })

  

const standaloneQuestionTemplate = `Given some conversation history (if any) and a question, convert the question to a standalone question.

conversation history: {conv_history}

question: {question}

standalone question:`

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

  

const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the context provided and the conversation history. Try to find the answer in the context. If the answer is not given in the context, find the answer in the conversation history if possible. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@scrimba.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.

context: {context}

conversation history: {conv_history}

question: {question}

answer: `

const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)

  

const standaloneQuestionChain = standaloneQuestionPrompt

.pipe(llm)

.pipe(new StringOutputParser())

  

const retrieverChain = RunnableSequence.from([

prevResult => prevResult.standalone_question,

retriever,

combineDocuments

])

  

const answerChain = answerPrompt

.pipe(llm)

.pipe(new StringOutputParser())

  

const chain = RunnableSequence.from([

{

standalone_question: standaloneQuestionChain,

original_input: new RunnablePassthrough()

},

{

context: retrieverChain,

question: ({ original_input }) => original_input.question,

conv_history: ({ original_input }) => original_input.conv_history

},

answerChain

])

  

const convHistory = []

  

async function progressConversation() {

const userInput = document.getElementById('user-input')

const chatbotConversation = document.getElementById('chatbot-conversation-container')

const question = userInput.value

userInput.value = ''

  

// add human message

const newHumanSpeechBubble = document.createElement('div')

newHumanSpeechBubble.classList.add('speech', 'speech-human')

chatbotConversation.appendChild(newHumanSpeechBubble)

newHumanSpeechBubble.textContent = question

chatbotConversation.scrollTop = chatbotConversation.scrollHeight

const response = await chain.invoke({

question: question,

conv_history: formatConvHistory(convHistory)

})

convHistory.push(question)

convHistory.push(response)

  

// add AI message

const newAiSpeechBubble = document.createElement('div')

newAiSpeechBubble.classList.add('speech', 'speech-ai')

chatbotConversation.appendChild(newAiSpeechBubble)

newAiSpeechBubble.textContent = response

chatbotConversation.scrollTop = chatbotConversation.scrollHeight

}
```
### retriever.js
```js
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'

import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

import { createClient } from '@supabase/supabase-js'

  

const openAIApiKey = process.env.OPENAI_API_KEY

  

const embeddings = new OpenAIEmbeddings({ openAIApiKey })

const sbApiKey = process.env.SUPABASE_API_KEY

const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT

const client = createClient(sbUrl, sbApiKey)

  

const vectorStore = new SupabaseVectorStore(embeddings, {

client,

tableName: 'documents',

queryName: 'match_documents'

})

  

const retriever = vectorStore.asRetriever()

  

export { retriever }

```

### formatConvHistory.js
```js
export function formatConvHistory(messages) {

return messages.map((message, i) => {

if (i % 2 === 0){

return `Human: ${message}`

} else {

return `AI: ${message}`

}

}).join('\n')

}
```

### combineDocuments.js
```js
export function combineDocuments(docs){

return docs.map((doc)=>doc.pageContent).join('\n\n')

}
```

### index.css
```css
:root {

--border-rad-lg: 15px;

--light-text: #fefefe;

}

  

*, *::before, *::after {

box-sizing: border-box;

}

  

html, body {

margin: 0;

padding: 0;

font-family: 'Poppins';

}

  

main {

background-color: slategrey;

background-image: url('images/scrimba-bg.jpeg');

background-size: cover;

background-repeat: no-repeat;

height: 100vh;

display: flex;

align-items: center;

justify-content: center;

}

  

/* chatbot elements */

  

.chatbot-container {

background-color: #171f26;

width: 360px;

min-height: 380px;

border-radius: var(--border-rad-lg);

padding: 1em;

}

  

.chatbot-container > * {

padding: .5em;

}

  

.chatbot-header {

display: flex;

flex-direction: column;

gap: .6em;

}

  

.logo {

width: 160px;

}

  

.chatbot-conversation-container {

height: 250px;

overflow-y: scroll;

margin: 1em 0;

}

  

/* stop ugly scroll bar on some browsers */

.chatbot-conversation-container::-webkit-scrollbar {

display: none;

}

  

.chatbot-conversation-container::-moz-scrollbar {

display: none;

}

  

.speech {

padding: 1em;

max-width: 240px;

color: var(--light-text);

min-width: 90%;

border-radius: var(--border-rad-lg);

font-size: 1.07em;

}

  

.speech:first-child {

margin-top: 0;

}

  

.speech-ai {

background: #334959;

border-top-left-radius: 0;

margin: 1.2em 1em 0 0;

}

  

.speech-human {

margin: 1.2em 0 0 1em;

background: #2f4f4f;

border-top-right-radius: 0;

}

  

.chatbot-input-container {

display: flex;

}

  

input[type="text"], button {

background-color: transparent;

border: 1px solid #586e88;

border-radius: var(--border-rad-lg);

padding: 1em;

}

  

input[type="text"] {

color: var(--light-text);

width: 100%;

border-right: 0;

border-top-right-radius: 0;

border-bottom-right-radius: 0;

}

  

button {

border-left: 0;

border-top-left-radius: 0;

border-bottom-left-radius: 0;

}

  

.send-btn-icon {

width: 20px;

display: block;

}

  

/* text */

.sub-heading {

color: #999999;

font-family: 'Roboto', sans-serif;

font-size: 12px;

text-transform: uppercase;

margin: 0;

}

```

### index.html
```html
<!doctype html>

<html>

<head>

<title>Scrimba Chatbot</title>

<link rel="stylesheet" href="index.css">

<link rel="preconnect" href="https://fonts.googleapis.com">

<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<link href="https://fonts.googleapis.com/css2?family=Poppins&family=Roboto&display=swap" rel="stylesheet">

</head>

  

<body>

<main>

<section class="chatbot-container">

<div class="chatbot-header">

<img src="images/logo-scrimba.svg" class="logo">

<p class="sub-heading">Knowledge Bank</p>

</div>

<div class="chatbot-conversation-container" id="chatbot-conversation-container">

</div>

<form id="form" class="chatbot-input-container">

<input name="user-input" type="text" id="user-input" required>

<button id="submit-btn" class="submit-btn">

<img

src="images/send.svg"

class="send-btn-icon"

>

</button>

</form>

</section>

</main>

<script src="index.js" type="module"></script>

</body>

</html>
```