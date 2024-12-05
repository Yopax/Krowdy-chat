import { useState } from "react";
import { useMutation } from "@apollo/client";
import { SIGNUP_USER, LOGIN_USER } from "../graphql/mutations";

const AuthScreen = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(true); 
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mutación para registro
  const [signupUser] = useMutation(SIGNUP_USER, {
    onCompleted: (data) => {
      setIsSubmitting(false); 
      setMessage({
        type: "success",
        text: `¡Registro exitoso! Bienvenido, ${data.signupUser.firstName} ${data.signupUser.lastName}.`,
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    },
    onError: (error) => {
      setIsSubmitting(false);
      setMessage({
        type: "error",
        text:
          error.message || "Ocurrió un error inesperado. Intenta nuevamente.",
      });
    },
  });

  const [loginUser] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      setIsSubmitting(false); // Permitir nuevos envíos
      setMessage({
        type: "success",
        text: "¡Inicio de sesión exitoso!",
      });
      localStorage.setItem("jwt", data.signinUser.token); // Guardar token
      window.location.reload(); // Forzar renderizado de `HomeScreen`
    },
    onError: (error) => {
      setIsSubmitting(false); // Permitir nuevos envíos
      setMessage({
        type: "error",
        text:
          error.message || "Ocurrió un error inesperado. Intenta nuevamente.",
      });
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar campos antes de enviar
    if (
      !formData.email ||
      !formData.password ||
      (!isLogin && (!formData.firstName || !formData.lastName))
    ) {
      setMessage({
        type: "error",
        text: "Por favor, completa todos los campos requeridos.",
      });
      return;
    }

    setIsSubmitting(true); // Bloquear múltiples envíos

    if (isLogin) {
      loginUser({
        variables: {
          userSignin: {
            email: formData.email,
            password: formData.password,
          },
        },
      });
    } else {
      signupUser({
        variables: {
          userNew: formData,
        },
      });
    }
  };

  return (
    <>
      <div className="flex w-screen h-screen">
        <div className="flex items-center  justify-center w-1/2 bg-cover bg-[url('/portada.webp')]">
        <img src="logo.svg" alt="logo krowdy" width={100} height={100} />
        <div >
          
          <h2 className="letra text-[#1a1212] text-5xl max-[400px]:text-2xl font-bold text-center">
            Krowdy Chat
          </h2>
          <p className="letra mt-2 cursor-pointer hover:opacity-50 transition-all duration-300 ease-in-out text-xs max-[425px]:text-[10px] text-white">Proyecto elaborado por : Barreto Darli Wilson</p>
        </div>
        </div>
  
        <div className="flex flex-col items-center justify-center w-1/2 p-8 space-y-6 bg-white rounded shadow">
          <h2 className="letra text-3xl max-[400px]:text-2xl font-bold text-center">
            {isLogin ? "Login" : "Registrarse"}
          </h2>
          <p className="text-xs font-light text-center letra">
            {isLogin
              ? "Por favor, inicia sesión en tu cuenta"
              : "Ingresa tus datos para registrarte"}
          </p>
  
          {message && (
            <div
              className={`p-2 w-full rounded text-center ${
                message.type === "success"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {message.text}
            </div>
          )}
  
          {/* Formulario */}
          <form className="flex flex-col w-3/4 space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Nombre"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pb-2 text-xs border-b border-gray-500 letra placeholder:text-xs placeholder:font-light focus:outline-none"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Apellidos"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full pb-2 text-xs border-b border-gray-500 letra placeholder:text-xs placeholder:font-light focus:outline-none"
                />
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={formData.email}
              onChange={handleChange}
              className="w-full pb-2 text-xs border-b border-gray-500 letra placeholder:text-xs placeholder:font-light focus:outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className="w-full pb-2 text-xs border-b border-gray-500 letra placeholder:text-xs placeholder:font-light focus:outline-none"
            />
            <button
              type="submit"
              className="w-full py-2 text-white bg-[#fe7541] rounded hover:bg-slate-600 transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isLogin
                  ? "Iniciando..."
                  : "Registrando..."
                : isLogin
                ? "Iniciar Sesión"
                : "Registrarse"}
            </button>
          </form>
  
          {/* Cambio entre Login y Registro */}
          <p
            className="text-xs cursor-pointer text-[#fe7541] underline hover:opacity-50"
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
              });
              setMessage(null);
            }}
          >
            {isLogin
              ? "¿No tienes cuenta? Regístrate aquí."
              : "¿Ya tienes cuenta? Inicia sesión."}
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthScreen;
