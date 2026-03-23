import config from 'config';
import moment from 'moment';
let date = moment();
let year = date.format('YYYY');

/**
 * + This is for the Verification mail template.
 * @param {*} userData
 * @returns
 */
export let verificationMail = userData => {
    return `<!DOCTYPE html>
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
                                      line-height: 1.6;"> Hello ${userData?.firstName
        }, for signing up to EmpMonitor WorkManagement.<br/> Please confirm your email address and start exploring our industry-leading employee monitoring solution.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0 11px;">
                                        <a href="${config.get('user_mail_verify_link')}=${userData?.emailValidateToken}&userMail=${userData?.email}&orgId=${userData?.orgId
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
                                        font-weight: 500;">Copyright @2022 - ${year} EmpMonitor | All Rights Reserved.</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </body>
                
                </html>`;
};

/**
 * + This is for the Welcome mail template.
 * @param {*} userData
 * @returns
 */

export let WelComeMail = userData => {
    return `


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
                               
    
                                <h2 style="text-align:center; margin-bottom: 25px; font-size: 20px;">Welcome to ${config.get('productName')}</h2>
    
                                <p style="text-align: left; font-size: 1rem;">Hello ${userData?.firstName},</p>
                                <p style="text-align: justify; font-size: 1rem;">We are thrilled to welcome you to ${config.get('productName')}, your all-in-one solution for efficient and effective workforce management. As a new member of our platform, you're about to experience a host of features designed to streamline employee monitoring, enhance productivity, and contribute to a thriving workplace environment.</p>
    
                                <p style="text-align: left; font-size: 1rem;">To get started, simply log in using your credentials <a href=${config.get('siteLogin')} target="_blank" style="    text-decoration: none;
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
                                               border-collapse: collapse; padding: 10px;"><p style="    color: #171717; font-size: 14px;">${userData?.email}</p></td>
                                           </tr>
                                           <tr>
                                               <td style="  border: 1px solid #ccc;
                                               border-collapse: collapse; padding: 10px;"><p style="font-size: 14px; font-weight: 600; color: #3876fb;">Password</p></td>
                                               <td style="  border: 1px solid #ccc;
                                               border-collapse: collapse; padding: 10px;"><p style="    color: #171717; font-size: 14px;">${userData?.password}</p></td>
                                           </tr>
                                            <tr>
                                               <td style="  border: 1px solid #ccc;
                                               border-collapse: collapse; padding: 10px;"><p style="font-size: 14px; font-weight: 600; color: #3876fb;">Organization Id</p></td>
                                               <td style="  border: 1px solid #ccc;
                                               border-collapse: collapse; padding: 10px;"><p style="    color: #171717; font-size: 14px;">${userData?.orgId}</p></td>
                                           </tr>
                                       </tbody>
                                       
                                    </table>
                                </div>
                                
    
                                <p style="text-align: justify; font-size: 1rem;">We recommend exploring our user guides and tutorials available in the Help section to acquaint yourself with the platform's features.</p>
    
                                <p style="text-align: justify; margin-bottom: 2rem; font-size: 1rem;">Thank you for choosing ${config.get('productName')} as your workforce management solution. We look forward to supporting your organization's growth and success.</p>
    
                                <p style="text-align: left; font-size: 1rem; font-weight: 500;">Best Regards,
                                   
                                    </p>
                                <p style="text-align: left; font-size: 1rem; margin: 0;">
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
    
    </html>`;
};

