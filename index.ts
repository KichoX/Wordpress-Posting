import * as express from "express";
import { Request, Response } from "express";
import * as bodyParser from "body-parser";
import * as fs from "fs";
import axios from "axios";
import * as cors from "cors";

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: "*", //requests from any site
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.set("view engine", "ejs");
app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

interface User {
  email: string;
  password: string;
}

const users: User[] = [
  { email: "user1@example.com", password: "pass" },
  { email: "user2@example.com", password: "password2" },
];

interface WordPressSite {
  siteName: string;
  apiKey: string;
}

let jwtToken = ""; // Variable to store the JWT token
let wordpressSites: WordPressSite[] = [];
fs.readFile("wordpress_sites.json", "utf8", (err, data) => {
  if (!err) {
    try {
      wordpressSites = JSON.parse(data);
    } catch (error) {
      console.error("Error parsing WordPress sites JSON:", error);
    }
  }
});

async function authenticateAndSaveToken(selectedSite: WordPressSite): Promise<void> {
  const authUrl = `http://${selectedSite.siteName}.local/wp-json/jwt-auth/v1/token`;
  const authData = {
    username: "user1",
    password: "testExample1",
  };

  try {
    const response = await axios.post(authUrl, authData, {
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
      },
    });

    const user = response.data;
    jwtToken = user.token;

  } catch (error) {
    console.error(error);
  }
}

// Function to add a post
async function addPost(req: Request, res: Response, siteName: string): Promise<void> {
  
  const selectedSite = wordpressSites.find((site) => site.siteName === siteName);

  if (!selectedSite) {
    throw res.send("Invalid site selection.");
  }

  await authenticateAndSaveToken(selectedSite);

  
  const apiUrl = `http://${selectedSite.siteName}.local/wp-json/wp/v2/posts`;
  const apiKey = req.body.apiKey;

  const post = {
    title: req.body.title,
    content: req.body.content,
    status: "publish",
  };

  try {
    const response = await axios.post(apiUrl, post, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
        apiKey: apiKey,
      },
    });

    // const responseData = response.data;
    // console.log("API Response:", responseData);

    if (response.status === 201) {
      res.send("Post created successfully!");
    } else {
      res.send("Error creating this post.");
    }
  } catch (error) {
    console.error(JSON.stringify(error));
    res.send("Error creating post.");
  }
}

app.get("/create-post", function (req: Request, res: Response) {
  const apiKey = req.query.apiKey;
  const siteName = req.query.siteName; 
  if (!siteName) {
    return res.redirect("/");
  }

  res.render("create-post", { apiKey, siteName, wordpressSites });
});

app.get("/", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/login.html");
});

app.post("/create-post", (req: Request, res: Response) => addPost(req, res, req.body.siteName));

app.post("/", function (req: Request, res: Response) {
  const email = req.body.email;
  const password = req.body.password;

  const user = users.find((user) => user.email === email && user.password === password);

  if (user) {
    res.render("success", { wordpressSites, selectedSite: req.body.siteName });
  } else {
    res.sendFile(__dirname + "/failure.html");
  }
});

app.listen(process.env.PORT || 3000, function () {
  console.log("The server is running on port 3000!");
});
