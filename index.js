import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { GoogleGenAI } from "@google/genai";

const app = express()

const port = process.env.PORT || 5000

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

const main = async () =>{
     const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.8-flash",
        contents: " What is JS?"
     })

     for await (const chunk of responseStream){
        console.log(chunk.text)
     }
}

main()

app.listen(port, ()=> {
    console.log(`server started at port ${port}`)
})




