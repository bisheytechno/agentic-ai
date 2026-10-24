import express from 'express'
import dotenv from 'dotenv'
import { ChatGoogle } from "@langchain/google";
dotenv.config()


const app = express()
const port = process.env.PORT || 5000


app.use(express.json())


const model = new ChatGoogle("gemini-3.8-flash")
const result = await model.invoke("Hello")

console.log(result.text)



app.listen(port, ()=> {
    console.log(`server started at port ${port}`)
})




