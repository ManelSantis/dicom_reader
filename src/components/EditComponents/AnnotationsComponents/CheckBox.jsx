export const CheckBox = ({ id }) => {

    return (
        <label className="inline-flex items-center cursor-pointer">
            <input id={id} type="checkbox" value="" className="sr-only peer" />
            <div className="
            relative w-12 h-7 rounded-full 
            peer bg-[#457B9D]
            border-2
            border-[#A8DADC]
            peer-checked:after:translate-x-full 
            rtl:peer-checked:after:-translate-x-full
             peer-checked:after:border-white 
             after:content-[''] after:absolute 
             after:top-[2px] after:start-[2px]
              after:bg-[#A8DADC] 
              after:border-gray-300 after:border 
              after:rounded-full after:h-5 
              after:w-5 after:transition-all
                peer-checked:bg-[#F1FAEE]">

                </div>
        </label>
    )
}