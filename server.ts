import "reflect-metadata";
import "dotenv/config";
import app from "./source/app"

const PORT = process.env.PORT || 3333;

app.listen(process.env.PORT, () => console.log(`⚡ Server rodando em http://localhost:${PORT}`));



