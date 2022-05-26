import express, {Application, Request, Response} from "express";
import AWS from "aws-sdk";

const app: Application = express();
const PORT: number = 443;
const FROM_EMAIL_ADDRESS = "nick.simone100@gmail.com";
const TO_EMAIL_ADDRESS = FROM_EMAIL_ADDRESS;

AWS.config.loadFromPath("./config.json");
const ses = new AWS.SES();

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});

app.post("/sendEmail", (req: Request, res: Response) => {

    const name: string | undefined = req.body?.name;
    const email: string | undefined = req.body?.email;
    const message: string | undefined = req.body?.message;

    if (!name || !email || !message) {
        return res.status(400).json({message: "missing a name/email/message!"});
    }

    const emailBody = `

    <h3>New Contact Form:<h3>
    <p>
    name: ${name}<br>
    <br>
    email: ${email}<br>
    <br>
    message: ${message}<br>
    </p>

    `;

    const params = {
        Source: FROM_EMAIL_ADDRESS,
        Destination: {
          ToAddresses: [
            TO_EMAIL_ADDRESS
          ],
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: emailBody,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: `Contact request from ${name}`,
          }
        },
      };

      ses.sendEmail(params).promise().then((response) => {
        console.log(response);
      });

    return res.status(200).end();
});
