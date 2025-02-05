const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
require("dotenv").config()
const User = require("../Db/user")
const {cloudinary} = require("../controller/cloud/cloudNary")

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the database
        let currentUser = await User.findOne({googleID: profile.id})
        if (currentUser) {
          // If the user already exists, return them
          return done(null, currentUser)
        }
        // Get the profile image URL from Google
        const GoogleImageUrl = profile.photos[0].value

        // Upload the image to Cloudinary
        const Cloudimg = await cloudinary.uploader.upload(GoogleImageUrl, {
          folder: "userImage",
        })

        // Create and save the new user in the database
        const newUser = new User({
          username: profile.displayName,
          googleID: profile.id,
          userImage: Cloudimg.secure_url,
        })

        await newUser.save()

        // Return the newly created user
        done(null, newUser)
      } catch (error) {
        console.error("Error while saving to DB:", error)
        return done(error, null)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user)
  })
})
