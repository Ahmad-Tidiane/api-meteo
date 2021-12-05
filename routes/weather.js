const express = require('express');
const router = express.Router();
const nanoid = require('nanoid');

const Weather = require('../model/weather');
const Location = require('../model/loc');


/**
 * @swagger
 * components:
 *  schemas:
 *      Location:
 *          type: object
 *          required: 
 *              -name
 *              -latitude
 *              -longitude
 *              -weather
 *          properties:
 *              -_id:
 *                  type: string
 *                  description : Auto-generated id
 *              -name:
 *                  type: string
 *                  description : Name of the location
 *              -latitude: 
 *                  type : string
 *                  description : latitude of the location
 *              -longitude: 
 *                  type : string
 *                  description : longitude of the location
 *              -weather: 
 *                  type : object
 *                  description : weather of the location
 *          example :
 *              name : Rufisque
 *              latitude : 13.345
 *              longitude : -17.234
 *              humidite: 2
 *              vitesse_vent : 22
 *              temperature : 20
 *     
 * 
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      Weather:
 *          type: object
 *          required: 
 *              -temperature
 *              -vitesse_vent
 *              -humidite
 *          properties:
 *              -_id:
 *                  type: string
 *                  description : Auto-generated id
 *              -temperature:
 *                  type: string
 *                  description : Name of the location
 *              -humidite: 
 *                  type : string
 *                  description : latitude of the location
 *              -vitesse_vent: 
 *                  type : string
 *                  description : longitude of the location
 *          example :
 *              temperature : 29
 *              vitesse_vent : 20
 *              humidite : 2
 *     
 * 
 */





/**
 * @swagger
 * /api/v1/location:
 *  post:
 *      summary: create a new location and weather
 *      
 *      requestBody:
 *          required: true
 *          content: 
 *           application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Location'
 *      responses:
 *          201:
 *              description: success
 *     
 * 
 */

router.post(`${process.env.API}/location`, async (req, res) => {
    const { name, latitude, longitude, temperature, vitesse_vent, humidite, date } = req.body;

    try {
        const weather = await Weather.create({ temperature, vitesse_vent, humidite, date });
        const loc = await Location.create({ name, latitude, longitude, weather });

        res.status(201).json({ success: true, data: loc })
    } catch (e) {
        res.status(400).json({ success: false, message: e.message })
    }

})

/**
 * @swagger
 * /api/v1/weather/{idLocation}/{date}:
 *  get:
 *      summary: Return the weather of a location in a specific date
 *      parameters:
 *          - in : path
 *            name : idLocation
 *            schema : 
 *              type : string
 *          - in : path
 *            name : date
 *            schema : 
 *              type : string
 *      responses:
 *          200:
 *              description: success
 *     
 * 
 */

router.get(`${process.env.API}/weather/:idLocation/:date`, async (req, res) => {

    const idLocation = req.params.idLocation;
    const date = new Date(req.params.date);

    try {
        const loc = await Location.findById(idLocation).populate('weather');

        const weather = await Weather.find({ _id: loc.weather._id.toString() })
        if (!loc) {
            return res.status(404).json({ success: false, message: "No record found" })
        }


        if (!weather) {
            return res.status(404).json({ success: false, message: "No weather data found" })
        }

        res.status(200).json({ success: true, data: weather })
    } catch (e) {
        res.status(400).json({ success: false, message: e.message })
    }

})



/**
 * @swagger
 * /api/v1/location/{id}:
 *  put:
 *      summary: update the location 
 *      parameters:
 *          - in : path
 *            name : id
 *            schema : 
 *              type : string
 * 
 *      requestBody:
 *          required: true
 *          content: 
 *           application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Location'
 *                  
 *      responses:
 *          200:
 *              description: success
 *     
 * 
 */

router.put(`${process.env.API}/location/:id`, async (req, res) => {

    const { latitude, longitude, name } = req.body
    try {
        const loc = await Location.findByIdAndUpdate(req.params.id, { name, latitude, longitude }, { new: true, runValidators: true })

        if (!loc) {
            return res.status(404).json({ success: false, message: "No record found" })
        }

        res.status(200).json({ success: true, message: "info mis à jour", data: loc })
    } catch (e) {
        res.status(400).json({ success: false, message: e.message })
    }
});

/**
 * @swagger
 * /api/v1/location/{id}:
 *  delete:
 *      summary: delete a location 
 *      parameters:
 *          - in : path
 *            name : id
 *            schema : 
 *              type : string
 * 
 *                  
 *      responses:
 *          200:
 *              description: success
 *     
 * 
 */

router.delete(`${process.env.API}/location/:id`, async (req, res) => {
    try {
        const loc = await Location.findByIdAndDelete(req.params.id)

        if (!loc) {
            return res.status(404).json({ success: false, message: "No record found" })
        }

        res.status(200).json({ success: true, message: "localite supprimé" })
    } catch (e) {
        res.status(400).json({ success: false, message: e.message })
    }
});

/**
 * @swagger
 * /api/v1/location:
 *  get:
 *      summary: get all location and weather
 *      responses:
 *          200:
 *              description: success
 *     
 * 
 */

router.get(`${process.env.API}/location`, async (req, res) => {

    try {
        const loc = await Location.find({});

        res.status(200).json({ success: true, data: loc });
    } catch (e) {
        res.status(400).json({ success: false, message: e.message })
    }
})




module.exports = router;
