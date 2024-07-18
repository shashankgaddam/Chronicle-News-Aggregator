import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors'

const PORT = 8000;
const app = express();

app.use(cors())

app.all("/api", async(req, res, next)=> {
    let apiUrl = req.url.split("/api?url=")[1];
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            res.status(502).send({message: 'Error occurred during fetching from API'})
        }
        const data = await response.json();
        res.status(200).send(data)
    } catch(error) {
        console.log(error)
        res.status(500).send({message: 'Error occurred during  fetching news'})
    }
    next()
})

app.listen(PORT);
console.log(`Server started at http://localhost: ${PORT}`);

