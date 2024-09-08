"use client";
import React, { useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from "framer-motion";
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
    },
        ]
    } 
    -فاصله ی بین کلمات رعایت شود و کلمات ب کلمه های بعی چسبیده نباشد
     
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
  const clickHandler = (e) => {
    if (search.length > 1) {
      aiRun();
    } else {
      return null;
    }
    setClick(click + 1);
  };
  console.log(data2);
  const listVariants = {
    hidden: {
      opacity: 0,
      x: 25,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form
      onSubmit={handleKeyDown}
      className={` md:w-[616px] sm:w-[528px] 
        xl:rounded-[16px]  overflow-auto
         rounded-none  flex-col  
         min-h-screen mx-auto bg-[#232324] md:my-[32px] 
          py-8 px-4 `}
    >
      {/* header */}
      <div
        className={` ${
          validatedData?.data ? "border-b-[1px]" : null
        }  border-[#FFFFFF] border-opacity-10 pb-4`}
      >
        <h1 className="text-[#FFFFFF]  font-black  text-[36px] md:text-[30px] leading-[51.48px]">
          چی میخوری؟
        </h1>
        <p
          className="mt-2 opacity-65 text-[#FFFFFF]
         md:font-normal md:text-[19px] text-[24px]
          leading-[34.32px] font-medium"
        >
          بهم بگو چی داری تو خونت، بهت میگم چی بخوری
        </p>
        <input
          onKeyDown={onkeydown}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="مثلا: سوسیس، تخم مرغ، بادمجون"
          className="w-full  md:text-[19px]  leading-[34.32px]
           py-3 pr-4 text-[#FFFFFF] font-medium 
           rounded-[12px] outline-none bg-[#27272A] mt-6"
        />
      </div>
      {/* response */}

      {validatedData?.data?.map((i, index) => (
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="visible"
          key={index}
          className=" items-center justify-center bg-[#27272A] rounded-md px-4 py-4 my-4"
        >
          <h1 className="font-medium text-[#FFFFFF]">عنوان غذا : {i.title}</h1>
          <p className="text-[#FFFFFF] font-medium mt-4 ">
            - مواد لازم : {i.ingredients}
          </p>
          <p className="text-[#FFFFFF] font-medium mt-4 ">
            - دستور پخت : {i.recipe}
          </p>
        </motion.div>
      ))}

      {/* footer */}
      <div
        className={`
          ${loading ? "opacity-5" : ""}
          fixed inset-x-0 mx-[16px] 
          bottom-[16px] sm:mx-auto
           sm:w-[496px] md:w-[584px] 
          font-black  text-[#000000]
           md:bottom-[42px]`}
      >
        <button
          type="submit"
          disabled={loading || (search.length === 0 && false)}
          onClick={clickHandler}
          className={` w-full bg-[#FFFFFF]  py-3  rounded-[12px] ${
            loading ? "animate-bounce" : ""
          }`}
        >
          {loading ? (
            "دارم فک میکنم!"
          ) : (
            <>
              {click > 1 && validatedData?.data ? "دوباره بگو" : "پیشنهاد بده"}
            </>
          )}
        </button>
      </div>
    </form>
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
