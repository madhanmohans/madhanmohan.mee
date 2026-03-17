### ways we can use open source models
- huggingface.js inference
	- find models from hugging face library
	- `import { HfInference } from '@huggingface/inference'`
- huggingface.js hub
	- find models from our web app
	- `import { listModels } from "@huggingface/hub";`
- transformers.js
	- download the model in browser and run
	- `import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.8.0'`
- ollama
	- download the model in local machine
	- start in a port and hit it
### tasks we can perform
- text generation
- text classification
- text translation
- text to speech
- image generation
- object detection (returns: {label, score, box(x1, x2, y1, y2)})