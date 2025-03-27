import nodemailer from 'nodemailer';

// Tạo transporter cho Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dunghqph33551@fpt.edu.vn',
    pass: 'peut qngo ivwo gftj'  
  }
});

// Hàm gửi email
export const sendEmail = async (email, emailMessage) => {
  try {
    const mailOptions = {
      from: 'WD20@gmail.com',
      to: email,
      subject: 'Phản Hồi Liên Hệ Của Bạn',
      text: emailMessage
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
