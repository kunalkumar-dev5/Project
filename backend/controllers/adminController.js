
import validator from "validator";
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from "../models/doctorModel.js";
import jwt from 'jsonwebtoken'

// API FOR ADDING DOCTOR
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;

        const imageFile = req.file
        const feeValue = Number(fees)

        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !address || !imageFile || !Number.isFinite(feeValue) || feeValue <= 0) {
            return res.json({ success: false, message: "All fields are required and fees must be greater than 0" });
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // validating password format
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password (minimum 8 characters)" });
        }

        // hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const parsedAddress = (() => {
            try {
                return JSON.parse(address)
            } catch {
                return address
            }
        })()

        const normalizedAddress = (() => {
            const rawAddress = parsedAddress && typeof parsedAddress === 'object' ? parsedAddress : {}
            return {
                line1: rawAddress.line1 ?? rawAddress.address1 ?? '',
                line2: rawAddress.line2 ?? rawAddress.address2 ?? ''
            }
        })()

        //Doctor data
        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fee: feeValue,
            address: normalizedAddress,
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({ success: true, message: "Doctor Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
    }
}

//  API for the admin login

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, message: "Admin Login Successful", token })
        } else {
            res.json({ success: false, message: "Invalid Credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password -__v').lean()
        const normalizedDoctors = doctors.map((doctor) => {
            const fee = doctor.fee ?? doctor.fees ?? 0
            return {
                ...doctor,
                fee,
                fees: fee
            }
        })
        res.json({ success: true, doctors: normalizedDoctors })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addDoctor, loginAdmin, allDoctors }