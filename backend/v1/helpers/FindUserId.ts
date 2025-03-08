import User from "../models/User";

 export const findUserId = async (username: string) => {
    try{ 
        console.log(username)

        // Find users by their usernames
        const currentUser = await User.findOne({ username });
    

        console.log(currentUser?._id.toString())
        return currentUser?._id.toString()
    }catch(error){
        console.error("Error finding user ID:", error);
        return null;
    }
}

export const findUserDetails = async (username: string) => {
    try{ 
        console.log(username)

        // Find users by their usernames
        const currentUser = await User.findOne({ username });
    

        console.log("User: ", currentUser)
        return currentUser
    }catch(error){
        console.error("Error finding user:", error);
        return null;
    }
}

