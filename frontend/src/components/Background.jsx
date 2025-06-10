import bottomLeftCircle from '@images/background/bottomLeftCircle.svg'
import bottomRightCircle from '@images/background/bottomRightCircle.svg'
import upperRightCircle from '@images/background/upperRightCircle.svg'

export default function Background() {
  return (
    <div className="-z-10 absolute top-0 left-0 bg-[#fcfcfc] w-[100%] 
    overflow-clip min-h-[100vh]">
      <img 
      className='absolute left-[-200px] bottom-[-230px] '
      src={bottomLeftCircle} alt="" />
      <img className='absolute right-[-100px] top-[100px]'
      src={bottomRightCircle} alt="" />
      <img className='absolute right-[-300px] top-[-400px]' 
      src={upperRightCircle} alt="" />

    </div>
  );
}
