import Wrapper from "../assets/wrappers/ErrorPage";
import pageNotFound from "../assets/images/not-found.svg";
import { Link } from "react-router-dom";
const Error = () => {
  return (
    <Wrapper className="full-page">
      <div>
        <img src={pageNotFound} alt="not-found" />
        <h3>Ohh! Page Not Found</h3>
        <p>We can' seem to find the page you're looking for</p>
        <Link to="/">back home</Link>
      </div>
    </Wrapper>
  );
};

export default Error;
