import nodemailer from 'nodemailer';

export const SendEmail = async (req, res) => {

    const data = req.body;
    const { firstName, lastName, email, message } = req.body;
    console.log("Email data : ", data);

    let sender = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const name = firstName + ' ' + lastName;

    const text = `
        You’ve received a new customer query from the SkillSpring website.

        👤 Name: ${name} 
        📧 Email: ${email}

        📝 Message:
        ${message}
        ---

        Please reply directly to the user's email to respond.
    `

    let mail = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "📩 New Customer Query from SkillSpring Contact Form",
        text,
        replyTo: email
    };

    try {
        const info = await sender.sendMail(mail);
        return res.status(200).json({
            success: true,
            data: info.response
        });
    }
    catch (error) {
        console.log("Email error:", error);
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }


}