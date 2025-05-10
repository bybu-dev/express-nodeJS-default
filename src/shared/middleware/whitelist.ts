import { Request, Response } from "express";

// Define blocklist middleware
const blocklist = ['192.168.1.1']; // Example IP addresses and ranges to block

const WhitelistMiddleware = (req: Request, res: Response, next: () => any) => {
    try {
        const userIP = req.ip; // Get user's IP address
        // Check if user's IP is not in the white list
        // if (!blocklist.includes(userIP)) {
        //     return res.status(403).send('Access forbidden');
        // }
        // Proceed to next middleware if IP is not blacklisted
        next();
    } catch (error) {
        res.status(500).json({ status: false, noToken: true, message: "unable to authenticate request" });
    }
}

export default WhitelistMiddleware;