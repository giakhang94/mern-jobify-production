import { useEffect } from "react";
import Loading from "./Loading";
import Job from "./Job";
import Wrapper from "../assets/wrappers/JobsContainer";
import { useAppContext } from "../context/appContext";
import PageBtnContainer from "./PageBtnContainer";
const JobContainer = () => {
  const {
    getJobs,
    jobs,
    isLoading,
    page,
    totalJobs,
    search,
    searchJobType,
    searchStatus,
    sort,
    numOfPages,
  } = useAppContext();
  // console.log(jobs);
  useEffect(() => {
    getJobs();
  }, [search, searchJobType, searchStatus, sort, page]);
  if (isLoading) {
    return <Loading center />;
  }
  if (jobs.length === 0) {
    return (
      <Wrapper>
        <h2>No jobs to display...</h2>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <h5>
        {totalJobs} job{jobs.length > 1 && "s"} found
      </h5>
      <div className="jobs">
        {jobs.map((job, index) => {
          // console.log(job);
          return <Job {...job} key={index + "job"} />;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};

export default JobContainer;
