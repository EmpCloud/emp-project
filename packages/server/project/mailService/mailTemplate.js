import sendGridMail from '@sendgrid/mail';
import config from 'config';
import moment from 'moment';
import fs from 'fs/promises';
import path from 'path';

class MailService {
    async sendAdminVerificationMail(mailData) {
        sendGridMail.setApiKey(config.get('sendgrid.key'));
        let bulkEmail = [];
        const mailPromise = mailData.map(data => {
            let email = {
                from: {
                    name: config.get('sendgrid.name'),
                    email: config.get('sendgrid.email'),
                },
                to: data?.email,
                subject: config.get('admin_verification_mail_subject'),
                html: `<html xmlns="http://www.w3.org/1999/xhtml">
                
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                    <link href="https://fonts.googleapis.com/css2?family=Comfortaa&display=swap" rel="stylesheet" />
                    <link rel="icon" href="https://empmonitor.com/wp-content/uploads/2019/03/empmonitor_icon.png" />
                    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" integrity="sha512-5A8nwdMOWrSz20fDsjczgUidUBR8liPYU+WymTZP1lmY9G6Oc7HlZv156XqnsgNUzTyMefFTcsFH/tnJE/+xBg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                    <title>EmpMonitor</title>
                
                   
                </head>
                
                
                <body style="background: #fff">
                    <div style="
                    /* background-image: url('power_email_temp_bg.png');
                    background-size: cover;
                    background-repeat: no-repeat; */
                        max-width: 650px;
                        margin: auto;
                        box-shadow: 0px 6px 15px #e9effc;
                        border-radius: 40px;
                        font-family: 'Poppins', sans-serif;
                      ">
                        <table style="
                          margin: auto;
                          width: 100%;
                          font-size: 14px;
                          border-spacing: 0px;
                          border-radius: 0px 20px 0px 0px;
                          background: #fff;
                          margin-bottom: 20px;
                        " cellspacing="0" cellpadding="0" border="0" ;>
                            <tbody style="
                            background-image: url('https://empmonitor.com/wp-content/uploads/2023/08/BG.png');
                            background-size: cover;
                            background-repeat: no-repeat;
                            background-position: center;">
                            
                            
                                
                                <tr>
                                    <td>
                
                                        <div style="padding: 30px 25px;
                                        margin-bottom: 25px;
                                        /* background-image: url('') !important; */
                                        background-size: cover !important;
                                        background-repeat: no-repeat;
                                        background-position: center;
                                        border-radius: 20px;
                                        /* background: red; */
                                        /* max-width: 389px; */
                                        /* width: 100%; */
                                        margin: 0 33px;
                                        background: white;
                                        border: 0;
                                        box-shadow: 0px 7px 17px 4px #0000002e;
                                        margin-top: 2rem;
                                        ">
                                            
                                            <div style="text-align: center;">
                                                <img src="https://app.empmonitor.com/assets/images/logos/323176aaf7bb6da5259e901f3b81bdcc.png" alt=""  style=" margin-bottom: 20px; margin-top: 20px; width: 220px;">
                                            </div>
                                           
                
                                            <h2 style="text-align:center; margin-bottom: 25px; font-size: 20px;">Verify Your Email for EmpMonitor ${config.get('productName')} Account</h2>
                
                                            <p style="text-align: left; font-size: 1rem;">Hello ${data?.firstName},</p>
                                            <p style="text-align: justify; font-size: 1rem;">Welcome to EmpMonitor ${config.get(
                                                'productName'
                                            )}! We're thrilled to have you join our platform to empower your organization's workforce management and productivity. To get started, we need to verify your admin account.</p>
                                            <p style="text-align: left; font-size: 1rem;">Please confirm your account by clicking the link below:</p>
                
                                            <p style="display: inline-block; text-align: left;"> 
                                            <a href="${config.get('admin_mail_verify_link')}=${data?.emailValidateToken}&adminMail=${data?.email}&orgId=${data?.orgId}" target="_blank" style="
                                                text-decoration: none;
                                                font-size: 0.9rem;
                                                font-weight: 500;
                                                background: #465cfe;
                                                color: #fff;
                                                padding: 10px 20px;
                                                border-radius: 20px;
                                                cursor: pointer;">Verify My Admin Account</a>
                                            </p>
                
                                            <p style="text-align: justify; font-size: 1rem;">This ensures access to EmpMonitor's features - real-time monitoring, productivity insights, and a lot more.</p>
                
                                            <p style="text-align: justify; margin-bottom: 2rem; font-size: 1rem;">If you didn't sign up, ignore this email. Reach us at <a href="https://support@empmonitor.com" target="_blank" style="    text-decoration: none;
                                                color: #3850f9;
                                                font-weight: 500;
                                                cursor: pointer;">support@empmonitor.com.</a></p>
                
                                            <p style="text-align: left; font-size: 1rem; font-weight: 500;">Thanks,
                                               
                                                </p>
                                          
                                            <p style="text-align: left; font-size: 1rem; margin: 0; ">
                                                EmpMonitor Team
                                                </p>
                
                    
                                        </div>
                                    </td>
                                </tr>
                
                                <tr>
                                    <td>
                                        <div style="width: 100%; margin: auto;" class="media-footer">
                                            <div style="
                                                display: flex;
                                                justify-content: space-between;
                                                align-content: center;
                                                gap: 30px;
                                                margin: auto;
                                                /* background: #fff; */
                                                padding: 15px;
                                                /* border-top: 1px solid #bfbfbf; */
                                                width: 100%;
                                                margin-top: 20px;
                                                
                                                 ">
                                                <table style="margin: auto">
                                                    <tbody>
                                                        <tr>
                                                      <td>
                                                        <div style="width: 100%;margin: auto;margin-top: 10px;margin-bottom: 0px;" class="media-footer">
                                                            <div style="display: flex;justify-content: space-between;align-content: center;gap: 30px;margin: auto;">
                                                                <table style="margin: auto">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>
                                                                                <div style="margin: 10px;">
                                                                                    <a href="https://www.facebook.com/EmpMonitor/" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2020/01/f_icon.png" style="width: 30px;"></a>
                                                                                </div>
                                                                            </td>
                                
                                
                                                                            <td>
                                                                                <div style="margin: 10px;">
                                                                                    <a href="https://www.linkedin.com/company/empmonitor/" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2020/04/linkedin.png" style="width: 30px;"></a>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div style="margin: 10px;">
                                                                                    <a href="https://www.youtube.com/channel/UCh2X5vn5KBkN-pGY5PxJzQw" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2020/04/youtube.png" style="width: 30px;"></a>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div style="margin: 10px;">
                                                                                    <a href="https://twitter.com/empmonitor" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2020/01/t_icon.png" style="width: 30px;"></a>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div style="margin: 10px;">
                                                                                    <a href="skype:empmonitorsupport" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2022/11/skype_icon.png" style="width: 30px;"></a>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                      </td>
                                                           
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="100%" height="20" style="
                                margin: 0;
                                font-size: 14px;
                                /* color: #000; */
                                font-family: 'comfortaa', sans-serif;
                                line-height: 18px;
                                text-align: center;
                                /* background: #000000c7; */
                                background: #0a577c;
                                padding: 14px;
                                border-radius: 0px 0px 0px 0px;
                                color: #fff;
                              ">
                                        Copyright@2023 EmpMonitor, all Rights reserved
                                    </td>
                                </tr>
                               
                                
                               
                            </tbody>
                        </table>
                
                
                
                
                
                
                
                <!-- 
                        <table style="
                          margin: auto;
                          width: 100%;
                          font-size: 14px;
                          border-spacing: 0px;
                          border-radius: 0px 20px 0px 0px;
                          /* background: #fff; */
                        " cellspacing="0" cellpadding="0" border="0" ;>
                            <tbody> -->
                
                
                               
                            <!-- </tbody>
                        </table> -->
                    </div>
                </body>
                
                </html>`,
            };
            return email;
        });
        bulkEmail = await Promise.all(mailPromise);
        let sendStatus = await sendGridMail.send(bulkEmail);
        return sendStatus;
    }

