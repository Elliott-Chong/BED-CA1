import mysql from "mysql2";
let connection;
try {
  connection = mysql.createConnection({
    host: "localhost",
    user: "bed_dvd_root",
    password: "pa$$woRD123",
    database: "bed_dvd_db",
  });
  console.log("mysql server connected!");
} catch (error) {
  console.error(error);
}

export default connection;
