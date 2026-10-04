import { useState } from 'react';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="fixed bottom-6 right-6 z-50">
      <div className={`flex-col w-[calc(100vw-3rem)] sm:w-[380px] h-[520px] max-h-[85vh] bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl modal-shadow overflow-hidden transition-all ${isOpen ? 'flex' : 'hidden'}`}>
        <div className="px-4 py-3 bg-[#FDFBF6] border-b border-[#DCE3D5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#F3F6EE] border border-[#DCE3D5] text-[#2F5233] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-[#2F5233]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"></path>
              </svg>
            </div>
            <div>
              <h4 className="font-vietnam text-[15px] font-semibold text-[#2B2A25] leading-snug">
                AI Nutrition Assistant
              </h4>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4C8C4A]"></span>
                <span className="text-[11px] text-[#6B6F63]">Ready to assist</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-lg text-[#6B6F63] hover:text-[#2B2A25] hover:bg-[#F3F6EE] flex items-center justify-center transition-colors text-lg leading-none font-normal" title="Đóng">
              ×
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto bg-[#F3F6EE]/40 flex flex-col gap-3.5 text-[13px]">
          <div className="flex items-start gap-2.5 max-w-[88%]">
            <div className="w-7 h-7 rounded-full bg-[#F3F6EE] border border-[#DCE3D5] text-[#2F5233] flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-3.5 h-3.5 text-[#2F5233]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>
            </div>
            <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-3 text-[#2B2A25] leading-relaxed">
              <p>Hello! I am the Vegan Helper AI Nutrition Assistant. I can help you discover wholesome plant-based recipes.</p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-[#FDFBF6] border-t border-[#DCE3D5] shrink-0">
          <div className="flex items-center gap-2 bg-[#F3F6EE] border border-[#DCE3D5] rounded-xl px-3 py-1.5 focus-within:border-[#2F5233] transition-colors">
            <input className="flex-1 bg-transparent text-[13px] text-[#2B2A25] placeholder-[#6B6F63] focus:outline-none" placeholder="Ask the AI assistant..." type="text" />
            <button className="w-8 h-8 rounded-full bg-[#2F5233] hover:bg-[#25401F] text-white flex items-center justify-center shrink-0 transition-colors shadow-sm" title="Gửi tin nhắn">
              <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="w-14 h-14 rounded-full bg-[#2F5233] hover:bg-[#25401F] text-white flex items-center justify-center modal-shadow transition-transform hover:scale-105" title="Vegan Helper AI Assistant">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"></path>
          </svg>
        </button>
      )}
    </aside>
  );
}
