"use client";
import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Circles } from "react-loader-spinner";
const AiPage = () => {
  const genAi = new GoogleGenerativeAI(
    "AIzaSyB9ke6GbPgcjEbz0ilBgJmCaIYWeQKKsiU"
  );
  const [search, setSearch] = useState("");
  const [responseAi, setResponseAi] = useState("{}");
  const [loading, setLoading] = useState(false);
  const [click, setClick] = useState(1);
  async function aiRun() {
    setLoading(true);
    setResponseAi("{}");
    const model = genAi.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
    من فقط ${search} هارا دارم .

    حداقل پنج پیشنهاد بده ک بتوانم با استفاده از انها غذا درست کنم.
    خروجی بصورت  json و ب زبان فارسی باشد
    structure:
    {
    data:[
       {
    id: id data
    title: "title in farsi",
    ingredients :"ingredients food in farsi",
    recipe:"recipe in farsi"
    image :"https://www.pinterest.com/ همه عکسا فقط از این وب باشند"
    },
        ]
    }

    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    setResponseAi(text);
    setLoading(false);
  }

  const data2 =
    responseAi.replaceAll("```json", "").replaceAll("```", "") ?? "{}";

  console.log(data2);

  const jsonString = data2;
  const validatedData = validJson(jsonString);

  const clickHandler = () => {
    aiRun();
    setClick(click + 1);
  };
  console.log(data2);

  return (
    <div
      className={`  lg:w-[616px] md:w-[616px] sm:w-[528px] lg:rounded-md md:rounded-none   flex-col  min-h-[1016px] mx-auto bg-[#232324] lg:my-8  py-8 px-4 md:my-0 `}
    >
      {/* header */}
      <div
        className={` ${
          validatedData?.data ? "border-b-[1px]" : null
        }  border-[#FFFFFF] border-opacity-10 pb-4`}
      >
        <h1 className="text-[#FFFFFF]  font-black text-[36px] leading-[51.48px]">
          چی میخوری؟
        </h1>
        <p className="mt-2 opacity-[65%] text-[#FFFFFF] text-[24px] leading-[34.32px] font-medium">
          بهم بگو چی داری تو خونت، بهت میگم چی بخوری
        </p>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="مثلا: سوسیس، تخم مرغ، بادمجون"
          className="w-full text-[24px] leading-[34.32px] py-3 pr-4 text-[#FFFFFF] font-medium rounded-md outline-none bg-[#27272A] mt-6"
        />
      </div>
      {/* response */}

      {loading ? (
        <div className=" items-center w-full mx-auto">
          <Circles
            height="80"
            width="80"
            color="#27272A"
            ariaLabel="circles-loading"
            visible={true}
          />
        </div>
      ) : (
        <>
          {validatedData?.data?.map((i) => (
            <div className="min-h-[184px] items-center justify-center bg-[#27272A] rounded-md px-4 py-4 my-4">
              <h1 className="font-medium text-[#FFFFFF]">
                عنوان غذا : {i.title}
              </h1>
              <p className="text-[#FFFFFF] font-medium mt-4 ">
                - مواد لازم : {i.ingredients}
              </p>
              <p className="text-[#FFFFFF] font-medium mt-4 ">
                - دستور پخت : {i.recipe}
              </p>
            </div>
          ))}
        </>
      )}

      {/* footer */}

      <button
        disabled={loading && false}
        onClick={clickHandler}
        className={`${
          loading && "opacity-5  "
        } py-3 items-center  sticky w-full   -bottom-0  font-black rounded-md bg-[#FFFFFF] text-[#000000] `}
      >
        {click > 1 && validatedData?.data ? "دوباره بگو" : "پیشنهاد بده"}
      </button>
    </div>
  );
};

function validJson(data2) {
  try {
    const data = JSON.parse(data2);
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export default AiPage;
