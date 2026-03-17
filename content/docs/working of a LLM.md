## stages
1. preprocessing
2. tokenization
3. Neural Network Training

internet -> text -> table -> stream of bytes -> tokens(symbols) 

> token != word

## context window 
- (max no. of tokens) to predict the output (next token)
- can be user inputs/scraped external resources/model's output/thinking

## pre-training and fine-tuning
we start with random weights for each token and fine-tune the weights of each token (back-propagation) to match the training dataset. 

the equation (model) + the right set of params(weights) - predicts the next word so that it will be pattern matched with our language. 

> pattern matching + prediction of next word = LLM

in practice, transformer model(_self-attention + parallel computation_) has billions of tokens, 
which are fine-tuned in parallel with a large mathematic expression to predict the next token from each of the context window of variable size. (0 to max context)

> 8k context window max size ideally, theoretically it can be infinite


### model inference

inference is like filpping a biased coin

the bias here is the input token sequence, and output would be variations of next token predictions that lead to new patterns each time we infer. 

1 token → 2 tokens   
2 tokens → 3 tokens  
3 tokens → 4 tokens ….(context window is the ceiling)

base model → token simulator → not an assistant → just tries to vaguely predict the next token → if given exact matches from websites can regurgiate to a certain extent then dream

instruct models are what we call assistants

models get trained on GPUs in datacenter, which can do lots of matrix multiplications and soft maxes.

## _Reference_
https://youtu.be/7xTGNNLPyMI

[[edge-ml]]

---

> what is attention block?

