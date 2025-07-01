import React from 'react';
import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from 'react-icons/fa';

const links = [
  {
    href: 'https://www.linkedin.com/in/vlad-muresan-b55349266/',
    label: 'LinkedIn',
    icon: <FaLinkedin className="text-2xl" />,
    external: true,
  },
  {
    href: 'https://github.com/VladMuresan77',
    label: 'GitHub',
    icon: <FaGithub className="text-2xl" />,
    external: true,
  },
  {
    href: 'https://x.com/VLADM999',
    label: 'X (Twitter)',
    icon: <FaTwitter className="text-2xl" />,
    external: true,
  },
  {
    href: 'mailto:vladmuresan997@gmail.com',
    label: 'vladmuresan997@gmail.com',
    icon: <FaEnvelope className="text-2xl" />,
    external: false,
  },
];

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-700 w-full flex items-center justify-center px-6 py-20">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl p-10 flex flex-col gap-6">
        <h1 className="text-6xl font-bold text-gray-900 text-center">contact</h1>
        <div className="flex flex-col gap-4 text-gray-900 text-lg">
          {links.map(({ href, label, icon, external }) => (
            <a
              key={href}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="flex items-center gap-3 hover:text-gray-500 transition"
            >
              {icon}
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
