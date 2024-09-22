import logDetails from "../models/log.js";

const loggingMiddleware = (req, res, next) => {
    const startTime = Date.now();

    res.on('finish', async () => {
        const log = new logDetails({
            method: req.method,
            url: req.url,
            ip: req.ip,
            responseTime: Date.now() - startTime,
        });
        await log.save();
    });

    next();
};

export default loggingMiddleware;
