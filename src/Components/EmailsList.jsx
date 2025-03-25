import React, { useEffect, useState } from "react";
import EmailContent from "./EmailContent";

let initialState = { isRead: false, isFavourite: false };
// let border=[#CFD2DC];
//#F4F5F9
//#CFD2DC

const EmailsList = () => {
  let [emailData, setEmailData] = useState([]);
  let [filteredData, setFilteredData] = useState(emailData);


  const [status,setStatus]=useState({
    selectedEmailId:null,
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
      selectedEmailId:id,
    })
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

  function handleFilterRead() {
    setFilteredData(emailData.filter((email) => email.isRead));
    setStatus({
      selectedEmailId:null,
    })
    
  }

  function handleFilterUnRead() {
    setFilteredData(emailData.filter((email) => !email.isRead));
    setStatus({
      selectedEmailId:null,
    })
  }

  function handleFilterIsFavourite() {
    setFilteredData(emailData.filter((email) => email.isFavourite));
    setStatus({
      selectedEmailId:null,
    })
  }

  function handleFilterAll() {
    setFilteredData(emailData);
    setStatus({
      selectedEmailId:null,
    })
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
        console.log("Error in fetching data");
      }
    }
    dataFetch();
  }, []);

  return (
    <>
      <div className="mx-8 mb-4 flex flex-row gap-4 ">
        <p className=" px-4 py-1">Filter</p>
        <button className="cursor-pointer " onClick={() => handleFilterAll()}>
          All
        </button>
        <button className="cursor-pointer" onClick={() => handleFilterRead()}>
          Read
        </button>
        <button className="cursor-pointer" onClick={() => handleFilterUnRead()}>
          Unread
        </button>
        <button
          onClick={() => handleFilterIsFavourite()}
          className="cursor-pointer"
        >
          Favourite
        </button>
      </div>
      <div className="flex">
        <ul className={status.selectedEmailId ? "w-1/3" : "w-full" }>
          {filteredData.map((email) => (
            <Card
              email={email}
              key={email.id}
              handleOpenEmailContent={handleOpenEmail}
            />
          ))}
        </ul>
        <div className={status.selectedEmailId ? "w-2/3" : "hidden"}>
          {status.selectedEmailId && (
            <EmailContent
              email={emailData.find((email) => email.id === status.selectedEmailId)}
              handleIsFavorite={handleIsFavorite}
            />
          )}
        </div>
      </div>
    </>
  );
};

function Card({ email, handleOpenEmailContent }) {
  let name = email.from.name;
  let firstLetter = name.substring(0, 1).toUpperCase();
  return (
    <div
      className={`card flex border border-[#CFD2DC] mx-8 mb-4 rounded-xl  cursor-pointer bg-white `}
      onClick={() => handleOpenEmailContent(email.id)}
    >
      <span className="flex justify-center items-center  w-12 h-12 p-4 bg-[#E54065] text-white text-3xl font-bold rounded-[50%] mt-2 ml-6 mr-4">
        {firstLetter}
      </span>

      <div className="details my-2">
        <p>
          From:
          <strong>
            {" " + name + " "} &lt;{email.from.email}&gt;
          </strong>
        </p>

        <p>
          Subject:<strong>{email.subject}</strong>
        </p>

        <p className="my-2">{email.short_description}</p>
        <div className="flex flex-row gap-4 justify-baseline">
          <p> Date: {new Date(email.date).toLocaleString()} </p>
          {email.isFavourite ? (
            <p className="text-[#E54065] mr-4 text-sm font-bold mt-0.5">
              Favourite{" "}
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailsList;
