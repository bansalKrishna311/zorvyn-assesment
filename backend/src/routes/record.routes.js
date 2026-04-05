const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");
const {
  createRecordValidator,
  updateRecordValidator,
  validate,
} = require("../middlewares/Validation.middleware");
const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
} = require("../controllers/record.controller");

router.post(
  "/",
  auth,
  allowRoles("admin"),
  createRecordValidator,
  validate,
  createRecord,
);
router.get("/", auth, allowRoles("admin", "analyst"), getRecords);
router.patch(
  "/:id",
  auth,
  allowRoles("admin"),
  updateRecordValidator,
  validate,
  updateRecord,
);
router.delete("/:id", auth, allowRoles("admin"), deleteRecord);

module.exports = router;
