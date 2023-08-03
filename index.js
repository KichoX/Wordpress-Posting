"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var axios_1 = require("axios");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var app = express();
var corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.set("view engine", "ejs");
app.use(cors(corsOptions)); // Use the configured CORS options
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
var users = [
    { email: "user1@example.com", password: "pass" },
    { email: "user2@example.com", password: "password2" },
];
var jwtToken = ""; // Variable to store the JWT token
var wordpressSites = [];
fs.readFile("wordpress_sites.json", "utf8", function (err, data) {
    if (!err) {
        try {
            wordpressSites = JSON.parse(data);
        }
        catch (error) {
            console.error("Error parsing WordPress sites JSON:", error);
        }
    }
});
function authenticateAndSaveToken(selectedSite) {
    return __awaiter(this, void 0, void 0, function () {
        var authUrl, authData, response, user, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authUrl = "http://".concat(selectedSite.siteName, ".local/wp-json/jwt-auth/v1/token");
                    authData = {
                        username: "user1",
                        password: "testExample1",
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.post(authUrl, authData, {
                            headers: {
                                "Content-Type": "application/json",
                                "accept": "application/json",
                            },
                        })];
                case 2:
                    response = _a.sent();
                    user = response.data;
                    jwtToken = user.token; // Save the JWT token to the variable
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Function to add a post
function addPost(req, res, siteName) {
    return __awaiter(this, void 0, void 0, function () {
        var selectedSite, apiUrl, apiKey, post, response, responseData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    selectedSite = wordpressSites.find(function (site) { return site.siteName === siteName; });
                    if (!selectedSite) {
                        // Site not found in the list
                        res.status(400).send("Invalid site selection.");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, authenticateAndSaveToken(selectedSite)];
                case 1:
                    _a.sent();
                    apiUrl = "http://".concat(selectedSite.siteName, ".local/wp-json/wp/v2/posts");
                    apiKey = req.body.apiKey;
                    post = {
                        title: req.body.title,
                        content: req.body.content,
                        status: "publish",
                    };
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, axios_1.default.post(apiUrl, post, {
                            headers: {
                                Authorization: "Bearer ".concat(jwtToken),
                                "Content-Type": "application/json",
                                apiKey: apiKey, // Include the API key in the headers
                            },
                        })];
                case 3:
                    response = _a.sent();
                    responseData = response.data;
                    console.log("API Response:", responseData);
                    if (response.status === 201) {
                        // Post created successfully
                        // Clear the selected site name from localStorage after successful post creation
                        localStorage.removeItem("selectedSiteName");
                        res.send("Post created successfully!");
                    }
                    else {
                        // Handle other status codes if needed
                        res.send("Error creating this post.");
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error("Error creating post:", error_2);
                    res.status(500).send("Error creating post.");
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
app.get("/create-post", function (req, res) {
    var siteName = req.query.siteName;
    var apiKey = req.query.apiKey;
    if (!apiKey || !siteName) {
        return res.send("API key or site name not found. Please select a site first.");
    }
    res.render("create-post", { siteName: siteName, apiKey: apiKey, wordpressSites: wordpressSites });
});
app.post("/create-post", function (req, res) { return addPost(req, res, req.body.siteName); });
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/login.html");
});
app.post("/", function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    // Check if the user exists and the password is correct
    var user = users.find(function (user) { return user.email === email && user.password === password; });
    if (user) {
        // Successful login
        res.render("success", { wordpressSites: wordpressSites, selectedSite: req.body.siteName });
    }
    else {
        // Failed login
        res.sendFile(__dirname + "/failure.html");
    }
});
app.listen(process.env.PORT || 3000, function () {
    console.log("The server is running on port 3000!");
});
