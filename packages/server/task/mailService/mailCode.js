import moment from 'moment';
let date = moment();
let year = date.format('YYYY');
import config from 'config';
/**
 * + This is for the task Assignment mail template.
 * @param {*} userData
 * @returns
 */

export let taskAssignmentMail = (userData,task) => {
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
                               
    
                                <h2 style="text-align:center; margin-bottom: 25px; font-size: 20px;">New Task Added to ${config.get('productName')}!</h2>
    
                                <p style="text-align: left; font-size: 1rem;">Hello ${userData?.firstName},</p>
                                <p style="text-align: justify; font-size: 1rem;">We are here to inform you about the new task <b>${task?.taskTitle} </b> has been added to your ${config.get('productName')} and are ready to be assigned to your team members. It would help you to enhance project management and streamline task distribution within your organization.</p>
                                <p style="text-align: left; font-size: 1rem;">${config.get('productName')} makes project and task management easy, ensuring that everyone stays aligned and aware of their responsibilities. Feel free to explore the features designed to improve collaboration and productivity..</p>
    
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
    
    </html>`
};



