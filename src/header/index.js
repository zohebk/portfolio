import React, { useState, useEffect } from "react";
import "./style.css";
import { VscGrabber, VscClose } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { logotext, socialprofils } from "../content_option";


const Headermain = () => {
  const [isActive, setActive] = useState("false");
  const [time, setTime] = useState("00:00");

  const handleToggle = () => {
    setActive(!isActive);
    document.body.classList.toggle("ovhidden");
  };

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3002');

    socket.addEventListener('open', () => {
      console.log('Connected to WebSocket server');
    });

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      const newTime = new Date(data.timestamp);
      const formattedDate = newTime.toLocaleString();
      setTime(formattedDate);
    });

    return () => {
      socket.close();
    };
  }, []);

  const increaseTime = async () => {
    const response = await fetch("http://localhost:3001/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({message:"hi"}), // Send newsTitle in the body
    });
  }

  return (
    <>
      <header className="fixed-top site__header">
        <div className="d-flex align-items-center justify-content-between">
          <Link className="navbar-brand nav_ac" to="/">
            {logotext}
          </Link>
          <p>{time}</p>
          <button onClick={() => increaseTime()}>Increase Time</button>
          <div className="d-flex align-items-center">

            <button className="menu__button  nav_ac" onClick={handleToggle}>
              {!isActive ? <VscClose /> : <VscGrabber />}
            </button>

          </div>
        </div>

        <div className={`site__navigation ${!isActive ? "menu__opend" : ""}`}>
          <div className="bg__menu h-100">
            <div className="menu__wrapper">
              <div className="menu__container p-3">
                <ul className="the_menu">
                  <li className="menu_item ">
                    <Link onClick={handleToggle} to="/" className="my-3">Home</Link>
                  </li>
                  <li className="menu_item">
                    <Link onClick={handleToggle} to="/crisis" className="my-3">CrisisPage</Link>
                  </li>
                  <li className="menu_item">
                    <Link onClick={handleToggle} to="/contact" className="my-3"> Contact</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="menu_footer d-flex flex-column flex-md-row justify-content-between align-items-md-center position-absolute w-100 p-3">
            <div className="d-flex">
              <a href={socialprofils.facebook}>Facebook</a>
              <a href={socialprofils.github}>Github</a>
              <a href={socialprofils.twitter}>Twitter</a>
            </div>
            <p className="copyright m-0">copyright __ {logotext}</p>
          </div>
        </div>
      </header>
      <div className="br-top"></div>
      <div className="br-bottom"></div>
      <div className="br-left"></div>
      <div className="br-right"></div>

    </>
  );
};

export default Headermain;
