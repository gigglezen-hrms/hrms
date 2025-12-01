const { z } = require("zod");

exports.loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

exports.refreshSchema = z.object({
  body: z.object({
    refresh_token: z.string().min(10),
  }),
});

exports.forgotSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

exports.resetSchema = z.object({
  body: z.object({
    token: z.string(),
    password: z.string().min(8),
  }),
});

exports.logoutSchema = z.object({
  body: z.object({
    refresh_token: z.string(),
  }),
});
