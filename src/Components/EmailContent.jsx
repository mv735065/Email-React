import React, { useEffect, useState } from "react";

const EmailContent = ({ email,handleIsFavorite }) => {
  let [emailDataById, setEmailDataById] = useState({});
   let [isLoading, setIsLoading] = useState(false);
  let [error, setError] = useState(null);

  let name = email.from.name;
  let firstLetter = name.substring(0, 1).toUpperCase();


  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        // throw new Error()

        let response = await fetch(`https://flipkart-email-mock.now.sh/?id=${email.id}`);
        let data = await response.json();
        setEmailDataById(data);
      } catch (err) {
        console.log(`Unable to fetch the data for id ${email.id} ` + err);
        setError(  err.message || `Unable to fetch the data for id ${email.id} `);
      }
      finally{
        setIsLoading(false);
      }
    }
    fetchData();
  }, [email.id]);

  const emailBody = emailDataById.body

  return (
    <>

    {
      isLoading ? (
        // Show loading spinner while data is being fetched or task is in progress
        <div className="flex justify-center items-center mt-[30vh]">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-solid rounded-full animate-spin border-t-blue-500"></div>
      </div>
      ) 
      :
     error ? (
        /* Error Message */
        <div className="flex justify-center items-center mt-[30vh] text-red-600 font-bold">
          {error}
        </div>
      ) :
    <div className="card flex border border-[#CFD2DC] rounded-xl cursor:pointer p-8 mr-4 bg-white  ">
      <span className="flex justify-center items-center w-12 h-12 p-4 bg-[#E54065] text-white text-3xl font-bold rounded-[50%] mr-4">
        {firstLetter}
      </span>

      <div className="details mr-4 flex flex-col gap-4">
         <div className=" flex justify-between">  <p className="text-2xl font-bold">{email.subject}</p>
         <button className=" bg-[#E54065] text-white font-bold rounded-[10px] text-sm px-4 cursor-pointer" 
         onClick={()=>handleIsFavorite(email.id)}>{email.isFavourite? "Unmark as favourite":"Mark as Favourite"}</button>
         </div>
        <p className=""> Date: {new Date(email.date).toLocaleString()} </p>
        <div className="flex flex-col gap-2"><div dangerouslySetInnerHTML={{ __html: emailBody }}/></div>
        
      </div>
    </div>
    }
    </>
  )
  
};

export default EmailContent;
