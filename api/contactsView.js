//aqui van los routers, que seria equivalente a la vista
const express = require("express");
const router = express.Router();
const signupCtrl = require("../controllers/signup.controller");
const loginCtrl = require("../controllers/login.controller");
const meCtrl = require("../controllers/me.controller");
const auth = require("../middleware/auth");
const {createContact} = require("../service/contactModel");

const invalidatedTokens = new Set();

const validToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (invalidatedTokens.has(token)) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Unathorized: Invalid token",
      data: "Unathorized",
    });
  }
  next();
};

router.post("/users/signup", signupCtrl);

router.post("/users/login", loginCtrl);

router.get("/users/current", validToken, auth, meCtrl);

router.post("/users/logout", validToken, auth, (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  invalidatedTokens.add(token);
  console.log(Array.from(invalidatedTokens));
  res.status(204).json({
    status: "success",
    code: 204,
    message: "Logout: successful",
    data: "Success",
  });
});

router.post("/contacts", validToken, auth, async (req, res, next) => {
  const { name, email, phone, favorite } = req.body;
  const owner = req.user._id;
  try {
    const result = await createContact({ name, email, phone, favorite, owner });
    res.status(201).json({
      status: "created",
      code: 201,
      data: { contact: result },
    });
  } catch (e) {
    next(e);
  }
});

// router.get("/", ctrlContact.get);

// router.get("/:id", ctrlContact.getById);

// router.post("/", ctrlContact.create);

// router.put("/:id", ctrlContact.update);

// router.patch("/:id/favorite", ctrlContact.updateFavorite);

// router.delete("/:id", ctrlContact.remove);

module.exports = router;
