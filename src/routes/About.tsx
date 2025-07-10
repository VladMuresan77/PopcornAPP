

const About = () => {
  return (
    <div className="min-h-screen bg-zinc-800 w-full flex items-start justify-center px-6 py-20 pt-32">
      <div className="bg-white shadow-lg rounded-xl max-w-3xl p-10 flex flex-col gap-8 mt-20">
        <h1 className="text-2xl font-bold text-zinc-900 mb-4">PopcornApp</h1>

<section className="mb-6">
          <h2 className="font-extrabold text-red-800 mb-2">About the project</h2>
          <p className="mb-2">• A responsive and interactive movie web app built for film enthusiasts.</p>
          <p className="mb-2">• Focused on clean UI, scalable components, and smooth user experience.</p>
          <p>• Implements efficient routing, real-time user data management, and integrates OMDb API for movie data.</p>
        </section>

        <section className="mb-6">
          <h2 className="font-extrabold text-red-800 mb-2">How to use</h2>
          <ul className="list-disc list-inside  space-y-2 ">
        <li>At the top, you will find the Recommended Movies section. This list is local and does not come from the API.</li>
        <li>You can create an account and manage your profile using the<span className="text-zinc-900 text font-bold"> Sign In / Log Out section</span>.</li>
        <li>Use the <span className="text-zinc-800 text font-bold">search bar</span> to find movies from the API. The search results will replace the Recommended Movies list.</li>   <p><span className="text-zinc-800 text font-bold">Clicking on a movie</span> displays its details in the Watched Movies section. Also, in this same section, you can give your own rating out of 10 stars for the film.</p>
        <p className="text-zinc-800 text font-bold">Each movie has several buttons:</p>
        
        <li>The ❤️ <span className="text-zinc-800 text font-bold">(heart) </span>icon adds or removes the movie from Favorite witch is in My List component.</li>
        <li>The ✅ <span className="text-zinc-800 text font-bold">(checkmark) </span>icon adds or removes the movie to the Watched Movies section, which is at the bottom of the Home page.</li>
        <li>The 📍 <span className="text-zinc-800 text font-bold">(pin)</span> icon saves the movie to the Plan to Watch section inside My List.</li>
      </ul>
      
        </section>

        <section>
          <h2 className="font-extrabold text-red-800 mb-2">Tech Stack</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-800">
            <li>React</li>
            <li>Vite</li>
            <li>TypeScript</li>
            <li>Tailwind</li>
            <li>React Router</li>
            <li>Firebase (Authentication & Firestore)</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;
