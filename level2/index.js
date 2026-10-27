import express from 'express'
import dotenv from 'dotenv'
import { ChatGoogle } from "@langchain/google";
import { TavilyMap, TavilySearch } from "@langchain/tavily";
import {createAgent , tool} from "langchain"
import z from 'zod';

dotenv.config()


const app = express()
const port = process.env.PORT || 5000


app.use(express.json())



//ai agents = tools+llm using tavily search

const tool1 = new TavilySearch({
    maxResults: 5,
    topic: "general"
})

//custom tool

const tool2 =  tool(
    ({a,b}) => {
      return `addition of ${a} & ${b} is ${a+b}`
    },
    
    {
     name: "addition_tool",
     description: "Use this tool to add two numbers",
     schema: z.object({
        a: z.number(),
        b : z.number()
     })
    }
)

//tool3- email send

const tool3 = tool(
    ({email, content}) => {
       return `Email sent successfully to ${email} with content ${content}`
    },

    {
        name: "email_send_tool",
        description: "Use this tool to send email",
        schema : z.object({
            email: z.string().describe("Sender Email"),
            content: z.string("Mail Content For Sending")
        })
    }
)

const model = new ChatGoogle("gemini-3.5-flash")


app.post("/chat", async(req,res) => {
    const {prompt} = req.body
    const agent = createAgent({
        model,
        tools:[tool1, tool2, tool3]
    })

    const result = await agent.invoke({
        messages:[
            {
              role:"human",
              content: prompt
            }
        ]
    })

    return res.json(result.messages[result.messages.length-1].content)
})

app.listen(port, ()=> {
    console.log(`server started at port ${port}`)
})




