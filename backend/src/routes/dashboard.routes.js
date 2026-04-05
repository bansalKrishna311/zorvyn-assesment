const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");
const { getSummary } = require("../controllers/dashboard.controller");

router.get("/summary", auth, allowRoles("admin", "analyst", "viewer"), getSummary);

module.exports = router;
