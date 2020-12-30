exports.registerEmailParams = (email, token) => {
  // Send email parameters
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<html>
                <h1>Verify your email address</h1>
                <p>Please use the following link to complete your registration</p>
                <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                </html>`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Complete your registration",
      },
    },
  };
};

exports.forgotPasswordEmailParams = (email, token) => {
  // Send email parameters
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<html>
                <h1>Reset Password Link</h1>
                <p>Please use the following link to reset your password</p>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                </html>`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Reset password link",
      },
    },
  };
};
// linkPublishedParams
exports.linkPublishedParams = (email, data) => {
  // Send email parameters
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<html>
                <h1>New link published! | reactawsmongo.com</h1>
                <p>A new link titled <b>${
                  data.title
                }</b> has been published for the following categories:</p>
                

                ${data.categories
                  .map((c) => {
                    return `
                  <div>
                    <h2>${c.name}</h2>
                    <img src="${c.image.url}" alt="${c.name}" style="height:50px"/>
                    <h3><a href="${process.env.CLIENT_URL}/links/${c.slug}">Click here for more information!</a></h3>
                  </div>
                  `;
                  })
                  .join("------------")}

                  <br />

                  <p>Do not wish to received these notifications?</p>
                  <p>Turn off notifications by going to your <b>dashboard</b> > <b>update profile</b> and <b>uncheck the categories</b></p>
                  <p>${process.env.CLIENT_URL}/user/profile/update</p>
                </html>`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "New link published",
      },
    },
  };
};
