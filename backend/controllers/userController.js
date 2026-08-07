import validator from "validator"
import bcrypt from "bcrypt"
import mongoose from 'mongoose'
import userModel from "../models/userModel.js"
import jwt from "jsonwebtoken"
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'

// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.json({ success: false, message: "All fields are required" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "enter a valid email" })
        }
        // validate strong password 
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters long" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        // _id is the unique identifier for the user in the database

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required" })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }



    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')
        res.json({ success: true, userData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update  user profile
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }
        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {
            // upload image  to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }
        res.json({ success: true, message: "Profile Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointement
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body

        if (!userId) {
            return res.json({ success: false, message: 'User ID not provided' })
        }

        if (!docId) {
            return res.json({ success: false, message: 'Doctor ID not provided' })
        }

        if (!mongoose.isValidObjectId(docId)) {
            return res.json({ success: false, message: 'Invalid doctor ID' })
        }

        if (!slotDate || !slotTime) {
            return res.json({ success: false, message: 'Please select a date and time slot' })
        }

        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData) {
            return res.json({ success: false, message: 'Doctor not found' })
        }

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor not available' })
        }

        const existingAppointment = await appointmentModel.findOne({
            docId,
            slotDate,
            slotTime,
            cancelled: false,
            isCompleted: false
        })

        if (existingAppointment) {
            return res.json({ success: false, message: 'This slot is already booked for this doctor' })
        }

        let slots_booked = docData.slots_booked || {}

        // checking for slot availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot not available' })
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        if (!userData) {
            return res.json({ success: false, message: 'User not found' })
        }

        delete docData.slots_booked

        const normalizedDocData = {
            ...docData.toObject ? docData.toObject() : docData,
            address: {
                line1: docData.address?.line1 ?? docData.address?.address1 ?? '',
                line2: docData.address?.line2 ?? docData.address?.address2 ?? ''
            }
        }

        const appointmentData = {
            userId,
            docId,
            slotDate,
            slotData: slotDate,
            slotTime,
            userData,
            docData: normalizedDocData,
            amount: docData.fee,
            date: Date.now(),
            data: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slot data on docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked: slots_booked })

        res.json({ success: true, message: 'Appointment booked successfully' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {
        const { userId } = req.body || {}
        const appointments = await appointmentModel.find({ userId }).sort({ date: -1 })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body

        if (!appointmentId) {
            return res.json({ success: false, message: 'Appointment ID is required' })
        }

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' })
        }

        // verify appointment user
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot
        const { docId, slotDate, slotTime } = appointmentData
        const doctorData = await doctorModel.findById(docId)

        if (doctorData && doctorData.slots_booked && doctorData.slots_booked[slotDate]) {
            const slots_booked = doctorData.slots_booked
            slots_booked[slotDate] = (slots_booked[slotDate] || []).filter(e => e !== slotTime)
            await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        }

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment }