const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/users", userController.getUsers);
router.get("/users/:id", userController.getUserById);
router.post("/users", userController.createUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

router.get("/substrates/:id", userController.getImagesUser);
router.get("/image-ids/:id", userController.getImageArrayForUser);
router.post("/upload-image/:id", userController.uploadImage);
router.delete("/images/:id", userController.deleteImage);

module.exports = router;