    async sendWelcomeMailAdminBySendgridAPI(data) {
        sendGridMail.setApiKey(config.get('sendgrid.key'));
        const email = {
            from: {
                name: config.get('sendgrid.name'),
                email: config.get('sendgrid.email'),
            },
            to: data?.email,
            subject: config.get('admin_welcome_mail_subject'),
            html: `
            <html xmlns="http://www.w3.org/1999/xhtml">
            
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Comfortaa&display=swap" rel="stylesheet" />
                <link rel="icon" href="https://empmonitor.com/wp-content/uploads/2019/03/empmonitor_icon.png" />
                <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" integrity="sha512-5A8nwdMOWrSz20fDsjczgUidUBR8liPYU+WymTZP1lmY9G6Oc7HlZv156XqnsgNUzTyMefFTcsFH/tnJE/+xBg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                <title>EmpMonitor</title>
            
               
            </head>
            
            
            <body style="background: #fff">
                <div style="
                /* background-image: url('power_email_temp_bg.png');
                background-size: cover;
                background-repeat: no-repeat; */
                    max-width: 650px;
                    margin: auto;
                    box-shadow: 0px 6px 15px #e9effc;
                    border-radius: 40px;
                    font-family: 'Poppins', sans-serif;
                  ">
                    <table style="
                      margin: auto;
                      width: 100%;
                      font-size: 14px;
                      border-spacing: 0px;
                      border-radius: 0px 20px 0px 0px;
                      background: #fff;
                      margin-bottom: 20px;
                    " cellspacing="0" cellpadding="0" border="0" ;>
                        <tbody style="
                        background-image: url('https://empmonitor.com/wp-content/uploads/2023/08/BG.png');
                        background-size: cover;
                        background-repeat: no-repeat;
                        background-position: center;">
                        
                        
                            
                            <tr>
                                <td>
            
                                    <div style="padding: 30px 25px;
                                    margin-bottom: 25px;
                                    /* background-image: url('') !important; */
                                    background-size: cover !important;
                                    background-repeat: no-repeat;
                                    background-position: center;
                                    border-radius: 20px;
                                    /* background: red; */
                                    /* max-width: 389px; */
                                    /* width: 100%; */
                                    margin: 0 33px;
                                    background: white;
                                    border: 0;
                                    box-shadow: 0px 7px 17px 4px #0000002e;
                                    margin-top: 2rem;
                                    ">
                                        
                                        <div style="text-align: center;">
                                            <img src="https://app.empmonitor.com/assets/images/logos/323176aaf7bb6da5259e901f3b81bdcc.png" alt=""  style=" margin-bottom: 20px; margin-top: 20px; width: 220px;">
                                        </div>
                                       
            
                                        <h2 style="text-align:center; margin-bottom: 25px; font-size: 20px;">Welcome to EmpMonitor ${config.get('productName')}</h2>
            
                                        <p style="text-align: left; font-size: 1rem;">Hello ${data?.firstName},</p>
                                        <p style="text-align: justify; font-size: 1rem;">We are thrilled to welcome you to EmpMonitor ${config.get(
                                            'productName'
                                        )}, your all-in-one solution for efficient and effective workforce management. As a new member of our platform, you're about to experience a host of features designed to streamline employee monitoring, enhance productivity, and contribute to a thriving workplace environment.</p>
            
                                        <p style="text-align: left; font-size: 1rem;">To get started, simply log in using your credentials <a href="${config.get(
                                            'siteLogin'
                                        )}" target="_blank" style="    text-decoration: none;
                                            color: #3850f9;
                                            font-weight: 500;
                                            cursor: pointer;">here</a></p>
            
                                        <div>
                                            <table style="  border: 1px solid #ccc;
                                            border-collapse: collapse;
                                            margin: auto;">
                                               <tbody style="background: #f4f7ff;">
                                                   <tr>
                                                       <td style="  border: 1px solid #ccc;
                                                       border-collapse: collapse; padding: 10px;"><p style="font-size: 14px; font-weight: 600; color: #3876fb;">Email id</p></td>
                                                       <td style="  border: 1px solid #ccc;
                                                       border-collapse: collapse; padding: 10px;"><p style="    color: #171717; font-size: 14px;">${data?.email}</p></td>
                                                   </tr>
                                                   <tr>
                                                       <td style="  border: 1px solid #ccc;
                                                       border-collapse: collapse; padding: 10px;"><p style="font-size: 14px; font-weight: 600; color: #3876fb;">Password</p></td>
                                                       <td style="  border: 1px solid #ccc;
                                                       border-collapse: collapse; padding: 10px;"><p style="    color: #171717; font-size: 14px;">${data?.password}</p></td>
                                                   </tr>
                                                   <tr>
                                                       <td style="  border: 1px solid #ccc;
                                                       border-collapse: collapse; padding: 10px;"><p style="font-size: 14px; font-weight: 600; color: #3876fb;">Organization Id</p></td>
                                                       <td style="  border: 1px solid #ccc;
                                                       border-collapse: collapse; padding: 10px;"><p style="    color: #171717; font-size: 14px;">${data?.orgId}</p></td>
                                                   </tr>
                                                   
                                               </tbody>
                                               
                                            </table>
                                        </div>
                                        
            
                                        <p style="text-align: justify; font-size: 1rem;">We recommend exploring our user guides and tutorials available in the Help section to acquaint yourself with the platform's features.</p>
            
                                        <p style="text-align: justify; margin-bottom: 2rem; font-size: 1rem;">Thank you for choosing EmpMonitor as your workforce management solution. We look forward to supporting your organization's growth and success.</p>
            
                                        <p style="text-align: left; font-size: 1rem; font-weight: 500;">Best Regards,
                                           
                                            </p>
                                        <p style="text-align: left; font-size: 1rem; margin: 0;">
                                            EmpMonitor
                                   
                                            </p>
                                      
            
                
                                    </div>
                                </td>
                            </tr>
            
            
                            <tr>
                                <td>
                                    <div style="width: 100%; margin: auto;" class="media-footer">
                                        <div style="
                                            display: flex;
                                            justify-content: space-between;
                                            align-content: center;
                                            gap: 30px;
                                            margin: auto;
                                            /* background: #fff; */
                                            padding: 15px;
                                            /* border-top: 1px solid #bfbfbf; */
                                            width: 100%;
                                            margin-top: 20px;
                                            
                                             ">
                                            <table style="margin: auto">
                                                <tbody>
                                                    <tr>
                                                  <td>
                                                    <div style="width: 100%;margin: auto;margin-top: 10px;margin-bottom: 0px;" class="media-footer">
                                                        <div style="display: flex;justify-content: space-between;align-content: center;gap: 30px;margin: auto;">
                                                            <table style="margin: auto">
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            <div style="margin: 10px;">
                                                                                <a href="https://www.facebook.com/EmpMonitor/" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2020/01/f_icon.png" style="width: 30px;"></a>
                                                                            </div>
                                                                        </td>
                            
                            
                                                                        <td>
                                                                            <div style="margin: 10px;">
                                                                                <a href="https://www.linkedin.com/company/empmonitor/" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2020/04/linkedin.png" style="width: 30px;"></a>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div style="margin: 10px;">
                                                                                <a href="https://www.youtube.com/channel/UCh2X5vn5KBkN-pGY5PxJzQw" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2020/04/youtube.png" style="width: 30px;"></a>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div style="margin: 10px;">
                                                                                <a href="https://twitter.com/empmonitor" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2020/01/t_icon.png" style="width: 30px;"></a>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div style="margin: 10px;">
                                                                                <a href="skype:empmonitorsupport" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2022/11/skype_icon.png" style="width: 30px;"></a>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                  </td>
                                                       
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="100%" height="20" style="
                            margin: 0;
                            font-size: 14px;
                            /* color: #000; */
                            font-family: 'comfortaa', sans-serif;
                            line-height: 18px;
                            text-align: center;
                            /* background: #000000c7; */
                            background: #0a577c;
                            padding: 14px;
                            border-radius: 0px 0px 0px 0px;
                            color: #fff;
                          ">
                                    Copyright@2023 EmpMonitor, all Rights reserved
                                </td>
                            </tr>
                           
                            
                           
                        </tbody>
                    </table>
            
            
            
            
            
            
            
            <!-- 
                    <table style="
                      margin: auto;
                      width: 100%;
                      font-size: 14px;
                      border-spacing: 0px;
                      border-radius: 0px 20px 0px 0px;
                      /* background: #fff; */
                    " cellspacing="0" cellpadding="0" border="0" ;>
                        <tbody> -->
            
            
                           
                        <!-- </tbody>
                    </table> -->
                </div>
            </body>
            
            </html>`,
        };
        let sendStatus = await sendGridMail.send(email);
        return sendStatus;
    }

