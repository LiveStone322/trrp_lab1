const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
// const cookieParser = require("cookie-parser");

const app = express();
const jsonParser = express.json();
const clientSecret = '15fb604164568d0124ccbad94955d2c10388001d';

app.use(cors());
/* app.use(
  cookieSession({
    secret: "lab1-secret",
  })
); */
// app.use(cookieParser());
app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), function () {
  console.log("listening on: ", app.get("port"));
});


app.get("/", async (req, res) => {
  if (!req.query || req.query === {}) return res.status(400);

  const data = await get(req.query.url, req.query.auth);
  res.send(JSON.stringify(data));
})

app.delete("/", async (req, res) => {
  if (!req.query || req.query === {}) return res.status(400);

  const data = await remove(req.query.url, req.query.auth);
  res.send(JSON.stringify(data));
})

app.post("/", jsonParser, async (req, res) => {
  if (!req.body) return res.status(400);

  const data = await post(req.body.url, req.body.data, req.body.auth);
  res.send(JSON.stringify(data));
});

app.patch("/", jsonParser, async (req, res) => {
  if (!req.body) return res.status(400);

  const data = await patch(req.body.url, req.body.data, req.body.auth);
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

async function remove(url, auth) {
  const headers = getHeaders(auth);
  const res = await fetch(url, {
    headers: headers,
    method: "DELETE",
  });
  return await res.json();
}

async function post(url, body, auth) {
  if (body.hasOwnProperty("client_secret")) {
    body.client_secret = clientSecret;
  }
  const headers = getHeaders(auth);
  const res = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });
  return await res.text();
}

async function patch(url, body, auth) {
  if (body.hasOwnProperty("client_secret")) {
    body.client_secret = clientSecret;
  }
  const headers = getHeaders(auth);
  console.log({url, body, headers, auth})
  const res = await fetch(url, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(body),
  });
  return await res.text();
}

function getHeaders(auth) {
  if (auth) {
    return {
      "Authorization": "token " + auth,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
  }
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
};
