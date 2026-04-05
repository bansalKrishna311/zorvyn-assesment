const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");
const {
  createUser,
  getUsers,
  updateUser,
  getMe,
} = require("../controllers/user.controller");
const {
  createUserValidator,
  updateUserValidator,
  validate,
} = require("../middlewares/Validation.middleware");

router.get("/me", auth, getMe);
router.post("/", auth, allowRoles("admin"), createUserValidator, validate, createUser);
router.get("/", auth, allowRoles("admin"), getUsers);
router.patch(
  "/:id",
  auth,
  allowRoles("admin"),
  updateUserValidator,
  validate,
  updateUser,
);

module.exports = router;
