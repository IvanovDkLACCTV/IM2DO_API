import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import fetch from "node-fetch";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

// 🧠 Express-прокси
const server = express();
server.use(express.static(path.join(__dirname)));
server.use(express.text({ type: "application/xml" }));

server.get("/proxy/network", async (req, res) => {
  const { ip, user, pass } = req.query;
  const url = `http://${ip}/Network`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${user}:${pass}`).toString("base64"),
      },
    });
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    res.status(500).send("Ошибка запроса: " + err.message);
  }
});

server.put("/proxy/network", async (req, res) => {
  const { ip, user, pass } = req.query;
  const url = `http://${ip}/Network`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${user}:${pass}`).toString("base64"),
        "Content-Type": "application/xml",
      },
      body: req.body,
    });
    const text = await response.text();
    res.status(response.status).send(text || "(пустой ответ)");
  } catch (err) {
    res.status(500).send("Ошибка запроса: " + err.message);
  }
});

server.listen(PORT, () => {
  console.log(`Express-прокси запущен на http://localhost:${PORT}`);
});

// 🖥️ Electron окно
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadURL(`http://localhost:${PORT}/index.html`);
};

app.whenReady().then(createWindow);
