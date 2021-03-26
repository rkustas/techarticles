import Head from "next/head";
import globalStyles from "../styles/bio";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import FadeInSection from "../components/fadeinsection";

const Bio = () => {
  const handleScrollNext = (direction) => {
    const cards = document.querySelector(".con-cards");
    cards.scrollLeft = cards.scrollLeft +=
      window.innerWidth / 2 > 600
        ? window.innerWidth / 2
        : window.innerWidth - 100;
  };

  const handleScrollPrev = (direction) => {
    const cards = document.querySelector(".con-cards");
    cards.scrollLeft = cards.scrollLeft -=
      window.innerWidth / 2 > 600
        ? window.innerWidth / 2
        : window.innerWidth - 100;
  };
  return (
    <>
      <div>
        <Head>
          <title>Bio</title>
        </Head>
      </div>
      <div class="jumbotron jumbotron-fluid">
        <div class="container">
          <h1 class="display-4">About Me</h1>
          <p class="lead">Developer bio</p>
        </div>
      </div>
      <div className="col-md-12 bg-white" style={{ border: "1px solid black" }}>
        <div className="text-center">
          <h1 className="text-title text-blue my-3">Ryan Kustas</h1>
          <br />
          <img src="/formal.jpg" alt="Test picture" className="img-container" />
          <img
            src="/informal.jpg"
            alt="Test picture"
            className="img-container h-auto"
          />
        </div>
        <hr />
        <div className="my-5">
          <div
            className="p-3"
            style={{
              backgroundColor: "#DCDCDC",
              border: "1px solid black",
            }}
          >
            <p style={{ fontSize: "15px", fontWeight: "bold" }}>
              I am an aspiring and hardworking dreamer with goals to one day
              become a software engineer or full stack web developer!! My
              journey so far has been fantastic and learning has never been
              easier with all the materials that you can find online, in books,
              etc.
            </p>
            <p style={{ fontSize: "15px", fontWeight: "bold" }}>
              I have a deep passion for making data driven decisions not only in
              my professional life but in my personal life as well and I believe
              each of us can find a passion and seize hold of it.
            </p>
            <p style={{ fontSize: "15px", fontWeight: "bold" }}>
              I am in love with coding and all programming languages, my
              immediate goal has been to develop skills in the technologies
              listed below as well as their various libraries and frameworks.
            </p>
            <p style={{ fontSize: "15px", fontWeight: "bold" }}>
              Please contact me through various means which I have provided
              below!
            </p>
          </div>
          <br />
          <div className="row text-center p-4">
            <div className="col-md-4">
              <FadeInSection>
                <img
                  className="img-thumbnail"
                  style={{ backgroundColor: "#DCDCDC" }}
                  src="/cats.jpg"
                  hidden=""
                />
              </FadeInSection>
            </div>
            <div className="col-md-4 p-3">
              <ul>MongoDB</ul>
              <ul>MySQL</ul>
              <ul>Javascript</ul>
              <ul>Django</ul>
              <ul>Python</ul>
              <ul>C++</ul>
            </div>
            <div className="col-md-4">
              <FadeInSection>
                <img
                  className="img-thumbnail w-auto"
                  style={{ backgroundColor: "#DCDCDC" }}
                  src="/family.jpg"
                  alt=""
                />
              </FadeInSection>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-12">
        <br />
        <FadeInSection>
          <div class="jumbotron jumbotron-fluid">
            <div class="container">
              <h1 class="display-4">Projects</h1>
              <p class="lead">
                Current projects I am working on or have completed.
              </p>
            </div>
          </div>
        </FadeInSection>
        <FadeInSection>
          <div className="content">
            <button className="btn" onClick={() => handleScrollPrev()}>
              <ArrowBackIosIcon style={{ fontSize: "1.6rem" }} />
            </button>
            <div className="con-cards">
              <a href="/postshome" target="_blank">
                <div className="card" style={{ width: "20rem" }}>
                  <div className="con-img">
                    <img src="/aws.jpg" alt="First project" />
                    <img src="/aws.jpg" alt="" className="blur" />
                  </div>
                  <div className="con-text">
                    <h2>Blog Post, Links and Ecommerce</h2>
                    <p>
                      This is a full stack website that contains CRUD
                      functionality and is similar in behavior to a blog post
                      app and also contains some Ecommerce. Tech stack used:
                      <li className="mt-3">MongoDB</li>
                      <li>AWS S3</li>
                      <li>AWS EC2</li>
                      <li>AWS Email Services</li>
                      <li>React.JS</li>
                      <li>Express.JS</li>
                      <li>Node.JS</li>
                      <li>JWT Token Authentication</li>
                    </p>
                  </div>
                </div>
              </a>
              <a
                href="https://social-media-react-client.herokuapp.com/"
                target="_blank"
              >
                <div className="card" style={{ width: "20rem" }}>
                  <div className="con-img">
                    <img src="/graphql.jpg" alt="Second project" />
                    <img src="/graphql.jpg" alt="" className="blur" />
                  </div>
                  <div className="con-text">
                    <h2>Social Media</h2>
                    <p>
                      This is a full stack website that contains CRUD
                      functionality and is similar in behavior to a social media
                      app. Tech stack used:
                      <li className="mt-3">MongoDB</li>
                      <li>GraphQL</li>
                      <li>React.JS</li>
                      <li>Express.JS</li>
                      <li>Firebase Auth</li>
                      <li>Node.JS</li>
                      <li>Heroku</li>
                    </p>
                  </div>
                </div>
              </a>
              <a
                href="https://afternoon-mesa-09121.herokuapp.com/"
                target="_blank"
              >
                <div className="card" style={{ width: "20rem" }}>
                  <div className="con-img">
                    <img src="/django.jpg" alt="Third project" />
                    <img src="/django.jpg" alt="" className="blur" />
                  </div>
                  <div className="con-text">
                    <h2>Boards and Todo app</h2>
                    <p>
                      This is a full stack website that contains CRUD
                      functionality and is similar in behavior to a todo list
                      and boards/topics app. Tech stack used:
                      <li className="mt-3">MySQL</li>
                      <li>Django</li>
                      <li>Token Auth</li>
                      <li>Python</li>
                      <li>Heroku</li>
                    </p>
                  </div>
                </div>
              </a>
              <a href="https://taskmanagerrk.herokuapp.com" target="_blank">
                <div className="card" style={{ width: "20rem" }}>
                  <div className="con-img">
                    <img src="/flask.jpg" alt="Fourth project" />
                    <img src="/flask.jpg" alt="" className="blur" />
                  </div>
                  <div className="con-text">
                    <h2>Task Manager</h2>
                    <p>
                      This is a full stack website that contains CRUD
                      functionality and is similar in behavior to a taskmanager
                      app. Tech stack used:
                      <li className="mt-3">SQL lite</li>
                      <li>PostgreSQL</li>
                      <li>Token Auth</li>
                      <li>Python</li>
                      <li>Flask</li>
                      <li>Heroku</li>
                    </p>
                  </div>
                </div>
              </a>
            </div>
            <button
              id="next"
              className="btn"
              onClick={() => handleScrollNext()}
            >
              <ArrowForwardIosIcon style={{ fontSize: "1.6rem" }} />
            </button>
          </div>
        </FadeInSection>
        <style jsx global>
          {globalStyles}
        </style>
      </div>
      <div className="footer">
        <p>
          <a
            target="_blank"
            href="https://github.com/rkustas"
            class="fa fa-github fa-3x px-3"
          ></a>
          <a
            target="_blank"
            href="https://twitter.com/RyanKustas"
            class="fa fa-twitter fa-3x px-3"
          ></a>
          <a
            target="_blank"
            href="https://www.linkedin.com/in/ryan-kustas"
            class="fa fa-linkedin fa-3x px-3"
          ></a>
        </p>
      </div>
    </>
  );
};

export default Bio;
