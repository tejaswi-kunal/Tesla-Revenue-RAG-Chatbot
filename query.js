import readlineSync from 'readline-sync';
import * as dotenv from 'dotenv';
dotenv.config();
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';

const History=[];

const model = new ChatGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY,
        model: 'gemini-2.5-flash',  
        temperature: 0.3, 
    });

const chatting=async(userProblem)=>
{

    // this apporch may fail ,if user asks query reletaed to above queries ,like explain the above part in more detail
    // so we have to make call to LLM for figuring out the intent of the user for cuurent query on the basis of the past queries 
    // if its related 

   const intentPrompt = PromptTemplate.fromTemplate(`
        You are a query rewriting system for a RAG chatbot.

        Your job is to analyze the conversation history and determine whether the latest user query refers to previous conversation context.

        Conversation History:
        {History}

        Current User Query:
        {userProblem}

        Rules:

        1. If the latest query is referring to a previous question, answer, explanation, result, table, figure, page, source, or discussion, rewrite it into a complete standalone question.

        Examples:

        User:
        What was Tesla's revenue in 2025?

        Assistant:
        Tesla's revenue in 2025 was $97.7 billion.

        User:
        Explain this in more detail.

        Your Output:
        Explain Tesla's revenue in 2025 in more detail.

        -------------------------

        User:
        What was Tesla's revenue in 2025?

        Assistant:
        Tesla's revenue in 2025 was $97.7 billion.

        User:
        Which page contains this information?

        Your Output:
        Which page contains Tesla's 2025 revenue information?

        -------------------------

        2. If the latest query is independent and does not depend on previous conversation, return it unchanged.

        Example:

        User:
        What is Tesla's net income?

        Your Output:
        What is Tesla's net income?

        3. Return ONLY the final query(userProblem) .
        4. Do not provide explanations.
        5. Do not return JSON.
        6. Output must contain only a single query.

        Final Rewritten Query:
    `);
    const intentChain = RunnableSequence.from([
        intentPrompt,
        model,
        new StringOutputParser(),
    ]);

    //Invoke the chain and get the answer
    const  question= await intentChain.invoke({
        History: History,
        userProblem:userProblem
    });
    
    History.push({User:question});
    
    // coverting User Query to Vector
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        model: 'gemini-embedding-001',
        });
    
    const queryVector = await embeddings.embedQuery(question);   

    // now we have to serach for the relavent vectors similar to it from the vector db
    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    const searchResults = await pineconeIndex.query({
        topK: 10,
        vector: queryVector,
        includeMetadata: true,
        });

    // now extract the metadata of each vector retrived from the db
    const context = searchResults.matches
                       .map(match => match.metadata.text)
                       .join("\n\n---\n\n");

    // now we have to pass this metadatas as context for each specific query
    //Create a prompt template
    const promptTemplate = PromptTemplate.fromTemplate(`
        You are a helpful assistant answer questions regarding the tesla's revenue report of 2025 based on the provided documentation.
        
        Context from the documentation:
        {context}

        Question: {question}

        Instructions:
        - Answer the question using ONLY the information from the context above
        - If the user’s question is related to Tesla’s revenue, financial performance, earnings, business segments, growth trends, 
            or any information contained in the report, provide a clear and accurate answer based on the document.
        - If the answer is not in the context, say "I don't have enough information to answer that question."
        - Be concise and clear
        - If the user asks a question unrelated to Tesla revenue or the report, politely respond:
            “I’m specifically designed to answer questions about Tesla’s revenue report. Please ask a question related to Tesla’s financial performance, 
            revenue, earnings, or other information covered in the document.”

        Answer
    `);

    // Create a chain (prompt → model → parser)
    const chain = RunnableSequence.from([
        promptTemplate,
        model,
        new StringOutputParser(),
    ]);

    // Step 6: Invoke the chain and get the answer
    const answer = await chain.invoke({
        context: context,
        question: question,
    }); 

    console.log('\n📖 Answer : \n',answer);
    History.push({Assistant:answer});
}

async function main(){
   const userProblem = readlineSync.question("\nAsk Any Question About Tesla's Revenue Reports:---> \n");

   if(userProblem=='stop')
   {
        return;
   }
   await chatting(userProblem);
   main();
}


main();
// What were Tesla’s major revenue segments in 2025?

