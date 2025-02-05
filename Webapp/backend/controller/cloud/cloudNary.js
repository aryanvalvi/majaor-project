const cloudinary = require("cloudinary").v2
require("dotenv").config()
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
})

const image = "./controller/Cloud/abc.jpeg"
const Cloud = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(image)
    console.log(result)
    res.json({msg: "success", data: result})
  } catch (error) {
    console.error("Error uploading image:", error)
    res.status(500).json({msg: "failure", error: error.message})
  }
}

module.exports = {cloudinary, Cloud}
