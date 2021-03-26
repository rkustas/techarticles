import css from "styled-jsx/css";

export default css.global`
  body {
    background-color: lightblue;
    padding-top: 0px;
  }
  body::after {
    background-image: none;
  }
  img {
    width: 200px;
    height: 200px;
  }
  p {
    font-family: "Montserrat", sans-serif;
    font-size: 0.8rem;
    opacity: 0.6;
    margin-top: 10px;
  }

  .card {
    width: 300px;
    min-width: 300px;
    height: auto;
    background: #fff;
    border-radius: 30px;
    position: relative;
    z-index: 10;
    margin: 25px;
    min-height: 356px;
    transition: all 0.25s ease;
    box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.08);
    cursor: pointer;
  }

  .card .con-img {
      width: calc(100% - 60px)
      margin: 0px 30px;
      margin-top: -90px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all .35s ease-out;
  }

  .card img.blur {
      position: absolute;
      filter: blur(15px);
      z-index: -1;
      opacity: .35;
      transform: translate(-10px, 10px) scale(.85);
      transition: all .35s ease-out;
  }

  .card:hover {
    transform: translate(0, -10px);
    box-shadow: 0px 17px 35px 0px rgba(0, 0, 0, 0.07);
  }
  .btn {
      min-width: 60px;
      height: 60px;
      border-radius: 20px;
      backgroung: #fff;
      border: 0px;
      outline: none;
      cursor: pointer;
      z-index: 200;
      margin: 15px;
      box-shadow: 0px 0px 0px 0px rgba(0,0,0,.08);
      transition: all .25s ease;
  }

  @media only screen and (max-width: 768px) {
    .btn {
      display: none;
    }

    section {
      all: initial;
    }
    .con-cards {
      flex-direction: column;
    }

  }

  .btn:hover {
      transform: translate(0, -10px)
      box-shadow: 0px 17px 35px 0px rgba(0,0,0,.07);
  }

  .con-cards {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      overflow: auto;
      padding-top: 100px;
      padding-left: 40px;
      padding-right: 40px;
      scroll-behavior: smooth;
  }

  .con-cards::-webkit-scrollbar {
    height: 0px;
  }

  .con-cards:after {
    content: '';
    display: block;
    min-width: 20px;
    height: 100px;
    position: relative;
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .card:hover .con-img {
    transform: translate(0, -15px);
  }

  .card:hover .con-img img.blur {
    opacity: 0.45;
    transform: translate(-10px, 26px) scale(0.85);
  }

  .card h3 {
    position: absolute;
    font-family: "Oswald", sans-serif;
    left: 0px;
    top: 0px;
    padding: 15px;
  }

  .card .con-text {
    padding: 20px;
  }
  
  section {
    padding: 16px;
    margin: 16px;
    opacity: 0;
    transform: translate(0, 50%);
    visibility: hidden;
    transition: opacity 300ms ease-out, transform 300ms ease-out;
    will-change: opacity, visibility;
  }

  .footer {
    text-align: center;
    width: 100%;
  }

  .is-visible {
    opacity: 1;
    transform: none;
    visibility: visible;
  }

  .jumbotron {
      background-color: transparent;
  }

  h2 {
    font-family: "Oswald", sans-serif;
  }
`;
