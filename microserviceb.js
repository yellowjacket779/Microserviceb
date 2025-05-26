require("dotenv").config();
const zmq = require("zeromq");

async function runServer() {
  const sock = new zmq.Reply();

  await sock.bind("tcp://*:6002");
  while (1) {
    const [msg] = await sock.receive();
    console.log(msg.toString());
    const messageStr = msg.toString(); // Convert from Buffer to string
    console.log("Received message:", messageStr);

    const [lat, lon] = messageStr.split(",");
    console.log("\n");

    getWeatherForecast(lat, lon, sock);
  }
}


async function getWeatherForecast(lat, lon, sock) {
  let url =
    "https://api.open-meteo.com/v1/forecast?latitude=" +
    lat +
    "&longitude=" +
    lon +
    "&daily=weather_code,temperature_2m_max,precipitation_probability_max,temperature_2m_min&temperature_unit=fahrenheit";
  console.log("URL ", url);
  const response = await fetch(url);
  if (response) {
    const jsonResult = await response.json();
    console.log("Full Json ::", jsonResult);
    var son = JSON.stringify(jsonResult);
    await sock.send(son);
  }
}

runServer();
