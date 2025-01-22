import React from 'react';
// Correct import syntax for lucide-react icons
import { Github, Instagram, Linkedin, Twitter } from 'lucide-react';
// If you're using a React icon, import it correctly from your source
import { FaReact as ReactIcon } from 'react-icons/fa'; // Using React Icons as an example

const Footer = () => (
  <div className="text-sm text-gray-400 flex items-center gap-2">
    Made by @ankushshharma
    <div className="flex items-center gap-3 ml-2">
      <a href="https://github.com/ankushshharma" target="_blank" rel="noopener noreferrer">
        <Github className="w-4 h-4 hover:text-white cursor-pointer" />
      </a>
      <a href="https://instagram.com/ankushshharma" target="_blank" rel="noopener noreferrer">
        <Instagram className="w-4 h-4 hover:text-white cursor-pointer" />
      </a>
      <a href="https://linkedin.com/in/ankushshharma" target="_blank" rel="noopener noreferrer">
        <Linkedin className="w-4 h-4 hover:text-white cursor-pointer" />
      </a>
    </div>
  </div>
);

export default Footer;