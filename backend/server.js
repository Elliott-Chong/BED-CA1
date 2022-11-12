import express from "express";
import connection from "./database.js";
import util from "util";

const app = express();
let query = util.promisify(connection.query).bind(connection);

app.use(express.json());

app.get("/", async (req, res) => {
  console.log("yos");
});

app.get("/actors/:actor_id", async (req, res) => {
  const actor_id = req.params.actor_id;
  try {
    const response = await query(
      "SELECT actor_id, first_name, last_name FROM actor WHERE actor_id = ?",
      [actor_id]
    );
    if (response.length === 0) {
      return res
        .status(204)
        .send("No Content. Record of given actor_id cannot be found.");
    }
    return res.status(200).json(response[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error in @GET /actors/:actor_id");
  }
});

app.get("/actors", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const response = await query(
      "SELECT actor_id, first_name, last_name FROM actor LIMIT ? OFFSET ?",
      [limit, offset]
    );
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error in @GET /actors");
  }
});

app.post("/actors", async (req, res) => {
  try {
    const { first_name, last_name } = req.body;
    if (!first_name || !last_name) {
      return res
        .status(400)
        .send("Missing first_name or last_name in request body");
    }

    const response = await query(
      "INSERT INTO actor (first_name, last_name) VALUES (?, ?)",
      [first_name, last_name]
    );
    return res.status(200).json({ actor_id: response.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error in @POST /actors");
  }
});

app.put("/actors/:actor_id", async (req, res) => {
  let { first_name, last_name } = req.body;
  const { actor_id } = req.params;
  if (!first_name && !last_name) {
    return res
      .status(400)
      .send("Missing first_name or last_name in request body");
  }
  try {
    let response = await query("SELECT * FROM actor WHERE actor_id =? ", [
      actor_id,
    ]);
    if (!first_name) {
      first_name = response[0].first_name;
    }
    if (!last_name) {
      last_name = response[0].last_name;
    }
    if (response.length === 0) {
      return res
        .status(204)
        .send("No Content. Record of given actor_id cannot be found.");
    }
    await query("UPDATE actor set first_name=?, last_name=? where actor_id=?", [
      first_name,
      last_name,
      actor_id,
    ]);
    return res.status(200).send("Record updated!");
  } catch (error) {
    return res.status(500).send("Server error in @PUT /actors/:actor_id");
  }
});

app.delete("/actors/:actor_id", async (req, res) => {
  const { actor_id } = req.params;
  try {
    const response = await query("SELECT * FROM actor where actor_id=?", [
      actor_id,
    ]);
    if (response.length === 0) {
      return res.status(204);
    }
    await query("DELETE FROM actor where actor_id=?", [actor_id]);
    return res.status(200).send("Actor deleted!");
  } catch (error) {
    return res.status(500).send("Server error in @DELETE /actors/:actor_id");
  }
});

app.get("/film_categories/:category_id/films", async (req, res) => {
  const { category_id } = req.params;
  try {
    const response = await query(
      "SELECT film.film_id, film.title, category.name as category, film.rating, film.release_year, film.length as duration from film join film_category on film_category.film_id=film.film_id join category on category.category_id=film_category.category_id WHERE category.category_id =?;"[
        category_id
      ]
    );
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send("Server error in @GET /film_categories/:category_id/films");
  }
});

app.listen(8000, () => {
  console.log("BED CA1 Running on http://localhost:" + 8000);
});
