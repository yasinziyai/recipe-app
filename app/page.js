"use client";
import React, { useState } from "react";
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
  return (
    <div
      className={`  md:w-[616px] sm:w-[528px] xl:rounded-md rounded-none  flex-col   min-h-[1080px] mx-auto bg-[#232324] xl:my-8 xl:inset-y-0 py-8 px-4 `}
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
        <p className="mt-2 opacity-65 text-[#FFFFFF] text-[24px] leading-[34.32px] font-medium">
          بهم بگو چی داری تو خونت، بهت میگم چی بخوری
        </p>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="مثلا: سوسیس، تخم مرغ، بادمجون"
          className="w-full text-w sm:text-[24px] text-opacity-45 leading-[34.32px] py-3 pr-4 text-[#FFFFFF] font-medium rounded-md outline-none bg-[#27272A] mt-6"
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
          fixed inset-x-0 mx-[16px]  bottom-[16px] sm:mx-auto bg-[#27272A]   sm:w-[496px] md:w-[584px] xl:bottom-[42px]
          font-black  text-[#000000]  `}
      >
        <button
          disabled={loading || (search.length === 0 && false)}
          onClick={clickHandler}
          className=" w-full bg-[#FFFFFF]  py-3  rounded-md "
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
