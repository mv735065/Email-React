

export default function Card({ email, handleOpenEmailContent, selectedEmailId }) {
    let name = email.from.name;
    let firstLetter = name.substring(0, 1).toUpperCase();

    let description=selectedEmailId ? email.short_description.substring(0,50)+"...":email.short_description;
     
  
    return (
      <div
        className={`card flex border mx-8 mb-4 rounded-xl cursor-pointer ${
          email.isRead ? "bg-white " : "bg-[#F2F2F2]"
        }
        transition-all duration-300 
        ${selectedEmailId==email.id ? "border border-[#E54065]" : "border-2 border-[#CFD2DC]"}
      `}
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
  
          <p className="my-2">{description}</p>
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