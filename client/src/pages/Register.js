import { useState, useEffect, useContext } from "react";
import { Alert, FormRow, Logo } from "../components";
import Wrapper from "../assets/wrappers/RegisterPage";
import { AppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";
// import { LOGIN_USER_BEGIN } from "../context/action";
const initialState = {
  name: "",
  email: "",
  password: "",
  isMember: true,
};
const Register = () => {
  const navigate = useNavigate();

  const [value, setValue] = useState(initialState);
  const {
    isLoading,
    showAlert,
    displayAlert,
    hideAlert,
    registerUser,
    loginUser,
    user,
  } = useContext(AppContext);

  //glbal state and useNavigate
  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };
  //toggle member
  const toggleMember = () => {
    setValue((prev) => ({ ...prev, isMember: !prev.isMember }));
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, isMember } = value;
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }
    const currentUser = { name, email, password };
    if (isMember) {
      // console.log("already a member");
      console.log(isMember);
      loginUser({ email, password });
    } else {
      registerUser(currentUser);
    }
    hideAlert();
    console.log("curentuser", currentUser);
  };
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [user, navigate]);

  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />
        <h3>{!value.isMember ? "Register" : "Login"}</h3>
        <p style={{ fontSize: "12px", textAlign: "center" }}>
          Demo: Email: tao000@gmail.com - pw: 123456Abc
        </p>
        {/* name input */}
        {showAlert && <Alert />}
        {!value.isMember && (
          <FormRow
            value={value.name}
            type="text"
            name="name"
            handleChange={handleChange}
            labelText="name"
          />
        )}
        {/* Email input */}
        <FormRow
          value={value.email}
          type="text"
          name="email"
          handleChange={handleChange}
          labelText="Email"
        />
        {/* password input */}
        <FormRow
          value={value.password}
          type="password"
          name="password"
          handleChange={handleChange}
          labelText="Password"
        />
        <button className="btn btn-block" type="submit">
          Submit
        </button>
        <p>
          {value.isMember && (
            <>
              <span>Don't have an Account? </span>
              <button
                type="button"
                className="member-btn"
                onClick={toggleMember}
              >
                Register
              </button>
            </>
          )}
          {!value.isMember && (
            <>
              <span>Already had an Account? </span>
              <button
                type="button"
                className="member-btn"
                onClick={toggleMember}
              >
                Login
              </button>
            </>
          )}
        </p>
      </form>
    </Wrapper>
  );
};
export default Register;
