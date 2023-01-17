import { FormRow, Alert, FormRowSelect } from "../../components";
import { useAppContext } from "../../context/appContext";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
// import { EDIT_JOB } from "../../context/action";

const AddJob = () => {
  const {
    isEditing,
    showAlert,
    displayAlert,
    position,
    company,
    jobLocation,
    jobType,
    jobTypeOptions,
    status,
    statusOptions,
    handleChangeFormRow,
    clearFormValue,
    createJob,
    editJob,
  } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!position || !company || !jobLocation) {
      console.log("not enough");
      displayAlert();
      return;
    }
    if (isEditing) {
      editJob();
      return;
    }
    createJob();
    console.log("create job");
  };
  const handleClear = (e) => {
    e.preventDefault();
    clearFormValue();
  };
  // const handleChange = (name, selectValue) => {
  //   console.log(name);
  //   handleChangeFormRow({ [name]: selectValue });
  // };
  const handleJobInput = (e) => {
    handleChangeFormRow({ [e.target.name]: e.target.value });
  };
  return (
    <Wrapper>
      <form className="form">
        <h3>{isEditing ? "Edit Job" : "Add Job"}</h3>
        {showAlert && <Alert />}
        <div className="form-center">
          {/* position */}
          <FormRow
            type="text"
            name="position"
            value={position}
            handleChange={handleJobInput}
          />
          {/* company */}
          <FormRow
            type="text"
            name="company"
            value={company}
            handleChange={handleJobInput}
          />
          {/* jobLocation */}
          <FormRow
            type="text"
            name="jobLocation"
            value={jobLocation}
            handleChange={handleJobInput}
          />
          {/* job type */}
          <FormRowSelect
            list={jobTypeOptions}
            name="jobType"
            handleChange={handleJobInput}
            value={jobType}
          />
          {/* job status */}
          <FormRowSelect
            list={statusOptions}
            name="status"
            handleChange={handleJobInput}
            value={status}
          />
          <div className="btn-container">
            <button
              type="submit"
              className="btn btn-block submit-btn"
              onClick={handleSubmit}
            >
              Sumbit
            </button>
            <button className="btn btn-block clear-btn" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddJob;
