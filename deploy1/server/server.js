import express from 'express'
const app = express();
const port = 3001

app.get('/',(req, res) => {
    res.send("data is sent from backend")
})

app.listen(port, () => {
    console.log(`server in running ${port}`);
})