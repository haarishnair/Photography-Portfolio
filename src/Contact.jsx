import { useState } from "react";
import emailjs from "emailjs-com";

import './styles/Contact.css' 

function Contact() {
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        subject: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;

        const newErrors = validate();
            if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        emailjs
        .sendForm(
            "service_yl2yrdl",
            "template_4yk2d1y",
            form,
            "-k2Hk3_Wv86M_K-ks"
        )
        .then(
            () => {
            setSubmitted(true);
            form.reset(); // clear fields
            setErrors({});
            },
            (error) => {
            console.error("FAILED...", error);
            alert("❌ Something went wrong. Please try again.");
            }
        );
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.subject.trim()) newErrors.subject = "Subject is required";
        if (!formData.message.trim()) newErrors.message = "Message is required";
        return newErrors;
    };

    return (
        <>
            <section className='contact' id='contact'>
                <form onSubmit={handleSubmit}>
                    <p className='contact_title'>Contact Me</p>
                    <div className="contact_info">
                        <div className="contact_row1">
                            <div className="contact_name">
                                <p className="contact_name_title">Name<span style={{ color: "red" }}> *</span></p>
                                <input type="text" name="name" className="contact_name_input" value={formData.name} onChange={handleChange} required/>
                                {errors.name && <p className="error">{errors.name}</p>}
                            </div>
                            <div className="contact_phone">
                                <p className="contact_phone_title">Phone Number<span style={{ color: "red" }}> *</span></p>
                                <input type="text" name="phone" className="contact_phone_input" value={formData.phone} onChange={handleChange} required/>
                                {errors.phone && <p className="error">{errors.phone}</p>}
                            </div>
                        </div>
                        <div className="contact_row2">
                            <p className="contact_subject_title">Subject<span style={{ color: "red" }}> *</span></p>
                            <input type="text" name="subject" className="contact_subject_input" value={formData.subject} onChange={handleChange} required/>
                            {errors.subject && <p className="error">{errors.subject}</p>}
                        </div>
                        <div className="contact_row3">
                            <p className="contact_message_title">Message<span style={{ color: "red" }}> *</span></p>
                            <textarea className="contact_message_input" name="message" value={formData.message} onChange={handleChange} required/>
                            {errors.message && <p className="error">{errors.message}</p>}
                        </div>
                        {submitted && (
                            <p style={{ color: "white" }}>
                            ✅ Thank you for contacting me!
                            </p>
                        )}
                        <button type="submit" className='submit_button'>Submit</button>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Contact