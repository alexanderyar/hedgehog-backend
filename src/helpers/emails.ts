export const verifyMail = (verificationToken: string) => {
  return `<div
      style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 30px;
        border-radius: 15px;
        color: #fafafa;
        background-color: #2A2C36;
      "
    >
      <b>
        Congratulations! You have signed up for HedgehogInChina DB. Follow the link to
        complete registration
      </b>
      <a
        target="_blank"
        href="${process.env.BASE_URL}/api/auth/verify/${verificationToken}"
        style="
          box-sizing: border-box;
          width: 400px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 12px;
          padding: 20px;
          border-radius: 6px;
          background-color: #8baa36;
          text-decoration: none;
          color: #fafafa;
        "
        ><b>Click to verify email</b></a
      >
    </div>`;
};
export const accessDataMail = (password: string) => {
  return `<div style="
        padding: 20px;
        border-radius: 6px;
        background-color: #2a2c36;
        text-align: center;
      ">
        <p style="color: #fafafa">
          <span  style="color: #fafafa">Congratulations! You have signed up for So Yummy.</span>
          <br />
          Your password: 
          <b style=" color: #8baa36 ">${password}</b>
        </p>
      </div>`;
};
