import "dotenv/config";

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",").map((origin) =>
  origin.trim(),
);
if (!ALLOWED_ORIGINS) {
  throw new Error("Missing ALLOWED_ORIGINS environment variable."); // Handle this error in your production code.
}
export const corsOptions = {
  origin: ALLOWED_ORIGINS, // or your frontend domain
  credentials: true, // ✅ allow cookies
  methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "X-Requested-With",
  ],
};