    async sendAdminVerificationTokenMail(mailData) {
        sendGridMail.setApiKey(config.get('sendgrid.key'));
        let bulkEmail = [];
        const mailPromise = mailData.map(data => {
            let email = {
                from: {
                    name: config.get('sendgrid.name'),
                    email: config.get('sendgrid.email'),
                },
                to: data?.email,
                subject: config.get('admin_forgot_password_subject'),
                html: `


                <html xmlns="http://www.w3.org/1999/xhtml">
                
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                    <link href="https://fonts.googleapis.com/css2?family=Comfortaa&display=swap" rel="stylesheet" />
                    <link rel="icon" href="https://empmonitor.com/wp-content/uploads/2019/03/empmonitor_icon.png" />
                    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" integrity="sha512-5A8nwdMOWrSz20fDsjczgUidUBR8liPYU+WymTZP1lmY9G6Oc7HlZv156XqnsgNUzTyMefFTcsFH/tnJE/+xBg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                    <title>EmpMonitor</title>
                
                   
                </head>
                
                
                <body style="background: #fff">
                    <div style="
                    /* background-image: url('power_email_temp_bg.png');
                    background-size: cover;
                    background-repeat: no-repeat; */
                        max-width: 650px;
                        margin: auto;
                        box-shadow: 0px 6px 15px #e9effc;
                        border-radius: 40px;
                        font-family: 'Poppins', sans-serif;
                      ">
                        <table style="
                          margin: auto;
                          width: 100%;
                          font-size: 14px;
                          border-spacing: 0px;
                          border-radius: 0px 20px 0px 0px;
                          background: #fff;
                          margin-bottom: 20px;
                        " cellspacing="0" cellpadding="0" border="0" ;>
                            <tbody style="
                            background-image: url('https://empmonitor.com/wp-content/uploads/2023/08/BG.png');
                            background-size: cover;
                            background-repeat: no-repeat;
                            background-position: center;">
                            
                            
                                
                                <tr>
                                    <td>
                
                                        <div style="padding: 30px 25px;
                                        margin-bottom: 25px;
                                        /* background-image: url('') !important; */
                                        background-size: cover !important;
                                        background-repeat: no-repeat;
                                        background-position: center;
                                        border-radius: 20px;
                                        /* background: red; */
                                        /* max-width: 389px; */
                                        /* width: 100%; */
                                        margin: 0 33px;
                                        background: white;
                                        border: 0;
                                        box-shadow: 0px 7px 17px 4px #0000002e;
                                        margin-top: 2rem;
                                        ">
                                            
                                            <div style="text-align: center;">
                                                <img src="https://app.empmonitor.com/assets/images/logos/323176aaf7bb6da5259e901f3b81bdcc.png" alt=""  style=" margin-bottom: 20px; margin-top: 20px; width: 220px;">
                                            </div>
                                           
                
                                            <h2 style="text-align:center; margin-bottom: 25px; font-size: 20px;">Reset Your EmpMonitor Password</h2>
                
                                            <p style="text-align: left; font-size: 1rem;">Hello ${data?.firstName},</p>
                                            <p style="text-align: justify; font-size: 1rem;">If you've forgotten your EmpMonitor password, don't worry – we're here to help you regain access to your account.</p>
                                            <p style="text-align: left; font-size: 1rem;"><span style="font-weight: 600;">Visit the Password Reset Page: </span> Click on the link below to access the password reset page.</p>
                
                                            <p style="display: inline-block; text-align: left;"> 
                                            <a href="${config.get('admin_forgot_password_link')}=${data?.forgotPasswordToken}&userMail=${data?.email}&orgId=${data?.orgId}" target="_blank" style="
                                                text-decoration: none;
                                                font-size: 0.9rem;
                                                font-weight: 500;
                                                background: green;
                                                color: #fff;
                                                padding: 10px 20px;
                                                border-radius: 20px;
                                                cursor: pointer;">Reset Password</a>
                                            </p>
                
                                            <p style="text-align: justify; font-size: 1rem;">On the page, enter the email address associated with your EmpMonitor account. You would receive a verification mail on your inbox. After the confirmation, you'll be able to create a new password for your account. 
                                            </p>
                
                                            <p style="text-align: justify; font-weight: 500; margin-bottom: 1rem; font-size: 1rem;">Please note:</p>
                
                                       
                
                                                <ul style="text-align: left; font-size: 1rem; margin: 0; margin-bottom: 1rem;">
                                                    <li>If you did not initiate this password reset, please disregard this email.</li>
                
                                                    <li>Ensure that you create a strong, unique password to secure your account.</li>
                                                </ul>
                
                                            <p style="text-align: left; font-size: 1rem; margin: 0; ">
                                                If you encounter any difficulties or have questions, feel free to reach out to our support team at <a href="https://support@empmonitor.com" target="_blank" style="    text-decoration: none;
                                                color: #3850f9;
                                                font-weight: 500;
                                                cursor: pointer;">support@empmonitor.com</a>.
                                            </p>    
                
                                            <p style="text-align: left; font-size: 1rem; font-weight: 500;">Thanks,
                                               
                                            </p>
                                      
                                        <p style="text-align: left; font-size: 1rem; margin: 0; ">
                                            EmpMonitor Team
                                            </p>
                    
                                        </div>
                                    </td>
                                </tr>
                
                                <tr>
                                    <td>
                                        <div style="width: 100%; margin: auto;" class="media-footer">
                                            <div style="
                                                display: flex;
                                                justify-content: space-between;
                                                align-content: center;
                                                gap: 30px;
                                                margin: auto;
                                                /* background: #fff; */
                                                padding: 15px;
                                                /* border-top: 1px solid #bfbfbf; */
                                                width: 100%;
                                                margin-top: 20px;
                                                
                                                 ">
                                                <table style="margin: auto">
                                                    <tbody>
                                                        <tr>
                                                      <td>
                                                        <div style="width: 100%;margin: auto;margin-top: 10px;margin-bottom: 0px;" class="media-footer">
                                                            <div style="display: flex;justify-content: space-between;align-content: center;gap: 30px;margin: auto;">
                                                                <table style="margin: auto">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>
                                                                                <div style="margin: 10px;">
                                                                                    <a href="https://www.facebook.com/EmpMonitor/" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2020/01/f_icon.png" style="width: 30px;"></a>
                                                                                </div>
                                                                            </td>
                                
                                
                                                                            <td>
                                                                                <div style="margin: 10px;">
                                                                                    <a href="https://www.linkedin.com/company/empmonitor/" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2020/04/linkedin.png" style="width: 30px;"></a>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div style="margin: 10px;">
                                                                                    <a href="https://www.youtube.com/channel/UCh2X5vn5KBkN-pGY5PxJzQw" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2020/04/youtube.png" style="width: 30px;"></a>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div style="margin: 10px;">
                                                                                    <a href="https://twitter.com/empmonitor" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2020/01/t_icon.png" style="width: 30px;"></a>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div style="margin: 10px;">
                                                                                    <a href="skype:empmonitorsupport" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2022/11/skype_icon.png" style="width: 30px;"></a>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                      </td>
                                                           
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="100%" height="20" style="
                                margin: 0;
                                font-size: 14px;
                                /* color: #000; */
                                font-family: 'comfortaa', sans-serif;
                                line-height: 18px;
                                text-align: center;
                                /* background: #000000c7; */
                                background: #0a577c;
                                padding: 14px;
                                border-radius: 0px 0px 0px 0px;
                                color: #fff;
                              ">
                                        Copyright@2023 EmpMonitor, all Rights reserved
                                    </td>
                                </tr>
                               
                                
                               
                            </tbody>
                        </table>
                
                
                
                
                
                
                
                <!-- 
                        <table style="
                          margin: auto;
                          width: 100%;
                          font-size: 14px;
                          border-spacing: 0px;
                          border-radius: 0px 20px 0px 0px;
                          /* background: #fff; */
                        " cellspacing="0" cellpadding="0" border="0" ;>
                            <tbody> -->
                
                
                               
                            <!-- </tbody>
                        </table> -->
                    </div>
                </body>
                
                </html>`,
            };
            return email;
        });
        bulkEmail = await Promise.all(mailPromise);
        let sendStatus = await sendGridMail.send(bulkEmail);
        return sendStatus;
    }
    async sendUserVerificationMail(mailData) {
        sendGridMail.setApiKey(config.get('sendgrid.key'));
        let bulkEmail = [];
        const mailPromise = mailData.map(data => {
            let email = {
                from: {
                    name: config.get('sendgrid.name'),
                    email: config.get('sendgrid.email'),
                },
                to: data?.email,
                subject: `Emp-WM User Mail Verification`,
                html: `


                <html xmlns="http://www.w3.org/1999/xhtml">
                
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                    <link href="https://fonts.googleapis.com/css2?family=Comfortaa&display=swap" rel="stylesheet" />
                    <link rel="icon" href="https://empmonitor.com/wp-content/uploads/2019/03/empmonitor_icon.png" />
                    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" integrity="sha512-5A8nwdMOWrSz20fDsjczgUidUBR8liPYU+WymTZP1lmY9G6Oc7HlZv156XqnsgNUzTyMefFTcsFH/tnJE/+xBg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                    <title>EmpMonitor</title>
                
                   
                </head>
                
                
                <body style="background: #fff">
                    <div style="
                    /* background-image: url('power_email_temp_bg.png');
                    background-size: cover;
                    background-repeat: no-repeat; */
                        max-width: 650px;
                        margin: auto;
                        box-shadow: 0px 6px 15px #e9effc;
                        border-radius: 40px;
                        font-family: 'Poppins', sans-serif;
                      ">
                        <table style="
                          margin: auto;
                          width: 100%;
                          font-size: 14px;
                          border-spacing: 0px;
                          border-radius: 0px 20px 0px 0px;
                          background: #fff;
                          margin-bottom: 20px;
                        " cellspacing="0" cellpadding="0" border="0" ;>
                            <tbody style="
                            background-image: url('https://empmonitor.com/wp-content/uploads/2023/08/BG.png');
                            background-size: cover;
                            background-repeat: no-repeat;
                            background-position: center;">
                            
                            
                                
                                <tr>
                                    <td>
                
                                        <div style="padding: 30px 25px;
                                        margin-bottom: 25px;
                                        /* background-image: url('') !important; */
                                        background-size: cover !important;
                                        background-repeat: no-repeat;
                                        background-position: center;
                                        border-radius: 20px;
                                        /* background: red; */
                                        /* max-width: 389px; */
                                        /* width: 100%; */
                                        margin: 0 33px;
                                        background: white;
                                        border: 0;
                                        box-shadow: 0px 7px 17px 4px #0000002e;
                                        margin-top: 2rem;
                                        ">
                                            
                                            <div style="text-align: center;">
                                                <img src="https://app.empmonitor.com/assets/images/logos/323176aaf7bb6da5259e901f3b81bdcc.png" alt=""  style=" margin-bottom: 20px; margin-top: 20px; width: 220px;">
                                            </div>
                                           
                
                                            <h2 style="text-align:center; margin-bottom: 25px; font-size: 20px;">Join EmpMonitor to start your Workforce Management journey</h2>
                
                                            <p style="text-align: left; font-size: 1rem;">Hello ${data?.firstName},</p>
                                            <p style="text-align: justify; font-size: 1rem;">We are excited to invite you to join EmpMonitor – the ultimate platform for optimizing workforce management, boosting productivity, and creating a thriving workplace environment. As a valued member of our organization, your participation is crucial in enhancing our operational efficiency and overall success.
                                            <p style="text-align: left; font-size: 1rem;"><span style="font-weight: 600;">Click on the link given below to access your EmpMonitor invitation.</p>
                
                                            <p style="display: inline-block; text-align: left;"> 
                                       
                                      <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin-top: 1.5rem; margin-bottom: 2rem;">
                                                <div style="display: inline-block; text-align: left;     width: 90px;
                                                background: #4caf50; border-radius: 8px;
                                                padding: 10px; text-align: center;"> 
                                                    <a href="${config.get('user_mail_verify_link')}=${data?.emailValidateToken}&userMail=${data?.email}&orgId=${
                    data?.orgId
                }&invitation=1" target="_blank" style="
                                                        text-decoration: none;
                                                        font-size: 0.9rem;
                                                        font-weight: 500;
                                                        background: #4caf50;
                                                        color: #fff;
                                                        padding: 10px 20px;
                                                        border-radius: 10px;
                                                        cursor: pointer;">Accept</a>
                                                    </div>
                
                                                    <div  style="display: inline-block; text-align: left;     width: 90px;
                                                    background: #f44336;
                                                    border-radius: 8px;
                                                    padding: 10px; text-align: center;"> 
                                                        <a href="${config.get('user_mail_verify_link')}=${data?.emailValidateToken}&userMail=${data?.email}&orgId=${
                    data?.orgId
                }&invitation=2" target="_blank" style="
                                                            text-decoration: none;
                                                            font-size: 0.9rem;
                                                            font-weight: 500;
                                                            background: #f44336;
                                                            color: #fff;
                                                            padding: 10px 20px;
                                                            border-radius: 10px;
                                                            cursor: pointer;">Reject</a>
                                                        </div>
                                            </div>
                
                
                
                
                
                                            <p style="text-align: justify; font-size: 1rem;">Follow the instructions on the registration page to create your EmpMonitor account and complete your profile. 
                                            </p>
                                            <p style="text-align: justify; font-size: 1rem;">Once registered, you'll have access to a range of powerful features that will help you manage tasks, track productivity, and collaborate seamlessly with your team. 
                                            </p>
                                            <p style="text-align: justify; font-size: 1rem;">Thank you for considering EmpMonitor as your workforce management solution. We look forward to supporting your organization's growth and success.
                                            </p>
                
                                        
                                             
                
                                            <p style="text-align: left; font-size: 1rem; font-weight: 500;">Best Regards,
                                               
                                        <p style="text-align: left; font-size: 1rem; margin: 0; ">
                                            The EmpMonitor Team
                                            </p>
                    
                                        </div>
                                    </td>
                                </tr>
                
                                <tr>
                                    <td>
                                        <div style="width: 100%; margin: auto;" class="media-footer">
                                            <div style="
                                                display: flex;
                                                justify-content: space-between;
                                                align-content: center;
                                                gap: 30px;
                                                margin: auto;
                                                /* background: #fff; */
                                                padding: 15px;
                                                /* border-top: 1px solid #bfbfbf; */
                                                width: 100%;
                                                margin-top: 20px;
                                                
                                                 ">
                                                <table style="margin: auto">
                                                    <tbody>
                                                        <tr>
                                                      <td>
                                                        <div style="width: 100%;margin: auto;margin-top: 10px;margin-bottom: 0px;" class="media-footer">
                                                            <div style="display: flex;justify-content: space-between;align-content: center;gap: 30px;margin: auto;">
                                                                <table style="margin: auto">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>
                                                                                <div style="margin: 10px;">
                                                                                    <a href="https://www.facebook.com/EmpMonitor/" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2020/01/f_icon.png" style="width: 30px;"></a>
                                                                                </div>
                                                                            </td>
                                
                                
                                                                            <td>
                                                                                <div style="margin: 10px;">
                                                                                    <a href="https://www.linkedin.com/company/empmonitor/" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2020/04/linkedin.png" style="width: 30px;"></a>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div style="margin: 10px;">
                                                                                    <a href="https://www.youtube.com/channel/UCh2X5vn5KBkN-pGY5PxJzQw" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2020/04/youtube.png" style="width: 30px;"></a>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div style="margin: 10px;">
                                                                                    <a href="https://twitter.com/empmonitor" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2020/01/t_icon.png" style="width: 30px;"></a>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div style="margin: 10px;">
                                                                                    <a href="skype:empmonitorsupport" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2022/11/skype_icon.png" style="width: 30px;"></a>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                      </td>
                                                           
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="100%" height="20" style="
                                margin: 0;
                                font-size: 14px;
                                /* color: #000; */
                                font-family: 'comfortaa', sans-serif;
                                line-height: 18px;
                                text-align: center;
                                /* background: #000000c7; */
                                background: #0a577c;
                                padding: 14px;
                                border-radius: 0px 0px 0px 0px;
                                color: #fff;
                              ">
                                        Copyright@2023 EmpMonitor, all Rights reserved
                                    </td>
                                </tr>
                               
                                
                               
                            </tbody>
                        </table>
                
                
                
                
                
                
                
                <!-- 
                        <table style="
                          margin: auto;
                          width: 100%;
                          font-size: 14px;
                          border-spacing: 0px;
                          border-radius: 0px 20px 0px 0px;
                          /* background: #fff; */
                        " cellspacing="0" cellpadding="0" border="0" ;>
                            <tbody> -->
                
                
                               
                            <!-- </tbody>
                        </table> -->
                    </div>
                </body>
                
                </html>`,
            };
            return email;
        });
        bulkEmail = await Promise.all(mailPromise);
        let sendStatus = await sendGridMail.send(bulkEmail);
        console.log(`sendStatus`, sendStatus);
        return sendStatus;
    }

