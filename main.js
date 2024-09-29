import { createTransport } from "nodemailer";
import { readFile } from "fs/promises";
import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const data = await readFile("email-config.json", "utf-8");
const config = JSON.parse(data);

const user = config.user;
const pass = config.pass;

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

let receiver = "";
let subject = "";
let text = "";

function init() {
  rl.question("Introduce el receptor del correo:\n\n", (inputReceiver) => {
    if (!inputReceiver) {
      console.log("No introduciste un correo");
      rl.close();
      return;
    }
    receiver = inputReceiver;

    rl.question("Introduce el asunto del correo: \n\n", (inputSubject) => {
      if (!inputSubject) console.log("Se enviará un asunto vacío");

      subject = inputSubject;

      rl.question("Introduce el texto del correo: \n\n", (inputText) => {
        text = inputText;
        sendEmail();
        rl.close();
      });
    });
  });
}

const sendEmail = () => {
  const mailOptions = {
    from: user,
    to: receiver,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) console.log(err);
    else console.log(`Correo electrónico enviado: ${data.response}`);
  });
};

init();
