import React from 'react'
import { assets } from '../../assets/assets'

const AddDoctor = () => {
  return (
    <form >
      <p>Add Doctor</p>
      <div>
        <div>
          <label htmlFor="">
            <img src={assets.upload_area} alt="" />
          </label>
          <input type="file" id="doc-img" hidden />
          <p>Upload Doctor <br />picture</p>
        </div>

        <div>
          <div>
            <div>
              <p>Doctor name</p>
              <input type="text" placeholder='Name' required />
            </div>

            <div>
              <p>Doctor Email</p>
              <input type="email" placeholder='Email' required />
            </div>

            <div>
              <p>Doctor Password</p>
              <input type="password" placeholder='Password' required />
            </div>

            <div>
              <p>Experience</p>
              <select name="" id="">
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="4 Years">4 Years</option>
                <option value="5 Years">5 Years</option>
                <option value="6 Years">6 Years</option>
                <option value="7 Years">7 Years</option>
                <option value="8 Years">8 Years</option>
                <option value="9 Years">9 Years</option>
                <option value="10 Years">10 Years</option>
              </select>
            </div>

            <div>
              <p>Fees</p>
              <input type="number" placeholder='Fees' required />
            </div>
          </div>

          <div>
            <div>
              <p>Speciality</p>
              <select>
                <option value="General Physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div>
              <p>Education</p>
              <input type="text" placeholder='Education' required />
            </div>

            <div>
              <p>Address</p>
              <input type="text" placeholder='Address 1' required />
              <input type="text" placeholder='Address 2' required />
            </div>
          </div>
        </div>

        <div>
          <p>About Doctor</p>
          <textarea placeholder='write About Doctor' rows={5} required></textarea>
        </div>

        <button>Add Doctor</button>
      </div>
    </form>
  )
}

export default AddDoctor
