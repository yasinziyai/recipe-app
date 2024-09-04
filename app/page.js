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
  };
  console.log(data2);

  return (
    <div className=" max-w-[616px]  rounded-md  flex flex-col min-h-[1080px] mx-auto bg-[#232324] my-8 py-8 px-4">
      {/* header */}
      <div className="border-b-[1px] border-[#FFFFFF] border-opacity-10 pb-4">
        <h1 className="text-[#FFFFFF] font-black">چی میخوری؟</h1>
        <p className="mt-2 text-[#FFFFFF] font-medium">
          بهم بگو چی داری تو خونت، بهت میگم چی بخوری
        </p>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="مثلا: سوسیس، تخم مرغ، بادمجون"
          className="w-full py-3 pr-4 text-[#FFFFFF] font-medium rounded-md  bg-[#27272A] mt-6"
        />
      </div>
      {/* response */}

      {loading ? (
        <div className="mx-auto mt-36">
          <Circles
            height="80"
            width="80"
            color="#27272A"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
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
        onClick={clickHandler}
        className=" py-3 items-center w-full sticky bottom-0 top-[540px]  font-black rounded-md bg-[#FFFFFF] text-[#000000] "
      >
        پیشنهاد بده
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
