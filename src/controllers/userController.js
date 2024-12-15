const pool = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "usersImages/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM users where id = $1", [id]);

    if (!result.rows.length) {
      return res.status(404).json({ user: null });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  const { id, nickname } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (id, nickname) VALUES ($1, $2) RETURNING *",
      [id, nickname]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nickname, subscription_lvl } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET nickname = $2, subscription_lvl = $3 WHERE id = $1 RETURNING *",
      [id, nickname, subscription_lvl]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getImagesUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT image_link FROM custom_substrates WHERE user_id = $1",
      [id]
    );

    if (!result.rows.length) {
      return res.status(200).json([]);
    }

    const links = result.rows.map((row) => row.image_link);

    res.status(200).json(links);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getImageArrayForUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT id FROM custom_substrates WHERE user_id = $1",
      [id]
    );
    const imageIds = result.rows.map((row) => row.id);

    res.status(200).json(imageIds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadImage = async (req, res) => {
  const { id } = req.params;

  try {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ error: "Ошибка при загрузке файла" });
      }

      const { filename } = req.file;

      const result = await pool.query(
        "INSERT INTO custom_substrates (user_id, image_link) VALUES ($1, $2) RETURNING *",
        [id, filename]
      );

      res.status(201).json(result.rows[0]);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT image_link FROM custom_substrates WHERE id = $1",
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Изображение не найдено" });
    }

    const imgPath = result.rows[0].image_link;
    const fwq = path.join(__dirname, "../../usersImages/", imgPath);

    await fs.unlink(fwq);
    await pool.query("DELETE FROM custom_substrates WHERE id = $1", [id]);

    res.status(200).json({ message: "Изображение удалено" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
