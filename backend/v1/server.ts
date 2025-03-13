import express, { Router } from "express"
import MongoStore from "connect-mongo"
import cors from "cors"
import session from "express-session"
import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import connectDB from "./config/database"  // Import the database connection
import app from "./routes/index"
import { PORT, SESSION_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NODE_ENV, MONGODB_URI } from "./config"
import User from "./models/User"


const startServer = async () => {
    try {
        // Connect to MongoDB first
        await connectDB();
        console.log("MongoDB connected successfully!");

        // CREATE SERVER
        const server = express()

        // Ensure app is typed as Router
        const router: Router = app;

        // CONFIGURE HEADER INFORMATION (MIDDLEWARES)
        server.use(express.json())      
        server.use(cors({
            origin: 'https://checkche.vercel.app',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            optionsSuccessStatus: 200
          }))

        //CONFIGURE SESSION
        console.log("NODE_ENV: ", NODE_ENV)

        server.use(
            session({
                secret: SESSION_SECRET,
                resave: false,
                saveUninitialized: false,
                store: MongoStore.create({
                    mongoUrl: MONGODB_URI, // your MongoDB connection string
                    collectionName: 'sessions',
                  }),
                cookie: {
                    secure: NODE_ENV === 'production', // false in development
                    httpOnly: true,
                    maxAge: 60 * 60 * 1000, // 1 hour
                    sameSite: 'none'
                }
            })
        )

        //CONFIGURE PASSPORT
        server.use(passport.initialize())
        server.use(passport.session())

        // Serialize user to store ID in session
        passport.serializeUser((user: any, done) => {
            console.log("Serializing user:", user);
            done(null, user._id); // store only user ID in session
        });
  
        // Deserialize user to get full user details using ID stored in session
        passport.deserializeUser(async (id, done) => {
            console.log("Deserializing user ID:", id);
            try {
              const user = await User.findById(id);
              console.log("User fetched during deserialization:", user);
              done(null, user);
            } catch (err) {
              console.error("Error in deserializing user:", err);
              done(err);
            }
          });

        //CONFIGURE GOOGLE STRATEGY
        passport.use(new GoogleStrategy({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "https://checkche-backend.onrender.com/auth/google/callback",
            passReqToCallback: true,
        }, async(request, accessToken, refreshToken, profile, done) => {
            try {
                // Get email from profile emails array
                const userEmail = profile.emails?.[0]?.value;
                
                if (!userEmail) {
                    throw new Error('No email found in Google profile');
                }

                let user = await User.findOne({ email: userEmail });

                if (!user) {
                    const newUser = new User({
                        email: userEmail,
                        name: profile.displayName,
                        image: profile.photos?.[0]?.value || "",
                        googleId: profile.id,  // It's good to store the Google ID
                    });

                    await newUser.save();
                    user = newUser;
                }

                return done(null, user);
            } catch (error) {
                console.error('Google Strategy Error:', error);
                return done(error as Error, null);
            }
        }))

        // CONFIGURE ROUTES
        server.use(router)

        // START UP SERVER
        server.listen(PORT, () => {
            console.log(`Server listening on port: ${PORT}`)
        })

    } catch (error) {
        console.error("Failed to start server:", error)
        process.exit(1)
    }
}

// Start the server
startServer()
