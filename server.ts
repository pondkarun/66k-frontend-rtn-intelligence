import bodyParser from 'body-parser';
import express from 'express';
import next from 'next';
import dotenv from 'dotenv';
import config from './service/config'

dotenv.config();

const port = parseInt(`${config.PORT}`, 10) || 3000;
const dev = config.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));
    // server.use("/api", apiRoutes);
    server.all("*", (req, res) => {
        return handle(req, res);
    });
    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});