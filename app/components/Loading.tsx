import './Loading.css'

const LoadingScreen = () => {
  return (
    <div className="fixed w-full h-[100%] flex flex-col items-center justify-center left-0 top-0">
      <label className="loader">
        <span className="slider"></span>
      </label>
    </div>
  )
}

export default LoadingScreen
