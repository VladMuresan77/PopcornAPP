import React from 'react'
import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from 'react-icons/fa'

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-700 w-full flex items-center justify-center px-6 py-20">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl p-10 flex flex-col gap-6">
        <h1 className="text-6xl font-bold text-gray-900 text-center">contact</h1>
        <div className="flex flex-col gap-4 text-gray-900 text-lg">
          <a href="https://www.linkedin.com/in/vlad-muresan-b55349266/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-gray-500 transition">
            <FaLinkedin className="text-2xl" />
            <span>LinkedIn</span>
          </a>
          <a href="https://github.com/VladMuresan77" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-gray-500 transition">
            <FaGithub className="text-2xl" />
            <span>GitHub</span>
          </a>
          <a href="https://x.com/VLADM999" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-gray-500 transition">
            <FaTwitter className="text-2xl" />
            <span>X (Twitter)</span>
          </a>
          <a href="mailto:email@example.com" className="flex items-center gap-3 hover:text-gray-500 transition">
            <FaEnvelope className="text-2xl" />
            <span>vladmuresan997@gmail.com</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Contact
