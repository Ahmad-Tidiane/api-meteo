const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

dotenv.config({ path: './config/config.env' });

connectDB();

const weatherRoute = require('./routes/weather');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Weather API",
            version: "1.0.0",
            description: "A simple Express Weather API"
        },
        servers: [
            {
                url: 'http://localhost:5000'
            }
        ]
    },
    apis: ["./routes/*.js"]
}

const specs = swaggerJsDoc(options);


const app = express();



app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(weatherRoute);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))



const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log('The server is running on port ' + PORT))