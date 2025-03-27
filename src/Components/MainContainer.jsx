import React, { useEffect, useState } from "react";
import EmailContent from "./EmailContent";
import EmailCard  from "./EmailCard";
import NavBar from "./NavBar";

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
    searchQuery:null,
  });

  const filterEmails = (filterType, data=emailData) => {
    let filteredData = [];

    if (filterType === "Read") {
      filteredData = data.filter((email) => email.isRead);
    } else if (filterType === "Unread") {
      filteredData = data.filter((email) => !email.isRead || email.id==status.selectedEmailId);
    } else if (filterType === "Favourite") {
      filteredData = data.filter((email) => email.isFavourite || email.id==status.selectedEmailId);
    } else if (filterType === "SortByTime") {
      filteredData = [...data].sort(
        (e1, e2) => new Date(e1.date) - new Date(e2.date)
      );
    } 
    else {
      filteredData = [...data];
    }

    if (status.searchQuery) {
      let text = status.searchQuery;
      filteredData = filteredData.filter((mail) => 
        mail.from.name.toLowerCase().includes(text.toLowerCase()) // Case insensitive search
      );
    
    }

    return filteredData;
  };

  let filteredData = filterEmails(status.activeFilter);

  let totalPages = Math.ceil(filteredData.length / emailQuantityForEachPage);

  useEffect(() => {
    async function dataFetch() {
      try {
        setIsLoading(true);
        // throw new Error()
        let response = await fetch("https://flipkart-email-mock.now.sh");
        let data = await response.json();
        let emailsWithState = data.list.map((email) => ({
          ...email,
          ...initialState,
        }));
        setEmailData(emailsWithState);
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
    setStatus({
      ...status,
      selectedEmailId: null,
      activeFilter: type,
      presentPageNumber: 1,
    });
  }
  function handleSearchQuery(e) {
    let query = e.target.value;
    setStatus({
      ...status,
      selectedEmailId: null,
      searchQuery:query,
    });
  }
  return (
    <>
      {/* Filter Section */}
      <NavBar activeFilter={status.activeFilter} handleFilter={handleFilter} handleSearchQuery={handleSearchQuery}/>

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
            <ul
              className={`${
                status.selectedEmailId ? "w-1/3" : "w-full"
              } min-h-[80vh]`}
            >
              {filteredData
                .slice(
                  emailQuantityForEachPage * (status.presentPageNumber - 1),
                  emailQuantityForEachPage * status.presentPageNumber
                )
                .map((email) => (
                  <EmailCard
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
                  email={emailData.find(
                    (email) => email.id === status.selectedEmailId
                  )}
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
                disabled={status.presentPageNumber === totalPages}
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
