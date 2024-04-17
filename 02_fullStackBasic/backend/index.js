import express from 'express';

const app = express();

const port = 3000;

const jokes = [
    {
        "id": 1,
        "name": "joke1"
    },
    {
        "id": 2,
        "name": "joke2"
    },
    {
        "id": 3,
        "name": "joke3"
    },
    {
        "id": 4,
        "name": "joke4"
    },
]

// app.get('/', (req, res) => {
//     res.send('hlw from app');
// })

app.get('/api/jokes', (req, res) => {
    res.json(jokes);
})


app.listen(port, () => {
    console.log(`app is running on port: ${port}`);
})