the challenge

build an offline-first mobile app using small language models. zero api costs. complete privacy. this teaches you how to optimize models for restricted hardware.

key architectural decisions :

> model management: lazy loading models on-demand to preserve memory. unload inactive models when memory pressure is detected. preload frequently used models during idle time.

> context window: implement sliding window with semantic chunking. keep the most relevant context, drop the oldest. use embedding similarity to determine what stays in the window versus what gets archived.

> quantization strategy: dynamic quantization based on device capabilities. 4-bit quantization for older devices (pre-2020), 8-bit for newer devices. detect available ram and adjust accordingly.

> battery optimization: batch inference requests to reduce wake cycles. throttle model calls during low battery mode. defer non-critical processing until charging.

> offline-first sync: store user data locally in encrypted format. sync to cloud only when connected and with user permission. conflict resolution prioritizes local changes.

about the app:
> chatbot for thirukural
> when given context like humanity, bravery, love, leadership, should give thirukurals related to that, searching across the book (top 3)



---
## ==*References ==

https://x.com/rohit4verse/status/2009663737469542875