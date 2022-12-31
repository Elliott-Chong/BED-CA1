import connection from "./database.js";
import util from "util";
let query = util.promisify(connection.query).bind(connection);

const Actor = {
  getActorById: ({ actor_id }) => {
    return query(
      "SELECT actor_id, first_name, last_name FROM actor WHERE actor_id = ?",
      [actor_id]
    );
  },

  getAllActors: ({ offset, limit }) => {
    return query(
      "SELECT actor_id, first_name, last_name FROM actor LIMIT ? OFFSET ?",
      [limit, offset]
    );
  },

  createActor: ({ first_name, last_name }) => {
    return query("INSERT INTO actor (first_name, last_name) VALUES (?, ?)", [
      first_name,
      last_name,
    ]);
  },

  updateActor: ({ actor_id, first_name, last_name }) => {
    return query(
      "UPDATE actor SET first_name = ?, last_name = ? WHERE actor_id = ?",
      [first_name, last_name, actor_id]
    );
  },

  deleteActor: ({ actor_id }) => {
    return query("DELETE FROM actor WHERE actor_id = ?", [actor_id]);
  },
};
export default Actor;
