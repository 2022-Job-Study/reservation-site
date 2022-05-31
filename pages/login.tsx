import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import { Input } from "../components/Input";
import { cls } from "../libs/utils";
import { url } from "inspector";
import { ApiError } from "next/dist/server/api-utils";

interface LoginForm {
  name: string;
}

interface LoginReturn {
  data: {
    ok: boolean;
    foundUser?: User;
  };
}

interface SignReturn {
  data: {
    ok: boolean;
    newUser?: User;
  };
}

const login_with_Kakao = () => {
  try {
    return new Promise((resolve, reject) => {
      if (!window.Kakao) {
        reject("Kakao instance does not exist.");
      }
      window.Kakao.Auth.login({
        success: function (response: any) {
          const data = JSON.stringify(response);
          console.log(data);
          // axios
          //   .post("/api/tokens", data, {
          //     headers: { "Content-Type": "application/json" },
          //   })
          //   .then((res) => console.log(res));
          const { access_token } = response;
          console.log(access_token);
          window.Kakao.API.request({
            url: "/v2/user/me",
            success: function (response: any) {
              const user = response.kakao_account;
              console.log(user);
              user.host = "kakao";
              const user_info = document.querySelector("#userinfo");
              if (user_info) user_info.value = JSON.stringify(user);
            },
            fail: function (error: any) {
              console.log(error);
            },
          });
        },
        fail: function (error: any) {
          console.log(error);
        },
      });
    });
  } catch (err) {
    console.log(err);
  }
};

export default function Login() {
  const [method, setMethod] = useState<"LogIn" | "SignUp">("LogIn");
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginForm>();

  const setSignUp = () => {
    setMethod("SignUp");
  };
  const setLogIn = () => {
    setMethod("LogIn");
  };

  const onValid = async ({ name }: LoginForm) => {
    if (method === "LogIn") {
      const { data }: LoginReturn = await axios.get(`/api/user?name=${name}`);
      if (!data.ok) {
        alert("No user!");
      } else {
        router.push("/");
      }
    } else {
      const { data }: SignReturn = await axios.post(
        "/api/user",
        { name },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!data.ok) {
        alert("Duplicate name!");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="max-w-xl w-full flex flex-col mx-auto mt-20 space-y-8">
      <h1 className="text-center text-lg text-violet-400">
        Make Your Reservation!
      </h1>

      <div className="grid grid-cols-2">
        <button
          className={cls(
            method === "LogIn"
              ? "text-violet-400 border-violet-400"
              : "text-gray-400",
            "border-b pb-2"
          )}
          onClick={setLogIn}
        >
          Log In
        </button>
        <button
          className={cls(
            method === "SignUp"
              ? "text-violet-400 border-violet-400"
              : "text-gray-400",
            "border-b pb-2"
          )}
          onClick={setSignUp}
        >
          Sign Up
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onValid)}
        className="flex flex-col space-y-8"
      >
        <Input register={register("name", { required: true })} name="Name" />
        {method === "LogIn" ? (
          <Button text="Log In" />
        ) : (
          <Button text="Sign Up" />
        )}
      </form>

      <div>
        <div className="border-t border-gray-200 w-full relative top-3.5 -z-10" />
        <div className="text-center">
          <span className="text-xs text-gray-500 bg-white px-3">Or use</span>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <button
          className="flex items-center justify-center border border-gray-200 py-2 text-xs text-gray-400
         hover:bg-slate-50 transition-colors rounded-md"
        >
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          className="flex items-center justify-center border border-gray-200 py-2 text-xs text-gray-400
           hover:bg-slate-50 transition-colors rounded-md"
          onClick={login_with_Kakao}
        >
          <svg
            className="w-8 h-8"
            id="kakao"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-75 -90 350 350"
          >
            <polygon
              className="kakao logo"
              fill="#3c1e1e"
              points="45 140 40 185 90 150 45 140"
            />
            <ellipse
              className="kakao logo"
              fill="#3c1e1e"
              cx="100"
              cy="80"
              rx="100"
              ry="80"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
