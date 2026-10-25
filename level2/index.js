import express from 'express'
import dotenv from 'dotenv'
import { ChatGoogle } from "@langchain/google";
import { TavilyMap, TavilySearch } from "@langchain/tavily";
import {AIMessage, createAgent, HumanMessage} from "langchain"
import { convertToChunk } from '@langchain/core/messages';
dotenv.config()


const app = express()
const port = process.env.PORT || 5000


app.use(express.json())



//ai agents = tools+llm

const tool = new TavilySearch({
    maxResults: 5,
    topic: "general"
})

const model = new ChatGoogle("gemini-3.5-flash")


app.post("/chat", async(req,res) => {
    const {prompt} = req.body
    const agent = createAgent({
        model,
        tools:[tool]
    })

    const result = await agent.invoke({
        messages:[
            {
              role:"human",
              content: prompt
            }
        ]
    })

    console.log(result.messages[result.messages.length-1].content)

    return res.json("successfull")
})

app.listen(port, ()=> {
    console.log(`server started at port ${port}`)
})




