"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PatModal({ username }: { username: string }) {
  const [inputValue, setInputValue] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("english"); // ✅ Default to English
  const router = useRouter();

  const handleSave = async () => {
    const postPat = async () => {
      // const apiUrl = `http://54.90.74.38/api/create/user`;
      const res = await fetch(`/api/intercepted`, {
        method: "POST",
        body: JSON.stringify({
          backend_path: `/create/user`,
          method: "POST",
          body: {
            user_name: username,
            language: selectedLanguage, // ✅ Send selected language
            pat: inputValue,
          },
        }),
      });
      // const res = await fetch(apiUrl, {
      //   method: "POST",
      //   body: JSON.stringify({
      //     user_name: username,
      //     language: selectedLanguage, // ✅ Send selected language
      //     pat: inputValue,
      //   }),
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

      if (res.ok) {
        const data = await res.json();
        console.log("User created:", data);
      } else {
        console.error("Failed to create user");
      }
    };
    await postPat();
    router.replace(`/${username}`); // ✅ Navigate after input
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-black">Enter GitHub PAT</h2>
        <p className="text-gray-600 mb-2">
          Please enter your GitHub Personal Access Token to continue.
        </p>

        {/* ✅ Language Selector Dropdown */}
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Language:
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-black"
        >
          <option value="english">English</option>
          <option value="chinese">Chinese</option>
          <option value="german">German</option>
        </select>

        {/* ✅ PAT Input Field */}
        <input
          type="password"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-black"
          placeholder="Enter your PAT"
        />

        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}
