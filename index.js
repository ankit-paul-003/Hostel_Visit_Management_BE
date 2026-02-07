import express from 'express';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.send("OK");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});