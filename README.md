📊 Tesla Revenue RAG Chatbot

A Retrieval-Augmented Generation (RAG) chatbot built using LangChain, Pinecone, and Google’s Gemini models. The chatbot answers questions about Tesla’s 2025 revenue report by retrieving relevant information from a PDF document and generating context-aware responses.

⸻

🚀 Features

* PDF ingestion and processing
* Automatic text chunking
* Vector embeddings using Gemini Embeddings
* Vector storage and similarity search using Pinecone
* Retrieval-Augmented Generation (RAG)
* Conversation-aware query rewriting
* Follow-up question support
* Restricts responses to Tesla revenue report content
* Terminal-based chat interface

⸻

🛠️ Tech Stack

AI & LLM

* Gemini 2.5 Flash
* Gemini Embedding Model (gemini-embedding-001)

Frameworks & Libraries

* LangChain
* Pinecone Vector Database
* PDF Loader
* Recursive Character Text Splitter

Runtime

* Node.js

⸻

📦 Dependencies

npm install @langchain/community
npm install @langchain/core
npm install @langchain/google-genai
npm install @langchain/pinecone
npm install @langchain/textsplitters
npm install @pinecone-database/pinecone
npm install dotenv
npm install pdf-parse
npm install readline-sync

⸻

## 📂 Project Structure

```text
.
├── indexing.js        # PDF ingestion and vector indexing
├── query.js           # Chatbot and retrieval pipeline
├── tesla.pdf          # Tesla revenue report
├── .env
├── package.json
└── README.md
```

⚙️ Environment Variables

Create a .env file:

GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_index_name

⸻

🔄 Architecture

Tesla Revenue PDF
        │
        ▼
 PDF Loader
        │
        ▼
 Text Chunking
        │
        ▼
 Gemini Embeddings
        │
        ▼
 Pinecone Vector DB
        │
        ▼
 User Query
        │
        ▼
 Query Rewriting
        │
        ▼
 Query Embedding
        │
        ▼
 Similarity Search
        │
        ▼
 Relevant Context
        │
        ▼
 Gemini 2.5 Flash
        │
        ▼
 Final Answer

⸻

🧠 Query Rewriting

The chatbot supports conversational follow-up questions.

Example:

User:
What were Tesla's major revenue segments in 2025?
Assistant:
Automotive Sales, Energy Generation & Storage,
and Services & Other Revenue.
User:
Explain this in more detail.

The query rewriting layer converts:

Explain this in more detail.

into

Explain Tesla's major revenue segments in 2025 in more detail.

before performing retrieval.

This significantly improves the quality of follow-up responses.

⸻

▶️ Running the Project

Step 1: Index the PDF

node indexing.js

This will:

* Load the Tesla PDF
* Split it into chunks
* Generate embeddings
* Store vectors in Pinecone

⸻

Step 2: Start the Chatbot

node query.js

Example:

📊 Tesla Revenue Assistant
Ask Any Question About Tesla's Revenue Reports:
> What were Tesla's major revenue segments in 2025?
📖 Answer:
Tesla's revenue was primarily generated through
Automotive Sales, Energy Generation & Storage,
and Services & Other Revenue.

⸻

💡 Example Questions

* What was Tesla’s total revenue in 2025?
* What were Tesla’s major revenue segments?
* How much revenue came from automotive sales?
* What was the growth rate compared to previous years?
* Explain Tesla’s energy generation and storage revenue.
* Which page contains information about automotive revenue?
* Summarize Tesla’s revenue performance.

⸻

🎯 Learning Outcomes

Through this project I learned:

* Retrieval-Augmented Generation (RAG)
* Embedding models
* Vector databases
* Similarity search
* LangChain pipelines
* Pinecone integration
* Context-aware query rewriting
* Conversational AI workflows
* PDF-based question answering systems

⸻

📜 License

This project is created for learning and educational purposes.
