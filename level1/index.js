import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { GoogleGenAI } from "@google/genai";

const app = express()

const port = process.env.PORT || 5000

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

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

app.post("/chat", async(req,res)=> {
    const {prompt} = req.body
    const result = await ai.models.generateContent({
         model: "gemini-2.5-flash",
         contents: prompt
    })
    return res.json(result.text)
})

app.listen(port, ()=> {
    console.log(`server started at port ${port}`)
})




