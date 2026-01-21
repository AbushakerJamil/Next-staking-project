"use client";

import {
  Github,
  Twitter,
  MessageCircle,
  ExternalLink,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Twitter",
      icon: <Twitter size={20} />,
      url: "https://x.com/AbushakerJamil",
    },
    {
      name: "GitHub",
      icon: <Github size={20} />,
      url: "https://github.com/AbushakerJamil",
    },
    {
      name: "Discord",
      icon: <Linkedin size={20} />,
      url: "https://www.linkedin.com/in/abushakerjamil-blockchain-solidity-developer/",
    },
  ];

  const footerLinks = [
    {
      title: "Resources",
      links: [
        { name: "Documentation", url: "#" },
        { name: "FAQ", url: "#" },
        { name: "Tutorial", url: "#" },
      ],
    },
    {
      title: "Community",
      links: [
        { name: "Discord", url: "#" },
        { name: "Forum", url: "#" },
        { name: "Blog", url: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", url: "#" },
        { name: "Privacy Policy", url: "#" },
        { name: "Disclaimer", url: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Staking DApp</h3>
            <p className="text-gray-400 text-sm mb-4">
              Earn passive income by staking your tokens. Simple, secure, and
              transparent decentralized staking platform.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.url}
                      className="text-gray-400 hover:text-white text-sm transition flex items-center gap-1"
                    >
                      {link.name}
                      <ExternalLink size={12} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Staking DApp. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm text-center md:text-right">
              Built with{" "}
              <span className="text-red-500" aria-label="love">
                ❤️
              </span>{" "}
              using Next.js, Wagmi & RainbowKit
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
