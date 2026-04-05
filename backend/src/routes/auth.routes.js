const router = require("express").Router();
const { register, login } = require("../controllers/auth.controller");
const {
  registerValidator,
  loginValidator,
  validate,
} = require("../middlewares/Validation.middleware");

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);

module.exports = router;
