import Wrapper from "../assets/wrappers/SearchContainer";
import { useAppContext } from "../context/appContext";
import { FormRow, FormRowSelect } from "../components";

const SearchContainer = () => {
  const {
    isLoading,
    search,
    searchStatus,
    searchJobType,
    sort,
    sortOptions,
    statusOptions,
    jobTypeOptions,
    handleChangeFormRow,
    clearFilters,
  } = useAppContext();
  const handleSearch = (e) => {
    if (isLoading) return;
    handleChangeFormRow({ [e.target.name]: e.target.value });
  };
  return (
    <Wrapper>
      <form action="" className="form">
        <div className="form-center">
          <FormRow
            type="text"
            name="search"
            value={search}
            handleChange={handleSearch}
          ></FormRow>
          <FormRowSelect
            name="searchJobType"
            labelText="job type"
            list={jobTypeOptions}
            value={searchJobType}
            handleChange={handleSearch}
          />
          <FormRowSelect
            name="searchStatus"
            labelText="Status"
            list={statusOptions}
            value={searchStatus}
            handleChange={handleSearch}
          />
          <FormRowSelect
            name="sort"
            labelText="sort"
            list={sortOptions}
            value={sort}
            handleChange={handleSearch}
          />
          <button
            className="btn btn-block btn-danger"
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault();
              clearFilters();
            }}
          >
            clear filters
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default SearchContainer;
