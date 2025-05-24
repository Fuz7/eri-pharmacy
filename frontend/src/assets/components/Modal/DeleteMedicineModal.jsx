export default function DeleteMedecineModal({ setIsDeleteShown }) {
  return (
    <div
      className="fixed w-full min-h-[100vh] modalBackground flex 
    justify-center items-center top-0 left-0 font-poppins"
    >
      <div
        className="w-[600px] h-[350px] bg-white rounded-[30px]
       pb-[30px] py-[40px] flex flex-col  px-[30px]"
      >
        <h2
          className="text-darkFont text-[32px] font-semibold
          mb-[56px]
        "
        >
          Delete Medicine
        </h2>
        <p className="text-[24px] font-medium text-darkFont leading-none mb-[12px]">
          You are about to delete Medicine Name.
        </p>
        <p className="text-[24px] font-medium text-darkFont leading-none">
          Do you wish to continue?
        </p>
        <div className="flex gap-[30px] mt-auto">
          <button
            className="min-h-[60px] w-[255px] text-darkFont
           text-[20px] border border-grayFont rounded-[10px] 
           cursor-pointer"
           onClick={()=>setIsDeleteShown(false)}
          >
            Cancel
          </button>
          <button
            className="min-h-[60px]  bg-deleteButton text-lightFont
          w-[255px] rounded-[10px] text-[20px] cursor-pointer"
          >
            Delete
          </button>
          </div>
      </div>
    </div>
  );
}
