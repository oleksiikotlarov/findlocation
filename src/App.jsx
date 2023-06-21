import { useState, useEffect } from "react";
import { gsap } from "gsap";
import Map from "./Map";
import spinner from "./assets/spinner.svg";

function getIPAddress(callback) {
  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      const ipAddress = data.ip;
      callback(ipAddress);
    })
    .catch((error) => {
      console.log(error);
      callback(null);
    });
}

async function getData(ipAddress) {
  try {
    const response = await fetch(`http://ip-api.com/json/${ipAddress}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

function App() {
  const [mapOpen, setMapOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mainLoading, setMainLoading] = useState(true);
  const [data, setData] = useState({});
  const [ip, setIp] = useState();
  const [countdown, setCountdown] = useState(30);
  const [buttonPosition, setButtonPosition] = useState({ x: '0px', y: '0px' });

  useEffect(() => {
    if (!ip) {
      setMainLoading(true);
      getIPAddress(function (ipAddress) {
        if (ipAddress) {
          setIp(ipAddress);
          setMainLoading(false);
        } else {
          console.log("Unable to retrieve the IP address.");
        }
      });
    }
  }, []);

  useEffect(() => {
    let countdownInterval;

    if (!mainLoading && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [mainLoading, countdown]);

  const handleButtonPositionChange = () => {
    if (countdown > 0) {
      const randomX = Math.random() * 600 - 500 + 'px';
      const randomY = Math.random() * 400 - 300 + 'px';
      setButtonPosition({ x: randomX, y: randomY });
    }
  };


  const handleButtonClick = async () => {
    setIsLoading(true);
    if (!ip) return;
    const data = await getData(ip);
    setData(data);
    if (!data) {
      console.log(1);
    }
    setIsLoading(false);
    setMapOpen(true);



    const tl = gsap.timeline({ defaults: { duration: 5 } });

    tl.from(".dataScreen", {
      opacity: 0,
      y: -100,
      scale: 0.5,
      rotation: 720,
      ease: "power4.out",
    })
      .from(
        ".grid p",
        {
          opacity: 0,
          scale: 0,
          rotation: -360,
          stagger: 0.2,
          x: () => gsap.utils.random(-200, 200),
          y: () => gsap.utils.random(-200, 200),
          ease: "power4.out",
        },
        "-=0.4"
      )
      .from(".grid p", {
        rotation: () => gsap.utils.random(-360, 360),
        duration: 1.2,
        ease: "elastic.out(1, 0.4)",
      });
  };

  return (
    <>
      <div className="wrapper">
        <a href="/">
          <h1>Find yourself</h1>
        </a>
      </div>
      {mainLoading ? (
        <div className="main">
          <img src={spinner} alt="Spinner" />
          <p>Searching for YOU</p>
        </div>
      ) : (
        <div>
          {mapOpen ? (
            <div className="dataScreen">
              {isLoading ? (
                <img src={spinner} alt="Spinner" />
              ) : (
                <>
                  <Map data={data} />
                  <div className="grid">
                    <p>Your ip: {data.query}</p>
                    <p>City: {data.city}</p>
                    <p>Zip code: {data.zip}</p>
                    <p>Country: {data.country}</p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div>
              <div className="timer">{countdown}</div>
              <div className="main">
                {countdown > 0 && (
                  <button
                  className="random-button"
                  onClick={handleButtonPositionChange}
                  style={{
                    '--random-x': buttonPosition.x,
                    '--random-y': buttonPosition.y,
                  }}
                    >
                      <div>Find my location</div>
                    
                  </button>
                )}
                {countdown === 0 && (
                  <button onClick={handleButtonClick}>
                    {isLoading ? (
                      <img src={spinner} alt="Spinner" />
                    ) : (
                      <div>Find my location</div>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
