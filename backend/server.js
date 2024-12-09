const app = require("./app");
const dbConnection = require("./database/dbConnection");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
});
const port = process.env.PORT || 3000
dbConnection();
app.listen(port, () => {
  console.log(`server running on ${port} port...`);
});
