import express, { Request, Response } from "express";
import multer from 'multer';
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { check } from "express-validator";
import { HotelType } from "../shared/types";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 5 * 1024 * 1024 //5MB
    }
})

router.post("/", 
    verifyToken, 
    [
        check("name").notEmpty().withMessage("Name is required"),
        check("city").notEmpty().withMessage("City is required"),
        check("country").notEmpty().withMessage("Country is required"),
        check("description").notEmpty().withMessage("Description is required"),
        check("type").notEmpty().withMessage("Hotel type is required"),
        check("pricePerNight").notEmpty().isNumeric().withMessage("Price per night is required and must be a number"),
        check("facilities").notEmpty().isArray().withMessage("Facilities are required"),
    ], 
    upload.array("imageFiles", 6), 
    async (req: Request, res: Response) => {

        try {
            const imageFiles = req.files as Express.Multer.File[];
            const newHotel: HotelType = req.body;

            const uploadPromises = imageFiles.map(async (image) => {
                const b64 = Buffer.from(image.buffer).toString("base64");
                let dataURI = "data:" + image.mimetype + ";base64," + b64;

                const res = await cloudinary.v2.uploader.upload(dataURI);
                return res.url;
            });

            const imageUrls = await Promise.all(uploadPromises);
            newHotel.imageUrls = imageUrls;
            newHotel.lastUpdated = new Date();
            newHotel.userId = req.userId;

            const hotel = new Hotel(newHotel);
            await hotel.save();

            res.status(201).send(hotel);

        } catch (error) {
            console.log("Error creating hotel: ", error);
            res.status(500).json({message: "Something went wrong"});
        }
    }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {

    try {
        const hotels = await Hotel.find({userId: req.userId}); 
        res.json(hotels);

    } catch (error) {
        console.log("Error fetching hotels: ", error);
        res.status(500).json({message: "Something went wrong"});
    }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {

    const id = req.params.id.toString();

    try {
        const hotel = await Hotel.findOne({_id: id, userId: req.userId});
        res.json(hotel);

    } catch (error) {
        console.log("Error fetching hotel: ", error);
        res.status(500).json({message: "Something went wrong"});
    }
});

router.put("/:hotelId", verifyToken, upload.array("imageFiles"), async (req: Request, res: Response) => {

    try {
        const updatedHotel: HotelType = req.body;
        updatedHotel.lastUpdated = new Date();

        const hotel = await Hotel.findOneAndUpdate({ _id: req.params.hotelId, userId: req.userId }, updatedHotel, { new: true });

        if(!hotel) {
            return res.status(404).json({message : "Hotel not found"});
        }

        const files = req.files as Express.Multer.File[];
        const uploadPromises = files.map(async (image) => {
            const b64 = Buffer.from(image.buffer).toString("base64");
            let dataURI = "data:" + image.mimetype + ";base64," + b64;

            const res = await cloudinary.v2.uploader.upload(dataURI);
            return res.url;
        });

        const updatedImageUrls = await Promise.all(uploadPromises);

        hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])];

        await hotel.save();

        res.status(200).json(hotel);

    } catch (error) {
        console.log("Error updating hotel: ", error);
        res.status(500).json({message: "Something went wrong"});
    }
});

export default router;