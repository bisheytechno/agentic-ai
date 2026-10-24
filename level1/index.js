import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { GoogleGenAI } from "@google/genai";
import { ChatGoogle } from "@langchain/google";
import { ChatGroq } from "@langchain/groq"

const app = express()

const port = process.env.PORT || 5000


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// const main = async () =>{
//      const responseStream = await ai.models.generateContentStream({
//         model: "gemini-3.8-flash",
//         contents: " What is JS?"
//      })

//      for await (const chunk of responseStream){
//         console.log(chunk.text)
//      }
// }

// main()


// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY
// })

//project - level 1

// app.post("/chat", async(req,res)=> {
//     const {prompt} = req.body
//     const result = await ai.models.generateContent({
//          model: "gemini-3.8-flash",
//          contents: prompt
//     })
//     return res.json(result.text)
// })



// langchain using google api

app.post("/chat", async(req,res)=> {
    const {prompt} = req.body
    const ai = new ChatGoogle({
        model: "gemini-3.8-flash",
        temperature: 0.7,
        maxOutputTokens: 1000,

    })
    const result = await ai.invoke([
        {

        role:"system",
        content: "you are bishu and my assistant"

        },
        {
            role: "human",
            content: prompt
        }
    ])
    
    return res.json(result.content)
})



//langchain using grok api


app.post("/chat", async(req,res)=> {
    const {prompt} = req.body
    const ai = new ChatGroq({
        model: "openai/gpt-oss-120b",
        temperature: 0.7,
        maxOutputTokens: 1000,

    })
    const result = await ai.invoke([
        {

        role:"system",
        content: "you are jarvis and my assistant"

        },
        {
            role: "human",
            content: prompt
        }
    ])
    
    return res.json(result.content)
})










app.listen(port, ()=> {
    console.log(`server started at port ${port}`)
})




