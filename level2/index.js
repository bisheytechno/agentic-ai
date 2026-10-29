import express from 'express'
import dotenv from 'dotenv'
import { ChatGoogle } from "@langchain/google";
import { TavilyMap, TavilySearch } from "@langchain/tavily";
import {createAgent , tool} from "langchain"
import { ToolNode } from "@langchain/langgraph/prebuilt"
import z from 'zod';
import { MessagesAnnotation, StateGraph } from '@langchain/langgraph';

dotenv.config()


const app = express()
const port = process.env.PORT || 5000


app.use(express.json())



//ai agents = tools+llm using tavily search using langchain

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

//tool3- email send using langchain

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

const tools = [tool1,tool2,tool3]

const model = new ChatGoogle("gemini-3.5-flash").bindTools(tools)


// app.post("/chat", async(req,res) => {
//     const {prompt} = req.body
//     const agent = createAgent({
//         model,
//         tools:[tool1, tool2, tool3]
//     })

//     const result = await agent.invoke({
//         messages:[
//             {
//               role:"human",
//               content: prompt
//             }
//         ]
//     })

//     return res.json(result.messages[result.messages.length-1].content)
// })


//ai agnents using langgraph

const toolNode = new ToolNode(tools)

const agent = async(state) => {
   const result = await model.invoke(
    state.messages
   )

   return  {
      messages: [result]
    }
}

const shouldContinue = async(state) => {
    console.log(state)
    if(state.messages[state.messages.length-1].tool_calls.length > 0){
        return "tool_node"
    }else{
        return "__end__"
    }
}

// state = {
//     humanMessage: "",
//     AiMessage: "",
//     toolMessage: "",
//     AiMessage: ""
// }

//making graph
const graph = new StateGraph(MessagesAnnotation)
    .addNode("agent",agent)
    .addNode("tool_node",toolNode)
    .addEdge("__start__", "agent")
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tool_node", "agent")
    .compile()


app.post('/chat', async(req,res) => {
    const {prompt} = req.body
    const result = await graph.invoke({
        messages: [
            {
                role: "human",
                content: prompt
            }
        ]
    })
    console.log(result.messages)
    return res.json(result.messages[result.messages.length-1].content)
})




app.listen(port, ()=> {
    console.log(`server started at port ${port}`)
})




