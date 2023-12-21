import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const cars_api_base_url: string = "http://localhost:8080";

  interface GoogleOauthResponse {
    credential?: string;
  }

  const handleLoginGoogleSuccess = async (response: GoogleOauthResponse) => {
    try {
      console.log("response google success:", response);

      // Kirim kredensial Google ke backend untuk verifikasi
      const backendResponse = await fetch(
        cars_api_base_url +
          "/api/auth/login/google?access_token=" +
          response.credential,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const backendResponseJson = await backendResponse.json();

      if (backendResponse.status !== 200) {
        // Tangani kesalahan backend, misalnya, kredensial Google tidak valid
        alert("error: " + backendResponseJson.message);
        return;
      }

      // Simpan token akses backend ke penyimpanan lokal
      localStorage.setItem(
        "access_token",
        backendResponseJson.data.access_token
      );

      // Alihkan ke halaman beranda
      navigate("/home");
    } catch (error) {
      console.error("Terjadi masalah ketika Login with Google:", error);
      alert("Terjadi masalah ketika Login with Google.");
    }
  };
  return (
    <div className=" bg-white-100 flex justify-center items-center h-screen">
      <div className="w-3/4 hidden lg:block">
        <img
          src="https://i.ibb.co/bBYs2zZ/image-2.png"
          alt="Placeholder Image"
          className="object-cover w-full h-full"
        />
      </div>
      {/* Area kanan */}
      <div className="form w-1/4 mr-20">
        <img
          src="https://i.ibb.co/Fx074Zt/Rectangle-62.png"
          alt="Logo"
          className="object-cover ml-5 mb-6"
        />
        <h1 className=" mb-6 text-2xl font-semibold dark:text-white text-start ml-5 font-sans">
          Welcome Admin BCR
        </h1>
        <div className="mb-4 ml-5">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 text-start"
            htmlFor="email"
          >
            Email
          </label>
          <input
            value={email}
            onChange={({ target }) => {
              setEmail(target.value);

            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="text"
            placeholder="Masukan email"
          />
        </div>
        <div className="mb-4 ml-5">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 text-start"
            htmlFor="username"
          >
            Password
          </label>
          <input
            value={password}
            onChange={({ target }) => {
              setPassword(target.value);

            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Masukan password"
          />
        </div>
        <div className="my-5 ml-5">
          <button
            onClick={async (e) => {
              e.preventDefault(); //agar ketika mengclick sumbit browser tidak auto reload

              const payload = {
                email: email,
                password: password,
              };

              const response = await fetch(
                cars_api_base_url + "/api/auth/login",
                {
                  method: "post",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                }
              );

              const responseJson = await response.json();

              if (response.status !== 200) {
                alert("error: " + responseJson.message);
              }
              if (response.status === 200) {
                alert("Login berhasil");
              }

              localStorage.setItem(
                "access_token",
                responseJson.data.access_token
              );

              // If login succeed, redirect ke home
              navigate("/home");
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="button"
          >
            Sign In
          </button>
          <div className="my-2 w-full">
            <GoogleOAuthProvider clientId="52535015285-0i182g0q4ccnv9q3i4dgnh7hiah779u3.apps.googleusercontent.com">
              <GoogleLogin onSuccess={handleLoginGoogleSuccess} />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>

      {/* <button>Login with Google</button> */}
    </div>
  );
}
