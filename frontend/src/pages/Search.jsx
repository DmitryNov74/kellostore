import React from 'react';

export default function Search() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-6 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <input
              className="border p-3 w-full"
              type="text"
              placeholder="Etsi..."
              id="searchTerm"
            />
          </div>
          <div className="flex">
            <div className="flex gap-2 flex-wrap items-center p-3">
              <input type="checkbox" id="isFullSet" />
              <span>Full Set</span>
            </div>
            <div className="flex gap-2 flex-wrap items-center p-3">
              <input type="checkbox" id="quartz" />
              <span>Kvartsi</span>
            </div>
            <div className="flex gap-2 flex-wrap items-center p-3">
              <input type="checkbox" id="automatic" />
              <span>Automaatti</span>
            </div>
          </div>
          <button className="bg-slate-600 rounded-md text-white p-3 hover:opacity-80">
            ETSI
          </button>
        </form>
      </div>
      <div>
        <h1 className="text-2xl text-slate-700 m-4">
          Löytyi seuraavat kellot:
        </h1>
      </div>
    </div>
  );
}
