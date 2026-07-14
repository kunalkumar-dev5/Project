import doctorModel from "../models/doctorModel.js"

const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body

        if (!docId) {
            return res.json({ success: false, message: "Doctor ID not provided" })
        }

        const doctor = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !doctor.available })
        res.json({ success: true, message: "Availability Changed Successfully" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors: doctors.length ? doctors : fallbackDoctors })
    } catch (error) {
        console.log(error)
        res.json({ success: true, doctors: fallbackDoctors, message: error.message })
    }
}

export { changeAvailability, doctorList }