    async sendUserForgotPasswordVerificationMail(mailData) {
        sendGridMail.setApiKey(config.get('sendgrid.key'));
        let bulkEmail = [];
        const mailPromise = mailData.map(data => {
            let email = {
                from: {
                    name: config.get('sendgrid.name'),
                    email: config.get('sendgrid.email'),
                },
                to: data?.email,
                subject: `Emp-WM User Mail Verification`,
                html: `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="icon" href="./images/favicon.png">
                    <title>Verify Your Email Address | EmpMonitor</title>
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
                        rel="stylesheet">
                </head>
                
                <body style="margin:0;padding:0;max-width:600px;width:100%;margin:auto;">
                    <div style="max-width:600px;margin:0 auto;font-family: 'Poppins', sans-serif;padding:0;box-shadow: 0px 7px 51px -29px #2b478b;background-image: url('https://empmonitor.com/wp-content/uploads/2022/12/600x700.png');background-repeat: no-repeat;
                        background-size: cover;">
                        <table style="width:100%;border-spacing: 0px;text-align: center;">
                            <tbody>
                                <tr>
                                    <td style="padding: 0;">
                                        <div>
                                            <img src="https://empmonitor.com/wp-content/uploads/2022/12/User_Email_Verification_mail.png" width="100%" />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0 11px;">
                                        <h3 style="margin: 0;
                                        font-weight: 500;
                                        font-size: 1.2rem;
                                        color: #98187f;">Just One More Step!</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0 11px;">
                                        <p style="font-size: .9rem;
                                      margin: 6px 0 0; color: #001d63;
                                      line-height: 1.6;"> Hello ${
                                          data?.firstName
                                      }, Welcome to EmpMonitor WorkManagement.<br/> Please confirm your email address to set your password and start exploring our industry-leading employee monitoring solution.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0 11px;">
                                        <a href="${config.get('user_mail_forgotPassword_verify_link')}=${data?.verifyTokenForNewPassword}&userMail=${data?.email}&orgId=${
                    data?.orgId
                }" target="_blank" style=" margin: 1.3rem auto;
                                       max-width: 182px;
                                        height: 28px;
                                        line-height: 28px;
                                        background: #5e81f1;
                                        padding: 11px;
                                        text-decoration: none;
                                        color: white;
                                        display: block;
                                        border-radius: 7px;
                                        font-size: .9rem;
                                        font-weight: 500;
                                        text-transform: uppercase;
                                        letter-spacing: .1px;
                                        text-shadow: 0px 1px 10px #a5a5a5;">Verify Email Address</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0 11px;">
                                        <p style="font-size: .9rem;color: #001d63;
                                        margin: 8px 0 0;">Monitor and track all your remote and on-site employees in real-time. Download <span style="display: block;
                    font-size: 1rem;
                    color: #d1452b;
                    text-transform: capitalize;">the agent on the host system and supervise the activities</span> of the user screen with the convenience of cloud data storage and robust report generation.</p>
                                    </td>
                                </tr>
                                
                                
                                <tr>
                                    <td style="padding: 0;">
                                        <ul style="display: flex;
                                        background: #1f3b7a;
                                        padding: 21px 10px 7px;
                                        border-top: 8px solid #fab141;
                                        list-style: none;
                                        margin-bottom: 0;">
                                            <li style="text-align: left;
                                            padding-top: 3rem;">
                                                <h3 style="margin: 0;
                                                color: white;
                                                font-weight: 500;
                                                font-size: 1rem;">Regards</h3>
                                                <p style="color: #ffffffdb;
                                                font-size: 0.7rem;
                                                margin: 11px 0 0;">
                                                    Team EmpMonitor
                                                </p>
                                                <a style="font-size: 0.7rem;
                                                color: #fcdd8d;
                                                text-decoration: none;" href="mailto:support@empmonitor.com">support@empmonitor.com</a>
                                                <p style="margin: 2px 0 0;font-size: 0.8rem;white-space: nowrap;">
                                                    <span style="color: #ffffffdb">Skype : </span><span><a style="font-size: 0.7rem; color: #fcdd8d;
                                      text-decoration: none;" href="skype:empmonitorsupport?chat">empmonitorsupport</a></span>
                                                </p>
                                                <ul class="social-icons" style="margin-top:7px;padding-left: 0;
                                                display: flex;
                                                justify-content: flex-start;
                                                align-items: center;
                                                flex-wrap: wrap;
                                                list-style: none;
                                                gap: 3px;
                                              ">
                                                    <li style="    background: #2049a7;
                                                    border-radius: 50%;
                                                    width: 28px;
                                                    height: 28px;
                                                    text-align: center;
                                                    box-shadow: 0px 5px 9px -4px black, inset 0px 4px 3px -4px white, 0px 2px 16px -7px black;
                                                    cursor: pointer;
                                                    border: 2px solid #1f3b7a;
                                                    margin:0;
                                                ">
                                                        <a href="https://www.facebook.com/EmpMonitor/" target="_blank">
                                                            <img src="https://empmonitor.com/wp-content/uploads/2022/12/facebook-3.png" style="
                                                      max-width: 15px;
                                                      max-height: 15px;
                                                      height: 100%;
                                                      width: 100%;    padding-top: 6px;
                                                    " />
                                                        </a>
                                                    </li>
                                                    <li style="    background: #2049a7;
                                                    border-radius: 50%;
                                                    width: 28px;
                                                    height: 28px;
                                                    box-shadow: 0px 5px 9px -4px black, inset 0px 4px 3px -4px white, 0px 2px 16px -7px black;
                                                    cursor: pointer; margin:0;
                                                    border: 2px solid #1f3b7a;    text-align: center;
                                                ">
                                                        <a href="https://twitter.com/empmonitor" target="_blank">
                                                            <img src="https://empmonitor.com/wp-content/uploads/2022/12/twitter.png" style="
                                                      max-width: 15px;
                                                      max-height: 15px;
                                                      height: 100%;
                                                      width: 100%;    padding-top: 6px;
                                                    " />
                                                        </a>
                                                    </li>
                                                    <li style="    background: #2049a7;
                                                    border-radius: 50%;
                                                    width: 28px;
                                                    height: 28px;
                                                    box-shadow: 0px 5px 9px -4px black, inset 0px 4px 3px -4px white, 0px 2px 16px -7px black;
                                                    cursor: pointer; margin:0;
                                                    border: 2px solid #1f3b7a;    text-align: center;
                                                ">
                                                        <a href="https://in.linkedin.com/company/empmonitor?original_referer=https%3A%2F%2Fempmonitor.com%2F"
                                                            target="_blank">
                                                            <img src="https://empmonitor.com/wp-content/uploads/2022/12/linkedin.png" style="
                                                      max-width: 15px;
                                                      max-height: 15px;
                                                      height: 100%;
                                                      width: 100%;
                                                      object-fit: cover;padding-top: 6px;
                                                    " />
                                                        </a>
                                                    </li>
                                                    <li style="    background: #2049a7;
                                                    border-radius: 50%;
                                                    width: 28px;
                                                    height: 28px;
                                                    box-shadow: 0px 5px 9px -4px black, inset 0px 4px 3px -4px white, 0px 2px 16px -7px black;
                                                    cursor: pointer; margin:0;
                                                    border: 2px solid #1f3b7a;    text-align: center;
                                                ">
                                                        <a href="https://www.youtube.com/channel/UCh2X5vn5KBkN-pGY5PxJzQw"
                                                            target="_blank">
                                                            <img src="https://empmonitor.com/wp-content/uploads/2022/12/play-2.png" style="
                                                      max-width: 15px;
                                                      max-height: 15px;
                                                      height: 100%;
                                                      width: 100%;
                                                      object-fit: cover;
                                                      padding-top: 6px;
                                                    " />
                                                        </a>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li style="text-align: right;">
                                                <a style="
                                                  font-size: 0.8rem;
                                                  color: #fcdd8d;
                                                  text-decoration: none;
                                                  cursor: pointer;
                                                "><img style="max-width: 101px; border-radius: 4px" src="https://empmonitor.com/wp-content/uploads/2022/12/qr-code-2.png" /></a>
                                                <h3 style="margin: 0;color: white;font-weight: 500;font-size: 1rem;">Connect with us!
                                                </h3>
                                                <p style="color: #ffffffdb;
                                                font-size: 0.7rem;
                                                margin: 5px 0;
                                                ">
                                                    Scan this QR code and talk to our experts.
                                                </p>
                
                                                <p style="margin: 6px 0 0; font-size: 0.6rem;color: white">
                                                    In case of queries, raise a ticket via the
                                                    <a href="https://help.empmonitor.com/support/solutions" target="_blank"
                                                        style="font-size: 0.6rem; color: #fcdd8d">Help Desk</a>
                                                    of EmpMonitor and our team will get back to you shortly
                                                    after.
                                                </p>
                                            </li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0 11px;
                                    background: #1f3b7a;
                                    border-top: 1px solid #ffffff1a;">
                                        <p style="font-size: .7rem;
                                        margin: 0;
                                        color: white;
                                        padding: 11px;
                                        font-weight: 500;">Copyright @2020 - 2022 EmpMonitor | All Rights Reserved.</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </body>
                
                </html>`,
            };
            return email;
        });
        bulkEmail = await Promise.all(mailPromise);
        let sendStatus = await sendGridMail.send(bulkEmail);
        console.log(`sendStatus`, sendStatus);
        return sendStatus;
    }
    async sendWelcomeMailBySendgridAPI(data) {
        sendGridMail.setApiKey(config.get('sendgrid.key'));
        const email = {
            from: {
                name: config.get('sendgrid.name'),
                email: config.get('sendgrid.email'),
            },
            to: data?.email,
            subject: `Welcome to WorkForceManagement from EmpMonitor`,
            html: `<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="icon" href="./images/favicon.png">
                <title>Account Activated | See you in the EmpMonitor's dashboard!</title>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet">
            </head>
            
            <body style="margin:0;padding:0;max-width:600px;width:100%;margin:auto;">
                <div style="max-width:600px;margin:0 auto;font-family: 'Poppins', sans-serif;padding:0;box-shadow: 0px 7px 51px -29px #2b478b;background-image: url('https://empmonitor.com/wp-content/uploads/2022/12/600x700.png');background-repeat: no-repeat;
                    background-size: cover;">
                    <table style="width:100%;border-spacing: 0px;text-align: center;">
                        <tbody>
                            <tr>
                                <td style="padding: 0;">
                                    <div>
                                        <img src="https://empmonitor.com/wp-content/uploads/2022/12/User_Welcome_Email-1.png"
                                            width="100%" />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 11px;">
                                    <h3 style="margin: 0;
                                    font-weight: 500;
                                    font-size: 1.1rem;">Hi, ${data?.firstName}</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 11px;">
                                    <p style="font-size: .9rem;
                                  margin: 6px 0 0; color: #001d63;
                                  line-height: 1.6;"><span
                                            style="font-size: 1.3rem;color: #5e5dda;text-transform: uppercase;">Welcome</span><br />
                                        on board
                                        to the family of EmpMonitor as role <b>${data?.role}</b> with <b>${data?.permission}</b> Permissions</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 11px;">
                                    <p style="font-size: .9rem;color: #001d63;
                                    margin: 8px 0 0;">We are super excited to share the features we’ve got for you. Keep an extra
                                        eye on your administration through clever insights on the employee productivity matrix and
                                        user-friendly dashboard.</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div style="margin: 1.1rem 0">
                                        <table style=" margin: 2rem auto;
                                        border: 1px solid #e5ebff;
                                        border-collapse: collapse;
                                        box-shadow: 0px 3px 7px -8px;
                                        background: #e4ebff40;
                                              ">
                                            <tbody>
                                                <tr>
                                                    <th style="padding: 0.6rem;
                                                    border-right: 1px solid #f0f0f0;
                                                    color: #0e37bc;
                                                    font-weight: 600;
                                                    font-size: .9rem;
                                                    ">
                                                        Email Id
                                                    </th>
                                                    <td style="padding: 0.6rem;
                                                    min-width: 158px;
                                                    color: #000000;
                                                    font-size: .9rem;">
                                                        <a href="#0" style="    text-decoration: none;
                                                        user-select: none;
                                                        cursor: default;
                                                        color: black;">${data?.email}</a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th style="padding: 0.6rem;
                                                    border-right: 1px solid #f0f0f0;
                                                    color: #0e37bc;
                                                    font-weight: 600;
                                                    font-size: .9rem;
                                                    ">
                                                        Password
                                                    </th>
                                                    <td style="padding: 0.6rem;
                                                    min-width: 158px;
                                                    color: #000000;
                                                    font-size: .9rem;">
                                                        ${data?.password}
                                                    </td>
                                                </tr>
                                                <tr>
                                                <th style="padding: 0.6rem;
                                                border-right: 1px solid #f0f0f0;
                                                color: #0e37bc;
                                                font-weight: 600;
                                                font-size: .9rem;
                                                ">
                                                    Org Id
                                                </th>
                                                <td style="padding: 0.6rem;
                                                min-width: 158px;
                                                color: #000000;
                                                font-size: .9rem;">
                                                    ${data?.orgId}
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
            
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 11px;">
                                    <p style="font-size: .9rem;color: #001d63;
                                    margin: 8px 0 0;">We are confident that it's going to be an awesome journey for both of us!</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 11px;">
                                    <a href="${config.get('user_sign_in_link')}" target="_blank" style=" margin: 1.3rem auto;
                                    max-width: 148px;
                                    height: 28px;
                                    line-height: 28px;
                                    background: #5e81f1;
                                    padding: 11px;
                                    text-decoration: none;
                                    color: white;
                                    display: block;
                                    border-radius: 7px;
                                    font-size: .9rem;
                                    font-weight: 500;
                                    text-transform: uppercase;
                                    letter-spacing: .1px;
                                    text-shadow: 0px 1px 10px #a5a5a5;">Get Started</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 11px;">
                                    <a style="font-size: 1.2rem;
                                    font-weight: 600;
                                    margin: 0.2rem auto 0;
                                    display: block;
                                    color: #f02e2e;
                                    text-transform: uppercase;" href="https://app.empmonitor.com/login"
                                        target="_blank">Click here</a>
                                    <p style="font-size: .9rem;color: #001d63;margin: 8px 0 16px;">in case you are facing any difficulties in logging in.<br />
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 11px;">
                                    <ul style="    padding: 0;
                                   list-style: none;
                                  
                                   margin: 0 auto 1rem;
                                   gap: 12px;">
                                        <li style=" display: inline-block;cursor: pointer;">
                                            <button type="button" style="text-align: center;
                                           padding: 8px;
                                           display: flex;
                                           justify-content: center;
                                           align-items: center;
                                           background: #ffcb7b;
                                           outline: 0;
                                           border: 1px solid white;
                                           border-radius: 6px;    cursor: pointer;">
                                                <div><img style="width: 40px;
                height: 31px;
                object-fit: cover;" src="https://empmonitor.com/wp-content/uploads/2022/12/computer.png" /></div>
                                                <p style="color: black;
                                                margin-left: 7px;">Download Installation Brochure</p>
                                            </button>
            
                                        </li>
                                        <li style="display: inline-block;cursor: pointer;">
                                            <button type="button" style=" text-align: center;
                                        padding: 8px;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        background: #ffcb7b;
                                        outline: 0;
                                        border: 1px solid white;
                                        border-radius: 6px;    cursor: pointer;">
                                                <div><img style="    width: 40px;
                height: 31px;
                object-fit: cover;" src="https://empmonitor.com/wp-content/uploads/2022/12/facebook-7.png" /></div>
                                                <p style=" color: black;
                                                margin-left: 7px;">Watch Onboarding Video</p>
                                            </button>
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0;">
                                    <ul style="display: flex;
                                    background: #1f3b7a;
                                    padding: 21px 10px 7px;
                                    border-top: 8px solid #fab141;
                                    list-style: none;
                                    margin-bottom: 0;">
                                        <li style="text-align: left;
                                        padding-top: 3rem;">
                                            <h3 style="margin: 0;
                                            color: white;
                                            font-weight: 500;
                                            font-size: 1rem;">Regards</h3>
                                            <p style="color: #ffffffdb;
                                            font-size: 0.7rem;
                                            margin: 11px 0 0;">
                                                Team EmpMonitor
                                            </p>
                                            <a style="font-size: 0.7rem;
                                            color: #fcdd8d;
                                            text-decoration: none;" href="mailto:support@empmonitor.com">support@empmonitor.com</a>
                                            <p style="margin: 2px 0 0;font-size: 0.8rem;white-space: nowrap;">
                                                <span style="color: #ffffffdb">Skype : </span><span><a style="font-size: 0.7rem; color: #fcdd8d;
                                  text-decoration: none;" href="skype:empmonitorsupport?chat">empmonitorsupport</a></span>
                                            </p>
                                            <ul class="social-icons" style="margin-top:7px;padding-left: 0;
                                            display: flex;
                                            justify-content: flex-start;
                                            align-items: center;
                                            flex-wrap: wrap;
                                            list-style: none;
                                            gap: 3px;
                                          ">
                                                <li style="    background: #2049a7;
                                                border-radius: 50%;
                                                width: 28px;
                                                height: 28px;
                                                text-align: center;
                                                box-shadow: 0px 5px 9px -4px black, inset 0px 4px 3px -4px white, 0px 2px 16px -7px black;
                                                cursor: pointer;
                                                border: 2px solid #1f3b7a;
                                                margin:0;
                                            ">
                                                    <a href="https://www.facebook.com/EmpMonitor/" target="_blank">
                                                        <img src="https://empmonitor.com/wp-content/uploads/2022/12/facebook-3.png"
                                                            style="
                                                  max-width: 15px;
                                                  max-height: 15px;
                                                  height: 100%;
                                                  width: 100%;    padding-top: 6px;
                                                " />
                                                    </a>
                                                </li>
                                                <li style="    background: #2049a7;
                                                border-radius: 50%;
                                                width: 28px;
                                                height: 28px;
                                                box-shadow: 0px 5px 9px -4px black, inset 0px 4px 3px -4px white, 0px 2px 16px -7px black;
                                                cursor: pointer; margin:0;
                                                border: 2px solid #1f3b7a;    text-align: center;
                                            ">
                                                    <a href="https://twitter.com/empmonitor" target="_blank">
                                                        <img src="https://empmonitor.com/wp-content/uploads/2022/12/twitter.png"
                                                            style="
                                                  max-width: 15px;
                                                  max-height: 15px;
                                                  height: 100%;
                                                  width: 100%;    padding-top: 6px;
                                                " />
                                                    </a>
                                                </li>
                                                <li style="    background: #2049a7;
                                                border-radius: 50%;
                                                width: 28px;
                                                height: 28px;
                                                box-shadow: 0px 5px 9px -4px black, inset 0px 4px 3px -4px white, 0px 2px 16px -7px black;
                                                cursor: pointer; margin:0;
                                                border: 2px solid #1f3b7a;    text-align: center;
                                            ">
                                                    <a href="https://in.linkedin.com/company/empmonitor?original_referer=https%3A%2F%2Fempmonitor.com%2F"
                                                        target="_blank">
                                                        <img src="https://empmonitor.com/wp-content/uploads/2022/12/linkedin.png"
                                                            style="
                                                  max-width: 15px;
                                                  max-height: 15px;
                                                  height: 100%;
                                                  width: 100%;
                                                  object-fit: cover;padding-top: 6px;
                                                " />
                                                    </a>
                                                </li>
                                                <li style="    background: #2049a7;
                                                border-radius: 50%;
                                                width: 28px;
                                                height: 28px;
                                                box-shadow: 0px 5px 9px -4px black, inset 0px 4px 3px -4px white, 0px 2px 16px -7px black;
                                                cursor: pointer; margin:0;
                                                border: 2px solid #1f3b7a;    text-align: center;
                                            ">
                                                    <a href="https://www.youtube.com/channel/UCh2X5vn5KBkN-pGY5PxJzQw"
                                                        target="_blank">
                                                        <img src="https://empmonitor.com/wp-content/uploads/2022/12/play-2.png"
                                                            style="
                                                  max-width: 15px;
                                                  max-height: 15px;
                                                  height: 100%;
                                                  width: 100%;
                                                  object-fit: cover;
                                                  padding-top: 6px;
                                                " />
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li style="text-align: right;">
                                            <a style="
                                              font-size: 0.8rem;
                                              color: #fcdd8d;
                                              text-decoration: none;
                                              cursor: pointer;
                                            "><img style="max-width: 101px; border-radius: 4px"
                                                    src="https://empmonitor.com/wp-content/uploads/2022/12/qr-code-2.png" /></a>
                                            <h3 style="margin: 0;color: white;font-weight: 500;font-size: 1rem;">Connect with us!
                                            </h3>
                                            <p style="color: #ffffffdb;
                                            font-size: 0.7rem;
                                            margin: 5px 0;
                                            ">
                                                Scan this QR code and talk to our experts.
                                            </p>
            
                                            <p style="margin: 6px 0 0; font-size: 0.6rem;color: white">
                                                In case of queries, raise a ticket via the
                                                <a href="https://help.empmonitor.com/support/solutions" target="_blank"
                                                    style="font-size: 0.6rem; color: #fcdd8d">Help Desk</a>
                                                of EmpMonitor and our team will get back to you shortly
                                                after.
                                            </p>
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 11px;
                                background: #1f3b7a;
                                border-top: 1px solid #ffffff1a;">
                                    <p style="font-size: .7rem;
                                    margin: 0;
                                    color: white;
                                    padding: 11px;
                                    font-weight: 500;">Copyright @2020 - 2022 EmpMonitor | All Rights Reserved.</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </body>
            
            </html>`,
        };
        let sendStatus = await sendGridMail.send(email);
        return sendStatus;
    }

