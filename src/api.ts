import express from "express"
import { getAccount, signup } from "./signup"

const app = express()
app.use(express.json())

app.post("/signup", async (req, res) => {
	const input = req.body
    try {
        const output = await signup(input)
        res.json(output)
    } catch(e: any) {
        res.status(422).json({ message: e.message })
    }
})

app.get("/accounts/:id", async (req, res) => {
    const { id } = req.params
    const output = await getAccount(id)
	res.json(output)
})

app.listen(3000)
