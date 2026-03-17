### challenge
Create the standaloneQuestionChain which has the standaloneQuestion prompt, the llm, and the StringOutputParser.

Create the retrieverChain which takes the standalone question from the previous results and has the retriever and combineDocs.

Create the answerChain that has the answer prompt, the llm and the StringOutputParser.

Put the above chains together in a RunnableSequence and have each provide the input_variables needed by the next step.

To pass the original question to the answer chain, you will need to use a RunnablePassthrough.

The standaloneQuestionChain and answerChain can be either a RunnableSequence or a chain of .pipe() methods as you prefer.

To pass the standalone question to the retriever, you will likely need to use an arrow function, and will therefore need the retrieverChain to be a RunnableSequence.

### approach

```js
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { PromptTemplate } from 'langchain/prompts'
import { StringOutputParser } from 'langchain/schema/output_parser'
import { retriever } from '/utils/retriever'
import { combineDocuments } from '/utils/combineDocuments'
import { RunnablePassthrough, RunnableSequence } from "langchain/schema/runnable"

document.addEventListener('submit', (e) => {
e.preventDefault()
progressConversation()
})

const openAIApiKey = process.env.OPENAI_API_KEY
const llm = new ChatOpenAI({ openAIApiKey })

const standaloneQuestionTemplate = 'Given a question, convert it to a standalone question. question: {question} standalone question:'
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@scrimba.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
context: {context}
question: {question}
answer: `
const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)

/**
* Super Challenge:
*
* Set up a RunnableSequence so that the standaloneQuestionPrompt
* passes the standalone question to the retriever, and the retriever
* passes the combined docs as context to the answerPrompt. Remember,
* the answerPrompt should also have access to the original question.
*
* When you have finished the challenge, you should see a
* conversational answer to our question in the console.
*
**/

const standAloneQuestionChain = RunnableSequence.from([standaloneQuestionPrompt, llm, new StringOutputParser()]);

const retrieverChain = RunnableSequence.from([standAloneQuestionChain, retriever, combineDocuments]);

const answerChain = RunnableSequence.from([answerPrompt, llm, new StringOutputParser()]);

// const chain = standaloneQuestionPrompt.pipe(llm).pipe(new StringOutputParser()).pipe(retriever).pipe(combineDocuments).pipe(answerPrompt)

const chain = RunnableSequence.from([
	{
		question: standAloneQuestionChain,
		original_input: new RunnablePassthrough()
	},

	{
		context: retrieverChain,
		question: ({original_input}) => original_input.question
	},
	answerChain
])

const response = await chain.invoke({
	question: 'What are the technical requirements for running Scrimba? I only have a very old laptop which is not that powerful.'
})

console.log(response)


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
	
	// add AI message
	const newAiSpeechBubble = document.createElement('div')
	newAiSpeechBubble.classList.add('speech', 'speech-ai')
	chatbotConversation.appendChild(newAiSpeechBubble)
	newAiSpeechBubble.textContent = result
	chatbotConversation.scrollTop = chatbotConversation.scrollHeight
}
```