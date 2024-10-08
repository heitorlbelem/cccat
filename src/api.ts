import express from "express"
import { Signup } from "./Signup"
import { AccountDAODatabase } from "./AccountDAO"
import { GetAccount } from "./GetAccount"

const app = express()
app.use(express.json())

app.post("/signup", async (req, res) => {
	const input = req.body
    const accountDAODatabase = new AccountDAODatabase()
    const signup = new Signup(accountDAODatabase)
    try {
        const output = await signup.execute(input)
        res.json(output)
    } catch(e: any) {
        res.status(422).json({ message: e.message })
    }
})

app.get("/accounts/:id", async (req, res) => {
    const { id } = req.params
    const accountDAODatabase = new AccountDAODatabase()
    const getAccount = new GetAccount(accountDAODatabase)
    const output = await getAccount.execute(id)
	res.json(output)
})

app.listen(3000)
