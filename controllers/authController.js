import User from '../models/User.js';
// export const authUser = async (req, res) => {
//   // Destructure email and password from the request body sent by the client
//   const { email, password } = req.body;

//   // Look up the user in the database using the email provided
//   const user = await user.findOne({ email });

//   // If a user with the provided email exists and the password matches
//   if (user && (await user.matchPassword(password))) {
//     // Generate a JSON Web Token (JWT) using the user's ID
//     const token = generateToken(user._id);
    
//     // Send a JSON response containing user data and the token
//     res.json({
//       _id: user._id,        
//       name: user.name,      
//       email: user.email,    
//       isAdmin: user.isAdmin,
//       token,                
//     });
//   } else {
//     // If authentication fails, set status to 401 (Unauthorized)
//     res.status(401);

//     // Throw an error that will be caught by error handling middleware
//     throw new Error('Invalid email or password');
//   }
// };
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js'; 
export const authUser = async (req, res) => {
  const { email, password } = req.body;

  
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
};
