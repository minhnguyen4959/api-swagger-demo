import jwt from 'jsonwebtoken';



function signAccessToken(userId: string) {
    return jwt.sign({ data: userId }, process.env.ACCESS_TOKEN_SECRET || "", {
        expiresIn: "1h",
    });
}

function signRefreshToken(userId: string) {
    return jwt.sign({ data: userId }, process.env.REFRESH_TOKEN_SECRET || "", {
        expiresIn: "25days",
    });
}


export { signAccessToken, signRefreshToken}