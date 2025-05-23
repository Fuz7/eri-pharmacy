import searchBarIcon from '@images/searchBarIcon.svg'

export default function SearchBar(){
  return (
    <div className="relative">
    <input className="w-[450px] min-h-[54px] border-[#959595] border
    rounded-[10px] pl-[50px] text-[24px]"
    placeholder='Search Products'
    >
    </input>
    <img className='absolute left-[20px] top-1/2 -translate-y-1/2' src={searchBarIcon} alt="" />
    </div>
  )
}