import React, { useEffect, useState } from "react";
import EmailContent from "./EmailContent";
import Card from "./Card";

let initialState = { isRead: false, isFavourite: false };
let emailQuantityForEachPage = 5;

const EmailsList = () => {
  let [emailData, setEmailData] = useState([]);
  let [isLoading, setIsLoading] = useState(false);
  let [error, setError] = useState(null);

  const [status, setStatus] = useState({
    selectedEmailId: null,
    activeFilter: "All",
    presentPageNumber: 1,
  });
let   filteredData1 =emailData;

  let [filteredData, setFilteredData] = useState(emailData);

  let totalPages = Math.ceil(emailData.length / emailQuantityForEachPage);


  useEffect(() => {
    async function dataFetch() {
      try {
        setIsLoading(true);
        let response = await fetch("https://flipkart-email-mock.now.sh");
        let data = await response.json();
        let emailsWithState = data.list.map((email) => ({
          ...email,
          ...initialState,
        }));
        setEmailData(emailsWithState);
        setFilteredData(emailsWithState);
      } catch (err) {
        console.log("Error in fetching data", err);
        setError(error || "Unbale to fetch data");
      } finally {
        setIsLoading(false);
      }
    }
    dataFetch();
  }, []);

  function handleOpenEmail(id) {
    let email = emailData.find((email) => email.id === id);
    let newEmail = {
      ...email,
      isRead: true,
    };
    setEmailData((prevData) =>
      prevData.map((email) => (email.id === id ? newEmail : email))
    );
    setFilteredData((prevFilteredData) =>
      prevFilteredData.map((email) => (email.id === id ? newEmail : email))
    );

    setStatus({
      ...status,
      selectedEmailId: id,
    });
  }

  function handleIsFavorite(id) {
    let email = emailData.find((email) => email.id === id);
    let newEmail = {
      ...email,
      isFavourite: !email.isFavourite,
    };

    setEmailData((prevData) =>
      prevData.map((email) => (email.id === id ? newEmail : email))
    );
    setFilteredData((prevFilteredData) =>
      prevFilteredData.map((email) => (email.id === id ? newEmail : email))
    );
  }

  function handlePrevButton() {
    let previousPage =
      status.presentPageNumber - 1 <= 0 ? 1 : status.presentPageNumber - 1;
    setStatus({
      ...status,
      presentPageNumber: previousPage,
    });
  }

  function handleNextButton() {
    let presntPage = status.presentPageNumber;

    let next = presntPage + 1 > totalPages ? totalPages : presntPage + 1;
    setStatus({
      ...status,
      presentPageNumber: next,
    });
  }

  function handleFilter(type) {
    switch (type) {
      case "Read":
        setFilteredData(emailData.filter((email) => email.isRead));
        break;
      case "Unread":
        setFilteredData(emailData.filter((email) => !email.isRead));
        break;
      case "Favourite":
        setFilteredData(emailData.filter((email) => email.isFavourite));
        break;
      case "SortByTime":
        let newData = [...emailData];
        newData.sort((e1, e2) => parseFloat(e1.date) - parseFloat(e2.date));
        setFilteredData(newData);
        break;
      case "All":
      default:
        setFilteredData(emailData);
        break;
    }

    setStatus({
      ...status,
      selectedEmailId: null,
      activeFilter: type,
      presentPageNumber: 1,
    });
  }
  function handleSearchQuery(e) {
    let query = e.target.value;

    setFilteredData(
      emailData.filter((email) =>
        email.from.name.toLowerCase().includes(query + "".toLowerCase())
      )
    );
    setStatus({
      ...status,
      selectedEmailId: null,
      activeFilter: "All",
    });
  }
  return (
    <>
      {/* Filter Section */}
      <div className="mx-8 mb-4 flex flex-row gap-4">
        <p className="px-4 py-1">Filter</p>
        {["All", "Read", "Unread", "Favourite", "SortByTime"].map((filter) => (
          <button
            key={filter}
            className={`cursor-pointer px-4 py-1 rounded-md ${
              status.activeFilter === filter
                ? "border border-[#CFD2DC] bg-[#E1E4EA]"
                : "border-transparent"
            }`}
            onClick={() => handleFilter(filter)}
          >
            {filter}
          </button>
        ))}
        <input
          className="ml-auto border border-[#CFD2DC] w-2/5 pl-4"
          placeholder="Search by name"
          onChange={handleSearchQuery}
        />
      </div>
  
      {/* Loading Indicator */}
      {isLoading ? (
        <div className="flex justify-center items-center mt-[30vh]">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-solid rounded-full animate-spin border-t-blue-500"></div>
        </div>
      ) : error ? (
        /* Error Message */
        <div className="flex justify-center items-center mt-[30vh] text-red-600 font-bold">
          {error}
        </div>
      ) : (
        <>
          {/* Email List & Content Section */}
          <div className="flex min-h-[80vh]">
            <ul className={`${status.selectedEmailId ? "w-1/3" : "w-full"} min-h-[80vh]`}>
              {filteredData
                .slice(
                  emailQuantityForEachPage * (status.presentPageNumber - 1),
                  emailQuantityForEachPage * status.presentPageNumber
                )
                .map((email) => (
                  <Card
                    email={email}
                    key={email.id}
                    handleOpenEmailContent={handleOpenEmail}
                    selectedEmailId={status.selectedEmailId}
                  />
                ))}
            </ul>
  
            {/* Email Content */}
            {status.selectedEmailId && (
              <div className="w-2/3">
                <EmailContent
                  email={emailData.find((email) => email.id === status.selectedEmailId)}
                  handleIsFavorite={handleIsFavorite}
                />
              </div>
            )}
          </div>
  
          {/* Pagination Buttons */}
          {filteredData.length > 0 && (
            <div className="flex justify-around mt-4">
              <button
                onClick={handlePrevButton}
                className="py-2 px-8 border border-[#CFD2DC] bg-white rounded-xl"
                disabled={status.presentPageNumber === 1}
              >
                Prev
              </button>
              <button
                onClick={handleNextButton}
                className="py-2 px-8 border border-[#CFD2DC] bg-white rounded-xl"
                disabled={status.presentPageNumber === 3} // Consider making this dynamic
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
  
};

export default EmailsList;
