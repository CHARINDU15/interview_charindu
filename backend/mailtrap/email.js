import { mailtrapclient,sender} from "../mailtrap/mailtrap.config.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "../mailtrap/emailTemplate.js";

 export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }]

    try{
        const response = await mailtrapclient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}',verificationToken),
            category: "Email Verification"   
        })
        console.log("Email Sent Sucessfully",response);
    }
    catch(error){
        console.log(error);
        throw new Error(`Failed to send verification email:${error}`);

    }
 }

 export const sendWelcomeEmail = async (email, name) => {
    const recipients = [{ email }];

    try{
        const response = await mailtrapclient.send({
        "from": sender,
        "to": recipients,
        "template_uuid": "e1fd1605-d2cb-4152-af63-ef44b0d93d30",
        "template_variables": {
        "company_info_name": "ClaveMaestra",
        "name": name,
        "company_info_address": "456/7, Green Road",
        "company_info_city": "Galle",
        "company_info_zip_code": "80000",
        "company_info_country": "Sri Lanka"
    }
        });
        console.log("Email Sent Sucessfully",response);
    }
    catch(error){
        console.log(error);
        throw new Error(`Failed to send welcome email:${error}`);
    }
 }

 export const sendPasswordResetEmail = async (email, resetURL) => {   
    const recipient = [{ email }];

    try{
        const response = await mailtrapclient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
            category: "Password Reset"   
        })
        console.log("Email Sent Sucessfully",response);
    }
    catch(error){
        console.log(error);
        throw new Error(`Failed to send password reset email:${error}`);
 }
 }

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }];

    try{
        const response = await mailtrapclient.send({
            from: sender,
            to: recipient,
            subject: "Password reset successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset"   
        });
        console.log("Email Sent Sucessfully",response);
    }
    catch(error){
        console.log("Failed to send password reset email: ",error);
        throw new Error(`Failed to send password reset email:${error}`);
    }
}