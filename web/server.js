import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch"; // npm install node-fetch@2

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.text({ type: "application/xml" }));

app.get("/proxy/network", async (req, res) => {
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

app.put("/proxy/network", async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`);
});
