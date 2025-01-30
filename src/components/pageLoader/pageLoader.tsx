import { RotatingLines } from 'react-loader-spinner';

const PageLoader = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <RotatingLines
        visible={true}
        //@ts-ignore
        height="80"
        width="80"
        strokeColor="#07283b"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default PageLoader;
