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
export { changeAvailability }