import React, { useEffect, useState } from "react";
import EmailContent from "./EmailContent";
import Card from "./Card";

let initialState = { isRead: false, isFavourite: false };
// let border=[#CFD2DC];
//#F4F5F9
//#CFD2DC
// #E1E4EA

const EmailsList = () => {
  let [emailData, setEmailData] = useState([]);
  let [filteredData, setFilteredData] = useState(emailData);

  const [status, setStatus] = useState({
    selectedEmailId: null,
    activeFilter: "All",
  });

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
      prevFilteredData.map((email) =>
        email.id === id ? { ...email, isFavourite: !email.isFavourite } : email
      )
    );
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
      case "All":
      default:
        setFilteredData(emailData);
        break;
    }

    setStatus({
      selectedEmailId: null,
      activeFilter: type,
    });
  }
  useEffect(() => {
    async function dataFetch() {
      try {
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
      }
    }
    dataFetch();
  }, []);

  return (
    <>
      <div className="mx-8 mb-4 flex flex-row gap-4 ">
        <p className=" px-4 py-1">Filter</p>
        {["All", "Read", "Unread", "Favourite"].map((filter) => (
          <button
            key={filter}
            className={`cursor-pointer px-4 py-1 rounded-md ${
              status.activeFilter === filter
                ? "border border-[#CFD2DC] bg-[#E1E4EA]"
                : " border-transparent"
            }`}
            onClick={() => handleFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="flex">
        <ul className={status.selectedEmailId ? "w-1/3" : "w-full"}>
          {filteredData.map((email) => (
            <Card
              email={email}
              key={email.id}
              handleOpenEmailContent={handleOpenEmail}
              isSelected={status.selectedEmailId === email.id}
            />
          ))}
        </ul>
        <div className={status.selectedEmailId ? "w-2/3" : "hidden"}>
          {status.selectedEmailId && (
            <EmailContent
              email={emailData.find(
                (email) => email.id === status.selectedEmailId
              )}
              handleIsFavorite={handleIsFavorite}
            />
          )}
        </div>
      </div>
    </>
  );
};



export default EmailsList;