export let forgetPassword = userData => {
    return `


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
                               
    
                                <h2 style="text-align:center; margin-bottom: 25px; font-size: 20px;">Reset your ${config.get('productName')} password!</h2>
    
                                <p style="text-align: left; font-size: 1rem;">Hello ${userData?.firstName},</p>
                                <p style="text-align: justify; font-size: 1rem;">We noticed that you're having trouble logging into your ${config.get('productName')} account. Not to worry! We're here to help you regain access to your account and get back to managing your employee activities seamlessly.</p>
    
                                <p style="text-align: left; font-size: 1rem;"><span style="font-weight: 600;">Click on the link below to visit the ${config.get('productName')} password reset page.</p>
    
                                <p style="display: inline-block; text-align: left;"> 
                                <a href="${config.get('user_mail_forgotPassword_verify_link')}=${userData?.forgotPasswordToken}&userMail=${userData?.email}&orgId=${userData?.orgId}" target="_blank" style="
                                    text-decoration: none;
                                    font-size: 0.9rem;
                                    font-weight: 500;
                                    background: green;
                                    color: #fff;
                                    padding: 10px 20px;
                                    border-radius: 20px;
                                    cursor: pointer;">Password Reset Link</a>
                                </p>
    
                                <p style="text-align: justify; font-size: 1rem;">On the page, enter the email address associated with your ${config.get('productName')} account. You would receive a verification mail on your inbox. After the confirmation, you'll be able to create a new password for your account.  
                                </p>
                                <p style="text-align: justify; font-size: 1rem;">Make sure to choose a strong and secure password that you'll remember. 
                                </p>
    
                                
                                <p style="text-align: left; font-size: 1rem; margin: 0; ">
                                    If you encounter any difficulties or have questions, feel free to reach out to our support team at <a href="https://support@empmonitor.com" target="_blank" style="    text-decoration: none;
                                    color: #3850f9;
                                    font-weight: 500;
                                    cursor: pointer;">support@empmonitor.com</a>.
                                </p> 
    
                                <p style="text-align: justify; font-weight: 500; margin-bottom: 1rem; font-size: 1rem;">Please note:</p>
    
                           
    
                                    <ul style="text-align: left; font-size: 1rem; margin: 0; margin-bottom: 1rem;">
                                        <li>If you did not initiate this password reset, please disregard this email.</li>
    
                                        <li>Ensure that you create a strong, unique password to secure your account.</li>
                                    </ul>
       
    
                                <p style="text-align: left; font-size: 1rem; font-weight: 500;">Best regards,
                                   
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
    
    </html>`;
};

export let invitationRejectedMail = (userData,adminData) => {
    return `
    
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
                               
    
                                <h2 style="text-align:center; margin-bottom: 25px; font-size: 20px;">${config.get('productName')} Invitation Declined
                                </h2>
    
                                <p style="text-align: left; font-size: 1rem;">Dear ${adminData?.firstName},</p>
    
                                <p style="text-align: justify; font-size: 1rem;">I hope this message finds you well. We regret to inform you that the invitation to join ${config.get('productName')}, which you extended to ${userData.firstName}, has been declined.</p>
    
                                <p style="text-align: left; font-size: 1rem;">While we understand that this may not have been the expected outcome, please be assured that we are here to support you. </p>
    
                                
                                <p style="text-align: left; font-size: 1rem; margin: 0; ">
                                    If you have any questions or require further assistance in the future, please do not hesitate to reach out to our dedicated support team at <a href="https://support@empmonitor.com" target="_blank" style="    text-decoration: none;
                                    color: #3850f9;
                                    font-weight: 500;
                                    cursor: pointer;">support@empmonitor.com .</a> We are committed to helping you make the most of ${config.get('productName')} and ensuring a smooth experience for your organization.
                                </p> 
                                
                                
                                <p style="text-align: left; font-size: 1rem;">We understand that concerns about privacy and autonomy may have influenced your decision. Rest assured, ${config.get('productName')} is designed with these considerations in mind. Our platform respects employees' privacy and focuses on optimizing workflows rather than intrusive monitoring.</p>
                             
                             
                              
    
                                   
    
                                <p style="text-align: left; font-size: 1rem; font-weight: 500;">Thank you for your understanding, and we appreciate your continued trust in EmpMonitor
          
                                   
                                </p>
                                
                                <p style="text-align: left; font-size: 1rem; margin: 0; ">
                                    Best Regards,
                                    </p>
                            <p style="text-align: left; font-size: 1rem; margin: 0; ">
                                ${config.get('productName')} Support Team
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
    
    </html>`;
}