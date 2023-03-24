const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');


const DEFAULT_WALLET_MONEY = 500;
const DEFAULT_PAYMENT_OPTION = "PAYMENT_OPTION_DEFAULT";
const DEFAULT_ADDRESSS = "ADDRESS_NOT_SET";

dotenv.config({ path: path.join(__dirname, '../../.env') });// unable to understand this line
//path : The path module provides utilities for working with file and directory paths.
//After importing packages, we're passing .env file location as an option to dotenv package. At the moment we don't have a .env file yet. We'll create later.

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
  })
  .unknown();//unknown(false) will ignore the errors is if joi identifies one more key value pair in env variable 
             //eg name:manohar it will ignore this parameter and allow joi to perform on other known ormentioned params

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);//unable to understand this line
//We validated joi schema and we got destructured 'value' and 'error' variables from joi validation and we give an alias to 'value' variable named 'envVars'.
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  // Set mongoose configuration
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === "test" ? "-test" : ""),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  default_wallet_money: DEFAULT_WALLET_MONEY,
  default_payment_option: DEFAULT_PAYMENT_OPTION,
  default_address: DEFAULT_ADDRESSS,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
  },
};
