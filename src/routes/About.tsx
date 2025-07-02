

const About = () => {
  return (
    <div className="min-h-screen bg-gray-700 w-full flex items-start justify-center px-6 py-20 pt-32">
      <div className="bg-white shadow-lg rounded-xl max-w-3xl p-10 flex flex-col gap-8 mt-20">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">PopcornApp</h1>

        <section className="mb-6">
          <h2 className="font-extrabold text-gray-700 mb-2">About the project</h2>
          <p className="mb-2">• A responsive and interactive movie web app built for film enthusiasts.</p>
          <p className="mb-2">• Focused on clean UI, scalable components, and smooth user experience.</p>
          <p>• Implements efficient routing, real-time user data management, and integrates OMDb API for movie data.</p>
        </section>

        <section>
          <h2 className="font-extrabold text-gray-700 mb-2">Tech Stack</h2>
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
