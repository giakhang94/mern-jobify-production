import { createContext, useContext, useEffect, useReducer } from "react";
import reducer from "./reducer";
import axios from "axios";

import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUE,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOB_BEGIN,
  GET_JOB_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
} from "./action";

//get user, token from local storage
// const token = localStorage.getItem("token");
// const user = localStorage.getItem("user");
// const userLocation = localStorage.getItem("location");
//========>remove to use cookies instead
const initialState = {
  isLoading: false,
  showAlert: false,
  showSidebar: false,
  alertText: "",
  alertType: "",
  user: null,
  userLocation: "",
  jobLocation: "",
  //job
  iSEditing: false,
  editJobId: "",
  position: "",
  company: "",
  //jobLocation
  jobTypeOptions: [
    "all",
    "full-time",
    "part-time",
    "remote",
    "fresher",
    "internship",
  ],
  jobType: "full-time",
  statusOptions: ["all", "interview", "declined", "pending"],
  status: "pending",
  //allJobs page initial values
  jobs: [],
  totalJobs: 1,
  numOfPages: 1,
  page: 1,
  //stats
  stats: {},
  monthlyApplications: [],
  //search form for alljobs page
  search: "",
  searchStatus: "all",
  searchJobType: "all",
  sort: "latest",
  sortOptions: ["latest", "oldest", "a-z", "z-a"],
  //use cookie
  userLoading: true,
};
const AppContext = createContext();
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  //axios Global setup for authoriztion
  // axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
  //axios cunstom instance
  const authFetch = axios.create({
    baseURL: "/api/v1",
    headers: {
      Authorization: `Bearer ${state.token}`,
    },
  });
  // Axios interceptors
  //request
  // authFetch.interceptors.request.use(
  //   (config) => {
  //     //nếu xài config headers này rồi thì ở trên authFecth = axios.create...
  //     //.. sẽ bỏ cái headers đi, không dùng nữa
  //     // config.headers["Authorization"] = `Bearer ${state.token}`;
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );
  //response
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log("interceptor", error);
      if (error.response.data.err.status === 401) {
        console.log("Auth erorr");
        logoutUser();
      }
      return Promise.reject(error.response);
    }
  );

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };
  const hideAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };
  //add user and token to local storage
  // const addUseToLocalStorage = ({ user, token, location }) => {
  //   localStorage.setItem("user", JSON.stringify(user));
  //   localStorage.setItem("token", token);
  //   localStorage.setItem("location", location);
  // };
  // const removeUseToLocalStorage = () => {
  //   localStorage.removeItem("user");
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("location");
  // };

  //register
  const registerUser = async (currentUser) => {
    dispatch({ type: REGISTER_USER_BEGIN });
    try {
      const response = await axios.post("/api/v1/auth/register", currentUser);
      console.log(response);
      const { user, location } = response.data;
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: { user, location },
      });
      //local storage later
      // addUseToLocalStorage(user, token, location); remove this, use cookies instead
    } catch (err) {
      console.log(err.response);
      dispatch({
        type: REGISTER_USER_ERROR,
        payload: { msg: err.response.data.msg },
      });
    }
    // console.log(currentUser);
  };
  //login
  const loginUser = async (userLogin) => {
    dispatch({ type: LOGIN_USER_BEGIN });
    try {
      const resp = await axios.post("/api/v1/auth/login", userLogin);
      console.log(resp.data);
      const { user, location } = resp.data;
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: { user, location },
      });
      // addUseToLocalStorage({ user, token, location });
    } catch (err) {
      console.log(err.response);
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: { msg: err.response.data.msg },
      });
    }
  };
  //toggle_sidebar
  const toggleSidebar = function () {
    dispatch({ type: TOGGLE_SIDEBAR });
  };
  //log out
  const logoutUser = async function () {
    await authFetch.get("auth/logout");
    dispatch({ type: LOGOUT_USER });
    // removeUseToLocalStorage();
  };

  //update user
  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const { data } = await authFetch.patch(
        "/auth/updateUser",
        currentUser
        // {
        //   headers: {
        //     Authorization: `Bearer ${state?.token}`,
        //   },
        // }
        //dung axios global setup roi thi remove cai header nay=================
      );
      const { user, location } = data;
      dispatch({ type: UPDATE_USER_SUCCESS, payload: { user, location } });
      // addUseToLocalStorage({
      //   user: data.user,
      //   token: data.token,
      //   location: data.user.location,
      // });
    } catch (error) {
      console.log(error);
      dispatch({ type: UPDATE_USER_ERROR, payload: error.data.msg });
    }
    hideAlert();
  };
  //handle change input FormRow and FormRowSelect
  const handleChangeFormRow = (valueChange) => {
    dispatch({ type: HANDLE_CHANGE, payload: valueChange });
  };
  //clear form value
  const clearFormValue = () => {
    dispatch({ type: CLEAR_VALUE });
  };
  //create job
  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.post("/jobs", {
        position,
        company,
        jobLocation,
        jobType,
        status,
      });
      dispatch({ type: CREATE_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUE });
    } catch (err) {
      console.log(err.data.msg);
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: err.data.msg || "can not create Job",
      });
    }
  };
  //get all jobs
  const getJobs = async () => {
    let url = `/jobs?status=${state.searchStatus}&jobType=${state.searchJobType}&sort=${state.sort}`;
    if (state.search) {
      url = url + `&search=${state.search}`;
    }
    if (state.page > 1) {
      url = url + `&page=${state.page}`;
    }
    dispatch({ type: GET_JOB_BEGIN });
    try {
      const { data } = await authFetch.get(url);
      console.log(data);
      const { allJobs, totalJobs, numOfPages } = data;
      dispatch({
        type: GET_JOB_SUCCESS,
        payload: {
          allJobs,
          totalJobs,
          numOfPages,
        },
      });
    } catch (err) {
      // console.log(err.response);
      logoutUser();
    }
    hideAlert();
  };
  //delete job
  const setEditJob = async (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } });
  };
  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.patch(`/jobs/${state.editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status,
      });
      dispatch({
        type: EDIT_JOB_SUCCESS,
      });
      dispatch({ type: CLEAR_VALUE });
    } catch (error) {
      console.log(error);
      if (error.status === 401) return;
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.data.msg },
      });
    }
  };
  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN });
    try {
      await authFetch.delete(`jobs/${jobId}`);
      getJobs();
    } catch (error) {
      alert("You Dont have permission to do this");
      // console.log(error);
      logoutUser();
    }
  };
  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      const { data } = await authFetch("jobs/stats");
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      // console.log(error);
      logoutUser();
    }
    hideAlert();
  };
  //search form
  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };
  //pagination
  const changePage = (pageToGo) => {
    dispatch({ type: CHANGE_PAGE, payload: { pageToGo } });
  };
  //cookie get current user (thay the cho local storage)
  const getCurentUser = async () => {
    dispatch({ type: GET_CURRENT_USER_BEGIN });
    try {
      const { data } = await authFetch("/auth/getCurrentUser");
      const { user, location } = data;

      dispatch({ type: GET_CURRENT_USER_SUCCESS, payload: { user, location } });
    } catch (error) {
      console.log(error);
      console.log(error.data.err.status);
      if (error.data.err.status === 401) return;
      logoutUser();
    }
  };
  useEffect(() => {
    getCurentUser();
  }, []);
  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        hideAlert,
        registerUser,
        loginUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChangeFormRow,
        clearFormValue,
        createJob,
        getJobs,
        deleteJob,
        setEditJob,
        editJob,
        showStats,
        clearFilters,
        changePage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
const useAppContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider, useAppContext };