    async sendProjectAssignmentMail(userData, project) {
        sendGridMail.setApiKey(config.get('sendgrid.key'));
        let bulkEmail = [];
        const mailPromise = async () => {
            let email = {
                from: {
                    name: config.get('sendgrid.name'),
                    email: config.get('sendgrid.email'),
                },
                to: userData?.email,
                subject: config.get('sendgrid.ProjectAssignmentSubject'),
                html: `<html xmlns="http://www.w3.org/1999/xhtml">

                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                    <link href="https://fonts.googleapis.com/css2?family=Comfortaa&display=swap" rel="stylesheet" />
                    <link rel="icon" href="https://empmonitor.com/wp-content/uploads/2019/03/empmonitor_icon.png" />
                    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" integrity="sha512-5A8nwdMOWrSz20fDsjczgUidUBR8liPYU+WymTZP1lmY9G6Oc7HlZv156XqnsgNUzTyMefFTcsFH/tnJE/+xBg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                    <title>EmpMonitor</title>
                
                   
                </head>
                
                
                <body style="background: #fff">
                    <div style="
                    /* background-image: url('power_email_temp_bg.png');
                    background-size: cover;
                    background-repeat: no-repeat; */
                        max-width: 650px;
                        margin: auto;
                        box-shadow: 0px 6px 15px #e9effc;
                        border-radius: 40px;
                        font-family: 'Poppins', sans-serif;
                      ">
                        <table style="
                          margin: auto;
                          width: 100%;
                          font-size: 14px;
                          border-spacing: 0px;
                          border-radius: 0px 20px 0px 0px;
                          background: #fff;
                          margin-bottom: 20px;
                        " cellspacing="0" cellpadding="0" border="0" ;>
                            <tbody style="
                            background-image: url('https://empmonitor.com/wp-content/uploads/2023/08/BG.png');
                            background-size: cover;
                            background-repeat: no-repeat;
                            background-position: center;">
                            
                            
                                
                                <tr>
                                    <td>
                
                                        <div style="padding: 30px 25px;
                                        margin-bottom: 25px;
                                        /* background-image: url('') !important; */
                                        background-size: cover !important;
                                        background-repeat: no-repeat;
                                        background-position: center;
                                        border-radius: 20px;
                                        /* background: red; */
                                        /* max-width: 389px; */
                                        /* width: 100%; */
                                        margin: 0 33px;
                                        background: white;
                                        border: 0;
                                        box-shadow: 0px 7px 17px 4px #0000002e;
                                        margin-top: 2rem;
                                        ">
                                            
                                            <div style="text-align: center;">
                                                <img src="https://app.empmonitor.com/assets/images/logos/323176aaf7bb6da5259e901f3b81bdcc.png" alt=""  style=" margin-bottom: 20px; margin-top: 20px; width: 220px;">
                                            </div>
                                           
                
                                            <h2 style="text-align:center; margin-bottom: 25px; font-size: 20px;">New Project Added to ${config.get('productName')}!</h2>
                
                                            <p style="text-align: left; font-size: 1rem;">Hello ${userData?.firstName},</p>
                                            <p style="text-align: justify; font-size: 1rem;">We are here to inform you about the new project <b>${
                                                project?.projectName
                                            }</b> has been added to your ${config.get(
                    'productName'
                )} and are ready to be assigned to your team members. It would help you to enhance project management and streamline task distribution within your organization.</p>
                                            <p style="text-align: left; font-size: 1rem;">${config.get(
                                                'productName'
                                            )} makes project and task management easy, ensuring that everyone stays aligned and aware of their responsibilities. Feel free to explore the features designed to improve collaboration and productivity..</p>
                
                                            <p style="text-align: left; font-size: 1rem; margin: 0; ">
                                                If you encounter any difficulties or have questions, feel free to reach out to our support team at <a href="https://support@empmonitor.com" target="_blank" style="    text-decoration: none;
                                                color: #3850f9;
                                                font-weight: 500;
                                                cursor: pointer;">support@empmonitor.com</a>.
                                            </p> 
                
                                          
                
                                               
                
                                            <p style="text-align: left; font-size: 1rem; font-weight: 500;">Thank you for using ${config.get('productName')} to optimize your workforce management!
                                               
                                            </p>
                                        <p style="text-align: left; font-size: 1rem; margin: 0;">
                                            
                                   
                                            </p>
                                        <p style="text-align: left; font-size: 1rem; margin: 0; ">
                                            ${config.get('productName')} Team
                                            </p>
                    
                                        </div>
                                    </td>
                                </tr>
                
                                <tr>
                                    <td>
                                        <div style="width: 100%; margin: auto;" class="media-footer">
                                            <div style="
                                                display: flex;
                                                justify-content: space-between;
                                                align-content: center;
                                                gap: 30px;
                                                margin: auto;
                                                /* background: #fff; */
                                                padding: 15px;
                                                /* border-top: 1px solid #bfbfbf; */
                                                width: 100%;
                                                margin-top: 20px;
                                                
                                                 ">
                                                <table style="margin: auto">
                                                    <tbody>
                                                        <tr>
                                                      <td>
                                                        <div style="width: 100%;margin: auto;margin-top: 10px;margin-bottom: 0px;" class="media-footer">
                                                            <div style="display: flex;justify-content: space-between;align-content: center;gap: 30px;margin: auto;">
                                                                <table style="margin: auto">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>
                                                                                <div style="margin: 10px;">
                                                                                    <a href="https://www.facebook.com/EmpMonitor/" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2020/01/f_icon.png" style="width: 30px;"></a>
                                                                                </div>
                                                                            </td>
                                
                                
                                                                            <td>
                                                                                <div style="margin: 10px;">
                                                                                    <a href="https://www.linkedin.com/company/empmonitor/" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2020/04/linkedin.png" style="width: 30px;"></a>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div style="margin: 10px;">
                                                                                    <a href="https://www.youtube.com/channel/UCh2X5vn5KBkN-pGY5PxJzQw" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2020/04/youtube.png" style="width: 30px;"></a>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div style="margin: 10px;">
                                                                                    <a href="https://twitter.com/empmonitor" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2020/01/t_icon.png" style="width: 30px;"></a>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div style="margin: 10px;">
                                                                                    <a href="skype:empmonitorsupport" target="_blank"><img src="https://empmonitor.com/wp-content/uploads/2022/11/skype_icon.png" style="width: 30px;"></a>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                      </td>
                                                           
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="100%" height="20" style="
                                margin: 0;
                                font-size: 14px;
                                /* color: #000; */
                                font-family: 'comfortaa', sans-serif;
                                line-height: 18px;
                                text-align: center;
                                /* background: #000000c7; */
                                background: #0a577c;
                                padding: 14px;
                                border-radius: 0px 0px 0px 0px;
                                color: #fff;
                              ">
                                        Copyright@2023 EmpMonitor, all Rights reserved
                                    </td>
                                </tr>
                               
                                
                               
                            </tbody>
                        </table>
                
                
                
                
                
                
                
                <!-- 
                        <table style="
                          margin: auto;
                          width: 100%;
                          font-size: 14px;
                          border-spacing: 0px;
                          border-radius: 0px 20px 0px 0px;
                          /* background: #fff; */
                        " cellspacing="0" cellpadding="0" border="0" ;>
                            <tbody> -->
                
                
                               
                            <!-- </tbody>
                        </table> -->
                    </div>
                </body>
                
                </html>`,
            };
            return email;
        };
        bulkEmail = await mailPromise();
        let sendStatus = await sendGridMail.send(bulkEmail);
        return sendStatus;
    }


