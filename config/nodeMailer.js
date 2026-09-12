import nodemailer from "nodemailer";
import express from "express"
import dotenv from "dotenv/config"
const emailPassword = process.env.email_password;

export const accountEmail ="pcpc1122334456@gmail.com"
export const transporter= nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:accountEmail,
        pass:emailPassword
    }
})



