import { Logo } from "../components";
import main from "../assets/images/main.svg";
// import styled from "styled-components";
import Wrapper from "../assets/wrappers/LandingPage";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { Navigate } from "react-router-dom";
const Landing = () => {
  const { user } = useAppContext();
  return (
    <>
      {user && <Navigate to="/" />}
      <Wrapper>
        <main>
          <nav>
            <Logo />
          </nav>
          <div className="container page">
            <div className="info">
              <h1>
                job <span>tracking</span> app
              </h1>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book
              </p>
              <Link to="/register" className="btn btn-hero">
                Login/Register
              </Link>
            </div>
            <img src={main} alt="job hunt" className="img main-img" />
          </div>
        </main>
      </Wrapper>
    </>
  );
};
// const Wrapper = styled.main`
//   nav {
//     width: var(--flid-width);
//     max-width: var(--max-width);
//     margin: 0 auto;
//     height: var(--nav-height);
//     display: flex;
//     align-items: center;
//   }
//   .page {
//     min-height: calc(100vh - var(--nav-height));
//     display: grid;
//     align-items: center;
//     margin-top: -3rem;
//     /* grid-template-columns: auto auto; */
//   }
//   h1 {
//     font-weight: 700;
//     span {
//       color: var(--primary-500);
//     }
//   }
//   p {
//     color: var(--grey-600);
//   }
//   .main-img {
//     display: none;
//   }
//   @media (min-width: 992px) {
//     .page {
//       grid-template-columns: 1fr 1fr;
//       column-gap: -3rem;
//     }
//     .main-img {
//       display: block;
//     }
//   }
// `;
export default Landing;
