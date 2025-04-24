import { Link } from "react-router-dom";
import Navbar from "../components/HomeNavbar";
import "../index.css";
import MySVG from "/Backdrop.svg"; // Adjust the path to your SVG file

const Home = () => {
  return (
    <main style={styles.main}>
      <Navbar />
      <div style={styles.svgContainer}>
        <img src={MySVG} alt="Background SVG" style={styles.svg} />
      </div>
      <div style={styles.container}>
        <p style={styles.heading}>
          Trade <span style={styles.highlight}>Perpetuals</span> on EDU Chain
        </p>
        <p style={styles.paragraph}>
          PerpX is a decentralized perpetuals exchange on EDU Chain
          <br />
          with best-in-class speed, liquidity, and price.
        </p>

        <div>
          <Link to="/trade" style={styles.buttonLink}>
            Start Trading
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Home;

const styles = {
  main: {
    paddingTop: "70px",
    position: "relative",
    height: "100vh",
    overflow: "hidden",
  },
  svgContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    transform: "translate(-50%, -50%)",
    zIndex: -1, // Ensure it's behind the content
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  svg: {
    width: "100%",
    height: "auto",
  },
  container: {
    height: "calc(100vh - 70px)", // Adjust for navbar height
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    textAlign: "center",
  },
  heading: {
    fontSize: "64px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  highlight: {
    color: "#50D2C1",
  },
  paragraph: {
    fontSize: "24px",
    marginBottom: "50px",
  },
  buttonLink: {
    display: "inline-block",
    width: "180px",
    padding: "12px 10px",
    backgroundColor: "#50D2C1",
    color: "#16181D",
    fontWeight: "500",
    border: "none",
    borderRadius: "50px", // Capsule shape
    cursor: "pointer",
    fontSize: "16px",
    transition: "box-shadow 0.3s ease",
    boxShadow: "0 0 5px rgba(80, 210, 193, 0.3)", // Blur effect on all sides
  },
};
