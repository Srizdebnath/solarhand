import React from 'react';

const CreatorInfo: React.FC = () => {
    return (
       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/40 backdrop-blur-md p-3 rounded-full border border-white/10 hover:bg-black/60 transition-all duration-300">

            <img
                src="https://github.com/Srizdebnath.png"
                alt="Creator"
                className="w-12 h-12 rounded-full border-2 border-cyan-400"
            />
            <div className="flex flex-col">
                <span className="text-white text-sm font-bold tracking-wide">
                    Created by <span className="text-cyan-400">Sriz Debnath</span>
                </span>
                <div className="flex gap-3 text-gray-400 text-xs mt-1">
                    <a href="https://github.com/Srizdebnath" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        GitHub
                    </a>
                    <span>•</span>
                    <a href="https://linkedin.com/in/srizdebnath" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                        LinkedIn
                    </a>
                    <span>•</span>
                    <a href="https://instagram.com/lenscapez_" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
                        Instagram
                    </a>
                    <span>•</span>
                    <a href="https://x.com/Srizdebnath" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                        Twitter
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CreatorInfo;
