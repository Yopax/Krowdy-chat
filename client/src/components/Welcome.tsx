

export function Welcome() {
  return (
    <div className=" w-full mx-auto flex text-center justify-center items-center bg-cover h-full bg-[url('/portada.webp')]">
      <img src="logo.svg" alt="logo krowdy" width={100} height={100} />
        <p className="text-3xl font-bold text-white letra" >Bienvenido a Krowdy Chat</p>
    </div>
  )
}

export default Welcome