
import passport from 'passport';
import { Strategy} from 'passport-google-oauth20';
import User from '../models/User.js';
import "dotenv/config";

passport.use(new Strategy({
    clientID : process.env.CLIENT_ID! , 
    clientSecret: process.env.CLIENT_SECRET!,
    callbackURL: 'http://localhost:8080/auth/google/callback'
} , async (accessToken , refreshToken , profile , done)=> {
    // what happens after login
    // check if the user is there in the db if he is not then add him to the db

    const email = profile.emails?.[0]?.value;
const picture = profile.photos?.[0]?.value;
if (!email) {
    return done(new Error("Google account has no email"));
}
    try {
        let user : any = await User.findOne({
        email : email
    });

     if (!user) {
       user = await User.create({
    googleId: profile.id,
    name: profile.displayName,
    email,
    picture: picture ?? "",
});
    }

    done(null, user);
    } catch (error) {
         done(error as Error);
    }
    
}));

export default passport;