    async sendAutoGenerateReportMail(attachmentPaths, emails) {
        sendGridMail.setApiKey(config.get('sendgrid.key'));

        const createAttachments = async (paths) => {
            return Promise.all(paths.map(async (filePath) => {
                const content = await fs.readFile(filePath, { encoding: 'base64' });
                return {
                    content: content,
                    filename: path.basename(filePath),
                    type: 'application/octet-stream', // You can customize this based on the file type
                    disposition: 'attachment',
                };
            }));
        };
    
        const attachments = await createAttachments(attachmentPaths);
    
        const email = {
            from: {
                name: config.get('sendgrid.name'),
                email: config.get('sendgrid.email'),
            },
            to: emails,
            subject: config.get('sendgrid.autoReportGenerateSubject'),
            attachments: attachments,
            html: `<!DOCTYPE>
            <html>
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <title>Report Date</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body style="margin: 0; padding: 0;" bgcolor="#f8f8f8">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td style="padding: 10px 0 30px 0;">
                            <table align="center" bgcolor="#f4f7fe" border="0" cellpadding="0" cellspacing="0" width="600"
                                style="border: 5px solid #e6e6e6; border-collapse: collapse;">
                                <tr>
                                    <td align="center">
                                        <img width="200px" src="https://empmonitor.com/wp-content/uploads/2019/03/0K2D_AqW-1.png" style="margin-top:20px;" />
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#f4f7fe" style="padding: 40px 30px 30px 30px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                                    <b></b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 0 30px 0 30px; text-align: right; font-family: Arial, sans-serif;">
                                                    <b>Report Date: </b>${moment().format("YYYY-MM-DD")}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="text-align: center; margin-bottom:30px">
                                            <tr>
                                                <td style="color: #000; font-family: Arial, sans-serif; font-size: 22px; line-height: 2; text-align: center; margin-bottom:30px; font-weight:700">
                                                    Please find the attachment below regarding Emp-monitor Activity Logs Employee Report
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <img src="https://empmonitor.com/wp-content/uploads/2020/06/Windows-amico.png" width="500px">
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" class="center" style="margin: 0; padding-bottom:15px; margin:0; font-family: Lucida Sans Unicode; font-size: 18px; color: #0d1a2b; line-height: 25px;mso-line-height-rule: exactly;">
                                        <span>Regards,<br>
                                            EmpMonitor Support,<br>
                                            support@empmonitor.com<br>
                                            Skype: empmonitorsupport </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#02213e" style="padding: 30px 30px 30px 30px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="text-align: center;">
                                            <tr>
                                                <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; line-height: 2;">
                                                    © EmpMonitor 2024-2025<br />
                                                    Have any questions? Please check out our <a href="http://help.empmonitor.com/" style="color: #adddfb;">Help center.</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <table width="600" cellpadding="0" cellspacing="0" border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td class="spacer" width="10"></td>
                                                            <td width="540">
                                                                <table class="full" align="center" width="300" cellpadding="0" cellspacing="0" border="0"
                                                                    style="margin-top:20px; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td class="center" align="center" style="margin: 0; font-size: 16px; color:#fff; font-family: Verdana, Geneva, sans-serif; line-height: 12px;  mso-line-height-rule: exactly;  padding-bottom: 7px;">
                                                                                <span><b>Stay in touch</b></span>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <table class="full" align="center" width="280" cellpadding="0" cellspacing="0" border="0"
                                                                    style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td class="center" align="center" style="margin: 0; font-size:14px ; color:#aaaaaa; font-family: Helvetica, Arial, sans-serif; line-height: 100%; padding-top: 10px;">
                                                                                <span>
                                                                                    <a style="text-decoration: none;" href="https://www.facebook.com/empmonitorglobal/" target="_blank">
                                                                                        <img src="https://empmonitor.com/wp-content/uploads/2020/01/f_icon.png"
                                                                                            style="width: 40px;">
                                                                                    </a> 
                                                                                    <a href="https://twitter.com/empmonitor" style="text-decoration: none;" target="_blank">
                                                                                        <img src="https://empmonitor.com/wp-content/uploads/2020/01/t_icon.png"
                                                                                            style="width: 40px;">
                                                                                    </a>
                                                                                    <a href="https://www.linkedin.com/company/empmonitor/" target="_blank" style="text-decoration: none;">
                                                                                        <img src="https://empmonitor.com/wp-content/uploads/2020/04/linkedin.png"
                                                                                            style="width: 40px;">
                                                                                    </a>
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>`,
        };
    
        try {
            const sendStatus = await sendGridMail.send(email);
            return sendStatus;
        } catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    };
    
}
export default new MailService();
