import rateLimit from 'express-rate-limit';

export default rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30,
  message:
    'Too many requests created from this IP, please try again in 5 minutes 😜',
});
