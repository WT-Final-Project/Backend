// Load environment variables from .env file
require("dotenv").config();

// Import Supabase client
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client using the environment variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Export the supabase client to be used in other files
module.exports = supabase;
