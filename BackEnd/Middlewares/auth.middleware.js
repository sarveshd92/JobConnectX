import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    try {
        const { ref_token } = req.cookies;
console.log("from auth ->",ref_token)
        const decode = await jwt.verify(ref_token, process.env.TOKENONE);
        
        if (!decode) {
            return res.status(401).json({
                message: "Token not found. Please log in again.",
                success: false,
            });
        }

        req.id = decode.userid;
        next();

    } catch (error) {
        return res.status(400).json({
            message: "Session expired. Please log in again.",
            success: false,
        });
    }
};

export default auth;
