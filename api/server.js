const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
// const cookieParser = require("cookie-parser");

const app = express();
const jsonParser = express.json();

app.use(cors());
/* app.use(
  cookieSession({
    secret: "lab1-secret",
  })
); */
// app.use(cookieParser());
app.set("port", process.env.PORT || 3001);
app.listen(app.get("port"), function () {
  console.log("listening on: ", app.get("port"));
});


app.get("/", async (req, res) => {
  if (!req.query || req.query === {}) return res.status(400);

  const data = await get(req.query.url, req.query.auth);
  res.send(JSON.stringify(data));
})

app.post("/", jsonParser, async (req, res) => {
  if (!req.body) return res.status(400);
  const data = await post(req.body.url, req.body.data, req.body.auth);
  res.send(JSON.stringify(data));
});


async function get(url, auth) {
  const headers = getHeaders(auth);
  const res = await fetch(url, {
    headers: headers,
    method: "GET",
  });
  return await res.json();
}

async function post(url, body, auth) {
  const headers = getHeaders(auth);
  const res = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });
  console.log(res);
  return await res.text();
}

function getHeaders(auth) {
  if (auth) {
    return {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
  }
  return {
    "Authorization": "token " + auth,
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
};
